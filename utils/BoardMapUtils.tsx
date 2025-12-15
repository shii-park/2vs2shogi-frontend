import type { BoardKey, BoardMapType } from "@/types/MapType"
import { PieceType } from "@/types/PieceType"
import { PieceMovableVector } from "@/constants/PieceMovableVector"
import { boardProperty } from "@/constants/BoardProperty"

// indexからボードマップのキーを返す関数
export const getBoardKey = (x: number, y: number): BoardKey => { return `${x}_${y}` as BoardKey}

// 駒とmapから、移動可能なマスを計算する関数
export const getMovableMasu = (boardMap: BoardMapType, current_x: number, current_y: number, piece: PieceType): [number, number][] => {
    // 返り値用配列
    const movableMasu: [number, number][] = [];

    // 座標が盤面内であるか
    const isValidPosition = (x: number, y: number): boolean => {
        return x >= 0 && x <= boardProperty.boardWidth && y >= 0 && y <= boardProperty.boardHeight;
    };

    // 一方向に進む駒の計算関数
    const addSlideMoves = (directions: [number, number][]) => {
        directions.forEach(([dx, dy]) => {
            let next_x = current_x + dx;
            let next_y = current_y + dy;
            
            // 駒にぶつかる、盤面から出るまでループ
            while(isValidPosition(next_x, next_y)){
                const stack = boardMap.get(getBoardKey(next_x, next_y)) ?? [];
                
                // スタックがあるとき
                if(stack.length !== 0){
                    const topStack = stack[stack.length - 1];
                    // 味方の駒であれば、ループを抜ける
                    if (topStack.team === piece.team)break;
                    // 敵の駒であれば、追加してループを抜ける
                    else {
                        movableMasu.push([next_x, next_y]);
                        break;
                    }
                }else{
                // スタックがないとき
                    movableMasu.push([next_x, next_y]);
                }
                // マス座標更新
                next_x += dx;
                next_y += dy;
            }    
        });
    };

    // 移動可能ベクトルを取得
    const [movableVectors, movableSlideVectors] = PieceMovableVector(piece.type, piece.promoted);

    // スライドの移動マス計算
    if (movableSlideVectors){
        addSlideMoves(movableSlideVectors);
    }
    
    // 1マスの移動マス計算
    movableVectors.forEach(vector => {
        // 移動可能マス一覧
        const Masu: [number, number] = [vector[0] + current_x, vector[1] + current_y];

        // 盤面外のマスを除外
        if (!isValidPosition(Masu[0], Masu[1])) return;

        // キーからマップのスタックを取得
        const boardKey = getBoardKey(Masu[0], Masu[1]);
        const boardStack = boardMap.get(boardKey) ?? [];
        // スタックが空、またはスタックのtopが相手の駒のとき、返り値に追加
        if (boardStack.length === 0 || boardStack[boardStack.length - 1].team !== piece.team) movableMasu.push(Masu)
    })

    return movableMasu;
}
