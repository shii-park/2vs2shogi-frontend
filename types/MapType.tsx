import { PieceType } from "./PieceType";

export type BoardKey = `${number}-${number}`;    //BoardMapのキー
export type HandKey = "first" | "second"    //HandMapのキー
export type BoardMapType = Map<BoardKey, PieceType[]>;   //boardMapの型
export type HandMapType = Map<HandKey, PieceType[]>;        //handMapの型
