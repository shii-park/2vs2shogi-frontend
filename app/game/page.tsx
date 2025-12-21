"use client";
import styles from "./page.module.css"
import { BoardDraw } from "@/components/molecules/board/board";
import { HandPieceDraw } from "@/components/molecules/hand/handPiece";
import { useGameState } from "@/hooks/useBoardState";
import { useGameControl } from "@/hooks/useGameControl";
import { Team } from "@/types/GameStates";
import { useEffect, useState } from "react";
import { ConfirmPromote } from "@/components/molecules/ConfirmPromote/ConfirmProm";
import { TurnTimer } from "@/components/atoms/TurnTimer/TurnTimer";
import { WhiteButton } from "@/components/atoms/WhiteButton/WhiteButton";
import { useMatchUsers } from "@/hooks/useUser";
import { Popup } from "@/components/atoms/Popup/Popup";
import { createInitialBoardMap } from "@/utils/initialBoardMap";
import { useSocket } from "@/hooks/useSocket";

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
        isSurrender,
        showTurnPopup,
        currentTurn,
        cancelSelectedPiece,
        selectDest,
        clickBoardPiece,
        clickHandPiece,
        handleClickMasu,
        createMoveData,
        surrenderConfirm,
        surrenderCancel,
        setIsSurrender,
        setShowTurnPopup,
    } = useGameControl(myTeam, boardMap);

    // useUserフックからユーザー名取得
    const {
        userName,
        allyName,
        oppName1,
        oppName2,
    } = useMatchUsers()

    // ソケット通信関連
    const {
        sendJsonMessage,
        lastJsonMessage,
    } = useSocket();

    // ターン開始のポップアップ監視
    useEffect(() => {
        // ターン開始時だけ表示
        setShowTurnPopup(true);

        const timer = setTimeout(() => {
            setShowTurnPopup(false);
        }, 2000); // 2秒表示

        return () => clearTimeout(timer);
    }, [currentTurn]);

    // 駒の一括配置
    useEffect(() => {
        initializeGameState(createInitialBoardMap(), new Map() );
    }, [])

    // ウェブソケット受信
    useEffect(() => {
        if (!lastJsonMessage) return;
            // データ受信処理分岐
            // type or MessageType

            // MessageType = "moveResult" | "timeUp" | "status"

                // MessageType = "moveResult"
                    // type = "moveResult" => 駒の移動処理受信(2人正常に処理)
                    // ペイロール   piece.id piece.type direcrions=[up, up] team.id promote condition=null position=null

                    // type = "capturedPiece" => 駒を取ったときの処理
                    // ペイロール   piece.id piece.type direcrions=[] team.id promote=false  condition="TAKEN" position=null

                    // type = "dropResult" => 持ち駒を打った処理受信
                    // ペイロール   piece.id piece.type direcrions=[] team.id promote=false condition=null position={x, y}
                
                // MessageType = "timeUp" => 時間切れ処理
                    // ペイロール   action[{moveResult}]

                // MessageType = "status" => 味方待ち
                    // ペイロール status=""

            // type = ""

        
    }, [lastJsonMessage])

    // 移動リクエスト送信
    const handleMoveSend = () => {
        sendJsonMessage({
            type: "MoveRequest",
            payload: {
                // ここに書く
            },
        });
    };

    // 持ち駒打ちリクエスト送信
    const handleDropSend = () => {
        sendJsonMessage({
            type: "DropRequest",
            payload: {
                // ここに書く
            },
        });
    }

    // バックに送信するための移動データを、GameControlから受け取るためのラッパー関数                                
    const clickMasu = (isPromotable: boolean, x: number, y: number) => {
        // GameControlから送信用データを受け取る
        // 成りの確認が必要な場合はnullが返される
        const moveData = handleClickMasu(isPromotable, x, y);

        if (moveData) {
            
        }

        // 確認画面はhandleClickMasu関数のフェーズ変更で自動的に発火する
    };

    // ターン開始のダイアログ表示関数
    const handleTurnPopip = () => {

    }

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
        setIsSurrender(true);
        surrenderCancel();

        // バックに送信処理
        // テスト　後から修正
    }

    return (
        <div className={styles.gameField}>

            <div className={styles.gameLayout}>

                <div className={`${styles.sidebar} ${styles.leftSidebar}`}>
                    <div className={styles.playerName}>
                        <div>{oppName1}</div>
                        <div>{oppName2}</div>
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
                        label={isSurrender ? "投了済み" : "投了"}
                        onClick={surrenderConfirm}
                        disabled={isSurrender}
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
                    <div className={styles.playerName}>
                        <div>{userName}</div>
                        <div>{allyName}</div>
                    </div>
                </div>

            </div>
            {/* ターン開始のポップアップを表示 */}
            {showTurnPopup && (
                <Popup
                    label={`${currentTurn === myTeam ? "あなた" : "相手"}の手番です`}
                />
            )}

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
                    promClcik={handleSurrender}
                    notPromClick={surrenderCancel}
                />
            )}
        </div>
    );
}
