"use client";
import { InputText } from "@/components/atoms/InputText/InputText";
import { WhiteButton } from "@/components/atoms/WhiteButton/WhiteButton";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useGameControl } from "@/hooks/useGameControl";
import { TurnTimer } from "@/components/atoms/TurnTimer/TurnTimer";

export default function Page() {
  const router = useRouter();

  // useUserフックにより、userNameとsetUserName関数を取得
  const { userName, setUserName } = useUser();

  // 確定ボタン処理
  const handleStartGame = () => {
    // 名前が空なら何もしない
    if (!userName.trim()) return;
    // Contextにすでに保存されているので、単にページ遷移するだけでOK
    router.push("/lobby");
  };

  const {timerCount, setTimerCount} = useGameControl("first", new Map());
  const handleStartTimer = () => {
    setTimerCount(20000);
  }

  return (
    <div>
      <main className="container">
        {/* 入力欄 */}
        <InputText
          value={userName}       // 共有されている値を表示
          onChange={setUserName} // 入力されたら共有値を更新
          placeholder="棋士名を入力"
        />

        {/* 開始ボタン */}
        <WhiteButton
          label="ゲーム開始"
          onClick={handleStartGame}
          disabled={userName.trim() === ""}
        />

        {/* タイマーテスト */}
        <WhiteButton
          label="タイマー開始"
          onClick={handleStartTimer}
        />
        <TurnTimer isMyTimer={false} myTeam="second" currentTurn="second" currentCount={timerCount ?? 0}></TurnTimer>
      </main>
    </div>
  );
}
