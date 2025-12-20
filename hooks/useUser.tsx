"use client";

import { useCallback, useState, useEffect } from "react";

type MatchUsers = {
  userName: string;
  allyName: string;
  oppName1: string;
  oppName2: string;

  setUserName: (name: string) => void;
  setMatchUserNames: (ally: string, opp1: string, opp2: string) => void;
  resetUserNames: () => void;
};

const storageKeys = {
  userName: "userName",
  allyName: "allyName",
  oppName1: "oppName1",
  oppName2: "oppName2",
};

export function useMatchUsers(): MatchUsers {
  // 4つの変数を1つのオブジェクトStateにまとめる
  const [users, setUsers] = useState({
    userName: "",
    allyName: "",
    oppName1: "",
    oppName2: "",
  });

  // マウント後にまとめて1回だけ更新する（これでエラーが消えます）
  useEffect(() => {
    if (typeof window !== "undefined") {
      setUsers({
        userName: localStorage.getItem(storageKeys.userName) ?? "",
        allyName: localStorage.getItem(storageKeys.allyName) ?? "",
        oppName1: localStorage.getItem(storageKeys.oppName1) ?? "",
        oppName2: localStorage.getItem(storageKeys.oppName2) ?? "",
      });
    }
  }, []);

  const setUserName = useCallback((name: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKeys.userName, name);
    }
    // prevを使って部分更新
    setUsers((prev) => ({ ...prev, userName: name }));
  }, []);

  const setMatchUserNames = useCallback(
    (ally: string, opp1: string, opp2: string) => {
      if (typeof window !== "undefined") {
        localStorage.setItem(storageKeys.allyName, ally);
        localStorage.setItem(storageKeys.oppName1, opp1);
        localStorage.setItem(storageKeys.oppName2, opp2);
      }

      setUsers((prev) => ({
        ...prev,
        allyName: ally,
        oppName1: opp1,
        oppName2: opp2,
      }));
    },
    []
  );

  const resetUserNames = useCallback(() => {
    if (typeof window !== "undefined") {
      Object.values(storageKeys).forEach((key) => {
        localStorage.removeItem(key);
      });
    }

    setUsers({
      userName: "",
      allyName: "",
      oppName1: "",
      oppName2: "",
    });
  }, []);

  return {
    userName: users.userName,
    allyName: users.allyName,
    oppName1: users.oppName1,
    oppName2: users.oppName2,
    setUserName,
    setMatchUserNames,
    resetUserNames,
  };
}
