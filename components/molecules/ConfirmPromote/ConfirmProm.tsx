import  "./ConfirmProm.css";
import { OutlineButtton } from "@/components/atoms/OutlineButton/OutlineButton";
import { WhiteButton } from "@/components/atoms/WhiteButton/white-button";


type Props = {
    promClcik: () => void;
    notPromClick: () => void;
}

export function ConfirmPromote ({promClcik, notPromClick}: Props) {
    return (
        // 画面全体を覆うオーバーレイ
        <div className="overlay" >
            {/* ダイアログ表示 */}
            <div className="dialog">
                
                <div className="messageArea">
                    <p className="text">成りますか？</p>
                </div>

                {/* ボタンを置くフッター */}
                <div className="footer">
                    {/* 成らないボタン */}
                    <div className="button notPromote">
                        <WhiteButton
                            label="成らず"
                            onClick={notPromClick}
                        />
                    </div>
                    {/* 成るボタン */}
                    <div className="button promote">
                        <WhiteButton
                            label="成る"
                            onClick={promClcik}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
