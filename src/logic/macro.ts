// FF14マクロ生成。各行 /p 始まり・1行25文字程度・合計15行以内(厳守)。
// 判定の途中経過(真偽・由来GC)は出さず、UIの処理順マップと同じく「やる行動」だけを淡々と並べる。
import { type ActionLabel } from "./types";
import { type ResolvedOutput } from "./globalInput";

// マクロ用の短縮行動ラベル。水/FL=頭割り/1人受, 混沌=内側/外側, 呪詛=見る/見ない, 加速度=動く/動かない。
function macroAction(a: ActionLabel): string {
  switch (a) {
    case "stack":
      return "頭割り";
    case "soloSpread":
      return "1人受";
    case "goInside":
      return "内側";
    case "goOutside":
      return "外側";
    case "lookAt":
      return "見る";
    case "lookAway":
      return "見ない";
    case "stayStill":
      return "動かない";
    case "mustMove":
      return "動く";
    default:
      return a;
  }
}

const kindJa = (kind: "chaosFire" | "chaosWater"): string =>
  kind === "chaosFire" ? "炎" : "水";

// 加速度爆弾とそれ以外を区切る水平線
const DIVIDER = "/p ────────────";
// 矢印(前後に半角スペース)
const ARROW = " → ";
// デバフ行の行頭(全角スペース1つでインデント)
const IND = "/p 　";

/**
 * 行動だけを並べたマクロを生成する。各行は "/p " 始まり。
 * 先頭に加速度爆弾(真偽が同じなら1行、違えば由来GC別)、水平線で区切り、
 * 早グループ→遅グループの順で 水圧縮/FL/呪詛/混沌 の行動を列挙する。
 * デバフ行は全角スペースでインデントする。
 */
export function buildMacro(r: ResolvedOutput): string[] {
  const e = r.waterFork.early;
  const l = r.waterFork.late;
  const a = r.accel;

  const accelLine = a.unified
    ? `/p ◆加速度${ARROW}${macroAction(a.gc1Action)}`
    : `/p ◆加速度 GC1${ARROW}${macroAction(a.gc1Action)} / GC2${ARROW}${macroAction(
        a.gc2Action,
      )}`;

  return [
    accelLine,
    DIVIDER,
    "/p ◆早グループ",
    `${IND}水圧縮${ARROW}${macroAction(e.waterAction)} / FL${ARROW}${macroAction(
      e.forkAction,
    )}`,
    `${IND}呪詛${ARROW}${macroAction(r.curse.early.action)}`,
    `${IND}混沌${kindJa(r.chaos.early.kind)}${ARROW}${macroAction(
      r.chaos.early.action,
    )}`,
    "/p ◆遅グループ",
    `${IND}水圧縮${ARROW}${macroAction(l.waterAction)} / FL${ARROW}${macroAction(
      l.forkAction,
    )}`,
    `${IND}呪詛${ARROW}${macroAction(r.curse.late.action)}`,
    `${IND}混沌${kindJa(r.chaos.late.kind)}${ARROW}${macroAction(
      r.chaos.late.action,
    )}`,
  ];
}

export function buildMacroText(r: ResolvedOutput): string {
  return buildMacro(r).join("\n");
}
