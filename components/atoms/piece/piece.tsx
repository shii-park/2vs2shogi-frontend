import './piece.css'
import Image from "next/image";
import { getPieceImgPath } from '@/utils/getPieceImgPath'
import type { PieceType } from '@/types/PieceType'
import { GamePhase, Team } from '@/types/GameStates';

type Props = {
    topPiece : PieceType;
    pieceStack: PieceType[];
    phase : GamePhase;
    isSelectedPiece : PieceType | null;
    myTeam: Team;
    onClick: (piece: PieceType) => void;
}

export function PieceDraw({topPiece, pieceStack, phase, isSelectedPiece, myTeam, onClick}: Props) {
    const imgPath: string = getPieceImgPath({team: topPiece.team, type: topPiece.type, promoted: topPiece.promoted,})
    const pieceClass = [
    'piece',
    myTeam === topPiece.team ? 'ally' : 'opp',
    (phase === 'selecting_dest' || phase === 'selecting_piece') && 'selectable',
    isSelectedPiece === topPiece && 'isSelected',
    isSelectedPiece !== null && isSelectedPiece !== topPiece && 'otherSelected',
    isSelectedPiece === null && 'noneSelected',
    pieceStack.length !== 0 && 'stack',
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
            />)
}
