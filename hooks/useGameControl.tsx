import { GamePhase, Team } from "@/types/GameStates";
import { PieceType } from "@/types/PieceType";
import { useCallback, useState } from "react";

export function useGameControl(myTeam: Team) {
    const [currentTurn, setcurrentTurn] = useState<Team>("first");  // 現在の手番
    const [phase, setPhase] = useState<GamePhase>(
        myTeam === "first" ? "selecting_piece" : "waiting_opp"
    );  // 現在のフェーズ
    const [isSelectedPiece, setIsSelectedPiece] = useState<PieceType | null>(null); //選択している駒
    const [pendingDest, setPendingDest] = useState<{ x: number, y: number } | null>(null);    //移動先の保留

    // 駒の選択時処理
    const selectPiece = useCallback((piece: PieceType) => {
        // 自分のターンかつ、「駒選択フェーズ」または「マス選択フェーズ」であるか
        if (currentTurn !== myTeam) return;
        if (phase !== "selecting_piece" && phase !== "selecting_dest") return;

        // 選択された駒が自陣の駒であるか
        if (piece.team !== myTeam) {
            console.log("自分の駒ではありません");
            return;
        }

        // 駒をセットし、フェーズを更新
        setIsSelectedPiece(piece);
        setPhase("selecting_dest");
    }, [currentTurn, myTeam, phase])

    // 駒の選択キャンセル(同じ駒を押したとき、画面の何もないことろを押したとき)
    const cancelSelectedPiece = useCallback(() => {
        if (phase === "selecting_dest") {
            setIsSelectedPiece(null);
            setPhase("selecting_piece");
        }
    }, [phase]);

    // 移動先のマス選択処理
    const selectDest = useCallback((x: number, y: number) => {
        // 移動先選択フェーズであるか
        if (phase !== "selecting_dest") return;

        // 移動先を保留にして、フェーズを更新
        setPendingDest({ x, y });
        setPhase("confirming");
    }, [phase]);

    // 確認画面でのキャンセル
    const cancelPending = useCallback(() => {
        // 確認画面のフェーズであるか
        if (phase !== "confirming") return;

        // 移動先を削除し、フェースをマス選択に更新
        setPendingDest(null);
        setPhase("selecting_dest");
    }, [phase])

    // 移動先確定後の処理
    const confirmMmove = useCallback((isPromote: boolean = false) => {
        // 移動確認フェーズであるか
        if (phase !== "confirming" || !isSelectedPiece || !pendingDest) return;

        // 駒、移動先、成りのデータを返り値としてまとめる
        const moveDate = {
            piece: isSelectedPiece,
            to: pendingDest,
            promote: isPromote
        };

        // フェーズの変更、移動データを返す
        setPhase("waitAlly");
        return moveDate;
    }, [phase, isSelectedPiece, pendingDest])


    // ターン終了処理
    const turnEnd = useCallback(() => {
        // ターンの切り替え
        setcurrentTurn(c => c === "first" ? "second" : "first");

        // フェーズの切り替え
        if (currentTurn === myTeam) {
            setPhase("selecting_piece");
        } else {
            setPhase("waiting_opp");
        }
    }, [phase, myTeam]);

    // ゲーム終了処理(投了、王を取る・取られる等)
    const gameEnd = useCallback(() => {
        // フェーズの切り替え
        setPhase("game_over");
    }, [phase]);

    return {
        currentTurn,
        phase,
        isSelectedPiece,
        pendingDest,
        isMyTurn: currentTurn === myTeam,

        selectPiece,
        cancelSelectedPiece,
        selectDest,
        cancelPending,
        confirmMmove,
        turnEnd,
        gameEnd,
    }
}
