"use client";
import styles from "./page.module.css" 
import { BoardDraw } from "@/components/molecules/board/board";
import { HandPieceDraw } from "@/components/molecules/hand/handPiece";
import { useGameState } from "@/hooks/useBoardState";
import { useGameControl } from "@/hooks/useGameControl";
import { Team } from "@/types/GameStates";
import { createHandTestBoardMap, createHandTestHandMap } from "@/utils/handTestInitMap";
import { useEffect } from "react";

export default function Game() {
    const myTeam: Team = "first"
    const {
        boardMap,
        handMap,
        initializeGameState,
    } = useGameState();
    
    const {
        phase,
        isSelectedPiece,
        selectedPos,
        movableMasu,
        cancelSelectedPiece,
        selectDest,
        clickBoardPiece,
        clickHandPiece,
        clickMasu,
    } = useGameControl(myTeam, boardMap);

    useEffect(() => {
        initializeGameState(createHandTestBoardMap(), createHandTestHandMap());
    }, [])

    return (
        <div className={styles.gameField}> 
            
            <div className={styles.gameLayout}>

                <div className={`${styles.sidebar} ${styles.leftSidebar}`}>
                    <HandPieceDraw 
                        handStack={handMap.get(myTeam === "first" ? "second": "first") ?? []}
                        isAlly={false}
                        phase={phase}
                        isSelectedPiece={isSelectedPiece}
                        myTeam={myTeam}
                        clickHandPiece={clickHandPiece}
                    />
                </div>

                <div className={styles.mainBoard}>
                    <BoardDraw
                        BoardMap={boardMap}
                        phase={phase}
                        isSelectedPiece={isSelectedPiece}
                        selectedPos={selectedPos}
                        movableMasu={movableMasu}
                        myTeam={myTeam}
                        cancelSelectedPiece={cancelSelectedPiece}
                        selectDest={selectDest}
                        clickBoardPiece={clickBoardPiece}
                        clickMasu={clickMasu}
                    />
                </div>

                <div className={`${styles.sidebar} ${styles.rightSidebar}`}>
                    <HandPieceDraw 
                        handStack={handMap.get(myTeam) ?? []}
                        isAlly={true}
                        phase={phase}
                        isSelectedPiece={isSelectedPiece}
                        myTeam={myTeam}
                        clickHandPiece={clickHandPiece}
                    />
                </div>

            </div>
            
        </div>
    );
}
