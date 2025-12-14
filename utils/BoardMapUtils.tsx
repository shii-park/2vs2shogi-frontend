import type { BoardKey } from "@/types/BoardType"
export const getBoradKey = (x: number, y: number): BoardKey => { return `${x}_${y}` as BoardKey}
