---
name: project-status
description: dmu-p4-cheat-sheet の現在地と次にやること（2026-06-26時点）
metadata:
  type: project
---

P4「おちょくりソウル」カンペ Web アプリ。Vite + React + TypeScript、静的デプロイ可。8人分のデバフ・真偽を入力→処理順マップ(2.1〜2.8)と各自行動を出力。`src/logic/`(純粋ロジック)・`src/state.ts`・`src/components/` 構成。`npm run dev` で起動、`npm run build` 通過済み。

設計→実装→レビューのワークフロー(`/build-ochokuri-cheatsheet`)で初版構築。レビューで仕様3.4との矛盾(個別デバフは1人2つ＝早枠2.3/遅枠2.6)を発見し修正済み(`personalEarly`/`personalLate`)。

**仕様変更#1 完了(2026-06-26):** プレイヤー単位入力を廃止し、デバフ単位のグローバル入力6項目(GC1真偽/GC1水圧縮早遅/1.3種別+真偽/GC2真偽/1.5真偽)に作り替え。全埋めで自動出力、変更で再出力。出力は処理順マップ(2.3〜2.8)+FF14マクロ(15行固定・最長18文字)。新ロジックは `src/logic/globalInput.ts`(resolveGlobal)・`src/logic/macro.ts`。PlayerCard/resolve.ts/validate.ts は削除。`docs/specification_change1.md` 参照。

**アイコン:** FF14ステータスアイコンPNGはリポジトリ直下の `assets/` に置く（src/assets ではない）。`src/icons.ts` で import して種別→URLにマップ（`DEBUFF_ICON`/`TRUTH_ICON`）。Viteが直下assets/からのimportをバンドルする。`src/vite-env.d.ts` で `*.png` 型解決。傷/領域はアイコン未提供（各自判断）。

**未確定で出力していない点(仕様未記載):** 暗黒光の盤面割り当て・方角、頭割り集合/散開の立ち位置、混沌の内外基準点と距離、加速度の移動方向、呪詛の発動者位置。固まれば座標出力に拡張可能。

コードは**未コミット**(working tree のみ)。[[avoid-frequent-questions]]
