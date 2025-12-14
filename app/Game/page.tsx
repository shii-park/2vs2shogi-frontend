"use client";
import { useGameState } from "@/hooks/useGameState";


export default function Game() {
    const {
        boardMap,
        handMap,
        Move,
        Capture,
        Drop,
    } = useGameState();

    return(
        <div>
            
        </div>
    );
}
