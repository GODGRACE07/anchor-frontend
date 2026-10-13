import identityRegistryAbi from "./IdentityRegistry.abi.json";
import anchorViewsAbi from "./AnchorViews.abi.json";

/**
 * Types for AnchorViews.getAccountSummary.
 * The JSON ABI is imported at runtime, so the read result is
 * explicitly typed at the contract-data boundary.
 */
export type AnchorAuthenticatorView = {
  id: bigint | number;
  scheme: bigint | number;
  identityId: `0x${string}`;
  owner: `0x${string}`;
  displayName: string;
  active: boolean;
};

export type AnchorAccountSummary = {
  configVersion: bigint | number;
  authenticators: AnchorAuthenticatorView[];
  signingPolicy: (bigint | number)[];
  signingThreshold: bigint | number;
  reconfigPolicy: (bigint | number)[];
  reconfigThreshold: bigint | number;
  hasPending: boolean;
  pendingProposedAt: bigint | number;
  pendingRiskScore: bigint | number;
  pendingRequiresExtraConfirmation: boolean;
  pendingExtraConfirmationGiven: boolean;
  nextNonce: bigint | number;
};

export const IDENTITY_REGISTRY = (process.env.NEXT_PUBLIC_IDENTITY_REGISTRY || "0xe92db7ed079aA6fF8888C6dD88f60C9Ed43De917") as `0x${string}`;
export const AUTH_CONFIG_MANAGER = (process.env.NEXT_PUBLIC_AUTH_CONFIG_MANAGER || "0x8330D46baE39D554DaACc61c424F27fCf364919B") as `0x${string}`;
export const ANCHOR_VIEWS = (process.env.NEXT_PUBLIC_ANCHOR_VIEWS || "0x08E2722d76fA8f964d88E44c202D3A3609c7A329") as `0x${string}`;
export const MONAD_EXPLORER = "https://testnet.monadscan.com";
export const CHAIN_ID = 10143;

export const IDENTITY_ABI = [
  ...identityRegistryAbi,
  {type:"function",name:"registerWithPasskey",stateMutability:"nonpayable",inputs:[
    {name:"pubKeyX",type:"bytes32"},{name:"pubKeyY",type:"bytes32"},
    {name:"proof",type:"tuple",components:[
      {name:"authenticatorData",type:"bytes"},{name:"clientDataJSONPrefix",type:"string"},
      {name:"clientDataJSONSuffix",type:"string"},{name:"sigR",type:"bytes32"},{name:"sigS",type:"bytes32"}
    ]},{name:"displayName",type:"string"}],outputs:[{name:"id",type:"bytes32"}]}
] as const;

const webauthnProof = {type:"tuple",components:[
  {name:"authenticatorData",type:"bytes"},{name:"clientDataJSONPrefix",type:"string"},
  {name:"clientDataJSONSuffix",type:"string"},{name:"sigR",type:"bytes32"},{name:"sigS",type:"bytes32"}
]} as const;
const authProof = {type:"tuple",components:[{name:"authenticatorId",type:"uint8"},{name:"proof",...webauthnProof}]} as const;
const authenticator = {type:"tuple",components:[{name:"id",type:"uint8"},{name:"scheme",type:"uint8"},{name:"identityId",type:"bytes32"}]} as const;

