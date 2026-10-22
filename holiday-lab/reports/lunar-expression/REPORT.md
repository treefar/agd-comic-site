# 年獸表演課：從對數字改為表演意圖（2026-10-23）

分支 `codex/lunar-expression`，獨立工作樹 `C:/agywork/agd-lunar-expression`，由主代理 `329da94` 建立。所有權只含本遊戲模組、`lunar-new-year*.test.mjs` 與此報告目錄；共用 renderer／CSS／playthrough 及其他遊戲均未修改。

這輪落地 P1-03 第二款。三幕仍為驚喜、開心、拜年，但不再用四個固定 TARGETS 的距離判成功或分數。第三幕選擇「誇張喜劇／含蓄問候」會改變適合的五官與姿態；玩家不能用同一張表情直接切標籤通過。

## 玩家看得到的變化

| 幕 | 要做出的表演 | 畫面上的因果 |
|---|---|---|
| 驚喜 | 看到新作品，站著回應 | 大眼、斜眉、張嘴一起傳達驚喜；太早鞠躬會搶走表情 |
| 開心 | 朋友來了，從驚喜轉成笑容 | 放鬆前一幕的大眼，眉毛回平，讓笑口成為主角 |
| 拜年：誇張喜劇 | 向全場熱情登場 | 大眼、大笑、深鞠躬，動作與五官一起放大 |
| 拜年：含蓄問候 | 輕聲向朋友致意 | 柔和眼神、小笑、輕鞠躬；深鞠躬或誇張五官會收到具體原因 |

每次調整即更新五官與觀察文字，頂端提示同步更新，避免改好後仍留著上一個錯誤。跨幕保留滑桿值，讓玩家看見「同一張驚喜臉」為什麼需要改成開心。沒有貼出唯一答案；目前數值仍可讀，以便微調及鍵盤操作。

原生圖五官形狀沒有重畫。嘴是既有笑口，鞠躬沿用原版整體旋轉 rig，並非新增腰部骨架動畫；本輪不宣稱已達到自然肢體表演。眼、眉與嘴在旋轉時維持原本的臉部錨點。

## 規則與兩套完整作品

下表是供開發與驗證的寬條件，玩家頁面用白話因果說明，沒有將某個中心值藏成另一組答案。score=100 表示三幕符合自己選擇的 brief，不是創意高低評分；探索次數只記錄，不扣分。

| 幕／意圖 | 寬條件 |
|---|---|
| 驚喜 | 眼 ≥1.2、眉 ≤−8、嘴 ≥0.4、身體旋轉 ≤16° |
| 開心 | 眼 ≤1.05、眉 ≥−5、嘴 ≥0.6、身體旋轉 ≤18° |
| 誇張喜劇 | 眼 ≥1.1、眉 ≥−5、嘴 ≥0.7、身體旋轉 ≥22° |
| 含蓄問候 | 眼 ≤1.05、眉介於 −18～18、嘴介於 0.2～0.65、身體旋轉介於 8～26° |

以上均限制在原有滑桿與 rig 範圍：眉 −30～30、眼 0.5～1.5、嘴 0～1、身體 0～40°。邊界、非法與非有限數值均有測試。這是此原創卡通練習的導演規約，不宣稱能辨識真人情緒。

每格依序為「眉、眼、嘴、鞠躬」。

| 作品 | 驚喜 | 開心 | 拜年 | 第三幕意圖 |
|---|---|---|---|---|
| A | −30／1.5／1／0 | 22／0.6／1／4 | 18／1.4／0.9／38 | 誇張喜劇 |
| B | −10／1.2／0.5／10 | 0／1／0.7／12 | −10／0.6／0.3／12 | 含蓄問候 |

兩套三幕均實際通關，回放保留各自五官位置、旋轉、縮放與第三幕意圖。A 第一幕正是原審查 `player-review/browser-trial.cjs:31` 拒絕的誇張驚喜，這次不是另造近似值替代。

## 10 組代表輸出

完整輸入與 verdict：`ten-combinations.json`，均實際呼叫 `evaluateExpression`，逐組讀過語意。

| 幕／意圖 | 眉／眼／嘴／鞠躬 | 實際結果 |
|---|---|---|
| 驚喜 | −30／1.5／1／0 | YES，原審查誇張表演可讀 |
| 驚喜 | −10／1.2／0.5／10 | YES，較輕的驚喜也成立 |
| 驚喜 | −30／1／1／0 | NO：surprise-eyes，眼神未張大 |
| 驚喜 | 0／1.4／0.8／0 | NO：surprise-brow，眼大但眉仍平 |
| 開心 | 22／0.6／1／4 | YES，瞇眼大笑 |
| 開心 | 0／1／0.7／12 | YES，較輕的笑容 |
| 開心 | −30／1.5／1／0 | NO：joy-eyes，仍像前幕驚訝 |
| 誇張喜劇 | 18／1.4／0.9／38 | YES，大表情配大動作 |
| 含蓄問候 | −10／0.6／0.3／12 | YES，小表情配輕致意 |
| 含蓄問候 | 18／1.4／0.9／38 | NO：reserved-bow-high，同一誇張作品不符合輕問候 |

共 6 YES／4 NO。失敗回饋共有 16 種可見五官／姿態原因及 1 種非法設定提示；純測試涵蓋 18 個失敗情境，其中部份情境共用同一原因。

## 實際指令與輸出

先新增只呼叫舊 submit 的兩個期待案例，尚未改模組時：

```text
node --test holiday-lab/tests/lunar-new-year-expression.test.mjs
✖ the exact exaggerated surprise rejected in player-review now reads as surprise
✖ two visibly distinct complete performances and ending intentions work
tests 2 / pass 0 / fail 2 / exit 1
```

