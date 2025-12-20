const ONE_MINUTES = 60000;
const ONE_SECONDS = 1000;

// msからmm:ssの文字列を返す関数
export function formatTime (remainTime: number) {
    // 0msを下回るときは00:00に固定
    if (remainTime <= 0) {
        return "00:00";
    }

    const mm = Math.floor(remainTime / ONE_MINUTES);
    const ss = Math.floor((remainTime % ONE_MINUTES) / ONE_SECONDS);
    return [mm,ss].map((val)=>String(val).padStart(2,'0')).join(':')
}
