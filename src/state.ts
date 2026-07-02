import { type Timing, type Truth } from "./logic/types";
import {
  type ChaosSourceKind,
  type GlobalInput,
  emptyGlobalInput,
} from "./logic/globalInput";

export function initialState(): GlobalInput {
  return emptyGlobalInput();
}

// ===== Actions =====
// 各入力は3状態(未選択/A/B)。同じ値を再度選ぶと未選択(null)に戻すトグル挙動。
export type Action =
  | { type: "setGc1Truth"; value: Truth | null }
  | { type: "setGc1WaterTiming"; value: Timing | null }
  | { type: "setHonooTsunamiKind"; value: ChaosSourceKind | null }
  | { type: "setHonooTsunamiTruth"; value: Truth | null }
  | { type: "setGc2Truth"; value: Truth | null }
  | { type: "setChaos15Truth"; value: Truth | null }
  | { type: "reset" };

export function reducer(state: GlobalInput, action: Action): GlobalInput {
  switch (action.type) {
    case "setGc1Truth":
      return { ...state, gc1Truth: action.value };
    case "setGc1WaterTiming":
      return { ...state, gc1WaterTiming: action.value };
    case "setHonooTsunamiKind":
      return { ...state, honooTsunamiKind: action.value };
    case "setHonooTsunamiTruth":
      return { ...state, honooTsunamiTruth: action.value };
    case "setGc2Truth":
      return { ...state, gc2Truth: action.value };
    case "setChaos15Truth":
      return { ...state, chaos15Truth: action.value };
    case "reset":
      return emptyGlobalInput();
    default:
      return state;
  }
}
