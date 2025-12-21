import { PieceType } from "@/types/PieceType"; 
import { BoardMapType, BoardKey } from "@/types/MapType";

// キー生成ヘルパー
const getBoardKey = (x: number, y: number): BoardKey => `${x}_${y}` as BoardKey;

export const createInitialBoardMap = (): BoardMapType => {
    const boardMap: BoardMapType = new Map();

    // 駒生成ヘルパー
    // ※PieceTypeの定義に合わせて、typeは適切なUnion型にキャストが必要な場合があります
    const createPiece = (x: number, y: number, type: string, team: "first" | "second"): PieceType => {
        return {
            id: `${team}-${type}-${x}-${y}`, // ユニークID
            type: type as any, // 型エラーが出る場合は as PieceType["type"] などでキャストしてください
            team: team,
            // 金と王以外は成れる
            promotable: type !== "gold" && type !== "king",
            promoted: false,
        };
    };

    // マップへのセット用ヘルパー
    const placePiece = (x: number, y: number, type: string, team: "first" | "second") => {
        const key = getBoardKey(x, y);
        const piece = createPiece(x, y, type, team);
        // スタック構造のため配列でセット
        boardMap.set(key, [piece]); 
    };

    // 1段目の並び順（左から：香桂銀金王金銀桂香）
    const bottomRowOrder = [
        "lance",    // 香車
        "knight",   // 桂馬
        "silver",   // 銀
        "gold",     // 金
        "king",     // 王
        "gold",     // 金
        "silver",   // 銀
        "knight",   // 桂馬
        "lance"     // 香車
    ];

    // --- 先手 (First: 下側 y=0,1,2) ---
   
    // y=0: 本陣 (香桂銀金王金銀桂香)
    bottomRowOrder.forEach((type, x) => {
        placePiece(x, 0, type, "first");
    });

    // y=1: 大駒 
    // 定跡：左(x=1, 8筋)に角、右(x=7, 2筋)に飛車
    placePiece(1, 1, "bishop", "first");
    placePiece(7, 1, "rook", "first");

    // y=2: 歩 (全列)
    for (let x = 0; x < 9; x++) {
        placePiece(x, 2, "pawn", "first");
    }

    // --- 後手 (Second: 上側 y=8,7,6) ---

    // y=8: 本陣 (香桂銀金王金銀桂香)
    bottomRowOrder.forEach((type, x) => {
        placePiece(x, 8, type, "second");
    });

    // y=7: 大駒
    // 定跡：後手から見て左(x=7)に角、右(x=1)に飛車
    placePiece(1, 7, "rook", "second");
    placePiece(7, 7, "bishop", "second");

    // y=6: 歩 (全列)
    for (let x = 0; x < 9; x++) {
        placePiece(x, 6, "pawn", "second");
    }

    return boardMap;
};
