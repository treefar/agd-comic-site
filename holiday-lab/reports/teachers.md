# 老師，這格謝謝你：子代理交付報告

日期：2026-10-22。分支 codex/hg-teachers。僅本機候選試作，不push、不碰main、不刪檔、不修改交接C節。

## 驗收逐條

| 項目 | yes/no | 證據 |
|---|---|---|
| 先測試失敗再實作 | yes | 初始命令退出1，ERR_MODULE_NOT_FOUND，pass 0 / fail 1 |
| 純邏輯拒絕錯誤與空白完成 | yes | 下列Node測試實際輸出 |
| 不同合法輸入會影響作品資料 | yes | artifact比較測試 |
| 三語可見字串與UI事件接線 | yes | zh/en/ja ctx測試，非瀏覽器截圖 |
| destroy移除frame/key訂閱 | yes | 三語ctx生命週期測試 |
| 程式語法檢查 | yes | node --check退出0，無輸出 |
| 整體Build | no | 所屬範圍只含模組/測試/本報告，共用外框與素材由主控整合後Build |
| 真實瀏覽器/行動裝置操作 | no | 等主控生圖外框整合後獨立驗收，不以fake ctx代替 |
| 美術使用者確認 | no | 素材由主控提供，候選狀態，不代替使用者確認 |

## 實際指令輸出

紅燈：

```text
node --test holiday-lab/tests/teachers.test.mjs
Error [ERR_MODULE_NOT_FOUND]: Cannot find module 'C:\agywork\agd-hg-teachers\holiday-lab\games\teachers.mjs'
ℹ tests 1
ℹ pass 0
ℹ fail 1
exit code 1
```

綠燈（本次實跑，以下完整stdout/stderr）：

```text
node --test holiday-lab/tests/teachers.test.mjs
✔ 漫畫不能空白完成，動作台詞和節奏都要配合 (0.8226ms)
✔ 三格台詞作品保留實際停頓，重新開始不殘留 (0.7986ms)
✔ 三語漫畫操作、錯誤阻擋與預覽清理：zh (1.6441ms)
✔ 三語漫畫操作、錯誤阻擋與預覽清理：en (0.2465ms)
✔ 三語漫畫操作、錯誤阻擋與預覽清理：ja (0.1865ms)
ℹ tests 5
ℹ suites 0
ℹ pass 5
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 77.4574
exit code 0

node --check holiday-lab/games/teachers.mjs
(無輸出)
exit code 0

git diff --check
(無輸出)
exit code 0
```

## 瀏覽器實際解法

每格設定 #teachers-action / #teachers-line / #teachers-pause，依序 listen / ask / 900；thanks / thank-patient / 1400；reply / reply / 1100。可按 #teachers-preview 觀看角色揭露與停頓，再 #teachers-save。第二格thank與thank-patient皆可；第三格reply-encourage也可。停頓合法範圍依格為700–1200、1100–1800、900–1500毫秒。

錯誤案例：初始reply/reply/400不能完成第一格。動作相符但台詞不符、停頓過短/過長都會有不同三語提示。

## 動態與資料

onFrame依玩家停頓時間揭露角色並水平緩移；reducedMotion直接顯示。結果每格caption是實際選擇台詞、duration是玩家pause+1400。

只用ctx.ui、生成Sprite與動態文字，沒有Canvas、SVG、程序繪製面板、外連音訊、帳號或真實學生作品。Sprite座標採中心點，width/height是舞台百分比；材質/台詞/座標/路線存入結果artifact。共享replay外框須按各shot的duration播放並呈現轉場；未以固定假作品代替玩家成果。
