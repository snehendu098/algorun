"use client";

import React, { useState, useEffect } from "react";
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
  const [isCashingOut, setIsCashingOut] = useState<boolean>(false);
  const {
    phase,
    joinGame,
    isConnected,
    withdraw,
    stakes,
    isInQueue,
    queueMessage
  } = useGame();
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
        amount: BigInt(betAmount * 1000000),
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
        betAmount > 0
      ) {
        // Pass the transaction ID to joinGame
        joinGame(activeAddress, betAmount, txid);

        // Check if the bet was queued (game might have started during confirmation)
        if (phase !== "waiting") {
          toast.info("Your bet has been queued for the next round");
        } else {
          toast.success("Bet placed successfully!");
        }
      }
    } catch (err: any) {
      console.log(err);

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
    activeAddress && betAmount > 0 && phase === "waiting" && isConnected && !isInQueue;

  const handleCashout = () => {
    if (activeAddress && phase === "running" && !isCashingOut) {
      setIsCashingOut(true);
      withdraw(activeAddress);
    }
  };

  const isPlayerInGame =
    activeAddress && stakes.some((stake) => stake.address === activeAddress);

  // Reset cashout state when player is no longer in game or game phase changes
  useEffect(() => {
    if (!isPlayerInGame || phase !== "running") {
      setIsCashingOut(false);
    }
  }, [isPlayerInGame, phase]);

  const canCashout =
    activeAddress &&
    phase === "running" &&
    isPlayerInGame &&
    isConnected &&
    !isCashingOut;
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
        {/* <div className="space-y-2 mt-6">
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
        </div> */}
        <Button
          className="mt-6 rounded-full"
          onClick={
            phase === "running" && canCashout ? handleCashout : handlePlaceBet
          }
          disabled={
            isInQueue ||
            (phase === "waiting"
              ? !canPlaceBet
              : phase === "running"
              ? !canCashout
              : true)
          }
        >
          {isInQueue
            ? "Queued for Next Round"
            : phase === "waiting"
            ? "Place Bet"
            : phase === "running"
            ? isCashingOut
              ? "Cashing Out..."
              : "Cashout"
            : "Game Ended"}
        </Button>

        {/* Queue status message */}
        {isInQueue && queueMessage && (
          <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <p className="text-sm text-yellow-500 text-center">
              {queueMessage}
            </p>
          </div>
        )}

        <div className="mt-4 text-sm text-center">
          <div
            className={`text-xs px-2 py-1 rounded ${
              isConnected ? "text-green-500" : "text-red-500"
            }`}
          >
            {isConnected ? "● Connected" : "● Disconnected"}
          </div>
          {isInQueue && (
            <div className="text-xs px-2 py-1 mt-1 text-yellow-500">
              ● Queued for next round
            </div>
          )}
        </div>

        <UsersView />
      </div>
    </ScrollArea>
  );
};

export default PlaygroundInteractions;
