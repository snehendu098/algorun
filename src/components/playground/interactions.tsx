"use client";

import React, { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import UsersView from "./user-view";
import { useGame } from "@/contexts/GameContext";
import { useWallet } from "@txnlab/use-wallet-react";
import algosdk from "algosdk";
import { toast } from "sonner";

const PlaygroundInteractions = () => {
  const [betAmount, setBetAmount] = useState<number>(0);
  const [autoCashout, setAutoCashout] = useState<number>(0);
  const { phase, joinGame, isConnected, withdraw, stakes } = useGame();
  const { activeAddress, signTransactions, algodClient } = useWallet();

  const handlePlaceBet = async () => {
    if (!activeAddress) return;

    if (phase !== "waiting") {
      toast.error("Bets can only be placed before the game starts");
      return;
    }

    try {
      const suggestedParams = await algodClient.getTransactionParams().do();
      const transaction = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        sender: activeAddress,
        receiver: "5ZIBWA22BEWPYP7NOSDCNP4YAWYUQIWVOMUEOZMW6BNZW6RNY3C37RHULM",
        amount: betAmount,
        suggestedParams,
      });

      toast.loading("Please sign the transaction in your wallet...");

      // Sign transaction
      const signedTxns = await signTransactions([transaction]);

      toast.dismiss();

      const filteredTxns = signedTxns.filter(
        (txn): txn is Uint8Array => txn !== null
      );

      toast.loading("Submitting transaction...");

      const { txid } = await algodClient.sendRawTransaction(filteredTxns).do();

      toast.dismiss();
      toast.loading("Waiting for confirmation...");

      const result = await algosdk.waitForConfirmation(algodClient, txid, 4);

      toast.dismiss();

      if (
        result["confirmedRound"] &&
        activeAddress &&
        betAmount > 0 &&
        phase === "waiting"
      ) {
        joinGame(activeAddress, betAmount);
        toast.success("Bet placed successfully!");
      }
    } catch (err: any) {
      toast.dismiss();

      if (
        err?.code === 4100 ||
        err?.message?.includes("User Rejected Request")
      ) {
        toast.error("Transaction cancelled by user");
      } else if (err?.message?.includes("insufficient balance")) {
        toast.error("Insufficient balance");
      } else {
        toast.error("Failed to place bet. Please try again.");
      }

      console.log(err);
    }
  };

  const canPlaceBet =
    activeAddress && betAmount > 0 && phase === "waiting" && isConnected;

  const handleCashout = () => {
    if (activeAddress && phase === "running") {
      withdraw(activeAddress);
    }
  };

  const isPlayerInGame =
    activeAddress && stakes.some((stake) => stake.address === activeAddress);
  const canCashout =
    activeAddress && phase === "running" && isPlayerInGame && isConnected;
  return (
    <ScrollArea className="h-[85vh] rounded-xl">
      <div className="col-span-1 w-full py-6 flex-1  flex backdrop-blur-2xl flex-col p-4 rounded-xl bg-card/50">
        <div className="space-y-2">
          <Label className="text-primary text-md font-semibold">
            Bet Amount
          </Label>
          <Input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(parseFloat(e.target.value) || 0)}
            step={0.001}
            min={0}
            className="w-full border-2 rounded-xl bg-background"
            placeholder="Enter bet amount"
          />
        </div>
        <div className="space-y-2 mt-6">
          <Label className="text-primary text-md font-semibold">
            Auto Cashout
          </Label>
          <Input
            type="number"
            value={autoCashout}
            onChange={(e) => setAutoCashout(parseFloat(e.target.value) || 0)}
            step={0.01}
            min={1}
            className="w-full border-2 rounded-xl bg-background"
            placeholder="Auto cashout multiplier"
          />
        </div>
        <Button
          className="mt-6 rounded-full"
          onClick={
            phase === "running" && canCashout ? handleCashout : handlePlaceBet
          }
          disabled={
            phase === "waiting"
              ? !canPlaceBet
              : phase === "running"
              ? !canCashout
              : true
          }
        >
          {phase === "waiting"
            ? "Place Bet"
            : phase === "running"
            ? "Cashout"
            : "Game Ended"}
        </Button>

        <div className="mt-4 text-sm text-center">
          <div
            className={`text-xs px-2 py-1 rounded ${
              isConnected ? "text-green-500" : "text-red-500"
            }`}
          >
            {isConnected ? "● Connected" : "● Disconnected"}
          </div>
        </div>

        <UsersView />
      </div>
    </ScrollArea>
  );
};

export default PlaygroundInteractions;
