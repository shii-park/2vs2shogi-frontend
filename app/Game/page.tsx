"use client";
import { InitialPieces } from "@/constants/InitialTest";
import { BoardDraw } from "@/components/molecules/board/board"
import { useEffect, useState } from "react";
import { PieceType } from "@/types/PieceType";
import { BoardMapKey } from "@/types/BoardMapType";

export default function Game() {
    const [BoardMap, setBoardMap] = useState<Map<BoardMapKey, PieceType[]>>(() => new Map());

    useEffect(() => {
        // マッチング時の初回処理
    }, [])
    
    return(
        <div>
          <BoardDraw/>
        </div>
    );
}
