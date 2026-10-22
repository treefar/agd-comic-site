# 燈影借位：模組交付

2026-10-22；分支 `codex/hg-lantern`。只新增本款模組、測試、報告。主控供給共同 UI、候選生圖、5 CG、音效與首頁整合；本款沒有自繪美術，也沒有網路請求。

## 實際玩法

三幕分別用紙鶴、紙魚、紙山。移動燈和紙、調整紙離屏幕的距離，黑影的位置與大小即時改變；第二幕加入與上一個影子的前後重疊。必須位置誤差不超過 3、距離誤差不超過 8，且重疊順序正確才記錄。這是易讀的舞台投影模型，不宣稱真實物理光學。

所有 sprite／replay 邊界座標都已轉成共用 renderer 的中心點語意。數學中的投影 x 就是畫面黑影中心。實際燈位、紙位、距離、順序均記進 artifact 與三幕 replay。

## 可直接操作的驗收路徑

1. 初次直接按 `lan-check`：仍在第 1 幕，顯示調整提示，不能得到結果。
2. `lan-lamp=20`、`lan-depth=20`、`lan-paper=57.5`、`lan-order=front`，按 `lan-check`。
3. `lan-lamp=20`、`lan-depth=50`、`lan-paper=43.3`、`lan-order=back`，按 `lan-check`。先試 front 應拒絕並提示重疊順序。
4. `lan-lamp=20`、`lan-depth=75`、`lan-paper=48.6`、`lan-order=front`，按 `lan-check`。
5. `ctx.complete` 收到三個實際 shots，replay 三幕；改燈位與紙位但維持投影位置，可以得到不同 artifact。

`lan-reset` 只重排目前一幕，保留先前完成作品。滑桿與選擇控制由共同 UI 提供鍵盤、滑鼠、觸控操作，沒有拖曳限定操作。

## 逐條驗收

| 驗收 | yes/no | 證據 |
|---|---|---|
| 純規則先紅後綠 | yes | 實作前執行同一測試，ERR_MODULE_NOT_FOUND，exit 1；實作後下列 4/4 |
| 非法值、初始連按不會通關 | yes | 第 2 測試與 mount 測試 |
| 三幕條件與前後順序有效 | yes | 第 3 測試，第二幕 front 不過關 |
| 不同輸入保留不同結果 | yes | 第 3 測試，燈位 +5 並補償紙位，artifact 不同 |
| 中英日控制回呼可完成、釋放後不再次完成 | yes | 第 4 測試，三種 lang 各完成一次，destroy 後圖片全部移除 |
| 畫面 sprite 中心與投影判定一致 | yes | 第 4 測試直接比較 lan-shadow.x 與 project().x |
| 整合 Build、實際瀏覽器、手機與美術審閱 | no | 本模組沒有共同外框與素材，交主控整合後獨立執行；未宣稱美術通過 |

## 實際指令輸出

工作目錄：`C:/agywork/agd-hg-lantern`

```text
node --test holiday-lab/tests/lantern.test.mjs
✔ projection changes with lamp and depth, not just object position
✔ invalid inputs do not alter state; initial submission cannot win
✔ three independent spatial tasks, failed ordering, and actual replay
✔ mount controls finish in all three languages; destroy prevents later completion
ℹ tests 4
ℹ pass 4
ℹ fail 0
exit code 0

node --check holiday-lab/games/lantern.mjs
(no output)
exit code 0
```

測試是 Node 純規則與模擬 ctx 整合，不能代替真實 DOM／畫面驗證。沒有執行 push、修改 main、刪檔或修改 C 節。
