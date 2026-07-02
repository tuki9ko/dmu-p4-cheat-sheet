export const meta = {
  name: 'build-ochokuri-cheatsheet',
  description: 'P4おちょくりソウル攻略カンペWebアプリを設計→実装→レビューで構築',
  phases: [
    { title: '設計' },
    { title: '実装' },
    { title: 'レビュー' },
  ],
}

const SPEC_CONTEXT = `
このプロジェクトは FF14「絶妖精乱舞」P4 の「おちょくりソウル」ギミック攻略カンペ(チートシート) Webアプリ。
必ず /home/lunafox/works/dmu-p4-cheat-sheet/docs/requires.md と CLAUDE.md を読んで、仕様の正解の参照元とすること。
確定済みの方針:
- 実装形態: Webアプリ (ブラウザで動く静的サイト。バックエンド無し)
- 利用モデル: パーティ全体入力。8人全員のデバフ・真偽・(早/遅)を入力 → 全体の処理順マップと各自の行動を出力
- 技術スタック: Vite + React + TypeScript + プレーンCSS。静的デプロイ(GitHub Pages等)前提。日本語UI。
- UIは「一瞬で読める」ことを最優先(視認性 > 情報密度)。攻略の合間に別画面/スマホで見る用途。
- ロール表記/方角はCLAUDE.mdの定義(MT/ST/H1/H2/D1-D4, N上=12時)に統一。
重要原則: 仕様(requires.md/CLAUDE.md)に明記されていない座標・立ち位置・ストラテジは推測で捏造しない。
出力は「処理方法(頭割り/1人受け散開/動く/動かない/見る/見ない/内側/外側/死者光側/生者光側 等)」と「処理順番」に限定し、未記載の具体座標は openQuestions として残す。
`

phase('設計')

const DOMAIN_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    typesCode: { type: 'string', description: 'TypeScriptの型定義コード一式(デバフ種別enum, 真偽, 早遅タイミング, Player, GimmickState等)' },
    resolutionTable: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          debuff: { type: 'string' },
          truth: { type: 'string', description: '真 または 偽' },
          action: { type: 'string', description: 'プレイヤーが取るべき具体行動ラベル' },
          notes: { type: 'string' },
        },
        required: ['debuff', 'truth', 'action', 'notes'],
      },
    },
    timelineEvents: {
      type: 'array',
      description: 'requires.md 3.3 発動フェーズ(2.1〜2.8)に対応する処理順',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          order: { type: 'number' },
          name: { type: 'string' },
          debuffsResolved: { type: 'string' },
          who: { type: 'string', description: '誰が動くか(該当デバフ保持者)' },
        },
        required: ['order', 'name', 'debuffsResolved', 'who'],
      },
    },
    inputModel: { type: 'string', description: '8人それぞれ何を入力させるか(デバフ/真偽/早遅)の入力モデル説明' },
    algorithmNotes: { type: 'string', description: '入力から各イベントの各自行動を導出するアルゴリズムの説明(早/遅の判定含む)' },
    openQuestions: { type: 'array', items: { type: 'string' }, description: '仕様に未記載で実装上の前提が必要な点' },
  },
  required: ['typesCode', 'resolutionTable', 'timelineEvents', 'inputModel', 'algorithmNotes', 'openQuestions'],
}

const UX_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    layoutDescription: { type: 'string' },
    components: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: { name: { type: 'string' }, purpose: { type: 'string' } },
        required: ['name', 'purpose'],
      },
    },
    colorPalette: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: { token: { type: 'string' }, hex: { type: 'string' }, usage: { type: 'string' } },
        required: ['token', 'hex', 'usage'],
      },
    },
    interactionFlow: { type: 'string', description: '入力→計算→出力のユーザー操作フロー' },
    outputDisplay: { type: 'string', description: '結果(処理順マップ/各自行動)の見せ方。視認性最優先' },
    responsiveNotes: { type: 'string', description: 'PC/スマホ両対応の方針' },
  },
  required: ['layoutDescription', 'components', 'colorPalette', 'interactionFlow', 'outputDisplay', 'responsiveNotes'],
}

