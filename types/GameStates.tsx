// プレイヤーのチーム
export type Team = "first" | "second";

// ゲームの進行フェーズ
export type GamePhase =
    | "waiting_opp"         // 相手の手番待ち
    | "selecting_piece"     // 自分の手番：動かす駒を選択中
    | "selecting_dest"      // 自分の手番：移動先を選択中
    | "promoteConfirming"   // 成り確認画面
    | "surrenderConfirming" // 投了確認画面
    | "waitAlly"            // マス確定後、ターンが終わるまで待機
    | "animating"           // アニメーション中（操作不能）
    | "game_over";          // 決着
