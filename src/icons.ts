// assets/ 配下のデバフ/真偽アイコン(FF14ステータスアイコン)を取り込み、種別→URLに対応付ける。
import accelBomb from "../assets/AccelBomb.png";
import waterCompress from "../assets/WaterCompless.png";
import forkLightning from "../assets/ForkLightning.png";
import chaosFire from "../assets/ChaosFire.png";
import chaosWater from "../assets/ChaosWater.png";
import curseVoice from "../assets/CurseVoice.png";
import truthTrue from "../assets/True.png";
import truthFalse from "../assets/False.png";

import { type DebuffKind, type Truth } from "./logic/types";

// 出力で扱うデバフのアイコン(傷/領域は各自判断のためアイコン無し)。
export const DEBUFF_ICON: Partial<Record<DebuffKind, string>> = {
  accelBomb,
  waterCompress,
  forkLightning,
  chaosFire,
  chaosWater,
  curseVoice,
};

// 真(青い球) / 偽(赤い?) のアイコン。
export const TRUTH_ICON: Record<Truth, string> = {
  true: truthTrue,
  false: truthFalse,
};
