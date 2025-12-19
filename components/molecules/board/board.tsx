import './board.css'
import { MasuDraw } from '../../atoms/masu/masu';
import { PieceDraw } from '@/components/atoms/piece/piece';
import { boardProperty } from '@/constants/BoardProperty';
import { BoardMapType, BoardKey, HandMapType, HandKey } from '@/types/MapType';
import { canPromote, getBoardKey } from '@/utils/BoardMapUtils';
import { GamePhase, Team } from '@/types/GameStates';
import { PieceType } from '@/types/PieceType';

type Props = {
    BoardMap: BoardMapType;
    phase: GamePhase;
    isSelectedPiece: PieceType | null;
    selectedPos: { x: number, y: number } | null;
    movableMasu: [number, number][];
    myTeam: Team;

    selectPiece: (piece: PieceType, x: number, y: number) => void;
    cancelSelectedPiece: () => void;
    selectDest: (x: number, y: number) => void;
}

export function BoardDraw({ BoardMap, phase, isSelectedPiece, selectedPos, movableMasu, myTeam, selectPiece, cancelSelectedPiece, selectDest }: Props) {
    // 駒クリック関数
    const handlePieceClick = (x: number, y: number, piece: PieceType) => {
        // フェーズの例外処理
        if (phase !== "selecting_dest" && phase !== "selecting_piece") return;

        // 敵の駒をクリックかつ、マス選択フェーズのときした場合、
        if (piece.team !== myTeam && phase === "selecting_dest") {
            // クリックした駒が取れるのか判定
            const capturable = movableMasu.some(([cx, cy]) => cx === x && cy === y);
            if (capturable) {
                // マスの一時保存
                selectDest(x, y);
                // ここでgame/pageの移動・成り確認画面の表示関数
            }
            else {
                cancelSelectedPiece();
                return;
            }
        }

        // 前の選択した駒と比較して同じであれば選択キャンセル
        if (isSelectedPiece === piece) {
            cancelSelectedPiece();
            return;
        } else {
            // 異なる場合は駒をセット
            selectPiece(piece, x, y);
            return;
        }
    }

    // マスクリック関数
    const handleMasuClick = (movable: boolean, x: number, y: number) => {
        // フェーズの例外処理
        if (phase !== "selecting_dest") return;

        // 移動可能マスでないなら、駒選択を解除
        if (!movable) {
            cancelSelectedPiece();
            return;
        }

        // マスの一時保存
        selectDest(x, y);
        // ここでgame/pageの移動・成り確認画面の表示関数

    }

    // 座標ループ用配列
    const board = [];

    for (let y = boardProperty.boardHeight; y >= 0; y--) {
        for (let x = 0; x <= boardProperty.boardWidth; x++) {

            //ここにboardmapのキー`x_y`からスタック取得
            const cellKey: BoardKey = getBoardKey(x, y);
            const cellStack = BoardMap.get(cellKey) ?? [];
            // スタックの一番上の駒を取得
            const topPiece = cellStack[cellStack.length - 1];

            // x,yのマスが移動可能かどうか
            const isMovable = movableMasu.some(([cx, cy]) => cx === x && cy === y);

            // 成れるマスかどうか
            const isPromotable = !!(
                isMovable &&
                isSelectedPiece &&
                selectedPos &&
                canPromote(myTeam, selectedPos.y, y, isSelectedPiece)
            );

            board.push(
                <div className="boardCell" key={`${x}-${y}`}>
                    <MasuDraw
                        x={x} y={y}
                        phase={phase}
                        isMovable={isMovable}
                        isSelectedPiece={isSelectedPiece}
                        isPromotable={isPromotable}
                        onClick={() => { handleMasuClick(isMovable, x, y) }}
                    />

                    {/* topPieceが存在するときのみ、PieceDraw*/}
                    {topPiece && (
                        <PieceDraw
                            topPiece={topPiece}
                            pieceStack={cellStack.length > 1 ? cellStack.slice(0, -1) : []}
                            phase={phase}
                            isSelectedPiece={isSelectedPiece}
                            myTeam={myTeam}
                            onClick={() => { handlePieceClick(x, y, topPiece) }}
                        />
                    )}
                </div>
            )
        }
    }

    return <div className="board">{board}</div>;
}
