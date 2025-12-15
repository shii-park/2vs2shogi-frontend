import './board.css'
import { MasuDraw } from '../../atoms/masu/masu';
import { PieceDraw } from '@/components/atoms/piece/piece';
import { boardProperty } from '@/constants/BoardProperty';
import { BoardMapType, BoardKey, HandMapType, HandKey } from '@/types/MapType';
import { getBoradKey } from '@/utils/BoardMapUtils';

type Props = {
    BoardMap: BoardMapType;
    HandMap: HandMapType;


}

export function BoardDraw({BoardMap, HandMap}: Props) {
    // 座標ループ用配列
    const board = [];

    for (let y = 0; y <= boardProperty.height_max; y++) {
        for (let x = 0; x <= boardProperty.width_max; x++) {

            //ここにboardmapのキー`x_y`からスタック取得
            const cellKey: BoardKey = getBoradKey(x, y);
            const cellStack = BoardMap.get(cellKey) ?? [];

            // スタックの一番上の駒を取得
            const topPiece = cellStack[cellStack.length - 1];


            board.push(
                <div>
                    <MasuDraw
                        key={`${x}-${y}`}
                        x={x} y={y}
                        isSelectable={false}
                        isMovable={false}
                        onClick={() => { console.log("マスclick!") }}
                    />

                    {/* topPieceが存在するときのみ、PieceDraw*/}
                    {topPiece && (
                        <PieceDraw
                            p={topPiece}
                            pieceStack={cellStack.length > 1 ? cellStack : []}
                            isSelectable={false}
                            isSelected={false}
                            onClick={() => {}}
                        />
                    )}
                </div>
            )
        }
    }

    return <div className="board">{board}</div>;
}
