# 玩具聲音偵探：子代理交付報告

日期：2026-10-22。分支 codex/hg-children。僅本機候選試作，不push、不碰main、不刪檔、不修改交接C節。

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
node --test holiday-lab/tests/children.test.mjs
Error [ERR_MODULE_NOT_FOUND]: Cannot find module 'C:\agywork\agd-hg-children\holiday-lab\games\children.mjs'
ℹ tests 1
ℹ pass 0
ℹ fail 1
exit code 1
```

綠燈（本次實跑，以下完整stdout/stderr）：

```text
node --test holiday-lab/tests/children.test.mjs
✔ 材質與時間必須都吻合，不能憑空完成 (0.7881ms)
✔ 三段收音，重播保留實際時間且拒絕超範圍 (0.9187ms)
✔ 三語UI連接、錯誤不完成與預覽清理：zh (1.5829ms)
✔ 三語UI連接、錯誤不完成與預覽清理：en (0.1942ms)
✔ 三語UI連接、錯誤不完成與預覽清理：ja (0.1666ms)
ℹ tests 5
ℹ suites 0
ℹ pass 5
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 76.0276
exit code 0

node --check holiday-lab/games/children.mjs
(無輸出)
exit code 0

git diff --check
(無輸出)
exit code 0
```

## 瀏覽器實際解法

三次依序設定 #children-material = wood / metal / paper，#children-cue = 700 / 1200 / 1700，按 #children-preview 等 2.6 秒，再按 #children-save。range 用 input event，choice 用 change event（主控若以按鈕組呈現，請依value選項點選）。誤差容許±100毫秒，改成740/1240/1740同樣能過，結果artifact與聲音marker不同。

錯誤案例：初始paper+300直接按save會被拒絕；木玩具配metal，或wood+100，也不能過。

## 動態與資料

onFrame按毫秒推進玩具移動/碰撞與聲音cue；wood/metal/paper只在真正經過玩家設定時間才送ctx.sound，無預先響聲。靜音仍有材質文字、碰撞target與聲音marker。

只用ctx.ui、生成Sprite與動態文字，沒有Canvas、SVG、程序繪製面板、外連音訊、帳號或真實學生作品。Sprite座標採中心點，width/height是舞台百分比；材質/台詞/座標/路線存入結果artifact。共享replay外框須按各shot的duration播放並呈現轉場；未以固定假作品代替玩家成果。
