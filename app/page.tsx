"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Clock3,
  Fingerprint,
  LockKeyhole,
  ScanSearch,
  ShieldCheck,
  Waypoints,
  Zap,
} from "lucide-react";
import Nav from "@/components/Nav";
import Background from "@/components/Background";
import LiveBadge from "@/components/LiveBadge";
import TrustOrb from "@/components/TrustOrb";
import AccountSnapshot from "@/components/AccountSnapshot";

const threats = [
  {
    n: "01",
    label: "CREDENTIAL COMPROMISE",
    title: "A stolen key can become total control.",
    body: "Traditional wallets often make one secret the single point of failure. Anchor adds a passkey-first P-256 identity without creating a seed phrase for that credential.",
    icon: Fingerprint,
    tone: "green",
    tag: "PASSKEY IDENTITY",
    href: "/identity",
  },
  {
    n: "02",
    label: "AUTHORIZATION SPOOFING",
    title: "A transaction can be approved for the wrong reason.",
    body: "The 24 September 2026 Bitget incident put wallet infrastructure and authorization integrity under scrutiny. Anchor's trust path checks cryptographic proofs and policy on-chain instead of asking a backend to make the final trust decision.",
    icon: ScanSearch,
    tone: "amber",
    tag: "INDEPENDENT VERIFICATION",
    href: "/policy",
  },
  {
    n: "03",
    label: "DESTINATION DECEPTION",
    title: "A valid signature can still send money to the wrong address.",
    body: "Anchor treats unfamiliar destinations differently: a new recipient is queued behind a delay window (one hour in production, 15 seconds in this demo build) and can be contested before settlement. Previously trusted destinations can use the fast path.",
    icon: LockKeyhole,
    tone: "lime",
    tag: "TRANSFER SHIELD",
    href: "/shield",
  },
];
const steps = [
  { n: "01", title: "Identity", sub: "Who is authorizing?", icon: Fingerprint },
  {
    n: "02",
    title: "Policy",
    sub: "Does the action qualify?",
    icon: Waypoints,
  },
  {
    n: "03",
    title: "Destination",
    sub: "Where will value go?",
    icon: ScanSearch,
  },
  { n: "04", title: "Settlement", sub: "Should it execute now?", icon: Zap },
];

