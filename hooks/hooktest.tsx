import { type HandKey, type BoardKey, type BoardMapType, type HandMapType } from "@/types/MapType";
import type { PieceType } from "@/types/PieceType";
import { InitialPieces } from "@/constants/InitialTest";
import { getBoradKey } from "@/utils/BoardMapUtils";
import { useGameState } from "@/hooks/useBoardState";
import { useEffect } from "react";

export function GameStateTest() {
    const {
        boardMap,
        handMap,
        Move,
        Capture,
        Drop,
        initializeGameState,
    } = useGameState();

    const initializeBoardMap: BoardMapType = new Map<BoardKey, PieceType[]>();
    initializeBoardMap.set(getBoradKey(0, 0), [InitialPieces[0]]);
    initializeBoardMap.set(getBoradKey(0, 1), [InitialPieces[1]]);
    const initializeHandMap: HandMapType = new Map<HandKey, PieceType[]>();

    useEffect(() => {
        initializeGameState(initializeBoardMap, initializeHandMap);
    }, []);

    useEffect(() => {
        console.log("boardMap changed", boardMap);
    }, [boardMap]);
    useEffect(() => {
        console.log("handMap changed", handMap);
    }, [handMap]);

    const moveTest = () => {
        Move(1, 0, InitialPieces[0]);
    };
    const captureTest = () => {
        Capture(InitialPieces[0]);
    };

    // ジェミナイ考案テスト関数
    const dropTest = () => {
        // 1. まず、現在の持ち駒リストを取得する（Captureした後なので、相手チームの持ち駒にあるはず）
        // ここでは "second" の持ち駒にあると仮定します
        const targetTeam = "second";
        const currentHand = handMap.get(targetTeam);

        if (!currentHand || currentHand.length === 0) {
            console.log("エラー: 持ち駒が空です。先にCaptureを実行してください。");
            return;
        }

        // 2. 持ち駒のリストから、実際に存在するオブジェクトを取り出す
        const pieceToDrop = currentHand[0];

        // 3. その「本物のオブジェクト」を渡してDropする
        Drop(2, 2, pieceToDrop);
    };

    return (
        <div>
            <p><button onClick={moveTest}>moveテスト</button></p>
            <p><button onClick={captureTest}>captureテスト</button></p>
            <p><button onClick={dropTest}>dropテスト</button></p>
        </div>
    );
}
