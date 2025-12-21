import { GamePhase, Team } from "@/types/GameStates";
import { BoardMapType } from "@/types/MapType";
import { PieceType } from "@/types/PieceType";
import { getDroppableMasu, getMovableMasu, mustPromote } from "@/utils/BoardMapUtils";
import { use, useCallback, useEffect, useState } from "react";

export function useGameControl(myTeam: Team, BoardMap: BoardMapType) {
    const [currentTurn, setCurrentTurn] = useState<Team>("first");  // 現在の手番
    const [phase, setPhase] = useState<GamePhase>(
        myTeam === "first" ? "selecting_piece" : "waiting_opp"
    );  // 現在のフェーズ
    const [prevPhase, setPrevPhase] = useState<GamePhase>(myTeam === "first" ? "selecting_piece" : "waiting_opp");  //前回のフェーズ(投了キャンセル用)
    const [selectedPiece, setselectedPiece] = useState<PieceType | null>(null); //選択している駒
    const [selectedPos, setSelectedPos] = useState<{ x: number, y: number } | null>(null);      //選択している駒の座標
    const [pendingDest, setPendingDest] = useState<{ x: number, y: number } | null>(null);      //移動先の保留
    const [movableMasu, setMovableMasu] = useState<[number, number][]>([]); // 移動可能マス配列
    const [timerCount, setTimerCount] = useState<number | null>(null);  // タイマーの秒数(ms)
    const oneSeconds = 1000;   // 1秒の定義
    const [showTurnPopup, setShowTurnPopup] = useState<boolean>(false);     // ターン開始のポップアップ表示
    const [isSurrender, setIsSurrender] = useState<boolean>(false); // 投了したかどうか(2人投了するまでゲーム終了しないため)

    // 状態クリア関数
    const stateClear = useCallback(() => {
        // 状態クリア
        setselectedPiece(null);
        setSelectedPos(null);
        setMovableMasu([]);
        setPendingDest(null);
    }, [])

    // バックに送信するデータを準備
    // manualDest: 指定があればその座標を使う (Stateの反映待ち回避)
    const createMoveData = useCallback((isPromote: boolean, manualDest?: { x: number, y: number }) => {
        // manualDestを優先して使用
        const destination = manualDest || pendingDest;
        // 移動確認フェーズであるか
        if (!selectedPiece || !destination) return null;

        // 駒、移動先、成りのデータを返り値としてまとめる
        const moveData = {
            piece: selectedPiece,
            to: destination,
            promote: isPromote
        };

        // 状態クリア
        stateClear();

        // フェーズの変更、移動データを返す
        setPhase("waitAlly");
        return moveData;
    }, [phase, selectedPiece, pendingDest, stateClear])

    // タイマーロジック
    useEffect(() => {
        // タイマーがnullか判定
        if (timerCount === null) return;

        const id = setTimeout(() => {
            setTimerCount(prev => {
                if (prev === null) return null;
                return Math.max(prev - oneSeconds, 0);
            });
        }, oneSeconds);

        return () => clearTimeout(id);
    }, [timerCount]);


    // 盤面の駒選択処理
    const selectBoardPiece = useCallback((piece: PieceType, x: number, y: number) => {
        // 自分のターンかつ、「駒選択フェーズ」または「マス選択フェーズ」であるか
        if (currentTurn !== myTeam) return;
        if (phase !== "selecting_piece" && phase !== "selecting_dest") return;

        // 選択された駒が自陣の駒であるか
        if (piece.team !== myTeam) {
            console.log("自分の駒ではありません");
            return;
        }

        // 駒をセットし、フェーズを更新
        setselectedPiece(piece);
        setSelectedPos({ x, y });
        setPhase("selecting_dest");

        // 移動可能マスをセット
        setMovableMasu(getMovableMasu(BoardMap, x, y, piece));
    }, [currentTurn, myTeam, phase, BoardMap])

    // 持ち駒選択処理
    const selectHandPiece = useCallback((piece: PieceType) => {
        // 自分のターンかつ、「駒選択フェーズ」または「マス選択フェーズ」であるか
        if (currentTurn !== myTeam) return;
        if (phase !== "selecting_piece" && phase !== "selecting_dest") return;
        // 選択された駒が自陣の駒であるか
        if (piece.team !== myTeam) return;

        // 駒をセットし、フェーズを更新
        setselectedPiece(piece);
        setSelectedPos(null);
        setPhase("selecting_dest");

        // 持ち駒の移動マスをセット
        setMovableMasu(getDroppableMasu(BoardMap, piece, myTeam))
    }, [currentTurn, myTeam, phase, BoardMap])

    // 駒の選択キャンセル(同じ駒を押したとき、画面の何もないことろを押したとき)
    const cancelSelectedPiece = useCallback(() => {
        if (phase === "selecting_dest") {
            stateClear();
            setPhase("selecting_piece");
        }
    }, [phase]);

    // 移動先のマス選択処理
    const selectDest = useCallback((x: number, y: number) => {
        // 移動先選択フェーズであるか
        if (phase !== "selecting_dest") return;

        // 移動先を保留にして、フェーズを更新
        setPendingDest({ x, y });
        setPhase("promoteConfirming");
    }, [phase]);

    // 確認画面でのキャンセル
    const cancelPending = useCallback(() => {
        // 確認画面のフェーズであるか
        if (phase !== "promoteConfirming") return;

        // 移動先を削除し、フェースをマス選択に更新
        setPendingDest(null);
        setPhase("selecting_dest");
    }, [phase])

    // 盤面上の駒クリック関数
    const clickBoardPiece = useCallback((piece: PieceType, x: number, y: number) => {
        // フェーズの例外処理
        if (phase !== "selecting_dest" && phase !== "selecting_piece") return;

        // 捕獲の判定
        if (piece.team !== myTeam && phase === "selecting_dest") {
            // クリックした駒が取れるのか判定
            const capturable = movableMasu.some(([cx, cy]) => cx === x && cy === y);
            if (capturable) {
                // マスの一時保存
                selectDest(x, y);
                // ここでgame/pageの移動・成り確認画面の表示関数
            }
            else {
                cancelSelectedPiece();
                return;
            }
        }

        // 前の選択した駒と比較して同じであれば選択キャンセル
        if (selectedPiece === piece) {
            cancelSelectedPiece();
            return;
        } else {
            // 異なる場合は駒をセット
            selectBoardPiece(piece, x, y);
            return;
        }
    }, [phase, myTeam, movableMasu, selectedPiece, selectDest, cancelSelectedPiece, selectBoardPiece])

    // 持ち駒クリック関数
    const clickHandPiece = useCallback((piece: PieceType) => {
        // フェーズチェック
        if (currentTurn !== myTeam) return;
        if (phase !== "selecting_piece" && phase !== "selecting_dest") return;

        // 前の選択した駒と比較して同じであれば選択キャンセル
        if (selectedPiece === piece) {
            cancelSelectedPiece();
            return;
        } else {
            // 異なる場合は駒をセット
            selectHandPiece(piece);
            return;
        }
    }, [currentTurn, myTeam, phase, selectedPiece, cancelSelectedPiece, selectHandPiece])

    // 成りの確認画面を表示するか判定、しない場合バックに送るmoveDataを返す
    const handleClickMasu = useCallback((isPromotable: boolean, x: number, y: number) => {
        // フェーズの例外処理
        if (phase !== "selecting_dest" || !selectedPiece) return;

        // 移動可能マス配列の中身を検索して判定する
        const isMovable = movableMasu.some(([cx, cy]) => cx === x && cy === y);
        // 移動可能マスでないなら、駒選択を解除
        if (!isMovable) {
            cancelSelectedPiece();
            return;
        }

        // マスの一時保存
        selectDest(x, y);

        // 成り確認画面の判定
        // 必ず成らなければいけない処理を最初に行う
        if (mustPromote(selectedPiece.type, y)) {
            // 確認画面が不要なときは、送信データを作成して返す
            return createMoveData(true, { x, y });;
        } else if (isPromotable) {
            // 確認画面を表示 
            setPhase("promoteConfirming");
            return null;
        } else {
            // 確認画面が不要なときは、送信データを作成して返す
            return createMoveData(false, { x, y });
        }

    }, [phase, movableMasu, cancelSelectedPiece, selectDest, selectedPiece, createMoveData,])

    // 投了確認フェーズ
    const surrenderConfirm = useCallback(() => {
        setPrevPhase(phase);
        setPhase("surrenderConfirming");
    }, [phase])

    // 投了キャンセル用
    const surrenderCancel = useCallback(() => {
        setPhase(prevPhase);
    }, [prevPhase])

    // ターン終了処理
    const turnEnd = useCallback(() => {
        // ターンの切り替え
        setCurrentTurn(prev => {
            const next = prev === "first" ? "second" : "first";

            // フェーズの切り替え
            if (next === myTeam) {
                setPhase("selecting_piece");
            } else {
                setPhase("waiting_opp");
            }

            return next;
        });
    }, [myTeam]);

    // ゲーム終了処理(投了、王を取る・取られる等)
    const gameEnd = useCallback(() => {
        // フェーズの切り替え
        setPhase("game_over");
    }, []);

    return {
        currentTurn,
        phase,
        selectedPiece,
        selectedPos,
        pendingDest,
        movableMasu,
        timerCount,
        isSurrender,
        showTurnPopup,
        isMyTurn: currentTurn === myTeam,

        cancelSelectedPiece,
        selectDest,
        cancelPending,
        clickBoardPiece,
        clickHandPiece,
        handleClickMasu,
        createMoveData,
        setTimerCount,
        surrenderConfirm,
        surrenderCancel,
        setIsSurrender,
        setShowTurnPopup,
        turnEnd,
        gameEnd,
    }
}
