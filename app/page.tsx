"use client";
import { InputText } from "@/components/atoms/InputText/InputText";
import { WhiteButton } from "@/components/atoms/WhiteButton/WhiteButton";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  // useUserフックにより、userNameとsetUserName関数を取得
  const { userName, setUserName } = useUser();

  // 確定ボタン処理
  const handleStartGame = () => {
      // 名前が空なら何もしない
      if (!userName.trim()) return;

      // Contextにすでに保存されているので、単にページ遷移するだけでOK
      router.push("/game");
  };
  
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
                disable={userName.trim() === ""}
            />
        </main>
    </div>
  );
}
