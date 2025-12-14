import './piece.css'
import Image from "next/image";
import { getPieceImgPath } from '@/utils/getPieceImgPath'
import type { PieceType } from '@/types/PieceType'

type Props = {
    p : PieceType;
    isSelectable : boolean;
    isSelected : boolean;
    onClick: () => void;
}

export function PieceDraw({p, isSelectable, isSelected, onClick}: Props) {
    return (<Image  src={getPieceImgPath({team: p.team, type: p.type, promoted: p.promoted,})}
                    alt={p.type}
                    className={`piece 
                                {/* チーム別クラスをここに入れる予定 */}
                                ${isSelected && "selected"}
                                ${isSelectable && "selectable"}
                                ${!isSelectable && !isSelected ? "not-selected": ""}
                                `}

                    width={40}
                    height={40}
                    style={{ maxWidth: '80%', height: 'auto' }} // マスからはみ出さないようにする
                    onClick={onClick}
            />)
}
