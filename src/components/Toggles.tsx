interface SegOption<T extends string> {
  value: T;
  label: string;
  cls: string;
  icon?: string; // 任意: ボタン内に表示するアイコンURL
}

interface SegProps<T extends string> {
  value: T | null;
  options: SegOption<T>[];
  onChange: (v: T | null) => void;
  ariaLabel: string;
}

/**
 * 未選択許容の3状態セグメントトグル(value: null | A | B)。
 * すでに選択中のボタンを再度押すと null(未選択)へ戻す。
 */
export function SegToggle<T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
}: SegProps<T>) {
  return (
    <div className="seg" role="group" aria-label={ariaLabel}>
      {options.map((o) => {
        const active = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            className={`seg-btn ${o.cls} ${active ? "is-active" : ""}`}
            aria-pressed={active}
            onClick={() => onChange(active ? null : o.value)}
          >
            {o.icon && <img src={o.icon} alt="" className="seg-btn__icon" />}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
