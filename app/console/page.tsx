"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAccount, useReadContract } from "wagmi";
import {
  ArrowRight,
  Clock3,
  Fingerprint,
  LockKeyhole,
  ShieldCheck,
  Waypoints,
} from "lucide-react";
import Nav from "@/components/Nav";
import Background from "@/components/Background";
import SectionTitle from "@/components/SectionTitle";
import ConnectCard from "@/components/ConnectCard";
import TrustOrb from "@/components/TrustOrb";
import OnChainPill from "@/components/OnChainPill";
import { CONTRACTS, shortAddress } from "@/lib/anchor";
import type { AnchorAccountSummary } from "@/lib/anchor";
export default function Console() {
  const { address, isConnected } = useAccount();
  const { data: s, isLoading } = useReadContract({
    address: CONTRACTS.anchorViews.address,
    abi: CONTRACTS.anchorViews.abi,
    functionName: "getAccountSummary",
    args: address ? [address] : undefined,
    query: { enabled: !!address, refetchInterval: 4000 },
  });
  const x = s as unknown as AnchorAccountSummary | undefined;
  if (!isConnected)
    return (
      <>
        <Background />
        <Nav />
        <main className="mx-auto max-w-7xl px-4 pb-24 pt-32 sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow="Live control room"
            title="Your wallet. Readable like a security system."
            body="Connect a wallet to inspect the actual Anchor state on Monad testnet. Every card below is derived from deployed contract reads."
          />
          <div className="mt-12">
            <ConnectCard title="Connect to inspect the account" />
          </div>
        </main>
      </>
    );
  return (
    <>
      <Background />
      <Nav />
      <main className="mx-auto max-w-7xl px-4 pb-24 pt-32 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionTitle
            eyebrow="Live control room"
            title="Account security, at a glance."
            body="The console is intentionally not a single dashboard. Use it as the map into Anchor's real security operations."
          />
          <div className="glass rounded-2xl p-4">
            <p className="text-[10px] uppercase tracking-[.16em] text-muted">
              Connected account
            </p>
            <p className="mono mt-2 text-sm">{shortAddress(address)}</p>
            <OnChainPill text="Reading Monad" />
          </div>
        </div>
        {isLoading ? (
          <div className="mt-12 h-64 animate-pulse rounded-3xl bg-white/5" />
        ) : (
          <>
            {x?.configVersion === 0n ? (
              <div className="mt-12 glass rounded-3xl p-8">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-warn">
                      Account not armed
                    </p>
                    <h2 className="display mt-1 text-3xl font-semibold">
                      Create your first passkey identity.
                    </h2>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
                      The connected address exists, but Anchor has no security
                      policy for it yet. Start in Identity to register a real
                      browser passkey, then initialize the on-chain policy.
                    </p>
                  </div>
                  <Link
                    href="/identity"
                    className="inline-flex shrink-0 items-center gap-2 rounded-full bg-mint px-5 py-3 text-sm font-semibold text-void"
                  >
                    Arm account <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="mt-12 grid items-center gap-8 lg:grid-cols-[.75fr_1.25fr]">
                  <div className="glass rounded-3xl p-8">
                    <TrustOrb
                      label={
                        x?.hasPending ? "ATTENTION REQUIRED" : "ACCOUNT ARMED"
                      }
                    />
                    <div className="mt-4 text-center">
                      <p className="text-sm font-semibold">
                        {x?.hasPending
                          ? "A change is waiting"
                          : "No pending security change"}
                      </p>
                      <p className="mt-2 text-xs leading-5 text-muted">
                        {x?.hasPending
                          ? "Review the risk score and choose: confirm, contest, or wait for activation."
                          : "Your current policy is active on-chain."}
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      [
                        Fingerprint,
                        "Identity",
                        `${x?.authenticators?.length || 0} authenticator${x?.authenticators?.length === 1 ? "" : "s"}`,
                        "/identity",
                      ],
                      [
                        Waypoints,
                        "Policy",
                        `${x?.signingThreshold} of ${x?.authenticators?.length || 0} signing threshold`,
                        "/policy",
                      ],
                      [
                        Clock3,
                        "Pending change",
                        x?.hasPending
                          ? `${x?.pendingRiskScore}/100 risk`
                          : "Nothing queued",
                        "/policy",
                      ],
                      [
                        LockKeyhole,
                        "Transfer shield",
                        "New destinations delayed",
                        "/shield",
                      ],
                      [
                        ShieldCheck,
                        "Guardians",
                        `${(x?.authenticators || []).filter((a: any) => Number(a.scheme) === 2).length} configured`,
                        "/guardians",
                      ],
                    ].map(([Icon, label, value, href]: any, i) => (
                      <motion.div
                        key={label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                      >
                        <Link
                          href={href}
                          className="glass group block rounded-3xl p-6 transition hover:-translate-y-1 hover:border-mint/20"
                        >
                          <div className="flex items-center justify-between">
                            <Icon size={18} className="text-mint" />
                            <ArrowRight
                              size={15}
                              className="text-muted transition group-hover:translate-x-1 group-hover:text-mint"
                            />
                          </div>
                          <p className="mt-7 text-[10px] uppercase tracking-[.18em] text-muted">
                            {label}
                          </p>
                          <p className="mt-1 font-semibold">{value}</p>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <section className="mt-14">
                  <div className="mb-5 flex items-end justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-[.18em] text-mint">
                        Current policy
                      </p>
                      <h2 className="display mt-1 text-2xl font-semibold">
                        Who can act on this address?
                      </h2>
                    </div>
                    <Link
                      href="/policy"
                      className="text-xs text-muted hover:text-mint"
                    >
                      Manage policy →
                    </Link>
                  </div>
                  <div className="glass overflow-hidden rounded-3xl">
                    <div className="grid grid-cols-[48px_minmax(0,1fr)] gap-3 border-b sm:grid-cols-[80px_minmax(0,1fr)_120px_120px] border-white/5 px-5 py-3 text-[10px] uppercase tracking-[.14em] text-muted">
                      <span>ID</span>
                      <span>Authenticator</span>
                      <span className="hidden sm:block">Signing</span>
                      <span className="hidden sm:block">Status</span>
                    </div>
                    {(x?.authenticators || []).map((a: any) => (
                      <div
                        key={a.id}
                        className="grid grid-cols-[48px_minmax(0,1fr)] items-center gap-3 border-b sm:grid-cols-[80px_minmax(0,1fr)_120px_120px] border-white/5 px-5 py-4 last:border-0"
                      >
                        <span className="mono text-xs text-muted">#{a.id}</span>
                        <div>
                          <p className="text-sm font-medium">
                            {a.displayName || "Unnamed authenticator"}
                          </p>
                          <p className="mono mt-1 text-[10px] text-muted">
                            {shortAddress(a.identityId)}
                          </p>
                        </div>
                        <span className="hidden text-xs sm:block">
                          {x?.signingPolicy?.includes(a.id)
                            ? "Allowed"
                            : "Recovery only"}
                        </span>
                        <span
                          className={`hidden sm:block ${a.active ? "text-xs text-mint" : "text-xs text-danger"}`}
                        >
                          {a.active ? "ACTIVE" : "REVOKED"}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}
          </>
        )}
      </main>
    </>
  );
}
