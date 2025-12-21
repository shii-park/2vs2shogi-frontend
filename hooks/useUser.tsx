"use client";

import { useCallback, useState } from "react";
import { rootCertificates } from "tls";

/* ===== 型定義 ===== */
type MatchUsers = {
  userName: string;
  roomId: string;
  allyName: string;
  oppName1: string;
  oppName2: string;

  setUserName: (name: string) => void;
  setMatchLocalStorage: (roomID: string, ally: string, opp1: string, opp2: string) => void;
  resetLocalStorage: () => void;
};

/* ===== localStorage key ===== */
const storageKeys = {
  userName: "userName",
  roomId: "roomId",
  allyName: "allyName",
  oppName1: "oppName1",
  oppName2: "oppName2",
} as const;

export function useMatchUsers(): MatchUsers {
  const [users, setUsers] = useState(() => {
    if (typeof window === "undefined") {
      return {
        userName: "",
        roomId: "",
        allyName: "",
        oppName1: "",
        oppName2: "",
      };
    }

    return {
      userName: localStorage.getItem(storageKeys.userName) ?? "",
      roomId: localStorage.getItem(storageKeys.roomId) ?? "",
      allyName: localStorage.getItem(storageKeys.allyName) ?? "",
      oppName1: localStorage.getItem(storageKeys.oppName1) ?? "",
      oppName2: localStorage.getItem(storageKeys.oppName2) ?? "",
    };
  });

  const setUserName = useCallback((name: string) => {
    localStorage.setItem(storageKeys.userName, name);
    setUsers((prev) => ({ ...prev, userName: name }));
  }, []);

  const setMatchLocalStorage = useCallback(
    (roomID: string, ally: string, opp1: string, opp2: string) => {
      localStorage.setItem(storageKeys.roomId, roomID);
      localStorage.setItem(storageKeys.allyName, ally);
      localStorage.setItem(storageKeys.oppName1, opp1);
      localStorage.setItem(storageKeys.oppName2, opp2);

      setUsers((prev) => ({
        ...prev,
        roomId: roomID,
        allyName: ally,
        oppName1: opp1,
        oppName2: opp2,
      }));
    },
    []
  );

  const resetLocalStorage = useCallback(() => {
    Object.values(storageKeys).forEach((key) => {
      localStorage.removeItem(key);
    });

    setUsers({
      userName: "",
      roomId: "",
      allyName: "",
      oppName1: "",
      oppName2: "",
    });
  }, []);

  return {
    ...users,
    setUserName,
    setMatchLocalStorage,
    resetLocalStorage,
  };
}
