import './piece.css'
import Image from "next/image";
import { getPieceImgPath } from '@/utils/getPieceImgPath'
import type { PieceType } from '@/types/PieceType'
import { GamePhase, Team } from '@/types/GameStates';
import React from 'react';

type Props = {
    topPiece : PieceType;
    phase : GamePhase;
    isSelectedPiece : PieceType | null;
    myTeam: Team;
    onClick: (piece: PieceType) => void;
    onMouseEnter?: (e: React.MouseEvent<HTMLImageElement>) => void;
    onMouseLeave?: () => void;
}

export function PieceDraw({topPiece, phase, isSelectedPiece, myTeam, onClick, onMouseEnter, onMouseLeave}: Props) {
    const imgPath: string = getPieceImgPath({team: topPiece.team, type: topPiece.type, promoted: topPiece.promoted,})
    const pieceClass = [
    'piece',
    myTeam === topPiece.team ? 'ally' : 'opp',
    (phase === 'selecting_dest' || phase === 'selecting_piece') && 'selectable',
    isSelectedPiece === topPiece && 'isSelected',
    isSelectedPiece !== null && isSelectedPiece !== topPiece && 'otherSelected',
    isSelectedPiece === null && 'noneSelected',
    // pieceのクラスはここに追加
    ]
    .filter(Boolean)
    .join(' ');

    return (<Image  src={imgPath}
                    alt={topPiece.type}
                    className={pieceClass}

                    width={40}
                    height={40}
                    style={{ maxWidth: '80%', height: 'auto' }} // マスからはみ出さないようにする
                    onClick={() => onClick(topPiece)}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
            />)
}
