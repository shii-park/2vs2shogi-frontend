import style from "./page.module.css"

export default function Page() {
  return (
    <div className={style.container}>
      <div className={style.title}>遊び方</div>
      <ul className={style.ulHowTo}>
        <li>完全ランダムマッチング！</li>
      </ul>
    </div>
  )
}
