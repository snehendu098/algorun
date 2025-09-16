"use client";

import { useWallet } from "@txnlab/use-wallet-react";
import { useState } from "react";
import { WalletModal } from "./wallet-modal";
import { motion } from "framer-motion";
import { Wallet2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function WalletButton({ className }: { className?: string }) {
  const { activeWallet } = useWallet();
  const [open, setOpen] = useState(false);

  const address = activeWallet?.activeAccount?.address || "";
  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpen(true)}
        className={cn(
          "relative group overflow-hidden",
          "px-5 py-2.5 rounded-full",
          "bg-primary text-primary-foreground",
          "hover:bg-primary/90 transition-all duration-200",
          "flex items-center gap-2",
          "font-medium text-sm",
          "shadow-lg shadow-primary/20",
          className
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

        {activeWallet ? (
          <>
            <div className="w-5 h-5 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              {activeWallet.metadata?.icon ? (
                <img
                  src={activeWallet.metadata.icon}
                  alt={activeWallet.metadata.name}
                  className="w-3 h-3 object-contain"
                />
              ) : (
                <Wallet2 className="w-3 h-3" />
              )}
            </div>
            <span>{shortAddress}</span>
            <ChevronDown className="w-4 h-4 opacity-60" />
          </>
        ) : (
          <>
            <Wallet2 className="w-5 h-5" />
            <span>Connect Wallet</span>
          </>
        )}
      </motion.button>

      <WalletModal open={open} onOpenChange={setOpen} />
    </>
  );
}

export function WalletButtonMinimal({ className }: { className?: string }) {
  const { activeWallet } = useWallet();
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className={cn(
          "p-2.5 rounded-xl",
          "bg-card hover:bg-muted border border-border",
          "transition-all duration-200",
          "shadow-sm hover:shadow-md",
          className
        )}
      >
        {activeWallet?.metadata?.icon ? (
          <img
            src={activeWallet.metadata.icon}
            alt={activeWallet.metadata.name}
            className="w-6 h-6 object-contain"
          />
        ) : (
          <Wallet2 className="w-6 h-6 text-muted-foreground" />
        )}
      </motion.button>

      <WalletModal open={open} onOpenChange={setOpen} />
    </>
  );
}