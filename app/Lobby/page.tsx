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
            label='？'
            onClick={handleHowtoPlayButton}
          />
          <WhiteButton
            label='対局を開始'
            onClick={handleMatchButton}
          />
        </div>
      </div>
    </div>
  );
}
