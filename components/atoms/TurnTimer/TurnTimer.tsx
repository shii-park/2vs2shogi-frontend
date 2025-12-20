import { formatTime } from "@/utils/timerUtils";
import  "./TurnTimer.css";
import { Team } from "@/types/GameStates";

type Props = {
    isMyTimer: boolean;     // 自分たちのタイマーか
    myTeam: Team;           // 自分たちのチーム
    currentTurn: Team;      // 現在のターン
    currentCount: number;   // 秒(s)基準
}

export function TurnTimer({
    isMyTimer,
    myTeam,
    currentTurn,
    currentCount,
}: Props) {

    const isActiveTimer =
        (isMyTimer && myTeam === currentTurn) ||
        (!isMyTimer && myTeam !== currentTurn);

    const label = isMyTimer
        ? "残り時間"
        : "相手残り時間";

    const count = isActiveTimer
        ? formatTime(currentCount)
        : "--:--";

    return (
        <div className="timer">
            <div className="label">{label}</div>
            <div className="counta">{count}</div>
        </div>
    );
}
