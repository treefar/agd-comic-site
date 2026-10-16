// 《六樓出口》實驗室支線回歸測試：入口站點、星等（三條件各一顆）、成就與獎勵解鎖
// 用法：node --test scripts/test-exit6-labs.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { LABS, labAt, starsFor, createAchv, record, totalStars, titleFor, unlocked, TITLES, REWARDS, MAX_STARS } from "../exit6/labs.mjs";
import { STATIONS } from "../exit6/data.mjs";
import { TEACHERS } from "../exit6/teachers.mjs";

test("實驗室：六樓 5 間、代號不重複、各在不同站、不和 D0647 岔路（第 6 站）同站", () => {
  assert.equal(LABS.length, 5);
  assert.deepEqual(LABS.map((l) => l.code).sort(), ["D0604", "D0628", "D0631", "D0633", "D0637"]);
  assert.equal(new Set(LABS.map((l) => l.station)).size, 5);
  for (const l of LABS) {
    assert.ok(STATIONS[l.station], `${l.code} 站點不存在`);
    assert.notEqual(l.station, 6, `${l.code} 不能放第 6 站`);
    assert.match(l.mg, /^lab-d06\d\d$/);
  }
});

test("入口：只在循環圈出現；沒有實驗室的站回 null", () => {
  for (const l of LABS) {
    assert.equal(labAt(l.station, "loop")?.code, l.code);
    assert.equal(labAt(l.station, "tour"), null);
  }
  assert.equal(labAt(6, "loop"), null);
});

test("星等：沒過關 0 星；過關 1 星，分數門檻與零失誤各加 1 星", () => {
  const s = { score2: 500 };
  assert.equal(starsFor({ win: false, score: 9999, flawless: true }, s), 0);
  assert.equal(starsFor({ win: true, score: 100, flawless: false }, s), 1);
  assert.equal(starsFor({ win: true, score: 500, flawless: false }, s), 2);
  assert.equal(starsFor({ win: true, score: 100, flawless: true }, s), 2);
  assert.equal(starsFor({ win: true, score: 900, flawless: true }, s), 3);
  assert.equal(starsFor(null, s), 0);
  assert.equal(starsFor({ win: true, score: 900, flawless: true }, undefined), 2, "沒給門檻就不給分數星");
});

test("成就：每間只記最高星；低分不覆蓋；回報有沒有進步與新解鎖的稱號", () => {
  const st = createAchv();
  const a = record(st, "d0637", 1, 300);
  assert.equal(a.improved, true);
  assert.deepEqual(a.newTitles.map((t) => t.at), [1]);
  assert.equal(record(st, "d0637", 1, 200).improved, false);
  const b = record(st, "d0637", 3, 100);
  assert.equal(b.improved, true);
  assert.equal(st.labs.d0637.stars, 3);
  assert.equal(st.labs.d0637.best, 300, "最高分另外記，不被低分覆蓋");
  assert.equal(record(st, "d0637", 2, 999).improved, false, "星數變少不算進步");
  assert.equal(totalStars(st), 3);
  assert.equal(record(st, "ghost", 3, 1).improved, false, "不存在的實驗室不記");
});

test("稱號與獎勵：依總星數解鎖；滿星 15", () => {
  assert.equal(MAX_STARS, 15);
  assert.equal(titleFor(0), null);
  assert.equal(titleFor(MAX_STARS).at, MAX_STARS);
  for (let i = 1; i < TITLES.length; i++) assert.ok(TITLES[i].at > TITLES[i - 1].at, "稱號門檻要遞增");
  assert.deepEqual(unlocked(5).map((r) => r.id), []);
  assert.deepEqual(unlocked(REWARDS[0].at).map((r) => r.id), [REWARDS[0].id]);
  assert.equal(unlocked(MAX_STARS).length, REWARDS.length);
});

test("讀舊存檔：壞資料不讓遊戲壞掉、星數夾在 0～3", () => {
  assert.equal(totalStars(createAchv("亂碼")), 0);
  const st = createAchv({ labs: { d0604: { stars: 9, best: 5 }, ghost: { stars: 3 }, d0628: null } });
  assert.equal(st.labs.d0604.stars, 3);
  assert.equal(totalStars(st), 3);
});

test("實驗室入口與老師邀請可以同站，但按鈕位置不同（實驗室左下、老師右下）", () => {
  const shared = LABS.filter((l) => TEACHERS.some((t) => t.station === l.station));
  for (const l of shared) assert.equal(l.button, "left", `${l.code}`);
});
