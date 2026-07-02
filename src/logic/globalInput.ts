// ===== グローバル入力(プレイヤー単位を廃止し、デバフ単位の全体入力に作り替え) =====
// 既存 types.ts の Truth / Timing / ActionLabel / RESOLVERS を流用。
import {
  type Truth,
  type Timing,
  type ActionLabel,
  RESOLVERS,
} from "./types";

// 全5項目。デフォルトは全て null(未選択)。
// 混沌は「付与順(1.3/1.5)はランダムだが必ず炎から発動する」ため、
// 付与順や種別を入力させず、炎の真偽・水の真偽を直接入力させる(炎=早/水=遅で確定)。
export interface GlobalInput {
  gc1Truth: Truth | null; // GC1(1.2) 真偽
  gc1WaterTiming: Timing | null; // GC1 水圧縮の早/遅(=GC1 FLも同じ)
  fireTruth: Truth | null; // 混沌の炎の真偽(=早い混沌。炎は必ず先に発動)
  gc2Truth: Truth | null; // GC2(1.4) 真偽
  waterTruth: Truth | null; // 混沌の水の真偽(=遅い混沌。水は必ず後に発動)
}

export function emptyGlobalInput(): GlobalInput {
  return {
    gc1Truth: null,
    gc1WaterTiming: null,
    fireTruth: null,
    gc2Truth: null,
    waterTruth: null,
  };
}

// 全項目が埋まったか(出力可否)。型ガードで以降 non-null を保証。
export interface FilledGlobalInput {
  gc1Truth: Truth;
  gc1WaterTiming: Timing;
  fireTruth: Truth;
  gc2Truth: Truth;
  waterTruth: Truth;
}

export function isFilled(i: GlobalInput): i is GlobalInput & FilledGlobalInput {
  return (
    i.gc1Truth !== null &&
    i.gc1WaterTiming !== null &&
    i.fireTruth !== null &&
    i.gc2Truth !== null &&
    i.waterTruth !== null
  );
}

// ===== 出力構造 =====
export type SourceGc = "gc1" | "gc2";

// 水圧縮/FL の早枠・遅枠1ブロック分(由来GCとその真偽が確定する)
export interface WaterForkBlock {
  timing: Timing; // early/late
  sourceGc: SourceGc; // 由来GC(一意確定)
  truth: Truth; // 由来GCの真偽
  waterAction: ActionLabel; // 水圧縮を持つ人の行動
  forkAction: ActionLabel; // FLを持つ人の行動
}

// 加速度ブロック(早遅混在のため由来GC別=真偽別に提示)
export interface AccelBlock {
  unified: boolean; // gc1Truth===gc2Truth で1本化できるか
  gc1Action: ActionLabel; // GC1由来の加速度行動
  gc2Action: ActionLabel; // GC2由来の加速度行動
}

// 呪詛(早=GC1真偽 / 遅=GC2真偽)
export interface CurseBlock {
  timing: Timing;
  truth: Truth;
  action: ActionLabel; // 見る/見ない
}

// 混沌(早=1.3 / 遅=1.3の逆)
export interface ChaosBlock {
  timing: Timing;
  kind: "chaosFire" | "chaosWater";
  truth: Truth;
  action: ActionLabel; // 内側/外側
}

// 各自判断(2.1/2.2)の注記
export interface SelfJudgeBlock {
  codes: ["2.1", "2.2"];
  note: string;
}

export interface ResolvedOutput {
  waterFork: { early: WaterForkBlock; late: WaterForkBlock };
  accel: AccelBlock;
  curse: { early: CurseBlock; late: CurseBlock };
  chaos: { early: ChaosBlock; late: ChaosBlock };
  selfJudge: SelfJudgeBlock;
}

// ===== 導出(RESOLVERS流用) =====
export function resolveGlobal(i: FilledGlobalInput): ResolvedOutput {
  // 水/FL 由来GCの一意確定:
  // GC内で水圧縮とFLは同タイミング(spec_change1)。2回のGCで早枠/遅枠を1枠ずつ埋めるため、
  // GC1の水・FLが早ならGC2は必ず遅、の排他関係になる。
  const earlySrc: SourceGc = i.gc1WaterTiming === "early" ? "gc1" : "gc2";
  const lateSrc: SourceGc = earlySrc === "gc1" ? "gc2" : "gc1";
  const truthOf = (gc: SourceGc): Truth =>
    gc === "gc1" ? i.gc1Truth : i.gc2Truth;

  const earlyWFTruth = truthOf(earlySrc);
  const lateWFTruth = truthOf(lateSrc);

  // 混沌種別: 炎は必ず先に発動するため 早い混沌(2.5)=炎 / 遅い混沌(2.8)=水 で固定。
  const earlyKind = "chaosFire" as const;
  const lateKind = "chaosWater" as const;

  return {
    waterFork: {
      early: {
        timing: "early",
        sourceGc: earlySrc,
        truth: earlyWFTruth,
        waterAction: RESOLVERS.waterCompress(earlyWFTruth),
        forkAction: RESOLVERS.forkLightning(earlyWFTruth),
      },
      late: {
        timing: "late",
        sourceGc: lateSrc,
        truth: lateWFTruth,
        waterAction: RESOLVERS.waterCompress(lateWFTruth),
        forkAction: RESOLVERS.forkLightning(lateWFTruth),
      },
    },
    accel: {
      unified: i.gc1Truth === i.gc2Truth,
      gc1Action: RESOLVERS.accelBomb(i.gc1Truth),
      gc2Action: RESOLVERS.accelBomb(i.gc2Truth),
    },
    curse: {
      early: {
        timing: "early",
        truth: i.gc1Truth,
        action: RESOLVERS.curseVoice(i.gc1Truth),
      },
      late: {
        timing: "late",
        truth: i.gc2Truth,
        action: RESOLVERS.curseVoice(i.gc2Truth),
      },
    },
    chaos: {
      early: {
        timing: "early",
        kind: earlyKind,
        truth: i.fireTruth,
        action: RESOLVERS[earlyKind](i.fireTruth),
      },
      late: {
        timing: "late",
        kind: lateKind,
        truth: i.waterTruth,
        action: RESOLVERS[lateKind](i.waterTruth),
      },
    },
    selfJudge: {
      codes: ["2.1", "2.2"],
      note: "2.1暗黒光(傷)・2.2アラガン/死の超越はGC3(1.6)由来。各自で確認して判断。",
    },
  };
}
