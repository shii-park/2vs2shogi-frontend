"use client";

import { useCallback, useEffect, useState } from "react";

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
  const [userName, setUserNameState] = useState("");
  const [allyName, setAllyNameState] = useState("");
  const [oppName1, setOppName1State] = useState("");
  const [oppName2, setOppName2State] = useState("");

  /* 初回マウント時に localStorage から復元 */
  useEffect(() => {
    setUserNameState(localStorage.getItem(storageKeys.userName) ?? "");
    setAllyNameState(localStorage.getItem(storageKeys.allyName) ?? "");
    setOppName1State(localStorage.getItem(storageKeys.oppName1) ?? "");
    setOppName2State(localStorage.getItem(storageKeys.oppName2) ?? "");
  }, []);

  /* 自分のユーザー名を保存 */
  const setUserName = useCallback((name: string) => {
    localStorage.setItem(storageKeys.userName, name);
    setUserNameState(name);
  }, []);

  /* マッチング成立時に一括保存 */
  const setMatchUserNames = useCallback(
    (ally: string, opp1: string, opp2: string) => {
      localStorage.setItem(storageKeys.allyName, ally);
      localStorage.setItem(storageKeys.oppName1, opp1);
      localStorage.setItem(storageKeys.oppName2, opp2);

      setAllyNameState(ally);
      setOppName1State(opp1);
      setOppName2State(opp2);
    },
    []
  );

  /* 全ユーザー名リセット */
  const resetUserNames = useCallback(() => {
    Object.values(storageKeys).forEach((key) => {
      localStorage.removeItem(key);
    });

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
