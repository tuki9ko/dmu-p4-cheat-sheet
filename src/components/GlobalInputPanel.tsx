import { type Dispatch } from "react";
import { type Timing, type Truth } from "../logic/types";
import { type ChaosSourceKind, type GlobalInput } from "../logic/globalInput";
import { type Action } from "../state";
import { SegToggle } from "./Toggles";
import { DEBUFF_ICON, TRUTH_ICON } from "../icons";
import { DebuffIcon } from "./Badges";

const TRUTH_OPTS = [
  { value: "true" as Truth, label: "真", cls: "seg-true", icon: TRUTH_ICON.true },
  { value: "false" as Truth, label: "偽", cls: "seg-false", icon: TRUTH_ICON.false },
];

const TIMING_OPTS = [
  { value: "early" as Timing, label: "早", cls: "seg-early" },
  { value: "late" as Timing, label: "遅", cls: "seg-late" },
];

const KIND_OPTS = [
  { value: "fire" as ChaosSourceKind, label: "ほのお", cls: "seg-plain", icon: DEBUFF_ICON.chaosFire },
  { value: "water" as ChaosSourceKind, label: "つなみ", cls: "seg-plain", icon: DEBUFF_ICON.chaosWater },
];

export function GlobalInputPanel({
  input,
  dispatch,
}: {
  input: GlobalInput;
  dispatch: Dispatch<Action>;
}) {
  return (
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

      {/* 3) 1.3 種別+真偽 */}
      <div className="drow">
        <div className="drow__label">ほのお/つなみ（1回目） + 真偽</div>
        <div className="drow__controls">
          <SegToggle
            ariaLabel="1回目のほのお/つなみの種別"
            value={input.honooTsunamiKind}
            onChange={(v) => dispatch({ type: "setHonooTsunamiKind", value: v })}
            options={KIND_OPTS}
          />
          <SegToggle
            ariaLabel="1回目のほのお/つなみの真偽"
            value={input.honooTsunamiTruth}
            onChange={(v) => dispatch({ type: "setHonooTsunamiTruth", value: v })}
            options={TRUTH_OPTS}
          />
        </div>
      </div>

      {/* 4) GC2 真偽 */}
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

      {/* 5) 1.5 真偽(種別は1.3の逆で自動) */}
      <div className="drow">
        <div className="drow__label">
          ほのお/つなみ（2回目） 真偽（種別は1回目の逆で自動）
        </div>
        <div className="drow__controls">
          <SegToggle
            ariaLabel="2回目のほのお/つなみの真偽"
            value={input.chaos15Truth}
            onChange={(v) => dispatch({ type: "setChaos15Truth", value: v })}
            options={TRUTH_OPTS}
          />
        </div>
      </div>
    </div>
  );
}
