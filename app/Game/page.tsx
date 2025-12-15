"use client";
import { BoardDraw } from "@/components/molecules/board/board";
import { useGameState } from "@/hooks/useBoardState";
import { useGameControl } from "@/hooks/useGameControl";
import { Team } from "@/types/GameStates";

export default function Game() {
    const myTeam: Team = "first"    //テストとしてfirst

    const {
        boardMap,
        handMap,
        Move,
        Capture,
        Drop,
        initializeGameState,
    } = useGameState();
    const {
        currentTurn,
        phase,
        isSelectedPiece,
        pendingDest,
        isMyTurn,

        selectPiece,
        cancelSelectedPiece,
        selectDest,
        cancelPending,
        confirmMmove,
        turnEnd,
        gameEnd,
    } = useGameControl(myTeam);

    return (
        <div>
            <BoardDraw
                BoardMap={boardMap}
                
            />
        </div>
    );
}
