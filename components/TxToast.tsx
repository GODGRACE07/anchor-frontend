"use client";

import { ExternalLink, X } from "lucide-react";
import { explorerTx } from "@/lib/anchor";

type TxToastProps = {
  hash?: string;
  onClose: () => void;
  status?: "submitted" | "confirmed" | "failed";
};

export default function TxToast({
  hash,
  onClose,
  status = "submitted",
}: TxToastProps) {
  if (!hash) return null;

  const title = {
    submitted: "Transaction submitted",
    confirmed: "Transaction confirmed",
    failed: "Transaction failed",
  }[status];

  const titleClass =
    status === "failed" ? "text-danger" : "text-mint";

  return (
    <div className="fixed bottom-5 right-5 z-[90] w-[min(390px,calc(100vw-2rem))] glass rounded-2xl p-4 shadow-2xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={`text-sm font-semibold ${titleClass}`}>
            {title}
          </p>
          <p className="mono mt-1 break-all text-[11px] text-muted">
            {hash}
          </p>
        </div>

        <button
          onClick={onClose}
          aria-label="Dismiss transaction notification"
          className="text-muted hover:text-white"
        >
          <X size={16} />
        </button>
      </div>

      <a
        href={explorerTx(hash)}
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-flex items-center gap-2 text-xs text-white hover:text-mint"
      >
        Open on MonadScan <ExternalLink size={13} />
      </a>
    </div>
  );
}
