"use client";

import { useCallback, useState } from "react";

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
  const [userName, setUserNameState] = useState(() =>
    localStorage.getItem(storageKeys.userName) ?? ""
  );
  const [allyName, setAllyNameState] = useState(() =>
    localStorage.getItem(storageKeys.allyName) ?? ""
  );
  const [oppName1, setOppName1State] = useState(() =>
    localStorage.getItem(storageKeys.oppName1) ?? ""
  );
  const [oppName2, setOppName2State] = useState(() =>
    localStorage.getItem(storageKeys.oppName2) ?? ""
  );

  const setUserName = useCallback((name: string) => {
    localStorage.setItem(storageKeys.userName, name);
    setUserNameState(name);
  }, []);

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
