import { useReducer } from "react";
import { initialState, reducer } from "./state";
import { isFilled } from "./logic/globalInput";
import { GlobalInputPanel } from "./components/GlobalInputPanel";
import { ResultSection } from "./components/Results";

export default function App() {
  const [input, dispatch] = useReducer(reducer, undefined, initialState);
  const filled = isFilled(input);

  return (
    <div className="app">
      <header className="appheader">
        <h1 className="appheader__title">おちょくりソウル カンペ</h1>
        <p className="appheader__sub">
          デバフごとに入力 → 全項目が埋まると自動でマクロと処理順を出力
        </p>
      </header>

      <main className="main">
        <section className="inputs">
          <div className="section-bar">
            <h2 className="section-title">入力</h2>
            <button
              type="button"
              className="reset-btn"
              onClick={() => dispatch({ type: "reset" })}
            >
              リセット
            </button>
          </div>
          <GlobalInputPanel input={input} dispatch={dispatch} />
        </section>

        {filled ? (
          <ResultSection input={input} />
        ) : (
          <section className="valbar valbar--warn" aria-live="polite">
            <div className="valbar__msg">全項目を入力してください</div>
            <p className="valbar__hint">
              すべての入力欄が埋まると、自動でマクロと処理順マップを表示します。
            </p>
          </section>
        )}
      </main>
    </div>
  );
}
