import style from "./page.module.css"

export default function Page() {
  return (
    <div className={style.container}>
      <div className={style.title}>遊び方</div>
      
      <div className={style.rulesContainer}>
        <div className={style.ruleBox}>
          <h2>ルール1</h2>
          <p>ここにルールの説明が入ります。</p>
        </div>
        <div className={style.ruleBox}>
          <h2>ルール2</h2>
          <p>ここにルールの説明が入ります。</p>
        </div>
        <div className={style.ruleBox}>
          <h2>ルール3</h2>
          <p>ここにルールの説明が入ります。</p>
        </div>
      </div>
    </div>
  )
}
