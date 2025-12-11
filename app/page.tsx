"use client";
import { WhiteButton } from "@/components/atoms/white-button/page";

export default function Page() {
  return (
    <div>
      <WhiteButton
        label="確定"
        onClick={() => console.log("click!!")}
      />
    </div>
  );
}
