export const PieceMovableVector = (p_Type: string, promoted: boolean): [number, number][][] => {
    if (promoted)p_Type = `prom_${p_Type}`;

    // 返り値:[[1マスの移動ベクトル配列], [スライド移動ベクトル配列]]
    switch (p_Type) {
        case 'king':
        case 'king2':
            return [[[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]], []];
        case 'gold':
            return [[[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [0, -1]], []];
        case 'silver':
            return [[[1, 1], [0, 1], [-1 ,1], [-1, -1], [1, -1]], []];
        case 'knight':
            return [[[-1, 2], [1, 2]], []];
        case 'lance':
            return [[], [[0, 1]]];
        case 'rook':
            return [[], [[0, 1], [-1, 0], [0, -1], [1, 0]]];
        case 'bishop':
            return [[], [[1, 1], [-1, 1], [-1, -1], [1, -1]]];
        case 'pawn':
            return [[[0, 1]], []];
        // 成り
        case 'prom_rook':
            return [[[1, 1], [-1, 1], [-1, -1], [1, -1]], [[0, 1], [-1, 0], [0, -1], [1, 0]]];
        case 'prom_':
            return [[[0, 1], [-1, 0], [0, -1], [1, 0]], [[1, 1], [-1, 1], [-1, -1], [1, -1]]];
        case 'prom_silver':
        case 'prom_knight':
        case 'prom_lance':
        case 'prom_pawn':
            return [[[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [0, -1]], []];
        default:
            return [];
    }
};
