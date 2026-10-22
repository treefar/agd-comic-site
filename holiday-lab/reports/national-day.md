# 島嶼場景工作室：模組交付

2026-10-22；分支 `codex/hg-national-day`。只新增本款模組、測試、報告。主控供給共同 UI、候選生圖、5 CG、音效與首頁整合；沒有自繪美術或網路請求。

## 實際玩法

配置城市前景、海岸中景、山遠景，攝影機在左、中、右拍三個鏡頭。前景／中景／遠景視差係數分別為 0.9／0.5／0.2，學生係數 0.6。樹與學生中心橫向距離至少 14 才算視線清楚；還須符合景深順序、相機位置、海岸與山的對位，才允許拍下。上一鏡的配置保留，玩家因應新的攝影機位置調整。

所有輸出 sprite 與 replay 均為中心點座標，學生與樹中心和遮擋判定一致。replay 使用玩家三次實際 camera／fore／mid／far 設定，沒有固定假動畫。

## 可直接操作的驗收路徑

1. 初次直接按 `island-capture`：樹擋到學生，不能通關。
2. `island-order=normal`、`island-fore=22`、`island-camera=-12`、`island-mid=-1`、`island-far=-4`，按 `island-capture`。
3. 保留 fore=22、normal；`island-camera=0`、`island-mid=0`、`island-far=0`，按 `island-capture`。
4. 保留 fore=22、normal；`island-camera=12`、`island-mid=1`、`island-far=4`，按 `island-capture`。
5. 得到三次真實構圖及 replay。可把 fore 改為 26 重新玩，作品的樹／城市位置會不同。
6. 任一幕將 `island-order=reversed` 應拒絕。`island-reset-shot` 重設目前四個位置，不移除先前已拍鏡頭。

位置與選擇均由共同 UI 提供鍵盤／單指可用控制，不需要拖曳。

## 逐條驗收

| 驗收 | yes/no | 證據 |
|---|---|---|
| 純規則先紅後綠 | yes | 實作前 ERR_MODULE_NOT_FOUND，exit 1；實作後下列 4/4 |
| 三種景深視差幅度不同 | yes | 第 1 測試，前景 > 中景 > 遠景 |
| 遮擋、錯層次、非法值與初始拍攝不過關 | yes | 第 2 測試 |
| 三次相機位置與不同構圖留在 artifact | yes | 第 3 測試，[-12,0,12]，另一組 fore=26 的 artifact 不同 |
| 中英日 UI 回呼可完成、sprite 中心等於判定位置 | yes | 第 4 測試，直接比對主角中心，destroy 無遺留圖片 |
| 整合 Build、真實瀏覽器、手機與美術審閱 | no | 缺共同外框與素材，交主控整合後獨立執行；未宣稱美術通過 |

## 實際指令輸出

工作目錄：`C:/agywork/agd-hg-national-day`

```text
node --test holiday-lab/tests/national-day.test.mjs
✔ camera produces different parallax at three depths
✔ occlusion, wrong depth order, and invalid inputs prevent a shot
✔ three checked camera positions produce a real sequence, reset and alternate layout differ
✔ all three languages can capture using UI callbacks and sprite centers match sightline geometry
ℹ tests 4
ℹ pass 4
ℹ fail 0
exit code 0

node --check holiday-lab/games/national-day.mjs
(no output)
exit code 0
```

測試使用 Node 與模擬 ctx，不是實際畫面／真機測試。沒有 push、main 修改、刪檔或 C 節修改。
