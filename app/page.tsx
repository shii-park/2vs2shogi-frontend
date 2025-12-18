"use client";
import { InputText } from "@/components/atoms/InputText/InputText";
import Link from "next/link";

export default function Page() {
  return (
    <div>
      <p><Link href="/game">ゲームページテスト</Link></p>
      <InputText value="" onChange={(value) => console.log(value)}  placeholder="棋士名を入力"
      />
    </div>
  );
}
