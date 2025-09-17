"use client";

import { useWallet } from "@txnlab/use-wallet-react";
import { WalletButton } from "./wallet-button";
import { Address } from "algosdk";
import { AlgorandClient } from "@algorandfoundation/algokit-utils";

export const WalletMenu = () => {
  return (
    <div className="flex items-center space-x-2">
      <WalletButton />
    </div>
  );
};
