"use client";

import { NetworkId, WalletId, WalletManager } from "@txnlab/use-wallet";
import { WalletProvider } from "@txnlab/use-wallet-react";
import React from "react";

const manager = new WalletManager({
  wallets: [
    WalletId.PERA,
    WalletId.DEFLY,
    WalletId.EXODUS,
    WalletId.KIBISIS,
    WalletId.LUTE,
  ],
  defaultNetwork: NetworkId.TESTNET,
});

const WalletWrapper = ({ children }: { children: React.ReactNode }) => {
  return <WalletProvider manager={manager}>{children}</WalletProvider>;
};

export default WalletWrapper;
