'use client'
import { useState, useEffect } from 'react';
import style from './page.module.css';
import { useRouter, useSearchParams } from "next/navigation";
import { WhiteButton } from '@/components/atoms/WhiteButton/WhiteButton';
import { OutlineButtton } from '@/components/atoms/OutlineButton/OutlineButton';

export default function Result() {
  const router = useRouter();

  // クエリパラメータから勝敗を取得
  const searchParams = useSearchParams();
  const outcome = searchParams.get('outcome'); // "win" or "lose"
  const outcomeMessage = outcome === "win" ? "勝利" : "敗北";

  // 勝敗から勝利チーム・敗北チームユーザー名取得
  const [myTeamUsersName, setMyTeamUsersName] = useState<string[]>([]);
  const [oppTeamUsersName, setOppTeamUsersName] = useState<string[]>([]);

  const [message, setMessage] = useState("");
  // 定型文
  useEffect(() => {
    setMyTeamUsersName([localStorage.getItem("userName") || "", localStorage.getItem("allyName") || ""]);
    setOppTeamUsersName([localStorage.getItem("oppName1") || "", localStorage.getItem("oppName2") || ""]);

    // 定型文
    const winMessage = [
      "驚異のコンビネーション",
      "盤上を支配する二手",
      "完璧なる包囲網",
      "相手の心が折れる音が、ここまで聞こえてきた",
    ];
    const loseMessage = [
      "一番の敵は無能な味方",
      "伸びしろしかないコンビ",
      "右脳と左脳がケンカして、王様が家出した",
      "二重人格の王様が、混乱の果てに投了した",
    ];

    const targetList = outcome === "win" ? winMessage : loseMessage;
    const randomIndex = Math.floor(Math.random() * targetList.length);
    setMessage(targetList[randomIndex]);
  }, [outcome]);

  // 再戦ボタンハンドラ
  const handleMatchButton = () => {
    // ここでバックにリクエストを送信

    router.push("/game");
  }

  // ホームボタンハンドラ
  const handleHomeButton = () => {
    router.push("lobby");
  }

  return (
    <div className={`${style.container}`}>
      <div className={`${style.topContainer}`}>
        <div className={`${style.resultLabels}`}>
          <div className={`${style.subLabel}`}>Result</div>
          <div className={`${style.outcome}`}>{outcomeMessage}</div>
        </div>
        <div className={`${style.myUsersName}`}>
          <div className={`${style.userName}`}>{myTeamUsersName[0]}</div>
          <div className={`${style.userName}`}>{myTeamUsersName[1]}</div>
        </div>
        <div className={`${style.message}`}>{message}</div>
      </div>
      <div className={`${style.bottomContainer}`}>
        <div className={style.oppInfo}>
          <div className={`${style.oppLabel}`}>対局相手</div>
          <div className={`${style.oppUsersName}`}>
            <div className={`${style.userName}`}>{oppTeamUsersName[0]}</div>
            <div className={`${style.userName}`}>{oppTeamUsersName[1]}</div>
          </div>
        </div>
        <div className={`${style.buttonContainer}`}>
          <WhiteButton
            label='再戦'
            onClick={handleMatchButton}
          />
          <OutlineButtton
            label='ホームへ'
            onClick={handleHomeButton}
          />
        </div>
      </div>
    </div>
  );
}
