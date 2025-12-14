import type { PieceType } from "@/types/PieceType";

// テスト用初期盤面
export const InitialPieces: PieceType[]=[
    { id: 'ki1', type: 'king', team: 'first', promotable: false, promoted: false,},
    { id: 'ki2', type: 'king', team: 'second', promotable: false, promoted: false,},
];
