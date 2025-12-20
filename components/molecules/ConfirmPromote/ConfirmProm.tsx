import  "./ConfirmProm.css";
import { OutlineButtton } from "@/components/atoms/OutlineButton/OutlineButton";
import { WhiteButton } from "@/components/atoms/WhiteButton/WhiteButton";


type Props = {
    label: string;
    promClcik: () => void;
    notPromClick: () => void;
}

export function ConfirmPromote ({label, promClcik, notPromClick}: Props) {
    return (
        // 画面全体を覆うオーバーレイ
        <div className="overlay" >
            {/* ダイアログ表示 */}
            <div className="dialog">
                
                <div className="messageArea">
                    <p className="text">{label}</p>
                </div>

                {/* ボタンを置くフッター */}
                <div className="footer">
                    {/* 成らないボタン */}
                    <div className="button notPromote">
                        <WhiteButton
                            label="いいえ"
                            onClick={notPromClick}
                        />
                    </div>
                    {/* 成るボタン */}
                    <div className="button promote">
                        <WhiteButton
                            label="はい"
                            onClick={promClcik}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
