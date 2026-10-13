"use client";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
export default function TrustOrb({label="SECURITY PIPELINE"}:{label?:string}) {
  return <div className="relative mx-auto grid h-64 w-64 place-items-center" aria-label={label}>
    <motion.div animate={{rotate:360}} transition={{duration:38,repeat:Infinity,ease:"linear"}} className="absolute inset-2 rounded-full border border-dashed border-mint/25"/>
    <div className="absolute inset-7 rounded-full border border-mint/15 bg-mint/[.025] shadow-[0_0_90px_rgba(139,231,162,.09)]"/>
    <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="43" fill="none" stroke="rgba(255,255,255,.10)" strokeWidth="1.5" strokeDasharray="2 7"/></svg>
    <div className="relative text-center"><div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl border border-mint/25 bg-mint/10 text-mint"><ShieldCheck size={23}/></div><p className="display text-3xl font-semibold tracking-[.16em]">ANCHOR</p><p className="mt-2 text-[9px] font-bold tracking-[.22em] text-mint">{label}</p><p className="mt-2 text-[9px] text-muted">VERIFY · POLICY · SETTLE</p></div>
  </div>;
}
