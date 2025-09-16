'use client'
import React, {use, useEffect, useState} from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import UsersView from "./user-view";
import { stakes } from "@/constants";

const PlaygroundInteractions = () => {
  return (
    <ScrollArea className="h-[85vh] rounded-xl">
      <div className="col-span-1 w-full py-6 flex-1  flex backdrop-blur-2xl flex-col p-4 rounded-xl bg-card/50">
        <div className="space-y-2">
          <Label className="text-primary text-md font-semibold">
            Bet Amount
          </Label>
          <Input
            type="number"
            defaultValue={0.0}
            step={0.001}
            className="w-full border-2 rounded-xl bg-background"
          />
        </div>
        <div className="space-y-2 mt-6">
          <Label className="text-primary text-md font-semibold">
            Auto Cashout
          </Label>
          <Input
            type="number"
            defaultValue={0.0}
            step={0.001}
            className="w-full border-2 rounded-xl bg-background"
          />
        </div>
        <Button className="mt-6 rounded-full">Place Bet</Button>

        <UsersView stakes={stakes} />
      </div>
    </ScrollArea>
  );
};

export default PlaygroundInteractions;
