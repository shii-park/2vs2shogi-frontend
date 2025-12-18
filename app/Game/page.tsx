"use client";
import { InitialPieces } from "@/constants/InitialTest";
import { BoardDraw } from "@/components/molecules/board/board"
import { useEffect, useState } from "react";
import { PieceType } from "@/types/PieceType";
import { BoardKey } from "@/types/MapType";

export default function Game() {


    return (
        <div>
            <BoardDraw />
        </div>
    );
}
