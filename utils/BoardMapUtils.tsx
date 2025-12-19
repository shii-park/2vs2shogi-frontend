import type { BoardKey, BoardMapType } from "@/types/MapType"
import { PieceType } from "@/types/PieceType"
import { PieceMovableVector } from "@/constants/PieceMovableVector"
import { boardProperty } from "@/constants/BoardProperty"
import { Team } from "@/types/GameStates"

// indexからボードマップのキーを返す関数
export const getBoardKey = (x: number, y: number): BoardKey => { return `${x}_${y}` as BoardKey}

// 駒とmapから、移動可能なマスを計算する関数
export const getMovableMasu = (
    boardMap: BoardMapType,
    current_x: number,
    current_y: number,
    piece: PieceType
): [number, number][] => {
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

// 駒の成りマス判定
export const canPromote = (
    team: Team,
    from_y: number,
    to_y: number,
    piece: PieceType
): boolean => {
    // 成っている、成れない駒を除外
    if (piece.promoted || !piece.promotable) return false;

    return from_y >= 6 || to_y >= 6;
}

export const getDroppableMasu = (
    boardMap: BoardMapType,
    piece: PieceType,   // 打とうとしている持ち駒
    myTeam: Team,
): [number, number][]  => {
    // 返り値用配列
    const droppableMasu: [number, number][] = [];
    // 二歩判定用配列
    const nifuColumns = new Set<number>();

    // 駒が歩であれば、二歩の判定
    if (piece.type === 'pawn'){
        for (let x = 0; x <= boardProperty.boardWidth; x++){
            for (let y = 0; y <= boardProperty.boardHeight; y++){
                const boardKey = getBoardKey(x, y);
                const stack = boardMap.get(boardKey) ?? [];
                // 列に味方の歩、かつ成っていないか判定
                const pawn_flag = stack.some(p => p.type === "pawn" && p.promoted === false && p.team === myTeam)
                if(pawn_flag){
                    nifuColumns.add(x);
                    break;
                }
            }
        }
    }

    // 持ち駒を打てるマスの計算
    for (let x = 0; x <= boardProperty.boardWidth; x++){
        // 二歩の列ならスキップ(pieceが歩でないならnihuColumnsは空)
        if (nifuColumns.has(x)) continue;

        for (let y = 0; y <= boardProperty.boardHeight; y++){
            const boardKey = getBoardKey(x, y);
            const stack = boardMap.get(boardKey) ?? [];

            // マスに駒がない場合は返り値配列に追加
            if (!stack || stack.length === 0){
                droppableMasu.push([x, y]);
            }
        }
    }

    return droppableMasu;
}
