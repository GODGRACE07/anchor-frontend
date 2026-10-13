"use client";
import Link from "next/link";
import {
  ArrowRight,
  Fingerprint,
  ShieldCheck,
  Users,
  Waypoints,
  AlertCircle,
} from "lucide-react";
import { useAccount, useReadContract } from "wagmi";
import Nav from "@/components/Nav";
import Background from "@/components/Background";
import SectionTitle from "@/components/SectionTitle";
import ConnectCard from "@/components/ConnectCard";
import OnChainPill from "@/components/OnChainPill";
import { CONTRACTS, schemeName, shortAddress } from "@/lib/anchor";

export default function Guardians() {
  const { address, isConnected } = useAccount();
  const { data, isLoading, error } = useReadContract({
    address: CONTRACTS.anchorViews.address,
    abi: CONTRACTS.anchorViews.abi,
    functionName: "getAccountSummary",
    args: address ? [address] : undefined,
    query: { enabled: !!address, refetchInterval: 5000 },
  });
  const account = data as any;
  const authenticators = (account?.authenticators || []) as any[];
  const guardians = authenticators.filter((a) => Number(a.scheme) === 2);
  const active = guardians.filter((a) => a.active);

  return (
    <>
      <Background />
      <Nav />
      <main className="mx-auto max-w-7xl px-4 pb-24 pt-32 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Guardians & continuity"
          title="Recovery should protect the account — not replace it."
          body="This page reads the guardian-scheme authenticators actually present in Anchor's on-chain configuration. It does not invent guardians or imply a recovery action exists when it is not exposed by this interface."
        />
        {!isConnected ? (
          <div className="mt-10">
            <ConnectCard title="Connect to inspect guardian configuration" />
          </div>
        ) : (
          <>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <div className="glass rounded-3xl p-6">
                <Users size={19} className="text-mint" />
                <p className="mt-6 text-[10px] font-bold uppercase tracking-[.18em] text-muted">
                  Configured guardian scheme
                </p>
                <p className="display mt-2 text-4xl font-semibold">
                  {guardians.length.toString().padStart(2, "0")}
                </p>
                <p className="mt-2 text-xs text-muted">
                  Read from live account summary
                </p>
              </div>
              <div className="glass rounded-3xl p-6">
                <ShieldCheck size={19} className="text-mint" />
                <p className="mt-6 text-[10px] font-bold uppercase tracking-[.18em] text-muted">
                  Active guardians
                </p>
                <p className="display mt-2 text-4xl font-semibold">
                  {active.length.toString().padStart(2, "0")}
                </p>
                <p className="mt-2 text-xs text-muted">
                  Only active configured entries are counted
                </p>
              </div>
              <div className="glass rounded-3xl p-6">
                <Waypoints size={19} className="text-mint" />
                <p className="mt-6 text-[10px] font-bold uppercase tracking-[.18em] text-muted">
                  Account continuity
                </p>
                <p className="mt-2 text-lg font-semibold">
                  {shortAddress(address)}
                </p>
                <p className="mt-2 text-xs text-muted">
                  The connected account address remains the same during policy
                  reconfiguration.
                </p>
              </div>
            </div>
            <section className="glass mt-6 overflow-hidden rounded-3xl">
              <div className="flex flex-col gap-3 border-b border-white/8 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[.18em] text-mint">
                    Live configuration
                  </p>
                  <h2 className="display mt-2 text-2xl font-semibold">
                    Guardian authenticators
                  </h2>
                </div>
                <OnChainPill
                  text={
                    isLoading
                      ? "Reading chain"
                      : error
                        ? "Read failed"
                        : "On-chain read"
                  }
                />
              </div>
              {isLoading ? (
                <div className="space-y-3 p-6">
                  <div className="h-16 animate-pulse rounded-xl bg-white/5" />
                  <div className="h-16 animate-pulse rounded-xl bg-white/5" />
                </div>
              ) : error ? (
                <div className="p-6 text-sm text-danger">
                  Could not read the current configuration from Monad. Check the
                  RPC connection and reload.
                </div>
              ) : guardians.length === 0 ? (
                <div className="p-6 sm:p-8">
                  <div className="flex items-start gap-4 rounded-2xl border border-warn/20 bg-warn/[.04] p-5">
                    <AlertCircle
                      size={19}
                      className="mt-0.5 shrink-0 text-warn"
                    />
                    <div>
                      <p className="text-sm font-semibold">
                        No guardian-scheme authenticator is configured for this
                        account.
                      </p>
                      <p className="mt-2 text-sm leading-6 text-muted">
                        That is a live contract result, not a placeholder. The
                        current frontend supports passkey registration and
                        passkey-backed policy changes. It does not yet expose a
                        dedicated guardian onboarding or guardian-approval
                        ceremony, so there is no fake “Add guardian” button
                        here.
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link
                      href="/identity"
                      className="inline-flex items-center gap-2 rounded-full bg-mint px-5 py-3 text-sm font-bold text-void"
                    >
                      Manage passkey identity <ArrowRight size={15} />
                    </Link>
                    <Link
                      href="/policy"
                      className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold"
                    >
                      Review policy <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-white/8">
                  {guardians.map((g: any) => (
                    <div
                      key={`${g.id}-${g.identityId}`}
                      className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:p-6"
                    >
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-mint/20 bg-mint/[.06] text-mint">
                        <Fingerprint size={19} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold">
                          {g.displayName || `Guardian authenticator #${g.id}`}
                        </p>
                        <p className="mono mt-1 break-all text-[10px] text-muted">
                          {g.identityId}
                        </p>
                        <p className="mt-2 text-[10px] text-muted">
                          ID #{g.id} · {schemeName(Number(g.scheme))}
                        </p>
                      </div>
                      <span
                        className={`w-fit rounded-full border px-3 py-1 text-[9px] font-bold tracking-[.14em] ${g.active ? "border-mint/25 bg-mint/[.06] text-mint" : "border-danger/25 bg-danger/[.05] text-danger"}`}
                      >
                        {g.active ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="glass rounded-3xl p-6">
                <h3 className="text-sm font-semibold">
                  What Anchor&apos;s contract model provides
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted">
                  Authenticators are represented as policy entries, and the
                  contract recognizes a Guardian scheme. Account policy can
                  evolve through a delayed, contestable reconfiguration process.
                </p>
                <Link
                  href="/policy"
                  className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-mint"
                >
                  Inspect live policy <ArrowRight size={14} />
                </Link>
              </div>
              <div className="glass rounded-3xl p-6">
                <h3 className="text-sm font-semibold">Capability boundary</h3>
                <p className="mt-3 text-sm leading-6 text-muted">
                  Guardian status above comes from chain data. A guardian
                  enrollment/approval workflow is not presented as functional
                  until the frontend can create the required proofs and submit
                  the corresponding contract operation end to end.
                </p>
              </div>
            </div>
          </>
        )}
      </main>
    </>
  );
}
