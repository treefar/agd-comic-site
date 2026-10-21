// 《六樓出口》D0647 片場對決：純規則與指令辨識，不碰 DOM
// 全部原創：招式名取自電影鏡頭語言，不使用任何既有格鬥遊戲的角色、招式名、畫面（遊戲內也不出現「快打」兩字）
// 輸入代號：U D L R UL UR DL DR（方向）＋ A（動作鍵）

export const GAP_MS = 500;      // 指令中相鄰兩個輸入的最長間隔
export const WINDOW_MS = 1600;  // 整串指令要在這段時間內完成

// 玩家反擊招：cmd＝指令；cam＝打中時的運鏡演出與術語卡（一般電影語言，非特定作品）
export const MOVES = {
  pan:   { name: "搖鏡閃身", cmd: ["L", "A"], cam: { key: "pan", term: "搖鏡 Pan", def: "攝影機原地左右轉動，帶出空間與角色動線。" } },
  low:   { name: "仰角跳踢", cmd: ["U", "A"], cam: { key: "low", term: "仰角 Low Angle", def: "從下往上拍，讓角色看起來更強大、更有壓迫感。" } },
  dolly: { name: "推軌連段", cmd: ["D", "DR", "R", "A"], cam: { key: "dolly", term: "推軌 Dolly In", def: "攝影機實際往前移動靠近主角，讓情緒與張力一路升高。" } },
  dutch: { name: "荷蘭角迴旋", cmd: ["R", "D", "DR", "A"], cam: { key: "dutch", term: "荷蘭角 Dutch Angle", def: "把畫面故意拍斜，製造不安或失衡的感覺。" } },
};

// 邱老師的招式：預告台詞＋要用哪一招反擊
export const ATTACKS = [
  { id: "jab",  name: "場記板直拳", tele: "他舉起場記板往前衝！", counter: "pan" },
  { id: "kick", name: "長鏡頭掃腿", tele: "他壓低重心，準備一記長長的掃腿！", counter: "low" },
  { id: "take", name: "一鏡到底", tele: "他大喊：「這顆鏡頭不准 NG！」整個人衝過來！", counter: "dolly" },
];
export const FINISHER = { id: "last", name: "最後一顆鏡頭", tele: "他搖搖晃晃——把畫面拍斜，給他最後一擊！", counter: "dutch" };

export const QIU_HP = 5;
export const PLAYER_HP = 3;

// 斜方向可以省略：cmd 裡的斜向，若前後兩個方向剛好是它的組成（↓ 然後 →），沒按到斜向也算對
const parts = { UL: ["U", "L"], UR: ["U", "R"], DL: ["D", "L"], DR: ["D", "R"] };

// buffer：[{ k, t }]（由舊到新）；回傳是否在 now 時剛完成 cmd；gap／win 可放寬（判斷「方向對了只是太慢」用）
export function matches(buffer, cmd, now = buffer.length ? buffer[buffer.length - 1].t : 0, gap = GAP_MS, win = WINDOW_MS) {
  if (!buffer.length) return false;
  const last = buffer[buffer.length - 1];
  if (last.k !== cmd[cmd.length - 1] || now - last.t > gap) return false;
  let bi = buffer.length - 2, prevT = last.t, startT = last.t;
  for (let ci = cmd.length - 2; ci >= 0; ci--) {
    const want = cmd[ci];
    // 在時間間隔內往回找這個輸入
    let found = -1;
    for (let j = bi; j >= 0 && prevT - buffer[j].t <= gap; j--) {
      if (buffer[j].k === want) { found = j; break; }
      if (buffer[j].k === "A") break;          // 中間夾了動作鍵就斷掉
    }
    if (found < 0) {
      // 斜向可省略：前一個（較早）要求是它的第一個組成、後一個（較晚）是第二個組成時跳過
      // （斜向後面直接接動作鍵時，例如 → ↓ ↘ A，前一個對了也可省略）
      if (parts[want] && cmd[ci - 1] === parts[want][0] && (cmd[ci + 1] === parts[want][1] || cmd[ci + 1] === "A")) continue;
      return false;
    }
    prevT = buffer[found].t; startT = prevT; bi = found - 1;
  }
  return last.t - startT <= win;
}

// 對戰狀態
export function createFight(rng = Math.random) {
  return { qiu: QIU_HP, me: PLAYER_HP, round: 0, attack: null, deadline: 0, buffer: [], over: null, rng };
}

export const windowFor = (round) => Math.max(1500, Math.round(2600 * Math.pow(0.9, round)));

// 開下一回合：血剩 1 時出大絕（要用荷蘭角迴旋收尾）
export function nextRound(f, now) {
  f.round += 1;
  // 同一招不連續出兩回合（比較有變化）
  const pool = ATTACKS.filter((a) => a.id !== f.prev);
  f.attack = f.qiu === 1 ? FINISHER : pool[Math.floor(f.rng() * pool.length)];
  f.prev = f.attack.id;
  f.deadline = now + windowFor(f.round);
  f.buffer = [];
  return f.attack;
}

// 收到一個輸入：回傳 { type: "hit" | "miss" | "pending", move?, over? }
export function input(f, k, now) {
  if (f.over || !f.attack) return { type: "pending" };
  f.buffer.push({ k, t: now });
  if (f.buffer.length > 12) f.buffer.shift();
  const move = MOVES[f.attack.counter];
  if (matches(f.buffer, move.cmd, now)) {
    f.qiu -= 1; f.attack = null;
    if (f.qiu <= 0) f.over = "win";
    return { type: "hit", move, over: f.over };
  }
  // 按了動作鍵卻沒對上指令＝出招失誤；方向順序對、只是太慢，回報 slow 讓畫面說清楚
  if (k === "A") {
    const slow = matches(f.buffer, move.cmd, now, 60000, 60000);
    return { ...hurt(f), reason: slow ? "slow" : "wrong" };
  }
  return { type: "pending" };
}

// 時間到還沒反擊
export function timeout(f, now) {
  if (f.over || !f.attack || now < f.deadline) return null;
  return hurt(f);
}

function hurt(f) {
  f.me -= 1; f.attack = null;
  if (f.me <= 0) f.over = "lose";
  return { type: "miss", over: f.over };
}
