import { PieceType } from "@/types/PieceType";
import { BoardMapType, HandMapType, BoardKey } from "@/types/MapType";

// --- ヘルパー関数 ---
const getBoardKey = (x: number, y: number): BoardKey => `${x}_${y}` as BoardKey;

const createPiece = (idSuffix: string, type: string, team: "first" | "second"): PieceType => ({
    id: `test-${team}-${type}-${idSuffix}`,
    type,
    team,
    promotable: type !== "gold" && type !== "king",
    promoted: false,
});

/**
 * 持ち駒テスト用の盤面 (BoardMap)
 * 盤上は王様と、二歩テスト用の歩だけを配置してスカスカにします
 */
export const createHandTestBoardMap = (): BoardMapType => {
    const boardMap: BoardMapType = new Map();

    const place = (x: number, y: number, type: string, team: "first" | "second") => {
        boardMap.set(getBoardKey(x, y), [createPiece(`board-${x}-${y}`, type, team)]);
    };

    // お互いの王様 (本陣)
    place(4, 0, "king", "first");  // 先手王
    place(4, 8, "king", "second"); // 後手王

    // 二歩テスト用の障害物
    // 2筋(x=7)に自分の歩を置いておく -> この列には持ち駒の歩を打てないはず
    place(7, 2, "pawn", "first");

    return boardMap;
};

/**
 * 持ち駒テスト用の持ち駒 (HandMap)
 * グルーピングや並び順が正しいか確認できるよう、多種多様な駒を持たせます
 */
export const createHandTestHandMap = (): HandMapType => {
    const handMap: HandMapType = new Map();

    // --- 味方 (先手) の持ち駒 ---
    // 飛車1, 角1, 金2, 銀1, 歩3 (バラバラに追加してもソートされるか確認)
    const allyPieces: PieceType[] = [
        createPiece("1", "pawn", "first"),
        createPiece("2", "gold", "first"),
        createPiece("3", "rook", "first"), // 強い駒
        createPiece("4", "pawn", "first"),
        createPiece("5", "silver", "first"),
        createPiece("6", "bishop", "first"),
        createPiece("7", "pawn", "first"),
        createPiece("8", "gold", "first"),
    ];
    handMap.set("first", allyPieces);

    // --- 敵 (後手) の持ち駒 ---
    // 桂馬4 (バッジ確認), 飛車1
    const enemyPieces: PieceType[] = [
        createPiece("e1", "knight", "second"),
        createPiece("e2", "knight", "second"),
        createPiece("e3", "knight", "second"),
        createPiece("e4", "knight", "second"),
        createPiece("e5", "rook", "second"),
    ];
    handMap.set("second", enemyPieces);

    return handMap;
};
