# 畢展策展練習：子代理交付報告

日期：2026-10-22。分支 codex/hg-exhibition。僅本機候選試作，不push、不碰main、不刪檔、不修改交接C節。

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
node --test holiday-lab/tests/exhibition.test.mjs
Error [ERR_MODULE_NOT_FOUND]: Cannot find module 'C:\agywork\agd-hg-exhibition\holiday-lab\games\exhibition.mjs'
ℹ tests 1
ℹ pass 0
ℹ fail 1
exit code 1
```

綠燈（本次實跑，以下完整stdout/stderr）：

```text
node --test holiday-lab/tests/exhibition.test.mjs
✔ 展位需有動線間距、入口視線、資訊 (0.9438ms)
✔ 策展位置資訊與順序可變，成品必須跟著改變 (1.0014ms)
✔ 三語策展操作、阻擋、巡覽與清理：zh (1.6572ms)
✔ 三語策展操作、阻擋、巡覽與清理：en (0.2073ms)
✔ 三語策展操作、阻擋、巡覽與清理：ja (0.1979ms)
ℹ tests 5
ℹ suites 0
ℹ pass 5
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 78.0094
exit code 0

node --check holiday-lab/games/exhibition.mjs
(無輸出)
exit code 0

git diff --check
(無輸出)
exit code 0
```

## 瀏覽器實際解法

依序 #exhibition-select = 0 / 1 / 2，分別設定 #exhibition-x = 20 / 50 / 80；每件 #exhibition-y = 30、#exhibition-info = yes。按 #exhibition-preview 可巡覽，再 #exhibition-save。也可把x全加2；排序由實際x/y決定，並非固定動畫→遊戲→互動。

錯誤案例：未動的作品在Y78擋住下方入口，無資訊卡也不過；任兩件中心距離<24不過；Y必須≤55。非法座標（Infinity/超出範圍）由純規則拒絕。

## 動態與資料

onFrame每1.4秒將生成燈具焦點依實際左右順序移往下一展位，4.2秒巡覽結束。展板、資訊卡位置依玩家配置更新。結果visitorOrder與鏡頭座標來自實際配置。

只用ctx.ui、生成Sprite與動態文字，沒有Canvas、SVG、程序繪製面板、外連音訊、帳號或真實學生作品。Sprite座標採中心點，width/height是舞台百分比；材質/台詞/座標/路線存入結果artifact。共享replay外框須按各shot的duration播放並呈現轉場；未以固定假作品代替玩家成果。
