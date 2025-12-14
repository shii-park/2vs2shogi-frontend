import './board.css'
import { MasuDraw } from '../../atoms/masu/masu';
import { board_property } from '@/constants/BoardProperty';

type Props = {
    
}

export function BoardDraw() {
    // 座標ループ用配列
    const board = [];

    for(let y = 0; y <= board_property.height_max; y++){
        for(let x = 0; x <= board_property.width_max; x++){
            board.push(
                <MasuDraw
                    key={`${x}-${y}`}
                    x={x} y={y}
                    isSelectable={false}
                    isMovable={false}
                    onClick={() => {console.log("マスclick!")}}
                />
            )
        }
    }

    return <div className="board">{board}</div>;
}
