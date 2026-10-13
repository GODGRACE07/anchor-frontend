# Anchor — green security console

Anchor is a wallet-security control layer for Monad. This frontend is built around the actual on-chain lifecycle, not a scripted success demo:

**Identity → Policy → Destination → Settlement**

A green badge is never used as the only signal of success. Pending, warning, and failed states use separate labels and icons. Transaction claims must be checked against the explorer.

## Network and deployed contracts

Default network: **Monad Testnet** (chain ID `10143`, native currency `MON`, RPC `https://testnet-rpc.monad.xyz`).

- IdentityRegistry: `0x0xe92db7ed079aA6fF8888C6dD88f60C9Ed43De917`
- AuthConfigManager: `0x0x8330D46baE39D554DaACc61c424F27fCf364919B`
- AnchorViews: `0x0x08E2722d76fA8f964d88E44c202D3A3609c7A329`
- Explorer: `https://testnet.monadscan.com`

Addresses can be overridden with the variables in `.env.example`. Do not use private keys in frontend environment variables; the user's wallet signs transactions.

## Run locally

Requirements: Node.js 20+ (Node 22 LTS recommended) and npm.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. WebAuthn works on `localhost` or a secure HTTPS origin. Connect a wallet on Monad Testnet and use only test funds.

Before submitting or deploying:

```bash
npm run build
npm run lint
```

A successful source archive or syntax-transpilation check is **not** a substitute for these commands. If either command fails, fix the errors before a public demo.

## Judge test path

1. **Homepage** — read the threat model and follow the live test link.
2. **Identity** — connect, create a browser passkey, wait for the registration transaction to confirm, then initialize the policy. Keep the same browser/profile for the credential used by later flows; the WebAuthn credential identifier is stored locally by the browser.
3. **Console** — inspect the account summary read from `AnchorViews`.
4. **Policy** — propose a policy change, inspect the real pending proposal, test the contest/extra-confirmation paths as appropriate, and activate only after the contract's delay allows it.
5. **Shield** — deposit test MON, send to a trusted destination to exercise the immediate path, then use an unfamiliar test destination to see the pending delay and contest/activation controls.
6. **Activity** — inspect the contract events and open transaction hashes in MonadScan.
7. **Guardians** — inspect only guardian-scheme authenticators already present in the live configuration. The deployed interface currently does not provide a separate guardian enrollment, voting, or recovery ceremony; this page must not be represented as such.

## Real capabilities represented

- WebAuthn passkey registration with proof sent to the deployed IdentityRegistry.
- Account policy initialization.
- Passkey-backed policy reconfiguration proposal, risk context, extra confirmation, contest, and activation.
- On-chain account summary and authenticator reads.
- Deposit and known-destination tracking.
- Passkey-authorized transfer, delayed unfamiliar-destination transfer, contest, and activation.
- On-chain event history with explorer links.

## Honest capability boundaries

- Guardian-scheme entries can be displayed if present in the on-chain account summary. A separate guardian enrollment / approval / social recovery ceremony is not exposed as a complete user flow by this frontend/contract interface.
- Activity scanning is bounded to a recent block window; it is not an archival indexer.
- Browser passkeys are device/browser-origin scoped. Losing access to the authenticator or changing browser/device can require a separate recovery route; do not promise automatic recovery.
- This is a testnet demo. It is not an audited production wallet and should not hold real funds.
- The frontend reports transaction submission separately from on-chain confirmation where applicable. Always open the transaction in the explorer to verify its final status.

## Visual system

The visual language is a dark botanical / security-console theme rather than generic purple Web3 UI:

- Background `#07110D`, surface `#0D1A13`
- Primary mint `#8BE7A2`, lime accent `#CFF879`
- Primary text `#F2F1E8`, muted text `#A2B1A5`
- Pending `#E8B86D`, critical `#FF7D72`

The palette's foreground colors exceed WCAG AA's 4.5:1 contrast threshold against both core dark surfaces. Status still includes text/icons, not color alone. Motion is decorative and should respect reduced-motion preferences.
