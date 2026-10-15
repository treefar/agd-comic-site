**只用檔案讀寫工具，不要執行任何指令（shell、npm、node、python 一律不准）。測試由主控跑。**

# 小遊戲雛形共用規格（每張小遊戲工單都要遵守）

## 0. 範圍鎖
- 只能寫：你這張工單指定的 `mg/<id>/` 資料夾裡的檔案。
- 只讀不改：`src/`、`research/`、`orders/`、`refdocs/`。
- 不准碰其他 `mg/` 子資料夾、不准建立 `mg/` 以外的檔案。
- 只做插入、新增檔案或局部替換；從 `src/` 借程式時是「複製一份到 `mg/<id>/` 再改」，不改 `src/` 原檔。

## 1. 背景
《六樓出口》是台灣樹德科技大學動畫與遊戲設計系的招生網頁遊戲（寫實漫畫風）。玩家在走廊遇到老師，老師邀他玩一個 60 秒內的小遊戲，玩法要讓人「玩完就懂這個專長在做什麼」。目標玩家是高中生，很多人不太玩遊戲。

## 2. 檔案結構（每個小遊戲都一樣）
```
mg/<id>/index.html   單獨開啟就能玩的試玩頁（雙擊 file:// 也要能玩，不能用 ES module、不能 fetch）
mg/<id>/game.js      小遊戲本體（一般 <script>，不是 module）
mg/<id>/rules.js     純規則函式：不碰 DOM、不用 window，給 node 測試用
mg/<id>/test.cjs     node:test 測試（主控會跑 node --test mg/<id>/test.cjs）
mg/<id>/README.md    玩法、操作、難度三階、教了什麼專長知識、借了哪個舊檔哪幾段
```

### rules.js 匯出寫法（照抄這個外殼）
```js
(function (root) {
  const R = {
    // 這裡放純函式與常數
  };
  if (typeof module !== "undefined" && module.exports) module.exports = R;
  else root.EXIT6_RULES_<ID大寫> = R;
})(typeof globalThis !== "undefined" ? globalThis : this);
```
test.cjs 用 `const R = require("./rules.js");`，至少 6 個測試，涵蓋：勝利條件、失敗條件、難度三階的參數會遞增、亂數用傳入的 rng（給固定 rng 結果可重現）、邊界值。浮點比較一律給容許誤差，不寫「剛好等於」。

### game.js 對外介面（宿主遊戲會這樣呼叫，一字不差）
```js
window.EXIT6_MG = window.EXIT6_MG || {};
window.EXIT6_MG["<id>"] = {
  title: "小遊戲名稱",
  skill: "對應專長（例：電腦動畫）",
  seconds: 60,
  // root：一個空的 <div>，小遊戲只能在它裡面建立元素；api.onEnd 只能呼叫一次
  mount(root, api) {
    // api = { onEnd({ win: true/false, score: 數字 }), rng: () => 0～1 的亂數 }
    return { destroy() { /* 移除所有元素、事件、計時器、requestAnimationFrame、音訊 */ } };
  },
};
```
- 不准用 `location.href`、`alert`、`confirm`、`prompt`、`localStorage`。
- 不准把事件掛在 `window`／`document` 後不移除；`destroy()` 要全部拆掉。
- 畫面大小跟著 root 走（root 寬度可能 320px～1280px），用 ResizeObserver 或每幀讀 root 尺寸；Canvas 要處理 devicePixelRatio。

### index.html（試玩頁）
- 一個置中的 16:9 舞台 `<div id="root">`，載入 rules.js、game.js，然後 `EXIT6_MG["<id>"].mount(root, { onEnd: r => 顯示結果與「再玩一次」按鈕, rng: Math.random })`。
- 「再玩一次」要先 destroy 再 mount。

## 3. 玩法共同要求
1. **10 秒教會**：開場 3 秒用「示範動作」教（例如一隻半透明的手示範按住、拖曳），文字最多一行。不要文字牆。
2. **由淺入深三階**：0～20 秒第 1 階（幾乎不會輸）、20～40 秒第 2 階、40～60 秒第 3 階。畫面角落顯示目前第幾階。
3. **60 秒上限**，畫面上方有倒數條。時間到依分數或目標判定勝負。
4. **失敗不重罰**：輸了也要給一句這個專長的知識，並有再玩一次。
5. **操作**：滑鼠、觸控（pointer events）、鍵盤三者都能玩；按鈕或可點範圍至少 44×44 CSS 像素；手機直拿也能玩。
6. **果汁**（打擊感回饋）：成功時縮放彈跳＋粒子或星星、失敗時畫面輕微震動＋紅閃、分數跳字。`prefers-reduced-motion` 時關掉震動與大動作。
7. **音效**：只用 WebAudio 即時合成短音（嗶、叮、咚），不准載入音檔。第一次點擊後才建立 AudioContext。
8. **結束畫面**：顯示勝／負、分數、一句「這就是 <專長> 在做的事：……」。

## 4. 美術：灰盒
- 只用色塊、幾何形狀、文字；畫面右下角固定小字 `GRAYBOX`。不准用任何圖片檔、不准 base64 圖、不准 emoji 當主要角色。
- 配色只用：紙 `#f4ecd8`、墨 `#0f0d0a`、紅 `#e63946`、黃 `#ffd60a`、藍 `#1d4ed8`、灰 `#8a948e`。粗黑邊框（3px）＋硬陰影（4px 4px 0 墨色），呼應漫畫風。
- 字型 `"Noto Sans TC", "Microsoft JhengHei", system-ui, sans-serif`，不另外載入字型。
- 不准出現任何既有遊戲名稱、商標或角色名（包含你參考的舊檔裡的名字）。

## 5. 驗收條件（主控逐條檢查，每條 yes/no）
1. 五個檔案都存在於 `mg/<id>/`，`mg/<id>/` 以外沒有任何變動。
2. `node --test mg/<id>/test.cjs` 全過，且至少 6 個測試。
3. 雙擊 index.html 能玩完一局並看到結束畫面；「再玩一次」可以重開。
4. 程式裡沒有 `location.href`、`alert(`、`localStorage`、`import `、`fetch(`、`<img`、`data:image`。
5. destroy() 後 root 是空的，再 mount 不會有兩份計時器（分數不會跑雙倍）。
6. 375×812 直拿與 1280×720 都能看到完整舞台與按鈕。

## 6. 失敗路徑
做不完就交「能跑的部分」，README 最後寫「未完成：…卡在哪一條」。寧可少做，不交會噴錯的東西。不確定的設計決定照本規格最保守的做法，並寫進 README「待主控確認」。

## 7. 交件格式
完成後只回 `WROTE <相對路徑> <行數>` 清單。
