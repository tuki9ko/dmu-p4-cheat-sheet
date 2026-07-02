import { type ActionLabel, type DebuffKind, type Truth, ACTION_META } from "../logic/types";
import { DEBUFF_ICON, TRUTH_ICON } from "../icons";

export function ActionBadge({ action, big }: { action: ActionLabel; big?: boolean }) {
  const meta = ACTION_META[action];
  return (
    <span
      className={`action-badge ${big ? "action-badge--big" : ""}`}
      style={{ ["--abc" as string]: `var(${meta.colorVar})` }}
    >
      <span className="action-badge__icon" aria-hidden>
        {meta.icon}
      </span>
      <span className="action-badge__label">{meta.label}</span>
    </span>
  );
}

// デバフのステータスアイコン(assets/)。傷/領域などアイコン未提供の種別は何も描画しない。
export function DebuffIcon({ kind, label }: { kind: DebuffKind; label: string }) {
  const src = DEBUFF_ICON[kind];
  if (!src) return null;
  return <img src={src} alt={label} className="dicon" />;
}

// 真(青い球) / 偽(赤い?) のアイコン。
export function TruthIcon({ truth }: { truth: Truth }) {
  return (
    <img
      src={TRUTH_ICON[truth]}
      alt={truth === "true" ? "真" : "偽"}
      className="ticon"
    />
  );
}
