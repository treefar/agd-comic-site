// 《六樓出口》新手引導規則：純函式，畫面層與測試共用
// 由淺入深三件事：第 1 圈手把手、異常由明顯到細微（排程在 game-core）、卡住時系主任分層提示

// 進到「有異常的那一站」時給多強的線索：2 強（畫面閃一下＋系主任探頭）、1 弱（只閃一下）、0 不給
// 第 1 圈強、第 2～3 圈弱、之後不給；連錯兩次（failStreak ≥ 2）就重新給弱線索，避免越玩越挫折
export function cueFor(lap, failStreak = 0) {
  const base = lap <= 1 ? 2 : lap <= 3 ? 1 : 0;
  return failStreak >= 2 ? Math.max(base, 1) : base;
}

// 卡住提示的層級：在異常站停越久、點錯越多，提示越具體；hintOn 為 false（老手圈）就不給
export function hintStage(seconds, misTaps, hintOn) {
  if (!hintOn) return 0;
  if (seconds >= 26) return 3;
  if (seconds >= 16 || misTaps >= 4) return 2;
  if (seconds >= 8 || misTaps >= 2) return 1;
  return 0;
}

// 第 2 層提示要說「在哪一帶」：依點擊範圍中心換成白話方位
export function areaOf(box) {
  const cx = box.x + box.w / 2, cy = box.y + box.h / 2;
  if (cy >= 65) return "畫面下方";
  if (cy <= 25) return "畫面上方";
  if (cx < 35) return "畫面左邊";
  if (cx > 65) return "畫面右邊";
  return "畫面中間";
}

// 系主任的分層提示（搞笑哀求風）；{area} 由 areaOf 填入
export const HINT_TEXT = {
  1: "拜託再看看嘛……這一站跟導覽時好像有一點點不一樣喔。",
  2: "給你一個提示就好：盯著{area}看看！",
  3: "好啦好啦，我幫你圈起來了，點那個發光的地方！",
};

// 教學分鏡：導覽圈前兩站手把手；key 對應畫面上要指的東西
export const COACH = {
  fwd: "按「往前」走出電梯",
  spot: "點點看發亮的地方",
  done: "這站看完了，按「往前」",
  loop1: "咦？這裡跟剛剛好像不一樣……覺得怪就直接點它！",
  lap2: "這圈看起來都很正常？那就一路「往前」走到底！",
};
