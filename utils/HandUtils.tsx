import { PieceType } from "@/types/PieceType";

// 表示順
const handOrder = ['rook', 'bishop', 'gold', 'silver', 'knight', 'lance', 'pawn'];

// 各タイプの代表駒1つとカウンタ
export type HandGroup = {
    piece: PieceType;   // 表示用の駒データ(代表1つ)
    count: number;
}

// 持ち駒のPieceType配列から、HandGroupフォーマットに変換する関数
export const formatHandPieces = (handStack: PieceType[]): HandGroup[] => {
    // 持ち駒がない場合を除外
    if (!handStack || handStack.length === 0) return [];

    // 返り値用配列
    const result: HandGroup[] = [];

    handOrder.forEach(type => {
        // typeのみを抽出
        const targetPieces = handStack.filter(p => p.type === type);
        
        // 返り値配列にpush
        if (targetPieces.length > 0) {
            result.push({
                piece: targetPieces[0], 
                count: targetPieces.length
            })
        }

    })

    return result;
}


