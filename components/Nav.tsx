"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { ArrowUpRight, Menu, X, WalletCards } from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import Brand from "./Brand";
import { shortAddress } from "@/lib/anchor";

const links = [
  ["/", "Why Anchor"],
  ["/console", "Control Room"],
  ["/identity", "Identity"],
  ["/policy", "Policy"],
  ["/guardians", "Guardians"],
  ["/shield", "Transfer Shield"],
  ["/activity", "Security Ledger"],
];

export default function Nav() {
  const path = usePathname();
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();

  const [open, setOpen] = useState(false);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const connector = connectors[0];

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/8 bg-void/90 backdrop-blur-2xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Brand />

        <nav className="ml-6 hidden items-center gap-0.5 xl:flex">
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className={`rounded-full px-3 py-2 text-sm transition ${
                path === href
                  ? "bg-mint/10 text-mint"
                  : "text-muted hover:text-white"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="https://testnet.monadscan.com"
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-1 rounded-full border border-white/12 px-3 py-2 text-xs text-muted hover:text-white sm:flex"
          >
            Monad testnet <ArrowUpRight size={13} />
          </a>

          {!mounted ? (
            <button
              type="button"
              disabled
              aria-label="Loading wallet"
              className="focus-ring rounded-full border border-white/10 px-4 py-2 text-sm opacity-50"
            >
              Loading wallet…
            </button>
          ) : isConnected && address ? (
            <button
              type="button"
              onClick={() => disconnect()}
              aria-label="Disconnect wallet"
              title="Click to disconnect wallet"
              className="focus-ring rounded-full border border-mint/20 bg-mint/5 px-3 py-2 text-xs text-mint"
            >
              {shortAddress(address)}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (connector) connect({ connector });
              }}
              className="focus-ring flex items-center gap-2 rounded-full bg-mint px-4 py-2 text-sm font-semibold text-void shadow-[0_0_24px_rgba(139,231,162,.12)]"
            >
              <WalletCards size={15} />
              Connect
            </button>
          )}

          <button
            type="button"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={open}
            className="rounded-full border border-white/10 p-2 xl:hidden"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-white/5 bg-void px-4 py-3 xl:hidden">
          {links.map(([href, label]) => (
            <Link
              onClick={() => setOpen(false)}
              key={href}
              href={href}
              className={`block rounded-xl px-3 py-3 text-sm ${
                path === href ? "bg-white/7 text-mint" : "text-muted"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
