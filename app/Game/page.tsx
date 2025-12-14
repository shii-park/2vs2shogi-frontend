"use client";
import { useGameState } from "@/hooks/useBoardState";


export default function Game() {
    const {
        boardMap,
        handMap,
        Move,
        Capture,
        Drop,
        initializeGameState,
    } = useGameState();

    return (
        <div>

        </div>
    );
}
