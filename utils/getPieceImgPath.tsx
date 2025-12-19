import { PieceType } from "@/types/PieceType";

type Props = {
    team: PieceType["team"];
    type: string;
    promoted: boolean;
    
}

export function getPieceImgPath({team, type, promoted}: Props) {
    return `/images/pieces/${team === "first" ? "ally" : "opp"}_${promoted ? "prom_": ""}${type}.png`;
}