export default function Home() {
  return (
    <>
      <Background />
      <Nav />
      <main>
        <section className="relative mx-auto max-w-7xl px-4 pb-20 pt-32 sm:px-6 sm:pt-40 lg:px-8 lg:pt-44">
          <div className="pointer-events-none absolute right-[-10rem] top-24 -z-10 h-[28rem] w-[28rem] rounded-full bg-mint/[.07] blur-[110px]" />
          <div className="grid items-center gap-12 lg:grid-cols-[1.12fr_.88fr] lg:gap-16">
            <div>
              <LiveBadge />
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-8 text-[10px] font-bold uppercase tracking-[.28em] text-mint"
              >
                On-chain wallet security · Monad testnet
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.65 }}
                className="display mt-5 max-w-4xl text-[3.35rem] font-semibold leading-[.94] sm:text-7xl lg:text-[6.1rem]"
              >
                A valid signature should not be enough to{" "}
                <span className="text-mint">lose your money.</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, duration: 0.6 }}
                className="mt-7 max-w-2xl text-base leading-7 text-muted sm:text-lg sm:leading-8"
              >
                Anchor places programmable security controls between
                authorization and settlement. Credentials can change. Policy can
                evolve. Unfamiliar destinations can wait. Your account address
                stays yours.
              </motion.p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/console"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-mint px-6 py-3 text-sm font-bold text-void transition hover:bg-mint2"
                >
                  Open live control room <ArrowRight size={16} />
                </Link>
                <Link
                  href="/shield"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-text transition hover:border-mint/40 hover:bg-white/[.03]"
                >
                  Test the transfer shield <ArrowDownRight size={16} />
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-muted">
                <span className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-mint" />
                  Real contract interactions
                </span>
                <span>Browser-to-RPC reads</span>
                <span>Monad testnet · chain 10143</span>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-[34rem] lg:max-w-none">
              <div className="absolute inset-8 rounded-full bg-mint/[.08] blur-3xl" />
              <div className="relative">
                <TrustOrb label="SECURITY PIPELINE" />
              </div>
              <div className="glass relative mx-auto -mt-3 w-[92%] rounded-2xl p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[.2em] text-muted">
                      Anchor decision path
                    </p>
                    <p className="mt-1 text-sm font-semibold">
                      Authorization ≠ settlement
                    </p>
                  </div>
                  <span className="rounded-full border border-mint/25 bg-mint/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-mint">
                    4 stages
                  </span>
                </div>
                <div className="mt-5 grid grid-cols-4 gap-2">
                  {steps.map((s, i) => (
                    <div key={s.n} className="relative min-w-0">
                      <div className="grid h-10 w-10 place-items-center rounded-xl border border-mint/20 bg-mint/[.06] text-mint">
                        <s.icon size={17} />
                      </div>
                      <p className="mt-3 text-[10px] font-bold">{s.title}</p>
                      <p className="mt-1 hidden text-[9px] leading-4 text-muted sm:block">
                        {s.sub}
                      </p>
                      {i < 3 && (
                        <span className="absolute left-11 top-5 hidden h-px w-[calc(100%-2rem)] bg-mint/30 sm:block" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-16">
            <AccountSnapshot />
          </div>
        </section>

        <section className="border-y border-white/8 bg-white/[.015]">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div className="max-w-3xl">
                <p className="text-[10px] font-bold uppercase tracking-[.25em] text-mint">
                  The problem is real
                </p>
                <h2 className="display mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
                  Three failure points.
                  <br />
                  <span className="text-muted">
                    One security layer between them and your funds.
                  </span>
                </h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-muted">
                Most interfaces focus on whether a transaction can be signed.
                Anchor focuses on whether that authorized action should be
                allowed to settle.
              </p>
            </div>
            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              {threats.map((t, i) => (
                <motion.article
                  key={t.n}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ delay: i * 0.06 }}
                  className="glass group flex min-h-[21rem] flex-col rounded-3xl p-6 sm:p-7"
                >
                  <div className="flex items-start justify-between">
                    <span className="mono text-xs text-muted">/{t.n}</span>
                    <span
                      className={`grid h-11 w-11 place-items-center rounded-2xl border ${t.tone === "amber" ? "border-warn/25 bg-warn/10 text-warn" : t.tone === "lime" ? "border-mint2/25 bg-mint2/10 text-mint2" : "border-mint/25 bg-mint/10 text-mint"}`}
                    >
                      <t.icon size={20} />
                    </span>
                  </div>
                  <p className="mt-7 text-[9px] font-bold tracking-[.19em] text-muted">
                    {t.label}
                  </p>
                  <h3 className="display mt-3 text-2xl font-semibold leading-tight">
                    {t.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted">{t.body}</p>
                  <Link
                    href={t.href}
                    className="mt-auto flex items-center justify-between gap-3 pt-7 text-[10px] font-bold uppercase tracking-[.12em] text-mint"
                  >
                    <span>{t.tag}</span>
                    <ArrowRight
                      size={15}
                      className="transition group-hover:translate-x-1"
                    />
                  </Link>
                </motion.article>
              ))}
            </div>
            <div className="mt-5 rounded-2xl border border-warn/20 bg-warn/[.04] p-4 text-xs leading-5 text-muted">
              <span className="font-semibold text-warn">Incident context:</span>{" "}
              Bitget publicly described a September 2026 wallet-infrastructure
              incident; GIWA fake-bridge reporting describes a fake chain reusing GIWA's real chain ID that a DEX mistook for GIWA's mainnet, so users bridged funds to a destination nobody had verified. These incidents
              are context for the threat model, not a claim that Anchor would
              prevent every attack.{" "}
              <a
                className="ml-1 inline-flex items-center gap-1 text-text underline decoration-white/25 underline-offset-4"
                href="https://www.bitget.com/support/articles/12560603896024"
                target="_blank"
                rel="noreferrer"
              >
                Bitget statement <ArrowUpRight size={11} />
              </a>
              <a
                className="ml-3 inline-flex items-center gap-1 text-text underline decoration-white/25 underline-offset-4"
                href="https://www.bifu.co/news/detail/fake-giwa-chain-costs-dyorswap-users-767-eth-in-bridge-scam"
                target="_blank"
                rel="noreferrer"
              >
                GIWA reporting <ArrowUpRight size={11} />
              </a>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-mint">
              Inspired by Monad&apos;s upgradeable-authentication research
            </p>

            <h2 className="max-w-4xl text-3xl font-semibold tracking-tight sm:text-5xl">
              Your account should outlive your credentials.
            </h2>

            <p className="mt-6 max-w-3xl text-base leading-8 text-white/70 sm:text-lg">
              An account should not have to lose its identity just because the
              authentication methods protecting it need to change. Anchor
              explores a flexible account-security model that separates account
              identity from the authentication methods and policies authorized
              to control it.
            </p>

            <p className="mt-4 max-w-3xl text-base leading-8 text-white/70">
              Passkeys and supported authenticators can be managed through
              controlled on-chain configuration changes. Delays and contest
              mechanisms are designed to protect sensitive changes instead of
              allowing authorization rules to change instantly.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/identity"
                className="inline-flex items-center rounded-full border border-mint/35 bg-transparent px-5 py-3 text-sm font-semibold text-text transition-colors duration-200 hover:border-mint/70 hover:bg-mint/[.08] hover:text-mint2"
              >
                Explore Identity
              </a>

              <a
                href="/policy"
                className="inline-flex items-center rounded-full bg-mint px-5 py-3 text-sm font-semibold text-void transition-colors duration-200 hover:bg-mint2"
              >
                Explore Policy
              </a>
            </div>

            <div className="mt-10 grid gap-4 border-t border-white/10 pt-6 sm:grid-cols-3">
              <div>
                <p className="text-sm font-semibold text-white">
                  Persistent identity
                </p>
                <p className="mt-2 text-sm leading-6 text-white/60">
                  Keep the account address stable while authentication evolves.
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-white">
                  Controlled changes
                </p>
                <p className="mt-2 text-sm leading-6 text-white/60">
                  Apply authorization changes through explicit contract rules.
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-white">
                  Contestable security
                </p>
                <p className="mt-2 text-sm leading-6 text-white/60">
                  Use delays and contest mechanisms to protect sensitive
                  operations.
                </p>
              </div>
            </div>

            <p className="mt-8 max-w-3xl text-xs leading-6 text-white/50">
              Research connection: Monad&apos;s proposed direction for flexible,
              upgradeable account authentication. Anchor is an independent
              application implementation, not an official Monad protocol
              feature. Verify the original research publication and its exact
              title before citing it in a public submission.
            </p>
          </div>
        </section>

        <section className="border-y border-white/8 bg-[#0A1710]">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_1fr] lg:items-center lg:px-8">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.25em] text-mint">
                Not a scripted demo
              </p>
              <h2 className="display mt-4 text-4xl font-semibold sm:text-5xl">
                Don&apos;t watch a mockup.
                <br />
                <span className="text-muted">Test the defense.</span>
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-muted">
                Connect a wallet on Monad testnet, register a browser passkey,
                initialize a policy, and try a real transfer. Trusted and
                unfamiliar destinations take different contract-enforced paths.
                Every transaction can be inspected on the explorer.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/shield"
                  className="inline-flex items-center gap-2 rounded-full bg-mint px-5 py-3 text-sm font-bold text-void"
                >
                  Launch live test <ArrowRight size={15} />
                </Link>
                <Link
                  href="/activity"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold"
                >
                  Inspect security ledger <ArrowUpRight size={15} />
                </Link>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-mint/20 bg-mint/[.045] p-5">
                <ShieldCheck size={19} className="text-mint" />
                <p className="mt-6 text-sm font-semibold">Known destination</p>
                <p className="mt-2 text-xs leading-5 text-muted">
                  Passkey proof → policy check → immediate settlement when the
                  destination is trusted.
                </p>
                <span className="mt-5 inline-flex rounded-full border border-mint/25 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-mint">
                  Fast path
                </span>
              </div>
              <div className="rounded-2xl border border-warn/20 bg-warn/[.035] p-5">
                <Clock3 size={19} className="text-warn" />
                <p className="mt-6 text-sm font-semibold">New destination</p>
                <p className="mt-2 text-xs leading-5 text-muted">
                  Passkey proof → queued transfer → one-hour window → activate
                  or contest.
                </p>
                <span className="mt-5 inline-flex rounded-full border border-warn/25 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-warn">
                  Delayed path
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-white/8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-[10px] text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <span className="font-bold tracking-[.2em] text-text">
            ANCHOR / MONAD
          </span>
          <span>Identity · Policy · Destination · Settlement</span>
          <span>Testnet software · verify every transaction on-chain</span>
        </div>
      </footer>
    </>
  );
}
