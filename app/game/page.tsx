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
import { TurnTimer } from "@/components/atoms/TurnTimer/TurnTimer";
import { WhiteButton } from "@/components/atoms/WhiteButton/WhiteButton";

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
        surrenderConfirm,
        surrenderCancel,
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

    // 投了処理
    const handleSurrender = () => {
        // テスト　後から修正
    }

    useEffect(() => {
        initializeGameState(createStackTestBoardMap(), new Map());
        // initializeGameState(createHandTestBoardMap(), createHandTestHandMap());
        localStorage.setItem("userName", "myUserName");
        localStorage.setItem("allyName", "test1");
        localStorage.setItem("oppName1", "test2");
        localStorage.setItem("oppName2", "test3");
    }, [])

    return (
        <div className={styles.gameField}>

            <div className={styles.gameLayout}>

                <div className={`${styles.sidebar} ${styles.leftSidebar}`}>
                    <div className="oppName">
                        <div className="text">{localStorage.getItem("oppName1")}</div>
                        <div className="text">{localStorage.getItem("oppName2")}</div>
                    </div>

                    <HandPieceDraw
                        handStack={handMap.get(myTeam === "first" ? "second" : "first") ?? []}
                        isAlly={false}
                        phase={phase}
                        selectedPiece={selectedPiece}
                        myTeam={myTeam}
                        clickHandPiece={clickHandPiece}
                    />

                    <TurnTimer
                        // テスト　後から修正
                        isMyTimer={false}
                        myTeam={myTeam}
                        currentTurn={myTeam}
                        currentCount={150}
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
                    <WhiteButton
                        label="投了"
                        onClick={surrenderConfirm}
                    />
                    <TurnTimer
                        // テスト後から修正
                        isMyTimer={true}
                        myTeam={myTeam}
                        currentTurn={myTeam}
                        currentCount={150}
                    />
                    <HandPieceDraw
                        handStack={handMap.get(myTeam) ?? []}
                        isAlly={true}
                        phase={phase}
                        selectedPiece={selectedPiece}
                        myTeam={myTeam}
                        clickHandPiece={clickHandPiece}
                    />
                    <div className="oppName">
                        <div className="text">{localStorage.getItem("userName")}</div>
                        <div className="text">{localStorage.getItem("allyName")}</div>
                    </div>
                </div>

            </div>

            {/* 成りの確認画面を表示 */}
            {phase === "promoteConfirming" && (
                <ConfirmPromote
                    label="成りますか？"
                    promClcik={() => promoteConfirm(true)}
                    notPromClick={() => promoteConfirm(false)}
                />
            )}

            {/* 投了の確認画面を表示 */}
            {phase === "surrenderConfirming" && (
                <ConfirmPromote
                    label="投了しますか？"
                    promClcik={() => console.log("a")}
                    notPromClick={surrenderCancel}
                />
            )}
        </div>
    );
}
