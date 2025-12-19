import "./stack-tooltip.css";
import { PieceDraw } from "@/components/atoms/piece/piece";
import { GamePhase, Team } from "@/types/GameStates";
import { PieceType } from "@/types/PieceType";

type Props = {
    stackPieces: PieceType[];
    x: number;
    y: number;
    myTeam: Team;
    phase: GamePhase;
};

export function StackTooltip({ stackPieces, x, y, myTeam, phase }: Props) {
    // 念のため、空のスタックを除外
    if (stackPieces.length === 0) return;
    // アニメーション中、決着フェーズでは表示しない
    if (phase === "animating" || phase === "game_over") return;

    // 逆順の配列を作成
    const reverseStack = [...stackPieces].reverse();

    return (
        <div className="stack-tooltip" style={{ top: y, left: x, }}>
            <div className="stack-list">
                {/* 逆順の配列を使って表示する */}
                {reverseStack.map((piece) => (
                    <div key={piece.id} className="stack-item">
                        <PieceDraw
                            topPiece={piece}
                            phase={phase}
                            selectedPiece={null}  // 駒を選択しているときは表示しない
                            myTeam={myTeam}
                            onClick={() => { }}  // クリック無効化
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
