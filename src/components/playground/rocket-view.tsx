'use client'
import { ScrollArea } from "@radix-ui/react-scroll-area";
import React, { useEffect, useState, useRef } from "react";
import PrismaticBurst from "../ui/prismatic-burst";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

type GameState = 'starting' | 'gameOn' | 'gameOver';

const RocketView = () => {
  const [multiplier, setMultiplier] = useState(1.0);
  const [gameState, setGameState] = useState<GameState>('starting');
  const [target, setTarget] = useState(5.02);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const gameTimerRef = useRef<NodeJS.Timeout | null>(null);

  console.log("Target:", target);
  console.log("Game State:", gameState);

  // Handle game state transitions
  useEffect(() => {
    if (gameState === 'starting') {
      // Reset multiplier and set timer to start game
      setMultiplier(1.0);
      gameTimerRef.current = setTimeout(() => {
        setGameState('gameOn');
      }, 2000); // 20 seconds
    } else if (gameState === 'gameOn') {
      // Start multiplier interval
      intervalRef.current = setInterval(() => {
        setMultiplier((prev) => {
          if (prev >= target) {
            setGameState('gameOver');
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            return target;
          } else {
            return prev + 0.01;
          }
        });
      }, 50);
    } else if (gameState === 'gameOver') {
      // Set timer to restart game
      gameTimerRef.current = setTimeout(() => {
        setGameState('starting');
      }, 5000); // 5 seconds
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (gameTimerRef.current) {
        clearTimeout(gameTimerRef.current);
        gameTimerRef.current = null;
      }
    };
  }, [gameState, target]);

  return (
    <ScrollArea className="col-span-4 h-[85vh]">
      <div className="bg-card/50 w-full h-full rounded-xl relative overflow-hidden">
        <PrismaticBurst paused={gameState !== "gameOn"} speed={3} colors={["#f59e0a","#f3f4f6","#ffbb6b"]}/>
        <div className="absolute top-0 right-0 w-full h-full flex flex-col items-center justify-center bg-card/50">
          <div className={cn("text-xl font-bold uppercase italic",
            gameState === 'starting' && "text-blue-400",
            gameState === 'gameOn' && "text-muted-foreground",
            gameState === 'gameOver' && "text-destructive"
          )}>
            {gameState === 'starting' && "Get Ready..."}
            {gameState === 'gameOn' && "Current Payout"}
            {gameState === 'gameOver' && "Game Over"}
          </div>
          <div className={cn("text-9xl font-black italic",
            gameState === 'starting' && "text-blue-400",
            gameState === 'gameOn' && "text-primary",
            gameState === 'gameOver' && "text-destructive"
          )}>
            {multiplier.toFixed(2)}x
          </div>
          {gameState === 'gameOn' && <Button className="mt-6 rounded-full px-8 cursor-pointer py-4 text-xl">
            Cashout
          </Button>}
        </div>
      </div>
    </ScrollArea>
  );
};

export default RocketView;
