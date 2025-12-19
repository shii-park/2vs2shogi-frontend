import { PieceType } from "@/types/PieceType";
import { BoardMapType, BoardKey } from "@/types/MapType";

// MapTypeの定義に合わせてキーを生成 (${number}_${number})
const getBoardKey = (x: number, y: number): BoardKey => `${x}_${y}` as BoardKey;

export const createStackTestBoardMap = (): BoardMapType => {
    const boardMap: BoardMapType = new Map();

    // 駒生成ヘルパー
    // indexを追加して、同じマスでもIDが被らないようにします
    const createPiece = (x: number, y: number, type: string, team: "first" | "second", index: number): PieceType => {
        return {
            id: `${team}-${type}-${x}-${y}-${index}`, // ユニークID (index付与)
            type: type,
            team: team,
            promotable: type !== "gold" && type !== "king",
            promoted: false,
        };
    };

    // スタック配置ヘルパー
    // types配列の [0]が一番下、[last]が一番上（topPiece）になります
    const placeStack = (x: number, y: number, piecesConfig: { type: string, team: "first" | "second" }[]) => {
        const key = getBoardKey(x, y);
        
        const pieces = piecesConfig.map((config, index) => 
            createPiece(x, y, config.type, config.team, index)
        );

        boardMap.set(key, pieces);
    };

    // --- テストケース配置 ---

    // 1. [2段重ね] 味方の歩の上に、味方の香車 (x=1, y=2)
    // 下: 歩, 上: 香車
    placeStack(1, 2, [
        { type: "pawn", team: "first" },
        { type: "lance", team: "first" }
    ]);

    // 2. [3段重ね] 味方の金・銀・桂馬 (x=3, y=2)
    // 下: 桂馬, 中: 銀, 上: 金
    placeStack(3, 2, [
        { type: "knight", team: "first" },
        { type: "silver", team: "first" },
        { type: "gold", team: "first" }
    ]);

    // 3. [大量重ね] 歩が4枚重なっている (x=5, y=2)
    // ツールチップのリスト表示確認用
    placeStack(5, 2, [
        { type: "pawn", team: "first" },
        { type: "pawn", team: "first" },
        { type: "pawn", team: "first" },
        { type: "pawn", team: "first" }
    ]);

    // 4. [敵の重ね] 敵の歩の上に敵の王 (x=4, y=6)
    // 敵の駒でもツールチップが出るか確認
    placeStack(4, 6, [
        { type: "pawn", team: "second" },
        { type: "king", team: "second" }
    ]);

    // 5. [単体配置] 比較用の単体配置 (x=8, y=2)
    placeStack(8, 2, [
        { type: "rook", team: "first" }
    ]);

    // 6. [混在] (通常ありえませんが) 下が敵、上が味方 (x=7, y=4)
    // topPieceの判定が正しいか（味方として操作できるか）の確認
    placeStack(7, 4, [
        { type: "pawn", team: "second" }, // 下は敵
        { type: "silver", team: "first" }  // 上は味方
    ]);

    return boardMap;
};
