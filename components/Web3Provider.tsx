"use client";
import {WagmiProvider} from "wagmi";import {QueryClient,QueryClientProvider} from "@tanstack/react-query";import {wagmiConfig} from "@/lib/wagmi";import {useState} from "react";
export default function Web3Provider({children}:{children:React.ReactNode}){const[q]=useState(()=>new QueryClient());return <WagmiProvider config={wagmiConfig}><QueryClientProvider client={q}>{children}</QueryClientProvider></WagmiProvider>}
