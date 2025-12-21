'use client';
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useMatchUsers } from "./useUser";

// jsonのメッセージの型
type JsonMessage = {
    type: string;   // "move","drop"などのイベント名
    payload?: unknown;
}

// ソケットのコンテキスト型を定義
type SocketContextType = {
  sendJsonMessage: (json: JsonMessage) => void;
  lastJsonMessage: JsonMessage | null;
  readyState: ReadyState;
  isConnected: boolean;
};


// ソケットのコンテキスト生成
const socketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [shouldConnect, setShouldConnect] = useState(false);

  const getSocketUrl = useCallback(() => {
    const sessionId = localStorage.getItem("sessionId");
    if (!sessionId) return "";
    return `ws://localhost:8080/ws/game?${encodeURIComponent(sessionId)}`;
  }, []);

  const {
    sendJsonMessage,
    lastJsonMessage,
    readyState,
  } = useWebSocket<JsonMessage>(
    shouldConnect ? getSocketUrl() : null,
    {
      shouldReconnect: (e) => e.code !== 1000,
      reconnectInterval: 3000,
      share: true,
      onOpen: () => console.log("WebSocket Connected"),
      onClose: () => console.log("WebSocket Disconnected"),
    }
  );

    useEffect(() => {
        const sessionId = localStorage.getItem("sessionId");
        if (sessionId) {
            setShouldConnect(true);
        }
    }, []);


  return (
    <socketContext.Provider
      value={{
        sendJsonMessage,
        lastJsonMessage,
        readyState,
        isConnected: readyState === ReadyState.OPEN,
      }}
    >
      {children}
    </socketContext.Provider>
  );

  
};

export const useSocket = () => {
  const context = useContext(socketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

