'use client'
import style from './page.module.css';
import { WhiteButton } from '@/components/atoms/WhiteButton/WhiteButton';
import { OutlineButtton } from '@/components/atoms/OutlineButton/OutlineButton';
import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  // コンテキストからユーザー名取得
  const userNameContext = useUser();

  // 遊び方ボタンハンドラ
  const handleHowtoPlayButton = () => {
    router.push("/rules");
  }

  // マッチングボタンハンドラ
  const handleMatchButton = () => {
    // ここでバックにリクエストを送信

    router.push("/game");
  }

  return (
    <div className={style.container}>
      {/* 左半分に配置 */}
      <div className={style.gridLayout}></div>
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
                {/* 垂直線: 右端(i=7)を消し、左端(i=0)を表示するように変更 */}
                {i < 7 && <line x1={i * 60} y1={0} x2={i * 60} y2={420} stroke="white" strokeWidth={2.5} />}
                {/* 水平線: y=420 の線は描画しない (各マスの上側の線として機能) */}
                {i < 7 && <line x1={0} y1={i * 60} x2={420} y2={i * 60} stroke="white" strokeWidth={2.5} />}
              </g>
            ))}
          </svg>
        </div>
      {/* ページ情報を右上 */}
      <div className={style.matchInfoPanel}>
        <div className={`${style.EnPanel} text`}>Matching</div>
        <div className={`${style.mainPanel} text`}>対局</div>
        <div className={`${style.subPanel} text`}>オンライン</div>
      </div>
      {/* マッチングボタンなど右下 */}
      <div className={style.matchingControls}>
        {/* ユーザー名 */}
        <div className={`${style.userName}`}>
          <div className="text">{userNameContext.userName}</div>
        </div>
        {/* ボタン類 */}
        <div className={style.buttonsContainer}>
          <OutlineButtton
            label='?'
            onClick={handleHowtoPlayButton}
          />
          <div className={style.matchingButton}>
            <WhiteButton
              label='対局を開始'
              onClick={handleMatchButton}
          />
          </div>
        </div>
      </div>
    </div>
  );
}
