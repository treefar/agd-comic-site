**只用檔案讀寫工具，不要執行任何指令（shell、npm、node、python 一律不准）。測試由主控跑。**

# 實驗室小遊戲共用規格（v2：加星等）

先完整讀 `orders/_mg-contract.md`（第一版規格），**全部照舊遵守**，只有下面列出的地方不同或新增。

## 0. 範圍鎖（取代第一版第 0 節）
- 只能寫：你這張工單指定的 `lab/<id>/` 資料夾。
- 只讀不改：`src/`、`mg/`、`research/`、`orders/`、`refdocs/`。
- 不准碰其他 `lab/` 子資料夾、不准建立 `lab/` 以外的檔案。

## 1. 情境
玩家在《六樓出口》走廊走進一間真實存在的實驗室，在實驗室裡玩一個 60 秒小遊戲。遊戲的名稱、教學文字、結束時的專長知識，都要扣住這間實驗室在做什麼（工單會寫）。玩法本體借舊遊戲改，**不要重新發明玩法**。

## 2. 對外介面（第一版加三樣東西）
```js
window.EXIT6_MG["<id>"] = {
  title: "…", skill: "…", seconds: 60,
  lab: "D06xx 實驗室名稱",
  // 星等：宿主依這個算 1～3 星。★1＝win；★2＝score >= score2；★3＝onEnd 回傳 flawless === true
  stars: { score2: 數字, flawless: "第三顆星的條件，10 字內，例如：零失誤過關" },
  mount(root, api) {
    // 結束時只呼叫一次：api.onEnd({ win: true/false, score: 數字, flawless: true/false })
    return { destroy() {} };
  },
};
```
- `flawless` 的判定要寫在 rules.js 的純函式裡（例如 `isFlawless(stats)`），test.cjs 要測。
- `score2` 要設成「認真玩、正常程度的玩家約一半能拿到」的分數；在 README 寫明你怎麼估的。
- 贏（`win`）的門檻要讓第一次玩的高中生大約 60 秒內有機會過；不能亂按就過。

## 3. 容器規則（新增，很重要）
- **不准改 `root` 本身的任何 style**（position、width、height、transform、background 都不准）。宿主給的 root 已經撐滿 16:9 舞台。
- 需要定位就在 root 裡面自己建一個 `div`，設 `position:absolute; inset:0`，所有東西放在它裡面；震動效果也只動這個內層 div。
- `destroy()` 後 root 必須是空的。

## 4. 從 src/ 借舊遊戲的方式
- `src/retro/games/*.html` 依賴 `src/retro/engine/retro-core.js`、`retro-audio.js`：需要的引擎函式**複製進 game.js**（或 `lab/<id>/lib/`），不可引用 `src/` 路徑，不可載入 retro-shell.css／js。
- 原檔的遊戲名稱、`location.href` 跳轉、教學面板、存檔（localStorage）全部拿掉。
- 保留原本的玩法手感與果汁，只改：時間上限 60 秒、三階難度、情境文字、對外介面。

## 5. 驗收條件（每條 yes/no，主控逐條檢查）
1. `lab/<id>/` 有 index.html、game.js、rules.js、test.cjs、README.md，`lab/<id>/` 以外沒有變動。
2. `node --test lab/<id>/test.cjs` 全過，至少 7 個測試，包含：勝利條件、失敗條件、三階參數遞增、固定 rng 可重現、`isFlawless` 正反例、score2 是正整數。
3. 程式裡沒有 `location.href`、`alert(`、`localStorage`、`import `、`fetch(`、`<img`、`data:image`、`root.style`。
4. 雙擊 index.html 能玩完一局；試玩頁顯示 win、score、flawless 與算出來的星數（★☆☆）並有「再玩一次」。
5. 畫面右下角 `GRAYBOX`；配色只用規格六色；不出現任何既有遊戲名稱或商標。

## 6. 失敗路徑
做不完就交能跑的部分，README 最後寫「未完成：…」。不確定的決定照最保守做法，寫進 README「待主控確認」。

## 7. 交件格式
完成後只回 `WROTE <相對路徑> <行數>` 清單。
