"use client";
function bytes(hex:string){return new Uint8Array(hex.slice(2).match(/.{1,2}/g)?.map(x=>parseInt(x,16))||[])}
function hex(buf:ArrayBuffer|Uint8Array){const b=new Uint8Array(buf);return "0x"+Array.from(b).map(x=>x.toString(16).padStart(2,"0")).join("") as `0x${string}`}
function b64urlToBuffer(v:string){const s=v.replace(/-/g,"+").replace(/_/g,"/").padEnd(Math.ceil(v.length/4)*4,"=");const raw=atob(s);return Uint8Array.from(raw,c=>c.charCodeAt(0)).buffer}
function parseDer(der:ArrayBuffer){const b=new Uint8Array(der);let o=2;const read=()=>{o++;const len=b[o++];let v=b.slice(o,o+len);o+=len;if(v[0]===0)v=v.slice(1);if(v.length<32){const p=new Uint8Array(32);p.set(v,32-v.length);v=p}return hex(v)};return {r:read(),s:read()}}
function cose(spki:ArrayBuffer){
  const b = new Uint8Array(spki);

  // WebAuthn getPublicKey() returns DER SubjectPublicKeyInfo.
  // A P-256 uncompressed EC point is 0x04 followed by 32-byte X and Y.
  if (b.length >= 65) {
    const i = b.length - 65;
    if (b[i] === 0x04) {
      const x = b.slice(i + 1, i + 33);
      const y = b.slice(i + 33, i + 65);

      if (x.length === 32 && y.length === 32) {
        return { x: hex(x), y: hex(y) };
      }
    }
  }

  throw new Error(
    "Could not extract the P-256 public key from the browser's DER key. No contract transaction was submitted."
  );
}
export function isWebAuthnAvailable(){return typeof window!=="undefined"&&!!window.PublicKeyCredential}
export async function registrationChallenge(address:string){const prefix=new TextEncoder().encode("Anchor:register:");const ab=bytes(address);const d=new Uint8Array(prefix.length+ab.length);d.set(prefix);d.set(ab,prefix.length);return hex(await crypto.subtle.digest("SHA-256",d))}
export async function actionChallenge(address:string,action:string,nonce:bigint){const prefix=new TextEncoder().encode(`Anchor:${action}:`);const ab=bytes(address);const separator=new TextEncoder().encode(":");const n=new Uint8Array(8);new DataView(n.buffer).setBigUint64(0,nonce,false);const d=new Uint8Array(prefix.length+ab.length+separator.length+n.length);d.set(prefix);d.set(ab,prefix.length);d.set(separator,prefix.length+ab.length);d.set(n,prefix.length+ab.length+separator.length);return hex(await crypto.subtle.digest("SHA-256",d))}
export function saveCredential(identityId:string,credentialId:string){const current=JSON.parse(localStorage.getItem("anchor:credentials")||"{}");current[identityId.toLowerCase()]=credentialId;localStorage.setItem("anchor:credentials",JSON.stringify(current));localStorage.setItem("anchor:credentialId",credentialId)}
export function credentialFor(identityId: string) {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem("anchor:credentials");
    if (!raw) return null;

    const current: unknown = JSON.parse(raw);
    if (!current || typeof current !== "object" || Array.isArray(current)) {
      console.error("Anchor: saved credential mapping is invalid.");
      return null;
    }

    const credentialId = (current as Record<string, unknown>)[
      identityId.toLowerCase()
    ];

    if (typeof credentialId !== "string" || credentialId.length === 0) {
      return null;
    }

    return credentialId;
  } catch (error) {
    console.error("Anchor: could not read the saved passkey mapping.", error);
    return null;
  }
}
export async function createPasskey(challengeHex:string,address:string){const credential=await navigator.credentials.create({publicKey:{challenge:bytes(challengeHex),rp:{name:"Anchor Security",id:window.location.hostname},user:{id:crypto.getRandomValues(new Uint8Array(16)),name:address,displayName:"Anchor account"},pubKeyCredParams:[{type:"public-key",alg:-7}],authenticatorSelection:{userVerification:"required",residentKey:"preferred"},timeout:60000}}) as PublicKeyCredential|null;if(!credential)throw new Error("Passkey creation was cancelled");const response=credential.response as AuthenticatorAttestationResponse;const key=response.getPublicKey();if(!key)throw new Error("The browser did not return a P-256 passkey public key");return {credentialId:credential.id,pubKeyX:cose(key).x,pubKeyY:cose(key).y}}
export async function signWithPasskey(
  credentialId: string,
  challengeHex: string,
) {
  const publicKey: PublicKeyCredentialRequestOptions = {
    challenge: bytes(challengeHex),
    userVerification: "required",
    timeout: 60000,
  };

  let assertion: PublicKeyCredential | null = null;

  // First try the exact credential associated with this on-chain identity.
  if (credentialId) {
    try {
      assertion = (await navigator.credentials.get({
        publicKey: {
          ...publicKey,
          allowCredentials: [
            {
              id: b64urlToBuffer(credentialId),
              type: "public-key",
            },
          ],
        },
      })) as PublicKeyCredential | null;
    } catch (error) {
      // Permit a discoverable-credential fallback if the browser cannot
      // find the saved credential. Cancellation is handled below.
      if (
        error instanceof DOMException &&
        error.name === "NotAllowedError"
      ) {
        assertion = null;
      } else {
        throw error;
      }
    }
  }

  // Let the platform discover available passkeys for localhost.
  if (!assertion) {
    assertion = (await navigator.credentials.get({
      publicKey,
    })) as PublicKeyCredential | null;
  }

  if (!assertion) throw new Error("Passkey signing was cancelled");

  const response = assertion.response as AuthenticatorAssertionResponse;
  const clientData = new TextDecoder().decode(response.clientDataJSON);
  const challenge = JSON.parse(clientData).challenge;
  const index = clientData.indexOf(challenge);

  if (index < 0) {
    throw new Error("The passkey response did not contain its challenge.");
  }

  const { r, s } = parseDer(response.signature);

  return {
    authenticatorData: hex(response.authenticatorData),
    clientDataJSONPrefix: clientData.slice(0, index),
    clientDataJSONSuffix: clientData.slice(index + challenge.length),
    sigR: r,
    sigS: s,
  };
}
