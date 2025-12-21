import  "./Popup.css";


type Props = {
    label: string;
}

export function Popup({label}: Props) {
    return (
        // 画面全体を覆うオーバーレイ
        <div className="overlay" >
            {/* ダイアログ表示 */}
            <div className="dialog">
                
                <div className="messageArea">
                    <p className="text">{label}</p>
                </div>

            </div>
        </div>
    )
}
