import './board.css'
import { MasuDraw } from '../../atoms/masu/masu';
import { PieceDraw } from '@/components/atoms/piece/piece';
import { boardProperty } from '@/constants/BoardProperty';
import { BoardMapType, BoardKey, HandMapType, HandKey } from '@/types/MapType';
import { getBoradKey } from '@/utils/BoardMapUtils';
import { GamePhase, Team } from '@/types/GameStates';
import { PieceType } from '@/types/PieceType';

type Props = {
    BoardMap: BoardMapType;
    phase: GamePhase;
    isSelectedPiece: PieceType | null;
    myTeam: Team;

    selectPiece: (piece: PieceType) => void;
    cancelSelectedPiece: () => void;

}

export function BoardDraw({BoardMap, phase, isSelectedPiece, myTeam, selectPiece,cancelSelectedPiece}: Props) {
    // 駒クリック関数
    const handlePieceClick = (piece: PieceType) => {
        // フェーズの例外処理
        if (phase !== "selecting_dest" && phase !== "selecting_piece")return;
        
        // 敵の駒をクリックした場合、選択解除
        if (piece.team !== myTeam){
            cancelSelectedPiece();
            return;
        }

        // 前の選択した駒と比較して同じであれば選択キャンセル
        if (isSelectedPiece === piece){
            cancelSelectedPiece();
            return;
        }else{
        // 異なる場合は駒をセット
            selectPiece(piece);
            // ここで移動可能マスを更新
            return;
        }
    } 

    // マスクリック関数
    const handleMasuClick = (movable: boolean) => {
        // フェーズの例外処理
        if (phase !== "selecting_dest")return;

        // 移動可能マスでないなら、駒選択を解除
        if (!movable) {
            cancelSelectedPiece();
            return;
        }


    }

    // 座標ループ用配列
    const board = [];

    for (let y = boardProperty.boardHeight; y >= 0; y--) {
        for (let x = 0; x <= boardProperty.boardWidth; x++) {

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
                            topPiece={topPiece}
                            pieceStack={cellStack.length > 1 ? cellStack.slice(0, -1) : []}
                            phase={phase}
                            isSelectedPiece={isSelectedPiece}
                            myTeam={myTeam}
                            onClick={() => {handlePieceClick}}
                        />
                    )}
                </div>
            )
        }
    }

    return <div className="board">{board}</div>;
}
