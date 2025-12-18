"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// 扱うデータの型定義
type UserContextType = {
    userName: string;
    setUserName: (name: string) => void;
};

// コンテキスト（保存場所）を作成
const UserContext = createContext<UserContextType | undefined>(undefined);

// プロバイダー（全ページにデータを提供するコンポーネント）
export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [userName, setUserName] = useState<string>(""); // ここに名前が保存されます

    return (
        <UserContext.Provider value={{ userName, setUserName }}>
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
