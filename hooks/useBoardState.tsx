import { useCallback, useState } from "react";
import type { PieceType } from "@/types/PieceType";
import type { BoardKey, HandKey } from "@/types/MapType";
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
        newBoard: Map<BoardKey, PieceType[]>,
        newHand: Map<HandKey, PieceType[]>
    ) => {
        // 念のため、新しいMapとしてセット
        setBoardMap(new Map(newBoard));
        setHandMap(new Map(newHand))
    }, [])

    // 駒の移動関数
    const Move = useCallback((x_to: number, y_to: number, piece: PieceType) => {
        setBoardMap(prevBoard => {
            const key_from = findBoardKey(piece, prevBoard);
            const key_to = getBoardKey(x_to, y_to);
            if (!key_from || key_from === key_to) {
                console.log(`Error:${prevBoard}に${piece}が存在しない、または${key_to}と${key_from}が等しいです`)
                return prevBoard;
            }

            // BoardMapのコピーnextBoardMapを作成し更新
            const nextBoardMap = new Map(prevBoard);
            const stack_from = nextBoardMap.get(key_from) ?? [];
            // キーのスタックがないときは、元のmapで更新
            if (stack_from.length === 0) {
                console.log(`Error:キー${key_from}に${piece}は存在しません`)
                return prevBoard;
            }

            // stack_fromから最後の要素をpop
            const popped: PieceType = stack_from[stack_from.length - 1];
            nextBoardMap.set(key_from, stack_from.slice(0, -1));
            // popした駒情報をstack_toにpush
            const stack_to = nextBoardMap.get(key_to) ?? [];
            nextBoardMap.set(key_to, [...stack_to, popped]);

            return nextBoardMap;
        });
    }, []);

    // 駒を取る関数
    const Capture = useCallback((piece: PieceType) => {
        const key_from = findBoardKey(piece, boardMap);
        // 動かしたteamと取る駒のteamが異なるか確認すべきかも
        if (!key_from) {
            console.log(`Error:キー${key_from}に${piece}は存在しません`)
            return;
        }
        const key_to = piece.team === "first" ? "second" : "first";

        // BoardMapのコピーnextBoardMapを作成し更新
        const nextBoardMap = new Map(boardMap);
        const stack_from = nextBoardMap.get(key_from) ?? [];
        // キーのスタックがないときは、更新しない
        if (stack_from.length === 0) {
            console.log(`Error:キー${key_from}に駒が存在しません`)
            return;
        }
        // stack_fromから全要素をpop
        const popped: PieceType[] = stack_from;
        nextBoardMap.set(key_from, []);

        const nextHandMap = new Map(handMap);
        const stack_to = nextHandMap.get(key_to) ?? [];
        const capturedPieces = popped.map(p => ({
            ...p,
            team: key_to as "first" | "second", // popしたPieceType.teamをkey_toに変更
            promoted: false,    // 成っているかをfalseに変更
        }));
        nextHandMap.set(key_to, [...stack_to, ...capturedPieces])

        setBoardMap(nextBoardMap);
        setHandMap(nextHandMap);
    }, [boardMap, handMap]);

    // 持ち駒を盤面に置く関数
    const Drop = useCallback((x_to: number, y_to: number, piece: PieceType) => {
        const key_from = piece.team;
        const stack_from = handMap.get(key_from) ?? [];
        if (stack_from?.length === 0) {
            console.log(`Error:${key_from}には持ち駒がありません`)
            return;
        }
        // stack_fromからpieceのインデックスを探す
        const targetIndex = stack_from.findIndex(p => p === piece);
        if (targetIndex === -1) {
            console.log(`Error:${key_from}には持ち駒に${piece}はありません`)
            return;
        }
        // 持ち駒stackから打つ駒を削除し、nextHandMapに更新
        const nextHandStack = [...stack_from];
        nextHandStack.splice(targetIndex, 1);
        const nextHandMap = new Map(handMap);
        nextHandMap.set(key_from, nextHandStack);

        // BoardMapのコピーnextBoardMapを作成し更新
        const nextBoardMap = new Map(boardMap);
        const key_to = getBoardKey(x_to, y_to);
        const stack_to = nextBoardMap.get(key_to) ?? [];
        nextBoardMap.set(key_to, [...stack_to, piece]);

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
