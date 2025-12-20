"use client";
import styles from "./page.module.css"
import { BoardDraw } from "@/components/molecules/board/board";
import { HandPieceDraw } from "@/components/molecules/hand/handPiece";
import { useGameState } from "@/hooks/useBoardState";
import { useGameControl } from "@/hooks/useGameControl";
import { Team } from "@/types/GameStates";
import { createHandTestBoardMap, createHandTestHandMap } from "@/utils/handTestInitMap";
import { useEffect } from "react";
import { ConfirmPromote } from "@/components/molecules/ConfirmPromote/ConfirmProm";
import { createStackTestBoardMap } from "@/utils/stackInitmap";

export default function Game() {
    const myTeam: Team = "first"
    const {
        boardMap,
        handMap,
        initializeGameState,
    } = useGameState();

    const {
        phase,
        selectedPiece,
        selectedPos,
        movableMasu,
        cancelSelectedPiece,
        selectDest,
        clickBoardPiece,
        clickHandPiece,
        handleClickMasu,
        createMoveData,
    } = useGameControl(myTeam, boardMap);

    // バックに送信するための移動データを、GameControlから受け取るためのラッパー関数                                
    const clickMasu = (isPromotable: boolean, x: number, y: number) => {
        // GameControlから送信用データを受け取る
        // 成りの確認が必要な場合はnullが返される
        const moveData = handleClickMasu(isPromotable, x, y);

        if (moveData) {
            console.log(moveData);
            // バックに送信処理
        }

        // 確認画面はhandleClickMasu関数のフェーズ変更で自動的に発火する
    };

    // 確認画面の処理
    const promoteConfirm = (promote: boolean) => {
        // 確認画面を経由した場合は、State使用で送信用データを作成
        const moveData = createMoveData(promote);
        if (moveData) {
            console.log(moveData);
            // バックに送信処理
        }
    };

    useEffect(() => {
        initializeGameState(createStackTestBoardMap(), new Map());
        // initializeGameState(createHandTestBoardMap(), createHandTestHandMap());
    }, [])

    return (
        <div className={styles.gameField}>

            <div className={styles.gameLayout}>

                <div className={`${styles.sidebar} ${styles.leftSidebar}`}>
                    <HandPieceDraw
                        handStack={handMap.get(myTeam === "first" ? "second" : "first") ?? []}
                        isAlly={false}
                        phase={phase}
                        selectedPiece={selectedPiece}
                        myTeam={myTeam}
                        clickHandPiece={clickHandPiece}
                    />
                </div>

                <div className={styles.mainBoard}>
                    <BoardDraw
                        BoardMap={boardMap}
                        phase={phase}
                        selectedPiece={selectedPiece}
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
                        selectedPiece={selectedPiece}
                        myTeam={myTeam}
                        clickHandPiece={clickHandPiece}
                    />
                </div>

            </div>

            {/* 成りの確認画面を表示 */}
            {phase === "confirming" && (
                <ConfirmPromote
                    promClcik={() => promoteConfirm(true)}
                    notPromClick={() => promoteConfirm(false)}
                />
            )}
        </div>
    );
}
