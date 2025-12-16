// テスト用初期盤面生成関数

import { PieceType } from "@/types/PieceType"; // パスは環境に合わせて調整してください
import { BoardMapType, BoardKey } from "@/types/MapType";

// キー生成ヘルパー（MapTypeの定義 ${number}_${number} に合わせる）
const getBoardKey = (x: number, y: number): BoardKey => `${x}_${y}` as BoardKey;

export const createInitialBoardMap = (): BoardMapType => {
    const boardMap: BoardMapType = new Map();

    // 駒生成ヘルパー
    const createPiece = (x: number, y: number, type: string, team: "first" | "second"): PieceType => {
        return {
            id: `${team}-${type}-${x}-${y}`, // ユニークID
            type: type,
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
        boardMap.set(key, [piece]); // PieceType[] としてセット
    };

    // 1段目の並び順（左から）
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

    // y=1: 大駒 (左:角, 右:飛車) ※将棋の定跡通り 8八角, 2八飛 の位置関係
    // 0_0基準だと x=1 が角(8筋), x=7 が飛車(2筋)
    placePiece(1, 1, "bishop", "first");
    placePiece(7, 1, "rook", "first");

    // // y=2: 歩
    // for (let x = 0; x < 9; x++) {
    //     placePiece(x, 2, "pawn", "first");
    // }

    // --- 後手 (Second: 上側 y=8,7,6) ---

    // y=8: 本陣 (香桂銀金王金銀桂香)
    bottomRowOrder.forEach((type, x) => {
        placePiece(x, 8, type, "second");
    });

    // y=7: 大駒 (左:飛車, 右:角) ※向かい合うため左右逆
    // 0_0基準だと x=1 が飛車(8筋), x=7 が角(2筋)
    placePiece(1, 7, "rook", "second");
    placePiece(7, 7, "bishop", "second");

    // y=6: 歩
    for (let x = 0; x < 9; x++) {
        placePiece(x, 6, "pawn", "second");
    }

    return boardMap;
};