完整舊失敗 assertion 與 reason=`expression` 保留在 `red.txt`。

```text
node --test holiday-lab/tests/lunar-new-year*.test.mjs
tests 16 / pass 16 / fail 0 / exit 0
```

完整項目與最後實跑時間保留 `green.txt`。原有幾何、DOM ID 與 replay geometry 測試沒有刪除；舊 TARGETS import 改用測試自己的樣本，新增第三幕 choice mock。

```text
node holiday-lab/build-review.mjs .measure-lunar-expression-02 --measurement
MEASUREMENT ONLY: test build for layout capture; not cleared for packaging or delivery.
ui-policy: pass=true, assets=257, screens=9, errors=[]
MEASUREMENT_ONLY: .measure-lunar-expression-02; 356 files; no publication performed.
exit 0
```

完整輸出 `build02.txt`。建置出現原有 JSX duplicate color key 警告，本次未修改該處。只建立測量版，未打包交付、未跑過／未繞過交付 layout gate。

```text
node holiday-lab/reports/lunar-expression/browser-test.cjs
YES zh-320: reserved, three actual poses, wrong intent rejected, replay geometry, retry, muted
YES zh-1440: comic, three actual poses, wrong intent rejected, replay geometry, retry, muted
YES en-320: reserved, three actual poses, wrong intent rejected, replay geometry, retry, muted
YES en-1440: comic, three actual poses, wrong intent rejected, replay geometry, retry, muted
YES ja-320: reserved, three actual poses, wrong intent rejected, replay geometry, retry, muted
YES ja-1440: comic, three actual poses, wrong intent rejected, replay geometry, retry, muted
YES en-keyboard: reserved, three actual poses, wrong intent rejected, replay geometry, retry, muted
YES ja-reduced: comic, three actual poses, wrong intent rejected, replay geometry, retry, muted
TOTAL 8/8; errors=0
exit 0
```

`browser.json`、`browser-output.txt` 與每組三幕／結果／回放 PNG 是最後 fresh02 證據。程式自行使用獨立 8817，遇到占用會停止，不接管既有 server；結束只關自己啟動的程序。第一版測試 8/8 後實看發現舊 hint 未同步，已修正並改新 build 重跑，舊結果另存 `run01/`，不可作最後版證據。

## yes／no 驗收

| 驗收項目 | yes／no | 證據與限制 |
|---|---|---|
| 移除唯一 TARGETS／距離評分 | yes | 搜尋全部引用後改模組與對應測試；其他遊戲、歷史報告不動 |
| 原誇張驚喜先被拒、修正後可接受 | yes | 原審查確切值，red 0/2 → green 16/16、DOM A 第一幕 |
| 兩套顯著不同完整三幕通關 | yes | A/B 表，JSON 實際 poses 與圖面 |
| 第三幕新增真實意圖選擇 | yes | 八組均先選錯意圖而被拒，再改成符合畫面的意圖完成 |
| 調一個五官就有可觀察差異 | yes | DOM 僅改眼睛，style 與具體觀察文字均改變 |
| 探索不隱藏扣分、失敗不重置滑桿 | yes | 各組 3 次失敗＋3 次成功，attempts=6、score=100；逐幕讀取實際 range |
| 三語 320／1440、鍵盤與減少動態 | yes | 8/8，鍵盤用真正 Tab／Enter／Home／方向鍵，不注入狀態 |
| 回放顯示實際五官 input／問候意圖 | yes | 三鏡的 left/top/width/height/transform 逐筆等於對應 live sprite；caption 比對所選意圖 |
| 靜音、重試、無 Console/page error、無缺圖／水平溢出 | yes | 全八組；Audio.play 次數為 0；重試初值 0/1/0/0 |
| 原 expressionProps 安全 rig 未變 | yes | 函式原始文字與 `original-rig.txt` 完全相同；既有幾何測試繼續通過 |
| 新畫面已實看 | yes | 實看 zh1440 A 的第1/3幕、zh320 B 第3幕、en320 B 第3幕與 ja320 A 減少動態第3幕；不等於美術簽認 |
| 真實墨跡／安全區 layout gate 通過 | no | 新文字與 choice 尚須主代理 collector 採樣；未造報告、未打包 |
| 真人學生盲測、30–90秒體驗與使用者美術確認 | no | 代理知道 fixtures；本輪沒有真人學生或使用者確認 |
| P1-03 至少三款整體完成 | no | 跨年＋年獸兩款已落地，第三款與真人理解觀察仍待完成 |

## 主代理整合注意

- 新可見節點：`lny-observation`；第三幕 `lny-intent`，選項 `lny-intent-0`（comic）／`lny-intent-1`（reserved）。原 `lny-reference` 改為質性方向，不是數值卡。
- collector 需採各幕初始／成功／具體失敗提示，以及第三幕兩種意圖、最長英日換行；桌機 controls 仍沿用既有可捲區，不能拿全頁截圖未捲到底視為所有按鈕都入鏡。
- 現行共用 qa/playthrough 的第三幕 `[0,.7,.5,30]` 會因含蓄問候鞠躬太深而被拒；整合時須換成上表 A/B 真實意圖與表演。此工單不擅改該檔。
- 測量 build 在此獨立工作樹產生 `locale-en.js`、`locale-ja.js` 與 `latest-build.json` 變動，未納入提交、不還原、不刪除。
- 測試前後 served 模組 SHA-256 相同：`556a459a44487cc8c8a8207f416ae193e5a6ec3bf4a12df9d865f9905127a170`。`source-receipt.json` 同列原 rig 未變及素材 SHA。Git 若改 checkout 換行，主代理以實際 served 位元組重新建立來源收據。

沒有啟動 Unity、push、碰 main、刪檔，或修改 shared renderer／CSS／其他遊戲。
