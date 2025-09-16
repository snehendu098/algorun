"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { Stake } from "@/interfaces";

type GamePhase = "waiting" | "running" | "ended";

interface GameContextType {
  // Game state
  phase: GamePhase;
  multiplier: number;
  stakes: Stake[];
  totalPlayers: number;
  totalStakeAmount: number;
  crashAt?: number;

  // Connection state
  isConnected: boolean;

  // Actions
  joinGame: (address: string, amount: number) => void;
  withdraw: (address: string) => void;

  // Connection management
  connect: () => void;
  disconnect: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

interface GameProviderProps {
  children: React.ReactNode;
  wsUrl?: string;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [phase, setPhase] = useState<GamePhase>("waiting");
  const [multiplier, setMultiplier] = useState(1.0);
  const [stakes, setStakes] = useState<Stake[]>([]);
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [totalStakeAmount, setTotalStakeAmount] = useState(0);
  const [crashAt, setCrashAt] = useState<number>();
  const [isConnected, setIsConnected] = useState(false);
  const wsUrl = process.env.NEXT_PUBLIC_WS_URL as string;

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = () => {
    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);

        // Clear any reconnection timeout
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleWebSocketMessage(data);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected");
        setIsConnected(false);
        wsRef.current = null;

        // Auto-reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(connect, 3000);
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        setIsConnected(false);
      };
    } catch (error) {
      console.error("Failed to connect WebSocket:", error);
      setIsConnected(false);

      // Retry connection after 3 seconds
      reconnectTimeoutRef.current = setTimeout(connect, 3000);
    }
  };

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  };

  const handleWebSocketMessage = (data: any) => {
    switch (data.type) {
      case "game_state":
        setPhase(data.data.phase);
        setStakes(data.data.stakes || []);
        setTotalPlayers(data.data.totalPlayers || 0);
        setTotalStakeAmount(data.data.totalStakeAmount || 0);
        setMultiplier(data.data.currentMultiplier || 1.0);
        break;

      case "waiting_phase":
        setPhase("waiting");
        setMultiplier(1.0);
        setStakes([]);
        setTotalPlayers(0);
        setTotalStakeAmount(0);
        setCrashAt(undefined);
        break;

      case "player_joined":
        setStakes(data.stakes || []);
        setTotalPlayers(data.totalPlayers || 0);
        setTotalStakeAmount(data.totalStakeAmount || 0);
        break;

      case "game_started":
        setPhase("running");
        setStakes(data.stakes || []);
        setTotalPlayers(data.totalPlayers || 0);
        setTotalStakeAmount(data.totalStakeAmount || 0);
        setMultiplier(1.0);
        break;

      case "multiplier_update":
        setMultiplier(data.multiplier);
        break;

      case "player_withdrew":
        setStakes(data.stakes || []);
        setTotalPlayers(data.remainingPlayers || 0);
        setTotalStakeAmount(data.totalStakeAmount || 0);
        break;

      case "game_ended":
        setPhase("ended");
        setCrashAt(data.crashAt);
        break;

      case "join_result":
      case "withdraw_result":
        // Handle success/error messages if needed
        console.log(data.message);
        break;

      default:
        console.log("Unknown message type:", data.type);
    }
  };

  const joinGame = (address: string, amount: number) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "join_game",
          address,
          amount,
        })
      );
    }
  };

  const withdraw = (address: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "withdraw",
          address,
        })
      );
    }
  };

  // Connect on mount
  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, []);

  const value: GameContextType = {
    phase,
    multiplier,
    stakes,
    totalPlayers,
    totalStakeAmount,
    crashAt,
    isConnected,
    joinGame,
    withdraw,
    connect,
    disconnect,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
