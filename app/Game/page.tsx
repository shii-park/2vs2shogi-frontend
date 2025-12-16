"use client";
import { BoardDraw } from "@/components/molecules/board/board";
import { useGameState } from "@/hooks/useBoardState";
import { useGameControl } from "@/hooks/useGameControl";
import { Team } from "@/types/GameStates";
import { createInitialBoardMap } from "@/utils/initialBoardMap";
import { useEffect } from "react";

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
        movableMasu,
        isMyTurn,

        selectPiece,
        cancelSelectedPiece,
        selectDest,
        cancelPending,
        confirmMove,
        turnEnd,
        gameEnd,
    } = useGameControl(myTeam, boardMap);

    useEffect(() => {
        initializeGameState(createInitialBoardMap(), new Map())
    }, [])

    return (
        <div>
            <BoardDraw
                BoardMap={boardMap}
                phase={phase}
                isSelectedPiece={isSelectedPiece}
                movableMasu={movableMasu}
                myTeam={myTeam}

                selectPiece={selectPiece}
                cancelSelectedPiece={cancelSelectedPiece}
                selectDest={selectDest}
            />
        </div>
    );
}
