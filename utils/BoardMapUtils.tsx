import type { BoardKey } from "@/types/MapType"
export const getBoradKey = (x: number, y: number): BoardKey => { return `${x}_${y}` as BoardKey}
