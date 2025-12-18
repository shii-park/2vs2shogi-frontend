import type { BoardKey } from "@/types/MapType"
export const getBoardKey = (x: number, y: number): BoardKey => { return `${x}_${y}` as BoardKey}
