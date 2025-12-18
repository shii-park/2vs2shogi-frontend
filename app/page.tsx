"use client";
import Link from "next/link";
import { GameStateTest } from "@/hooks/hooktest";

export default function Page() {
  return (
    <div>
      <Link href="/game">ゲームページテスト</Link>
      <GameStateTest></GameStateTest>
    </div>
  );
}
