// 駒の型定義
export type PieceType = {
    id: string;
    type: string;
    team: "first" | "second";
    promotable: boolean;    // 成ることが可能か(金・王は成ることができないため)
    promoted: boolean;      // 成っているか
}
