import { type Dispatch } from "react";
import { type Timing, type Truth } from "../logic/types";
import { type GlobalInput } from "../logic/globalInput";
import { type Action } from "../state";
import { SegToggle } from "./Toggles";
import { TRUTH_ICON } from "../icons";
import { DebuffIcon } from "./Badges";

const TRUTH_OPTS = [
  { value: "true" as Truth, label: "真", cls: "seg-true", icon: TRUTH_ICON.true },
  { value: "false" as Truth, label: "偽", cls: "seg-false", icon: TRUTH_ICON.false },
];

const TIMING_OPTS = [
  { value: "early" as Timing, label: "早", cls: "seg-early" },
  { value: "late" as Timing, label: "遅", cls: "seg-late" },
];

export function GlobalInputPanel({
  input,
  dispatch,
}: {
  input: GlobalInput;
  dispatch: Dispatch<Action>;
}) {
  return (
    <>
      {/* グランドクロス（GC1真偽 / 水圧縮・FL早遅 / GC2真偽） */}
      <div className="card ginput">
        {/* 1) GC1 真偽 */}
        <div className="drow">
          <div className="drow__label">GC1（1回目グランドクロス） 真偽</div>
          <div className="drow__controls">
            <SegToggle
              ariaLabel="GC1の真偽"
              value={input.gc1Truth}
              onChange={(v) => dispatch({ type: "setGc1Truth", value: v })}
              options={TRUTH_OPTS}
            />
          </div>
        </div>

        {/* 2) GC1 水圧縮 早遅 */}
        <div className="drow">
          <div className="drow__label">
            <DebuffIcon kind="waterCompress" label="水圧縮" />
            <DebuffIcon kind="forkLightning" label="FL" />
            GC1 水圧縮/FL 早/遅
          </div>
          <div className="drow__controls">
            <SegToggle
              ariaLabel="GC1水圧縮の早遅"
              value={input.gc1WaterTiming}
              onChange={(v) => dispatch({ type: "setGc1WaterTiming", value: v })}
              options={TIMING_OPTS}
            />
          </div>
        </div>

        {/* 3) GC2 真偽 */}
        <div className="drow">
          <div className="drow__label">GC2（2回目グランドクロス） 真偽</div>
          <div className="drow__controls">
            <SegToggle
              ariaLabel="GC2の真偽"
              value={input.gc2Truth}
              onChange={(v) => dispatch({ type: "setGc2Truth", value: v })}
              options={TRUTH_OPTS}
            />
          </div>
        </div>
      </div>

      {/* 混沌（炎は必ず先に発動＝早 / 水は後＝遅） */}
      <div className="card ginput">
        {/* 混沌の炎 真偽 */}
        <div className="drow">
          <div className="drow__label">
            <DebuffIcon kind="chaosFire" label="ほのお" />
            ほのお（混沌の炎） 真偽
          </div>
          <div className="drow__controls">
            <SegToggle
              ariaLabel="ほのお(混沌の炎)の真偽"
              value={input.fireTruth}
              onChange={(v) => dispatch({ type: "setFireTruth", value: v })}
              options={TRUTH_OPTS}
            />
          </div>
        </div>

        {/* 混沌の水 真偽 */}
        <div className="drow">
          <div className="drow__label">
            <DebuffIcon kind="chaosWater" label="つなみ" />
            つなみ（混沌の水） 真偽
          </div>
          <div className="drow__controls">
            <SegToggle
              ariaLabel="つなみ(混沌の水)の真偽"
              value={input.waterTruth}
              onChange={(v) => dispatch({ type: "setWaterTruth", value: v })}
              options={TRUTH_OPTS}
            />
          </div>
        </div>
      </div>
    </>
  );
}
