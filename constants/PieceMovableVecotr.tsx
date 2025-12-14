const PieceMovableVector = (p_Type: string): [number, number][] => {
    switch (p_Type) {
        case 'king':
        case 'king2':
            return [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
        case '歩':
            return [[0, -1]];
        default:
            return [];
    }
};
