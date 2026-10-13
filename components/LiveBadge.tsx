"use client";
import {motion} from "framer-motion";import {Activity} from "lucide-react";
export default function LiveBadge(){return <span className="inline-flex items-center gap-2 rounded-full border border-mint/20 bg-mint/[.06] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[.15em] text-mint"><motion.span animate={{opacity:[.45,1,.45],scale:[.85,1,.85]}} transition={{duration:2,repeat:Infinity}} className="h-1.5 w-1.5 rounded-full bg-mint"/><Activity size={12}/>Monad testnet · on-chain app</span>}
