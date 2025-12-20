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
  // ★修正ポイント1: 初期値での localStorage アクセスを廃止し、空文字にする
  // これでサーバー側での ReferenceError を回避します
  const [userName, setUserNameState] = useState("");
  const [allyName, setAllyNameState] = useState("");
  const [oppName1, setOppName1State] = useState("");
  const [oppName2, setOppName2State] = useState("");

  // ★修正ポイント2: マウント後（クライアント側）でのみ localStorage を読み込む
  useEffect(() => {
    // localStorage が使えるか念のため確認（通常はuseEffect内なら安全）
    if (typeof window !== "undefined") {
      setUserNameState(localStorage.getItem(storageKeys.userName) ?? "");
      setAllyNameState(localStorage.getItem(storageKeys.allyName) ?? "");
      setOppName1State(localStorage.getItem(storageKeys.oppName1) ?? "");
      setOppName2State(localStorage.getItem(storageKeys.oppName2) ?? "");
    }
  }, []);

  const setUserName = useCallback((name: string) => {
    // 保存時も念のため window チェックを入れるとより安全です
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKeys.userName, name);
    }
    setUserNameState(name);
  }, []);

  const setMatchUserNames = useCallback(
    (ally: string, opp1: string, opp2: string) => {
      if (typeof window !== "undefined") {
        localStorage.setItem(storageKeys.allyName, ally);
        localStorage.setItem(storageKeys.oppName1, opp1);
        localStorage.setItem(storageKeys.oppName2, opp2);
      }

      setAllyNameState(ally);
      setOppName1State(opp1);
      setOppName2State(opp2);
    },
    []
  );

  const resetUserNames = useCallback(() => {
    if (typeof window !== "undefined") {
      Object.values(storageKeys).forEach((key) => {
        localStorage.removeItem(key);
      });
    }

    setUserNameState("");
    setAllyNameState("");
    setOppName1State("");
    setOppName2State("");
  }, []);

  return {
    userName,
    allyName,
    oppName1,
    oppName2,
    setUserName,
    setMatchUserNames,
    resetUserNames,
  };
}
