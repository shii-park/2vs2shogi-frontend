import './masu.css'

type Props = {
    x: number;
    y: number;
    isSelectable: boolean;    // マス選択状態
    isMovable: boolean;       // マスが移動可能かどうか
    onClick: (movable: boolean) => void;        // マス選択時の関数
};

export function MasuDraw({x, y, isSelectable, isMovable, onClick}: Props){
    return <div className={`masu 
                            ${isSelectable && isMovable ? "movable" : ""} 
                            ${isSelectable && !isMovable ? "not-movable" : ""}
                            `}
                onClick={() => onClick(isMovable)}
                role="button">
            </div>
}
