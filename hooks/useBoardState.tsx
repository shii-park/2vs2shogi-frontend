import { useCallback, useState } from "react";
import type { PieceType } from "@/types/PieceType";
import type { BoardKey, BoardMapType, HandKey, HandMapType } from "@/types/MapType";
import { getBoardKey } from "@/utils/BoardMapUtils";

export function useGameState() {
    const [boardMap, setBoardMap] = useState<Map<BoardKey, PieceType[]>>(() => new Map());  // 盤面map
    const [handMap, setHandMap] = useState<Map<HandKey, PieceType[]>>(() => new Map())  // 持ち駒map

    // BoardMapの要素のPieceTypeを探し、キーを返す関数
    const findBoardKey = (piece: PieceType, prevBoard: Map<BoardKey, PieceType[]>): BoardKey | undefined => {
        const foundEntry = Array.from(prevBoard.entries()).find(([key, stack]) => {
            return stack.length > 0 && stack[stack.length - 1] === piece;
        });
        // fondEntryがあればキーを返す
        return foundEntry ? foundEntry[0] : undefined;
    };

    // 盤面・持ち駒状態を一括設定する関数(初期化・復帰用)
    const initializeGameState = useCallback((
        newBoard: BoardMapType,
        newHand: HandMapType
    ) => {
        // 念のため、新しいMapとしてセット
        setBoardMap(new Map(newBoard));
        setHandMap(new Map(newHand))
    }, [])

    // 駒の移動関数
    const Move = useCallback((xTo: number, yTo: number, piece: PieceType) => {
        setBoardMap(prevBoard => {
            const keyFrom = findBoardKey(piece, prevBoard);
            const keyTo = getBoardKey(xTo, yTo);
            if (!keyFrom || keyFrom === keyTo) {
                console.log(`Error:${prevBoard}に${piece}が存在しない、または${keyTo}と${keyFrom}が等しいです`)
                return prevBoard;
            }

            // BoardMapのコピーnextBoardMapを作成し更新
            const nextBoardMap = new Map(prevBoard);
            const stackFrom = nextBoardMap.get(keyFrom) ?? [];
            // キーのスタックがないときは、元のmapで更新
            if (stackFrom.length === 0) {
                console.log(`Error:キー${keyFrom}に${piece}は存在しません`)
                return prevBoard;
            }

            // stackFromから最後の要素をpop
            const popped: PieceType = stackFrom[stackFrom.length - 1];
            nextBoardMap.set(keyFrom, stackFrom.slice(0, -1));
            // popした駒情報をstackToにpush
            const stackTo = nextBoardMap.get(keyTo) ?? [];
            nextBoardMap.set(keyTo, [...stackTo, popped]);

            return nextBoardMap;
        });
    }, []);

    // 駒を取る関数
    const Capture = useCallback((piece: PieceType) => {
        const keyFrom = findBoardKey(piece, boardMap);
        // 動かしたteamと取る駒のteamが異なるか確認すべきかも
        if (!keyFrom) {
            console.log(`Error:キー${keyFrom}に${piece}は存在しません`)
            return;
        }
        const keyTo = piece.team === "first" ? "second" : "first";

        // BoardMapのコピーnextBoardMapを作成し更新
        const nextBoardMap = new Map(boardMap);
        const stackFrom = nextBoardMap.get(keyFrom) ?? [];
        // キーのスタックがないときは、更新しない
        if (stackFrom.length === 0) {
            console.log(`Error:キー${keyFrom}に駒が存在しません`)
            return;
        }
        // stackFromから全要素をpop
        const popped: PieceType[] = stackFrom;
        nextBoardMap.set(keyFrom, []);

        const nextHandMap = new Map(handMap);
        const stackTo = nextHandMap.get(keyTo) ?? [];
        const capturedPieces = popped.map(p => ({
            ...p,
            team: keyTo as "first" | "second", // popしたPieceType.teamをkeyToに変更
            promoted: false,    // 成っているかをfalseに変更
        }));
        nextHandMap.set(keyTo, [...stackTo, ...capturedPieces])

        setBoardMap(nextBoardMap);
        setHandMap(nextHandMap);
    }, [boardMap, handMap]);

    // 持ち駒を盤面に置く関数
    const Drop = useCallback((xTo: number, yTo: number, piece: PieceType) => {
        const keyFrom = piece.team;
        const stackFrom = handMap.get(keyFrom) ?? [];
        if (stackFrom?.length === 0) {
            console.log(`Error:${keyFrom}には持ち駒がありません`)
            return;
        }
        // stackFromからpieceのインデックスを探す
        const targetIndex = stackFrom.findIndex(p => p === piece);
        if (targetIndex === -1) {
            console.log(`Error:${keyFrom}には持ち駒に${piece}はありません`)
            return;
        }
        // 持ち駒stackから打つ駒を削除し、nextHandMapに更新
        const nextHandStack = [...stackFrom];
        nextHandStack.splice(targetIndex, 1);
        const nextHandMap = new Map(handMap);
        nextHandMap.set(keyFrom, nextHandStack);

        // BoardMapのコピーnextBoardMapを作成し更新
        const nextBoardMap = new Map(boardMap);
        const keyTo = getBoardKey(xTo, yTo);
        const stackTo = nextBoardMap.get(keyTo) ?? [];
        nextBoardMap.set(keyTo, [...stackTo, piece]);

        setHandMap(nextHandMap);
        setBoardMap(nextBoardMap);
    }, [boardMap, handMap]);

    return {
        boardMap,
        handMap,
        Move,
        Capture,
        Drop,
        initializeGameState,
    };
}
