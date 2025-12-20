"use client";
import style from "./page.module.css"
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
    router.push("/lobby");
  };

  return (
    <div>
      <main className={style.container}>

        {/* --- 左エリア上段: タイトル --- */}
        <div className={style.titleArea}>
          <div className={style.subTitle}>2vs2</div>
          <div className={style.mainTitle}>将棋</div>
          <div className={style.EnTitle}>shougi</div>
        </div>

        {/* --- 右エリア: 格子グリッドデザイン --- */}
        <div className={style.gridArea}>
          {/* SVGに width:100% を効かせるため、width/height属性は削除しviewBoxのみにするか、CSSで上書きします */}
          <svg
            viewBox="-1.25 -1.25 422.5 422.5"
            className={style.gridSvg}
            preserveAspectRatio="xMaxYMin meet"
          >
            {[...Array(8)].map((_, i) => (
              <g key={i}>
                {/* 垂直線: x=0 の線は描画しない (各マスの右側の線として機能) */}
                {i > 0 && <line x1={i * 60} y1={0} x2={i * 60} y2={420} stroke="white" strokeWidth={2.5} />}
                {/* 水平線: y=420 の線は描画しない (各マスの上側の線として機能) */}
                {i < 7 && <line x1={0} y1={i * 60} x2={420} y2={i * 60} stroke="white" strokeWidth={2.5} />}
              </g>
            ))}
          </svg>
        </div>

        {/* --- 左エリア下段: 入力フォーム --- */}
        <div className={style.inputArea}>
          <div className={style.inputWrapper}>
            <InputText
              value={userName}
              onChange={setUserName}
              placeholder="棋士名を入力"
            />
            <WhiteButton
              label="確定"
              onClick={handleStartGame}
              disabled={userName.trim() === ""}
            />
          </div>
        </div>

      </main>
    </div>
  );
}
