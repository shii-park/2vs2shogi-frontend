'use client';
import { createContext, ReactNode, useCallback, useContext, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useMatchUsers } from "./useUser";

// jsonのメッセージの型
type JsonMessage = {
    type: string;   // "move","drop"などのイベント名
    payload?: unknown;
}

// ソケットのコンテキスト型を定義
type SocketContextType =  {
    sendMessage: (message: string) => void;     // データを送る関数　<-いらなそう
    sendJsonMessage: (json: JsonMessage) => void;    // jsonを送る関数
    lastJsonMessage: JsonMessage| null;             // 最後に届いたjsonデータ
    readyState: ReadyState;                     // 接続状態(0:CONNECTING, 1:OPEN...)
    isConnected: boolean;                       // 接続済みのフラグ
    connectSocket: () => void;                  // ソケット接続を開始する関数
}

// ソケットのコンテキスト生成
const socketContext = createContext<SocketContextType | undefined>(undefined);

// ソケットコンテキストのプロバイダ
export const SocketProvider = ({children}: { children: ReactNode}) => {
    // ソケット接続フラグ : コネクションを条件付きで開始するため
    const  [shouldConnect, setShouldConnect] = useState(false);

    // 接続時に送信するためユーザー名取得
    const { userName } = useMatchUsers();

    // URL生成を関数化(useWebSocketに引数で渡すため)
    const getSocketUrl = useCallback(() => {
        // ローカルストレージからセッションIDを取得
        if (typeof window === "undefined") return "";

        const sessionId = localStorage.getItem("sessionId");
        if (!sessionId) {
            throw new Error("sessionId が存在しません");
        }
        
        return `ws://localhost:8080/ws/game?${encodeURIComponent(sessionId)}`;
    }, [shouldConnect, userName])

    // useWebSocketによってリクエストを送信
    const {
        sendMessage,
        sendJsonMessage,
        lastJsonMessage,
        readyState,
    } = useWebSocket<JsonMessage>(
        // ソケット接続フラグ確認
        shouldConnect ? getSocketUrl : null, 
    {
        // ここからオプション設定
    
        // 自動再接続の設定 (切断されたら常に再接続を試みる)
        shouldReconnect: (closeEvent) => true,
        reconnectAttempts: 10,
        reconnectInterval: 3000,
        
        // 複数のコンポーネントで同じURLを使う場合、接続を共有する
        share: true, 

        onOpen: () => console.log("WebSocket Connected!"),
        onClose: () => console.log("WebSocket Disconnected"),
        onError: (e) => console.error("WebSocket Error:", e),
    });

    // ソケット接続関数
    const connectSocket = useCallback(() => {
        setShouldConnect(true);
    }, []);     // 初回のみ生成

    // 接続状態フラグ更新
    const isConnected = readyState === ReadyState.OPEN;

    return (
        <socketContext.Provider
            value={{
                sendMessage,
                sendJsonMessage,
                lastJsonMessage,
                readyState,
                isConnected,
                connectSocket,
            }}
        >
            {children}
        </socketContext.Provider>
    );
}

// ソケットのコンテクストを取得するカスタムフック
export const useSocket = () => {
    const context = useContext(socketContext);
    if (!context) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return context;
};
