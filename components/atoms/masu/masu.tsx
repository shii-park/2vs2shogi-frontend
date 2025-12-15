import { GamePhase } from '@/types/GameStates';
import './masu.css'

type Props = {
    x: number;
    y: number;
    phase: GamePhase;   // ゲームフェーズ
    isMovable: boolean;       // マスが移動可能かどうか
    onClick: (movable: boolean, x: number, y: number) => void;        // マス選択時の関数
};

export function MasuDraw({x, y, phase, isMovable, onClick}: Props){
    // ゲームフェーズからマスを選択可能か
    const isSelectable = phase === "selecting_dest";

    // マスのクラス
    const masuClass = [
        'masu',
        isSelectable && isMovable ? "movable" : "" ,
        isSelectable && !isMovable ? "not-movable" : "", 
        // masuのクラスはここに追加
    ]
    .filter(Boolean)
    .join(' ');

    return <div className={masuClass}
                onClick={() => onClick(isMovable, x, y)}
                role="button">
            </div>
}
