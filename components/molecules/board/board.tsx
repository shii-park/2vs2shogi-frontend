import './board.css'
import { MasuDraw } from '../../atoms/masu/masu';
import { PieceDraw } from '@/components/atoms/piece/piece';
import { boardProperty } from '@/constants/BoardProperty';
import { BoardMapType, BoardKey, HandMapType, HandKey } from '@/types/MapType';
import { canPromote, getBoardKey } from '@/utils/BoardMapUtils';
import { GamePhase, Team } from '@/types/GameStates';
import { PieceType } from '@/types/PieceType';
import React, { useState } from 'react';
import { StackTooltip } from '../stack-tooltip/stack-tooltip';

type Props = {
    BoardMap: BoardMapType;
    phase: GamePhase;
    selectedPiece: PieceType | null;
    selectedPos: { x: number, y: number } | null;
    movableMasu: [number, number][];
    myTeam: Team;

    cancelSelectedPiece: () => void;
    selectDest: (x: number, y: number) => void;
    clickBoardPiece: ((piece: PieceType, x: number, y: number) => void);
    clickMasu: ((isPromotable: boolean, x: number, y: number) => void);
}

export function BoardDraw({ BoardMap, phase, selectedPiece, selectedPos, movableMasu, myTeam, cancelSelectedPiece, selectDest, clickBoardPiece, clickMasu }: Props) {

    // ホバー情報の管理
    const [hoverInfo, setHoverInfo] = useState<{
        pieces: PieceType[],
        x: number,
        y: number
    } | null>(null);

    // 駒hover時にスタック表示
    const handleMouseEnter = (e: React.MouseEvent<HTMLImageElement>, stack: PieceType[]) => {
        // 重なりの判定
        if (stack.length <= 1) return;

        // ホバー情報を取得
        const rect = e.currentTarget.getBoundingClientRect();
        setHoverInfo({
            pieces: stack.slice(0, -1),
            x: rect.right + 5,
            y: rect.top,
        });
    };

    // カーソルが駒から離れた処理
    const handleMouseLeave = () => {
        setHoverInfo(null);
    };

    // 座標ループ用配列
    const board = [];

    for (let y = boardProperty.height; y >= 0; y--) {
        for (let x = 0; x <= boardProperty.width; x++) {

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
                selectedPiece &&
                selectedPos &&
                canPromote(myTeam, selectedPos.y, y, selectedPiece)
            );

            board.push(
                <div className="boardCell" key={`${x}-${y}`}>
                    <MasuDraw
                        x={x} y={y}
                        phase={phase}
                        isMovable={isMovable}
                        isPromotable={isPromotable}
                        onClick={() => { clickMasu(isPromotable, x, y) }}
                    />

                    {/* topPieceが存在するときのみ、PieceDraw*/}
                    {topPiece && (
                        <PieceDraw
                            topPiece={topPiece}
                            phase={phase}
                            selectedPiece={selectedPiece}
                            myTeam={myTeam}
                            onClick={() => { clickBoardPiece(topPiece, x, y) }}
                            onMouseEnter={(e) => handleMouseEnter(e, cellStack)}
                            onMouseLeave={handleMouseLeave}
                        />
                    )}
                </div>
            )
        }
    }

    return (
        <div className="board">
            {board}

            {/* ホバー情報が存在する時だけツールチップを表示 */}
            {hoverInfo && (
                <StackTooltip
                    stackPieces={hoverInfo.pieces}
                    x={hoverInfo.x}
                    y={hoverInfo.y}
                    myTeam={myTeam}
                    phase={phase}
                />
            )}
        </div>
    );
}
