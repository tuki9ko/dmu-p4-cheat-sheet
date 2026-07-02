import { useEffect, useRef, useState } from "react";
import {
  type ChaosBlock,
  type CurseBlock,
  type FilledGlobalInput,
  type ResolvedOutput,
  type WaterForkBlock,
  resolveGlobal,
} from "../logic/globalInput";
import { buildMacroText } from "../logic/macro";
import { ActionBadge, DebuffIcon, TruthIcon } from "./Badges";

const kindJa = (k: "chaosFire" | "chaosWater") => (k === "chaosFire" ? "炎" : "水");

export function ResultSection({ input }: { input: FilledGlobalInput }) {
  const resolved = resolveGlobal(input);
  return (
    <section className="results" id="results">
      <InputSummaryBar input={input} resolved={resolved} />
      <h2 className="section-title">処理順マップ</h2>
      <OutputTimeline resolved={resolved} />
      <h2 className="section-title">FF14 マクロ</h2>
      <MacroOutput resolved={resolved} />
    </section>
  );
}

function InputSummaryBar({
  input,
  resolved,
}: {
  input: FilledGlobalInput;
  resolved: ResolvedOutput;
}) {
  return (
    <div className="summarybar">
      <span className="schip">
        GC1 <TruthIcon truth={input.gc1Truth} />
      </span>
      <span className="schip">
        <DebuffIcon kind="waterCompress" label="水圧縮" />
        {input.gc1WaterTiming === "early" ? "早" : "遅"}
      </span>
      <span className="schip">
        <DebuffIcon
          kind={resolved.chaos.early.kind}
          label={kindJa(resolved.chaos.early.kind)}
        />
        <TruthIcon truth={input.honooTsunamiTruth} />
      </span>
      <span className="schip">
        GC2 <TruthIcon truth={input.gc2Truth} />
      </span>
      <span className="schip">
        <DebuffIcon
          kind={resolved.chaos.late.kind}
          label={kindJa(resolved.chaos.late.kind)}
        />
        <TruthIcon truth={input.chaos15Truth} />
      </span>
    </div>
  );
}

function OutputTimeline({ resolved }: { resolved: ResolvedOutput }) {
  return (
    <div className="timeline">
      {/* 加速度爆弾(先頭・早遅共通) */}
      <AccelStep accel={resolved.accel} />

      {/* 早グループ → 遅グループ */}
      <WaterForkStep block={resolved.waterFork.early} title="早グループ（水圧縮 / FL）" />
      <CurseStep block={resolved.curse.early} title="早い呪詛の叫声" />
      <ChaosStep block={resolved.chaos.early} title="早い混沌" />
      <WaterForkStep block={resolved.waterFork.late} title="遅グループ（水圧縮 / FL）" />
      <CurseStep block={resolved.curse.late} title="遅い呪詛の叫声" />
      <ChaosStep block={resolved.chaos.late} title="遅い混沌" />

      {/* 傷/領域 各自判断(脚注) */}
      <div className="tstep tstep--selfjudge">
        <div className="tstep__head">
          <span className="tstep__name">傷 / アラガン・死の超越</span>
        </div>
        <div className="selfjudge-note">{resolved.selfJudge.note}</div>
      </div>
    </div>
  );
}

function AccelStep({ accel }: { accel: ResolvedOutput["accel"] }) {
  return (
    <div className="tstep tstep--accel">
      <div className="tstep__head">
        <DebuffIcon kind="accelBomb" label="加速度爆弾" />
        <span className="tstep__name">加速度爆弾</span>
      </div>
      {accel.unified ? (
        <div className="tstep__single">
          <ActionBadge action={accel.gc1Action} big />
        </div>
      ) : (
        <div className="wf-actions">
          <div className="wf-cell">
            <span className="wf-cell__tag">GC1由来</span>
            <ActionBadge action={accel.gc1Action} big />
          </div>
          <div className="wf-cell">
            <span className="wf-cell__tag">GC2由来</span>
            <ActionBadge action={accel.gc2Action} big />
          </div>
        </div>
      )}
      <div className="note">
        ※早遅が混在。自分の由来GC（=真偽）で動く/動かないを判断。
      </div>
    </div>
  );
}

function WaterForkStep({ block, title }: { block: WaterForkBlock; title: string }) {
  return (
    <div className={`tstep tstep--${block.timing}`}>
      <div className="tstep__head">
        <span className="tstep__name">{title}</span>
      </div>
      <div className="wf-actions">
        <div className="wf-cell">
          <DebuffIcon kind="waterCompress" label="水圧縮" />
          <span className="wf-cell__tag">水圧縮</span>
          <ActionBadge action={block.waterAction} big />
        </div>
        <div className="wf-cell">
          <DebuffIcon kind="forkLightning" label="FL" />
          <span className="wf-cell__tag">FL</span>
          <ActionBadge action={block.forkAction} big />
        </div>
      </div>
    </div>
  );
}

function CurseStep({ block, title }: { block: CurseBlock; title: string }) {
  return (
    <div className={`tstep tstep--${block.timing}`}>
      <div className="tstep__head">
        <DebuffIcon kind="curseVoice" label="呪詛の叫声" />
        <span className="tstep__name">{title}</span>
        <TruthIcon truth={block.truth} />
      </div>
      <div className="tstep__single">
        <ActionBadge action={block.action} big />
      </div>
    </div>
  );
}

function ChaosStep({ block, title }: { block: ChaosBlock; title: string }) {
  return (
    <div className={`tstep tstep--${block.timing}`}>
      <div className="tstep__head">
        <DebuffIcon kind={block.kind} label={kindJa(block.kind)} />
        <span className="tstep__name">
          {title}（{kindJa(block.kind)}）
        </span>
        <TruthIcon truth={block.truth} />
      </div>
      <div className="tstep__single">
        <ActionBadge action={block.action} big />
      </div>
    </div>
  );
}

function MacroOutput({ resolved }: { resolved: ResolvedOutput }) {
  const text = buildMacroText(resolved);
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const taRef = useRef<HTMLTextAreaElement>(null);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("copied");
      window.setTimeout(() => setStatus("idle"), 2000);
    } catch {
      // 非HTTPS等で clipboard API が使えない場合は手動コピーに誘導
      taRef.current?.select();
      setStatus("failed");
    }
  };

  // 結果出力（＝マクロ内容が変化）と同時に自動でクリップボードへコピー。
  // 入力トグルのクリックというユーザー操作直後に発火するため大抵成功するが、
  // 権限が無い環境では手動コピー導線にフォールバックする。
  useEffect(() => {
    void copy();
    // text が変わるたびに再コピー
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const label =
    status === "copied"
      ? "コピーしました"
      : status === "failed"
        ? "失敗→Ctrl+Cで手動コピー"
        : "マクロをコピー";

  return (
    <div className="macro">
      <textarea
        ref={taRef}
        className="macro__text"
        readOnly
        rows={10}
        value={text}
      />
      <button type="button" className="macro__copy" onClick={copy}>
        {label}
      </button>
    </div>
  );
}