export const AUTH_ABI = [
  {type:"function",name:"RECONFIG_DELAY",stateMutability:"view",inputs:[],outputs:[{type:"uint64"}]},
  {type:"function",name:"TRANSFER_DELAY",stateMutability:"view",inputs:[],outputs:[{type:"uint64"}]},
  {type:"function",name:"accountBalance",stateMutability:"view",inputs:[{name:"account",type:"address"}],outputs:[{type:"uint256"}]},
  {type:"function",name:"actionNonce",stateMutability:"view",inputs:[{name:"account",type:"address"}],outputs:[{type:"uint64"}]},
  {type:"function",name:"lastActivityAt",stateMutability:"view",inputs:[{name:"account",type:"address"}],outputs:[{type:"uint64"}]},
  {type:"function",name:"recentFailedAttempts",stateMutability:"view",inputs:[{name:"account",type:"address"}],outputs:[{type:"uint32"}]},
  {type:"function",name:"knownDestination",stateMutability:"view",inputs:[{name:"account",type:"address"},{name:"destination",type:"address"}],outputs:[{type:"bool"}]},
  {type:"function",name:"pendingTransfers",stateMutability:"view",inputs:[{name:"account",type:"address"}],outputs:[{name:"to",type:"address"},{name:"amount",type:"uint256"},{name:"proposedAt",type:"uint64"},{name:"exists",type:"bool"}]},
  {type:"function",name:"getConfig",stateMutability:"view",inputs:[{name:"account",type:"address"}],outputs:[{type:"tuple",components:[
    {name:"authenticators",type:"tuple[]",components:[{name:"id",type:"uint8"},{name:"scheme",type:"uint8"},{name:"identityId",type:"bytes32"}]},
    {name:"signingPolicy",type:"uint8[]"},{name:"signingThreshold",type:"uint8"},{name:"reconfigPolicy",type:"uint8[]"},{name:"reconfigThreshold",type:"uint8"},{name:"configVersion",type:"uint64"}
  ]}]},
  {type:"function",name:"getPendingReconfig",stateMutability:"view",inputs:[{name:"account",type:"address"}],outputs:[{type:"tuple",components:[
    {name:"authenticators",type:"tuple[]",components:[{name:"id",type:"uint8"},{name:"scheme",type:"uint8"},{name:"identityId",type:"bytes32"}]},
    {name:"signingPolicy",type:"uint8[]"},{name:"signingThreshold",type:"uint8"},{name:"reconfigPolicy",type:"uint8[]"},{name:"reconfigThreshold",type:"uint8"},
    {name:"proposedAt",type:"uint64"},{name:"exists",type:"bool"},{name:"riskScore",type:"uint8"},{name:"requiresExtraConfirmation",type:"bool"},{name:"extraConfirmationGiven",type:"bool"}
  ]}]},
  {type:"function",name:"deposit",stateMutability:"payable",inputs:[{name:"account",type:"address"}],outputs:[]},
  {type:"function",name:"initializeConfig",stateMutability:"nonpayable",inputs:[{name:"authenticators",type:"tuple[]",components:authenticator.components},{name:"signingPolicy",type:"uint8[]"},{name:"signingThreshold",type:"uint8"},{name:"reconfigPolicy",type:"uint8[]"},{name:"reconfigThreshold",type:"uint8"}],outputs:[]},
  {type:"function",name:"proposeReconfigurationWithPasskey",stateMutability:"nonpayable",inputs:[
    {name:"requestData",type:"bytes"}
  ],outputs:[]},
  {"type":"function","name":"confirmHighRiskProposalWithPasskey","inputs":[{"name":"account","type":"address","internalType":"address"},{"name":"proofs","type":"tuple[]","internalType":"struct AuthConfigManager.WebAuthnAuthProof[]","components":[{"name":"authenticatorId","type":"uint8","internalType":"uint8"},{"name":"proof","type":"tuple","internalType":"struct WebAuthnVerifier.WebAuthnProof","components":[{"name":"authenticatorData","type":"bytes","internalType":"bytes"},{"name":"clientDataJSONPrefix","type":"string","internalType":"string"},{"name":"clientDataJSONSuffix","type":"string","internalType":"string"},{"name":"sigR","type":"bytes32","internalType":"bytes32"},{"name":"sigS","type":"bytes32","internalType":"bytes32"}]}]}],"outputs":[],"stateMutability":"nonpayable"},
  {"type":"function","name":"contestReconfigurationWithPasskey","inputs":[{"name":"account","type":"address","internalType":"address"},{"name":"proofs","type":"tuple[]","internalType":"struct AuthConfigManager.WebAuthnAuthProof[]","components":[{"name":"authenticatorId","type":"uint8","internalType":"uint8"},{"name":"proof","type":"tuple","internalType":"struct WebAuthnVerifier.WebAuthnProof","components":[{"name":"authenticatorData","type":"bytes","internalType":"bytes"},{"name":"clientDataJSONPrefix","type":"string","internalType":"string"},{"name":"clientDataJSONSuffix","type":"string","internalType":"string"},{"name":"sigR","type":"bytes32","internalType":"bytes32"},{"name":"sigS","type":"bytes32","internalType":"bytes32"}]}]}],"outputs":[],"stateMutability":"nonpayable"},
  {type:"function",name:"activateReconfiguration",stateMutability:"nonpayable",inputs:[{name:"account",type:"address"}],outputs:[]},
  {type:"function",name:"verifiedTransferWithPasskey",stateMutability:"nonpayable",inputs:[{name:"account",type:"address"},{name:"to",type:"address"},{name:"amount",type:"uint256"},{name:"proofs",type:"tuple[]",components:authProof.components}],outputs:[]},
  {"type":"function","name":"contestTransferWithPasskey","inputs":[{"name":"account","type":"address","internalType":"address"},{"name":"proofs","type":"tuple[]","internalType":"struct AuthConfigManager.WebAuthnAuthProof[]","components":[{"name":"authenticatorId","type":"uint8","internalType":"uint8"},{"name":"proof","type":"tuple","internalType":"struct WebAuthnVerifier.WebAuthnProof","components":[{"name":"authenticatorData","type":"bytes","internalType":"bytes"},{"name":"clientDataJSONPrefix","type":"string","internalType":"string"},{"name":"clientDataJSONSuffix","type":"string","internalType":"string"},{"name":"sigR","type":"bytes32","internalType":"bytes32"},{"name":"sigS","type":"bytes32","internalType":"bytes32"}]}]}],"outputs":[],"stateMutability":"nonpayable"},
  {type:"function",name:"activateTransfer",stateMutability:"nonpayable",inputs:[{name:"account",type:"address"}],outputs:[]},
  {type:"event",name:"ConfigInitialized",anonymous:false,inputs:[{indexed:true,name:"account",type:"address"},{indexed:false,name:"configVersion",type:"uint64"}]},
  {type:"event",name:"ReconfigurationProposed",anonymous:false,inputs:[{indexed:true,name:"account",type:"address"},{indexed:false,name:"currentVersion",type:"uint64"},{indexed:false,name:"proposedAt",type:"uint64"},{indexed:false,name:"riskScore",type:"uint8"}]},
  {type:"event",name:"ReconfigurationContested",anonymous:false,inputs:[{indexed:true,name:"account",type:"address"},{indexed:false,name:"contestedAt",type:"uint64"}]},
  {type:"event",name:"ReconfigurationActivated",anonymous:false,inputs:[{indexed:true,name:"account",type:"address"},{indexed:false,name:"newVersion",type:"uint64"}]},
  {type:"event",name:"ExtraConfirmationGiven",anonymous:false,inputs:[{indexed:true,name:"account",type:"address"}]},
  {type:"event",name:"FundsReceived",anonymous:false,inputs:[{indexed:true,name:"account",type:"address"},{indexed:false,name:"amount",type:"uint256"}]},
  {type:"event",name:"VerifiedTransferExecuted",anonymous:false,inputs:[{indexed:true,name:"account",type:"address"},{indexed:true,name:"to",type:"address"},{indexed:false,name:"amount",type:"uint256"},{indexed:false,name:"nonce",type:"uint64"}]},
  {type:"event",name:"TransferProposed",anonymous:false,inputs:[{indexed:true,name:"account",type:"address"},{indexed:true,name:"to",type:"address"},{indexed:false,name:"amount",type:"uint256"},{indexed:false,name:"proposedAt",type:"uint64"}]},
  {type:"event",name:"TransferContested",anonymous:false,inputs:[{indexed:true,name:"account",type:"address"},{indexed:true,name:"to",type:"address"},{indexed:false,name:"contestedAt",type:"uint64"}]},
  {type:"event",name:"NewDestinationTransferActivated",anonymous:false,inputs:[{indexed:true,name:"account",type:"address"},{indexed:true,name:"to",type:"address"},{indexed:false,name:"amount",type:"uint256"}]}
] as const;

export const VIEWS_ABI = anchorViewsAbi;
export const CONTRACTS = { identityRegistry:{address:IDENTITY_REGISTRY,abi:IDENTITY_ABI}, authConfigManager:{address:AUTH_CONFIG_MANAGER,abi:AUTH_ABI}, anchorViews:{address:ANCHOR_VIEWS,abi:VIEWS_ABI} } as const;
export const explorerTx=(hash:string)=>`${MONAD_EXPLORER}/tx/${hash}`;
export const explorerAddress=(address:string)=>`${MONAD_EXPLORER}/address/${address}`;
export const shortAddress=(value?:string)=>value?`${value.slice(0,6)}…${value.slice(-4)}`:"—";
export const schemeName=(scheme:number)=>scheme===1?"Passkey":scheme===2?"Guardian":scheme===3?"Agent":"Signer";
