import "./handPiece.css";
import { formatHandPieces } from "@/utils/HandUtils";
import { PieceType } from "@/types/PieceType";
import { useMemo } from "react";
import { PieceDraw } from "@/components/atoms/piece/piece";
import { GamePhase, Team } from "@/types/GameStates";

type Props = {
    handStack: PieceType[];
    isAlly: boolean;
    phase: GamePhase;
    isSelectedPiece: PieceType | null;
    myTeam: Team;
    clickHandPiece: (piece: PieceType) => void;
};

// PieceType配列から描写
export function HandPieceDraw({handStack, isAlly, phase, isSelectedPiece, myTeam, clickHandPiece}: Props) {
    // 駒の集計
    const HandGroups = useMemo(() => formatHandPieces(handStack), [handStack]);

    // 持ち駒が選択されたときの処理


    return (
        <div className={`hand-container ${isAlly ? 'ally' : 'opp'}`}>
            {HandGroups.map((group) => 
                <div key={group.piece.type}
                className="hand-piece"
                onClick={() => {
                    if (!isAlly) return;    // 敵の持ち駒にはクリック関数は必要ない
                    clickHandPiece(group.piece);
                }}
                data-clickable={isAlly}
                >
                    <PieceDraw
                        topPiece={group.piece}
                        phase={phase}
                        isSelectedPiece={isSelectedPiece}
                        myTeam={myTeam}
                        onClick={() => {}}
                    />

                    {/* 枚数表示 */}
                    {group.count > 1 && (
                        <span className="hand-piece-count">{group.count}</span>
                    )}
                </div>
            )}
        </div>
    );
}