const [domain, ux] = await parallel([
  () => agent(
    `あなたはドメインロジック設計担当。${SPEC_CONTEXT}
やること: requires.md の 3.2 デバフ表・3.3 タイムライン・3.4 付与法則を厳密に読み解き、このカンペアプリの計算ロジックを設計する。
- 各デバフ×真偽の「取るべき行動」を resolutionTable に網羅(死者の傷/生者の傷, アラガンフィールド/死の超越, 加速度爆弾, 水圧縮/フォークライトニング, 混沌の炎/混沌の水, 呪詛の叫声)。
- 3.3 の発動フェーズ 2.1〜2.8 を timelineEvents として順序付け、各イベントで誰がどのデバフをどう処理するか整理。
- 早い/遅い(加速度爆弾・水圧縮・FL・呪詛)をどう入力・判定するか algorithmNotes に明記。呪詛は1回目=早,2回目=遅で確定だが他はデバフ残り時間で判定する前提を整理。
- TypeScriptの型定義(typesCode)を実装で使える形で完成させる。
- 仕様に無い具体座標やストラテジは捏造せず openQuestions に残す。
構造化出力のみ返すこと。`,
    { label: '設計:ドメインロジック', phase: '設計', schema: DOMAIN_SCHEMA }
  ),
  () => agent(
    `あなたはUI/UX設計担当。${SPEC_CONTEXT}
やること: 8人パーティ全体のデバフ入力 → 全体処理順マップ + 各自行動 を「一瞬で読める」形で見せるWeb UIを設計する。
- 8人(MT/ST/H1/H2/D1-D4)それぞれの入力UI(デバフ選択・真偽トグル・早遅)を視認性高く。
- 計算結果は requires.md 3.3 の処理順(2.1〜2.8)に沿ったタイムライン/マップとして表示。
- ダーク基調で攻略中に別画面/スマホで瞬読できる配色(colorPalette を具体hexで)。真=青系・偽=赤系など直感的に。
- React + プレーンCSS で実装できる粒度でコンポーネント分割(components)を提示。
構造化出力のみ返すこと。`,
    { label: '設計:UI/UX', phase: '設計', schema: UX_SCHEMA }
  ),
])

log(`設計完了: resolutionTable ${domain.resolutionTable.length}件 / timeline ${domain.timelineEvents.length}件 / components ${ux.components.length}件`)
if (domain.openQuestions?.length) log(`未確定点(openQuestions): ${domain.openQuestions.length}件`)

phase('実装')

const buildReport = await agent(
  `あなたは実装担当。${SPEC_CONTEXT}
作業ディレクトリ /home/lunafox/works/dmu-p4-cheat-sheet にWebアプリを新規スカフォールドして完成させる(src/ は空、まだpackage.json無し)。

【採用設計】以下のドメイン設計とUX設計を忠実に実装すること。
=== ドメイン設計(JSON) ===
${JSON.stringify(domain, null, 2)}
=== UX設計(JSON) ===
${JSON.stringify(ux, null, 2)}

【実装要件】
- Vite + React + TypeScript。package.json / vite.config.ts / tsconfig.json / index.html / src/main.tsx / src/App.tsx を手書きで作成(npm create vite は対話的なので使わない。対話フラグ禁止)。
- 計算ロジックは src/logic/ などに型(typesCode)とともに純粋関数として分離し、UIから呼ぶ。
- 8人全員のデバフ・真偽・(早/遅)を入力 → requires.md 3.3 の発動順(2.1〜2.8)に沿った全体処理順マップと各自行動を出力。
- 配色・コンポーネント分割はUX設計に従い、視認性最優先。日本語UI。スマホ対応(レスポンシブ)。
- 仕様に無い具体座標は捏造しない。openQuestions の点はUI上で「未確定/要設定」等として無理に断定しない。
- 依存をインストールして本番ビルドが通ることを必ず検証: \`npm install\` 後 \`npm run build\`。型エラー・ビルドエラーをすべて解消すること。

【返答】作成したファイル一覧、npm run build の最終結果(成功/失敗と要点)、設計からの逸脱や前提があれば簡潔に。テキストで返す。`,
  { label: '実装:スカフォールド+コーディング', phase: '実装' }
)

log('実装フェーズ完了')

phase('レビュー')

const REVIEW_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    summary: { type: 'string' },
    buildPasses: { type: 'boolean' },
    findings: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          severity: { type: 'string', description: 'critical / major / minor' },
          file: { type: 'string' },
          issue: { type: 'string' },
          fix: { type: 'string' },
        },
        required: ['severity', 'file', 'issue', 'fix'],
      },
    },
  },
  required: ['summary', 'buildPasses', 'findings'],
}

const [logicReview, buildReview] = await parallel([
  () => agent(
    `あなたはロジック正当性レビュー担当(批判的に検証)。
実装済みコード(src/ 配下)を読み、/home/lunafox/works/dmu-p4-cheat-sheet/docs/requires.md の 3.2デバフ表・3.3タイムライン・3.4付与法則と突き合わせて、計算ロジックの誤りを探す。
特に: 各デバフ×真偽→行動の対応(3.2)が正しいか、発動順 2.1〜2.8(3.3)が正しく実装されているか、早い/遅いの扱い、呪詛=1回目早/2回目遅の確定、仕様に無い座標の捏造が無いか。
実際にコードを読んで具体ファイル・該当箇所を挙げること。構造化出力のみ。`,
    { label: 'レビュー:ロジック正当性', phase: 'レビュー', schema: REVIEW_SCHEMA }
  ),
  () => agent(
    `あなたはビルド/品質レビュー担当。
/home/lunafox/works/dmu-p4-cheat-sheet で \`npm run build\` を実行してビルドが通るか検証(必要なら npm install)。
さらにコードを読み、視認性最優先の原則・レスポンシブ・明らかなReact/TSのバグ・未使用/壊れた箇所を確認する。
buildPasses に結果を入れ、問題は findings に具体ファイルと修正案で。構造化出力のみ。`,
    { label: 'レビュー:ビルド/品質', phase: 'レビュー', schema: REVIEW_SCHEMA }
  ),
])

return {
  openQuestions: domain.openQuestions,
  buildReport,
  logicReview,
  buildReview,
}
