import { GamePhase } from '@/types/GameStates';
import './masu.css'
import { PieceType } from '@/types/PieceType';

type Props = {
    x: number;
    y: number;
    phase: GamePhase;   // ゲームフェーズ
    isMovable: boolean;     // マスが移動可能かどうか
    isPromotable: boolean;  // マスに移動したときになれるのか 
    onClick: (x: number, y: number) => void;        // マス選択時の関数
};

export function MasuDraw({x, y, phase, isMovable, isPromotable, onClick}: Props){
    // ゲームフェーズからマスを選択可能か
    const isSelectable = phase === "selecting_dest";

    // マスのクラス
    const masuClass = [
        'masu',
        isSelectable && isMovable ? "movable" : "" ,
        isSelectable && !isMovable ? "not-movable" : "", 
        isPromotable && "promotable",
        // masuのクラスはここに追加
    ]
    .filter(Boolean)
    .join(' ');

    return <div className={masuClass}
                onClick={() => onClick(x, y)}
                role="button">
            </div>
}
