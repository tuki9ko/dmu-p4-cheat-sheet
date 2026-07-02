// ===== 真偽 (青い球=真 / 赤い?=偽) =====
export type Truth = "true" | "false"; // "true"=真, "false"=偽

// ===== タイミング(早い/遅い) =====
export type Timing = "early" | "late"; // "early"=早い(前半発動), "late"=遅い(後半発動)

// ===== デバフ種別 =====
export type DebuffKind =
  | "deathWound" // 死者の傷
  | "lifeWound" // 生者の傷
  | "allaganField" // アラガンフィールド
  | "transcendDeath" // 死の超越
  | "accelBomb" // 加速度爆弾
  | "waterCompress" // 水圧縮
  | "forkLightning" // フォークライトニング
  | "chaosFire" // 混沌の炎
  | "chaosWater" // 混沌の水
  | "curseVoice"; // 呪詛の叫声

// ===== 出力: 各自の行動 =====
export type ActionLabel =
  // 暗黒光(2.1)
  | "deathLightSide" // 死者の暗黒光側へ
  | "lifeLightSide" // 生者の暗黒光側へ
  // ダメージ蓄積系(2.2)
  | "takeLethal" // 即死ダメージを受けて解除
  | "avoidLethal" // 即死ダメージを受けない(蓄積で耐える)
  // 加速度爆弾(2.3/2.6)
  | "stayStill" // 動かない
  | "mustMove" // 動く
  // 頭割り/1人受け(水圧縮/FL: 2.3/2.6)
  | "stack" // 頭割り
  | "soloSpread" // 1人受け(散開)
  // 混沌(2.5/2.8)
  | "goInside" // 内側(ドーナツ回避)
  | "goOutside" // 外側(円AoE回避)
  // 呪詛(2.4/2.7)
  | "lookAt" // 発動者を見る
  | "lookAway"; // 発動者を見ない

// ===== 行動解決テーブル(真偽→行動の純粋関数マップ) =====
export type ResolverFn = (truth: Truth) => ActionLabel;
export const RESOLVERS: Record<DebuffKind, ResolverFn> = {
  // 死者の傷: 真=死者光で即死→生者光側へ / 偽=生者光で即死→死者光側へ
  deathWound: (t) => (t === "true" ? "lifeLightSide" : "deathLightSide"),
  // 生者の傷: 真=生者光で即死→死者光側へ / 偽=死者光で即死→生者光側へ
  lifeWound: (t) => (t === "true" ? "deathLightSide" : "lifeLightSide"),
  // アラガン: 真=蓄積(即死を受けない) / 偽=即死を受けて解除
  allaganField: (t) => (t === "true" ? "avoidLethal" : "takeLethal"),
  // 死の超越: 真=即死を受けて解除 / 偽=蓄積(即死を受けない)
  transcendDeath: (t) => (t === "true" ? "takeLethal" : "avoidLethal"),
  // 加速度爆弾: 真=動くと即死→動かない / 偽=動かないと即死→動く
  accelBomb: (t) => (t === "true" ? "stayStill" : "mustMove"),
  // 水圧縮: 真=頭割り / 偽=1人受け
  waterCompress: (t) => (t === "true" ? "stack" : "soloSpread"),
  // フォークライトニング: 真=1人受け / 偽=頭割り
  forkLightning: (t) => (t === "true" ? "soloSpread" : "stack"),
  // 混沌の炎: 真=円範囲(外側へ) / 偽=ドーナツ(内側へ)
  chaosFire: (t) => (t === "true" ? "goOutside" : "goInside"),
  // 混沌の水: 真=ドーナツ(内側) / 偽=円範囲(外側)
  chaosWater: (t) => (t === "true" ? "goInside" : "goOutside"),
  // 呪詛: 真=見ると石化→見ない / 偽=見ないと石化→見る
  curseVoice: (t) => (t === "true" ? "lookAway" : "lookAt"),
};

// ===== 行動ラベルの表示メタ(色/形/一語見出し) =====
export interface ActionMeta {
  label: string; // 一語見出し(日本語)
  icon: string; // 絵文字/記号
  colorVar: string; // CSS 変数名
}

export const ACTION_META: Record<ActionLabel, ActionMeta> = {
  deathLightSide: { label: "死者光側", icon: "🟪", colorVar: "--death-light" },
  lifeLightSide: { label: "生者光側", icon: "🟩", colorVar: "--life-light" },
  takeLethal: { label: "即死受ける", icon: "💥", colorVar: "--false-red" },
  avoidLethal: { label: "蓄積で耐える", icon: "🛡", colorVar: "--true-blue" },
  stayStill: { label: "動かない", icon: "⏹", colorVar: "--true-blue" },
  mustMove: { label: "動く", icon: "➡", colorVar: "--early" },
  stack: { label: "頭割り", icon: "👥", colorVar: "--action-stack" },
  soloSpread: { label: "1人受け", icon: "🙅", colorVar: "--action-spread" },
  goInside: { label: "内側", icon: "🎯", colorVar: "--action-stack" },
  goOutside: { label: "外側", icon: "⭕", colorVar: "--action-spread" },
  lookAt: { label: "見る", icon: "👁", colorVar: "--life-light" },
  lookAway: { label: "見ない", icon: "🚫", colorVar: "--false-red" },
};
