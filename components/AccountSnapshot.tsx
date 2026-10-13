"use client";

import { useAccount, useReadContract } from "wagmi";
import {
  ShieldCheck,
  KeyRound,
  Clock3,
  WalletMinimal,
} from "lucide-react";
import { CONTRACTS } from "@/lib/anchor";
import { formatEther } from "viem";

type AccountSummary = {
  configVersion?: bigint | number;
  authenticators?: readonly unknown[];
  hasPending?: boolean;
};

export default function AccountSnapshot() {
  const { address, isConnected } = useAccount();

  const { data: summary } = useReadContract({
    address: CONTRACTS.anchorViews.address,
    abi: CONTRACTS.anchorViews.abi,
    functionName: "getAccountSummary",
    args: address ? [address] : undefined,
    query: { enabled: !!address, refetchInterval: 6000 },
  });

  const { data: balance } = useReadContract({
    address: CONTRACTS.authConfigManager.address,
    abi: CONTRACTS.authConfigManager.abi,
    functionName: "accountBalance",
    args: address ? [address] : undefined,
    query: { enabled: !!address, refetchInterval: 6000 },
  });

  if (!isConnected) return null;

  const account = summary as AccountSummary | undefined;

  const cards = [
    {
      icon: ShieldCheck,
      label: "Version",
      value:
        account?.configVersion !== undefined &&
        account.configVersion !== 0
          ? account.configVersion.toString()
          : "Not initialized",
    },
    {
      icon: KeyRound,
      label: "Authenticators",
      value: account?.authenticators?.length ?? 0,
    },
    {
      icon: Clock3,
      label: "Protection",
      value: account?.hasPending ? "Action pending" : "No pending change",
    },
    {
      icon: WalletMinimal,
      label: "Shield balance",
      value:
        balance !== undefined
          ? `${Number(formatEther(balance)).toFixed(4)} MON`
          : "—",
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-4">
      {cards.map(({ icon: Icon, label, value }) => (
        <div key={label} className="glass rounded-2xl p-4">
          <Icon size={16} className="text-mint" />
          <p className="mt-3 text-[11px] uppercase tracking-[.14em] text-muted">
            {label}
          </p>
          <p className="mt-1 text-sm font-semibold">{value}</p>
        </div>
      ))}
    </div>
  );
}
