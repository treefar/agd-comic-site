# 新生漫畫走訪：子代理交付報告

日期：2026-10-22。分支 codex/hg-semester。僅本機候選試作，不push、不碰main、不刪檔、不修改交接C節。

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
node --test holiday-lab/tests/semester.test.mjs
Error [ERR_MODULE_NOT_FOUND]: Cannot find module 'C:\agywork\agd-hg-semester\holiday-lab\games\semester.mjs'
ℹ tests 1
ℹ pass 0
ℹ fail 1
exit code 1
```

綠燈（本次實跑，以下完整stdout/stderr）：

```text
node --test holiday-lab/tests/semester.test.mjs
✔ 校園走訪要到達窗口且依序辦事 (1.3382ms)
✔ 三站辦事完整旅程，路線不同則成品不同 (0.9057ms)
✔ 三語走訪、錯站阻擋、鍵盤替代與清理：zh (0.8922ms)
✔ 三語走訪、錯站阻擋、鍵盤替代與清理：en (0.1797ms)
✔ 三語走訪、錯站阻擋、鍵盤替代與清理：ja (0.1842ms)
ℹ tests 5
ℹ suites 0
ℹ pass 5
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 79.4999
exit code 0

node --check holiday-lab/games/semester.mjs
(無輸出)
exit code 0

git diff --check
(無輸出)
exit code 0
```

## 瀏覽器實際解法

起點1列3行。按 #semester-up 兩次、#semester-visit；#semester-right 四次、#semester-visit；#semester-down 兩次、#semester-left 兩次、#semester-visit。方向鍵也可（焦點在原生表單內時保留表單自身方向鍵行為）。座標是虛構5列3行漫畫示意，非真實校園導航。

錯誤案例：原地按visit或走錯站不能完成；走出地圖邊界不會移動；必須系辦→教室→作品室依序。

## 動態與資料

每一步更新舞台學生位置，三站重播由實際visit與route步數導出。繞路後artifact route不同；由父層提供在校指南正式辦理連結。未捏造真實校舍位置或法規。

只用ctx.ui、生成Sprite與動態文字，沒有Canvas、SVG、程序繪製面板、外連音訊、帳號或真實學生作品。Sprite座標採中心點，width/height是舞台百分比；材質/台詞/座標/路線存入結果artifact。共享replay外框須按各shot的duration播放並呈現轉場；未以固定假作品代替玩家成果。
