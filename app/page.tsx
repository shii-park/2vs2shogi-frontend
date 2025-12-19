"use client";
import { InputText } from "@/components/atoms/InputText/InputText";
import { WhiteButton } from "@/components/atoms/WhiteButton/WhiteButton";
import { useSocket } from "@/hooks/useSocket";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  // useUserフックにより、userNameとsetUserName関数を取得
  const { userName, setUserName } = useUser();
  // useSocketフックから、ソケット接続を開始する関数を取得
  const { connectSocket } = useSocket();

  // セッションIDの取得　->　ws接続
  const handleStartGame = async() => {
    // 名前が空の場合は終了
    if (!userName.trim()) return;

    try { 
      // バックのAPIをたたく
      const respone = await fetch(`http://localhost:8080/api/auth/register?username=${encodeURIComponent(userName)}`);

      // リクエストエラー処理
      if (!respone.ok) { throw new Error("登録に失敗しました"); }

      // レスポンスからセッションIDを取得
      const data = await respone.json();  // jsonから変換
      const sessionId = data.sessionId;
      // レスポンスエラー処理
      if (!sessionId) { throw new Error("セッションIDが取得できませんでした"); }

      // セッションIDとユーザー名をローカルストレージに保存
      localStorage.setItem("sessionId", sessionId);
      localStorage.setItem("userName", userName);

      // ソケット接続を開始
      connectSocket();

      // ロビーページに遷移
      router.push("/lobby");
    
    } catch (error) {
      console.error(error);
      alert("エラーが発生しました: " + error);
    }
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
          disabled={userName.trim() === ""}
        />
      </main>
    </div>
  );
}
