// hooks/useUser.tsx
"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";

// 扱うデータの型定義
type UserContextType = {
    // 自分のユーザー名
    userName: string;
    setUserName: (name: string) => void;

    // 味方のユーザー名
    allyName: string;
    // 敵のユーザー名
    oppName1: string;
    oppName2: string;

    // マッチング時に他プレイヤーのユーザー名を一括設定する関数
    setMatchUserNames: (ally: string, oppName1: string, oppName2: string) => void;

    // ユーザー名をリセットする関数
    resetUserNames: () => void;
};

// コンテキスト（保存場所）を作成
const UserContext = createContext<UserContextType | undefined>(undefined);

// プロバイダー（全ページにデータを提供するコンポーネント）
export const UserProvider = ({ children }: { children: ReactNode }) => {
    // 自分のユーザー名
    const [userName, setUserName] = useState<string>(""); 
    
    // 他のユーザー名 (マッチング成立時に設定)
    const [allyName, setAllyName] = useState<string>("");
    const [oppName1, setOppName1] = useState<string>("");
    const [oppName2, setOppName2] = useState<string>("");

    // マッチング成立時のユーザー名保存関数
    const setMatchUserNames = useCallback(
        (ally: string, opp1: string, opp2: string) => {
        setAllyName(ally);
        setOppName1(opp1);
        setOppName2(opp2);
    }, []);     // 初回のみ実行

    // ユーザー名リセット関数
    const resetUserNames = useCallback(() => {
        setAllyName("");
        setOppName1("");
        setOppName2("");
    }, [])

    return (
        <UserContext.Provider value={{
            userName,
            setUserName,
            allyName,
            oppName1,
            oppName2,
            setMatchUserNames,
            resetUserNames,
        }}>
            {children}
        </UserContext.Provider>
    );
};

// カスタムフック（各ページからデータを取得するための関数）
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
