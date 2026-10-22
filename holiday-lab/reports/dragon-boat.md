# 粽葉折疊局：模組交付

2026-10-22；分支 `codex/hg-dragon-boat`。只新增本款模組、測試、報告。主控供給共同 UI、候選生圖、5 CG、音效與首頁整合；本款沒有自繪美術或網路請求。

## 實際玩法

這是虛構紙藝，不是包粽食譜。依左葉打底、右葉交疊、上葉封口的支撐順序操作；滑桿調整摺角，生成的葉面依投影寬度收窄／展開並覆蓋中間紙餡料。每片用三個覆蓋採樣點判定，紋路朝內且不壓到完全平躺才可固定。錯誤能重試，也能展開上一摺或全部重做。

三幕 replay 逐步累積玩家實際摺角，最後加繩；artifact 保留 leaf／angle／face／coverage。內部幾何以矩形左上點表示，所有 ctx.sprite 與 replay 輸出都轉為共用 renderer 中心點語意。

## 可直接操作的驗收路徑

1. 初次直接按 `fold-commit`：覆蓋不足，不能進到下一摺。
2. 選 `fold-leaf=top`、`fold-angle=160`、`fold-face=inside` 再按 `fold-commit`：順序錯誤，不能進到下一摺。
3. 選 `fold-leaf=left`、`fold-angle=140`、`fold-face=inside`，按 `fold-commit`。
4. 可按 `fold-unfold` 回到左葉，調整後再固定；或直接選 `fold-leaf=right`、`fold-angle=140`、face=inside，按 `fold-commit`。
5. 選 `fold-leaf=top`、`fold-angle=160`、face=inside，按 `fold-commit`，得到真實三摺結果。
6. 可另用 left/right=145、top=165 完成，結果角度與重播尺寸會不同。

所有控制均使用共同 UI 滑桿／選擇／按鈕，沒有只能拖曳才能完成的步驟。

## 逐條驗收

| 驗收 | yes/no | 證據 |
|---|---|---|
| 純規則先紅後綠 | yes | 實作前 ERR_MODULE_NOT_FOUND，exit 1；實作後下列 4/4 |
| 開葉不會覆蓋、摺葉會改變覆蓋 | yes | 第 1 測試 |
| 非法值、錯摺序、錯面向不會成功 | yes | 第 2 測試 |
| 展開回到上一階段、不同角度保留不同結果 | yes | 第 3 測試 |
| 中英日實際控制回呼含錯誤、展開與通關 | yes | 第 4 測試；destroy 後不重複完成且無遺留 sprite |
| 整合 Build、真實瀏覽器、手機與美術審閱 | no | 缺共同外框與素材，交主控整合後獨立執行；未宣稱美術通過 |

## 實際指令輸出

工作目錄：`C:/agywork/agd-hg-dragon-boat`

```text
node --test holiday-lab/tests/dragon-boat.test.mjs
✔ folded plane projects over paper filling; an open plane cannot cover it
✔ wrong order, wrong face, and invalid angle never complete
✔ unfold restores previous stage and the final artifact uses actual angles
✔ mount permits wrong fold, retry, undo and actual completion in three languages
ℹ tests 4
ℹ pass 4
ℹ fail 0
exit code 0

node --check holiday-lab/games/dragon-boat.mjs
(no output)
exit code 0
```

測試使用 Node 與模擬 ctx，不是瀏覽器實測。沒有 push、main 修改、刪檔或 C 節修改。
