import "./globals.css";
import Web3Provider from "@/components/Web3Provider";
export const metadata={title:"Anchor — a valid signature is not enough",description:"On-chain wallet security on Monad. Passkey identity, programmable policy, destination protection and controlled settlement."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body className="noise"><Web3Provider>{children}</Web3Provider></body></html>}
