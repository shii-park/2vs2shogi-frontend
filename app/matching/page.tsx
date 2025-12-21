'use client';
import { useState } from 'react';
import style from './page.module.css';
import { useUser } from "@/hooks/useUser";
import { Team } from '@/types/GameStates';

export default function Matching() {
    // マッチングした他プレイヤーのユーザー名を保存する変数
    const [tepAllyName, setTmepAllyName] = useState<string>("----");
    const [tempOppName1, setTempOppName1] = useState<string>("----");
    const [tempOppName2, setTempOppName2] = useState<string>("----");

    // useUserフック取得
    const useNames = useUser();

    // ソケット通信（メッセージ受信と送信）
    // const { sendJsonMessage, lastJsonMessage } = useSocket();

    // サーバーからのメッセージを監視する
    // プレイヤーの参加処理、ゲーム開始処理


    return (
        <div className={style.container}>
            
            <div className={style.infoPanel}>
                <div className={`${style.subInfo} text`}>waiting...</div>
                <div className={`${style.mainInfo} text`}>待機中</div>
            </div>

            {/* ユーザー名表示 */}
            <div className={style.userNamesContainer}>
                {/* 自チーム */}
                <div className={style.allyUserNames}>
                    <div className={`${style.userName} text`}>{useNames.userName}</div>
                    <div className={`${style.userName} text`}>{tepAllyName}</div>
                </div>
                {/* 相手チーム */}
                <div className={style.oppUserNames}>
                    <div className={`${style.userName} text`}>{tempOppName1}</div>
                    <div className={`${style.userName} text`}>{tempOppName2}</div>
                </div>
            </div>
        </div>
    );
}
