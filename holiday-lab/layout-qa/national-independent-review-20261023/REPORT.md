# 國慶 error-longest：獨立唯讀補證評估

2026-10-23。建議下一步先做 **36 筆正常 UI 投影／尺寸校準，加 3 筆既有桌機 paint 旗標精準重現，合計上限 39 筆**，先決定能否合法拆分 owner 與省去無效 paint 掃描。這是待批准方案，本輪新增 native 為 0；不應直接開 5,492,196 次完整 frozen sampler，更不能把小校準改稱全域 error-longest 通過。

本輪只新增本目錄報告、證據摘要與純函式測試。未開 browser、未觸碰勞動 full、產品、舊證據、coverage、sampler、contract 或 map，未 commit／push／刪檔。

## 先修正舊證據的解讀

最關鍵的缺口不是只有「字串很多」。既有 `pilot-02/report.json` 的十筆真頁中，**index 1、3、5 直接含 target 的 `PAINT_HIT_TARGET_UNRESOLVED`**：

| index | context／phase | 原 target | 原旗標 |
| --- | --- | --- | --- |
| 1 | en／1440／0 | island-readout，text-14 | `PAINT_HIT_TARGET_UNRESOLVED image:island-scene-1/text-14` |
| 3 | zh／1440／1 | island-readout，text-14 | `PAINT_HIT_TARGET_UNRESOLVED image:island-scene-0/text-14` |
| 5 | ja／1440／2 | island-readout，text-14 | `PAINT_HIT_TARGET_UNRESOLVED image:island-scene-1/text-14` |

三個桌機 clone context 的 30 筆亦全部有原旗標，含 readout 相關 paint unresolved。原 `pass:true` 核的是真頁／clone 的幾何、computed style、字型一致性及文字完整性，**沒有要求原 violations 清空**。不能把這些旗標歸入「明確 non-target scroll」；它們命中 target，必須另有精確因果解釋。

本輪對四份本機實檔 `games/national-day.mjs`、`runner.mjs`、`lab.css`、`assets/ui/panel.png` 逐一算 SHA，與舊 source receipts 全相同。十張原 PNG SHA 亦逐一命中舊 `verification.json`。**沒有重新查 served URL**，不可將本機比對說成現在的 served body 驗證。細節與原完整 flags 在 `review-evidence.json`。

## 完整有限域與精確 owner 投影

已讀產品 `national-day.mjs`、runner 實作與 CSS，再比對 fast-domain 原模型。輸入由正常 slider 的 step=1 限制：camera −20…20，fore／mid／far −30…30；三個可互動 phase；order normal／reversed。完整邏輯控制態 55,837,326。

| semantic owner／正常 UI selector | 精確文字依賴 | 每語 distinct 文字／owner |
| --- | --- | --- |
| `#island-readout` | phase、camera、mid、far、視線 suffix | 915,366 |
| `#game-hint`，限 capture 拒絕後 | 原 capture 優先分支 order／blocked／camera／coast／ridge | 5 |
| `#island-task` | phase，原三語模板 | 3 |
| `#game-progress` | phase，字面 `${phase} / 3` | 3 |
| `output[for="island-fore"]` | fore 的原 `input.value` 字串 | 61 |
| `output[for="island-mid"]` | mid 的原 `input.value` 字串 | 61 |
| `output[for="island-far"]` | far 的原 `input.value` 字串 | 61 |
| `output[for="island-camera"]` | camera 的原 `input.value` 字串 | 41 |

output 沒有固定元素 id；原 sampler 的 `layout-owner-*` 是當筆 DOM 採樣生成值，**不得把 `layout-owner-16` 永久別名成 camera**。未來每筆要由上述 `output[for]` selector 取得實際 `dataset.layoutOwner`，將 mapping 原樣綁入證據。slider output 的 tabular-nums CSS 也不代表 readout 的數字等寬。

readout 的精確計數仍為 `3×41×61×61×2=915,366／語`，六個語寬 context 共 5,492,196。mid 與 far 必須使用**同一 camera** 下原 frame／toFixed(1) 的耦合值，不能任意拼單欄聯集。fore 只以 `abs(f.fore−f.subject)>=14` 的 suffix 進 readout；order、misses、shots 內容不進 readout 字串，shots／歷史只透過 phase 間接影響。每個 readout 均有 reversed order 的真拒絕見證。

原 capture 順序是 order → blocked → camera → coast → ridge → ok。完整拒絕 hint＋readout joint 每語 1,830,117，六 context 10,980,702；分支數逐筆由原規則重算為 order 915,366、blocked 457,683、camera 401,868、coast 49,776、ridge 5,424。正常 clear 的 615 組成功不冒稱拒絕。

若未來證明 owner 相對幾何與控制／paint 因果可拆開，八個動態 owner 的文字域合計是 **915,601 target 字串／context**，六 context 5,493,606。這只是條件式「文字工作量」，**不是現已證明的幾何減域，也不是 native 工作單**。靜態 island-rule／label／choice／button 原文不變，仍須由 full-case geometry／捲讀證據涵蓋，不能從報告刪掉。

純函式反例已實跑：phase0、camera0、mid0、far0、fore30、reversed 與 fore29、normal，兩者 readout 完全相同，fore output 不同，hint 分別是 order 與 camera。故「相同 readout」不足以認定整頁／四個 output／hint／pressed state 等價。

## 舊 native 證據能支持什麼

- 10 筆正常 UI 真頁都由合法操作到三個 phase 的拒絕；真 readout 與來源模板相同。原真頁／clone 的 readout 相對行幾何、原 safe、computed longhands 與 CDP faces 在十例吻合。
- 10 real＋10 calibration clone＋60 probe 是 **80 份 readout owner receipts**，不是 80 份全 case gate；舊 `measure()` 只回傳 readout node、原 flags 等，沒有保留完整 sample.nodes／blockers 供現在獨立重算全 case geometry。
- `init()` 與 `clone()` 明寫 viewport height=1000；手機六真例與手機 30 probes 為 320×1000，不能填 320×900。十張 PNG 是 `#island-readout` 元素裁切圖，本輪逐張讀 header 得手機約216×80、桌機305×54，**不是 viewport screenshot**，也沒有完整頁畫面證據可證假遮擋。
- 60 probe 只改技術 clone 的 readout 字串；其他 heading／hint／slider outputs／sprite 保留各 context seed。它們對 readout 字串換行量測有用，不能證明所有 joint readout＋hint 或控制幾何投影。
- 舊來源只綁四份 SHA；native 的 CDP faces 比對可作舊十例參考，不等於新完整字型檔／browser runtime freeze。舊 source／PNG／首次 fatal 都保留。

## 先做的最小可實作校準：39 筆上限，未授權

六 context 固定 zh/en/ja × 320×900／1440×1000。全部用正常 slider、choice、capture 與合法前幕成功 recipe，不直接改真頁 state/text、時鐘或樣式。

每 context 先排六筆：

1. phase0：camera0、mid0、far0、fore30、reversed，得到 order。
2. 同一 phase／camera／mid／far／fore，切 normal，得到 camera。與第1筆 readout 相同，hint 不同，檢查 hint 高度變化對 readout 相對安全幾何的影響。
3. 第1筆只改 fore29，仍 reversed／order。readout 相同而 output 不同，檢查 slider／pressed／sprite 因果。
4. phase1：camera0、mid0、far0、fore0、normal，得到 blocked。
5. phase2：camera12、mid30、far30、fore30、normal，得到 coast。
6. phase2：camera12、mid1、far30、fore30、normal，得到 ridge。

上列 36 筆包括三幕、五個拒絕分支、兩種 suffix、相同 readout 的兩種反事實對照。再精準重現原 index1／3／5 的桌機 recipe 各一筆，補原 target paint unresolved 的因果證據，總上限39。若重複 recipe 經逐欄相等可去重，不另加隨機例。**這39筆不是最大字串候選，也不能單獨關閉 error-longest。**

每筆保留完整原 case/sample/flags、全部 target owner mapping、geometry、DOM／inputs before-after、CDP faces／font files／source receipts、固定尺寸 viewport PNG、所有相關 scroll ancestor／scroll state、target 與祖先 computed longhands。對照採原完整 frozen sampler；若要比較 fast-draft，另在同源技術 clone 執行並物理區隔，不能用 fast 自己證 fast。

通過條件逐項 yes/no：原六尺寸正確；目標文字全文由原source重算一致；全部target行／Range／baseline／advance／ink／safe與原法逐欄吻合；同readout反事實的相對讀值幾何不變或其變化可被明確納入模型；全case geometry無新增錯誤；未知/target flags 未被清洗；來源／fonts／DOM前後穩定。任何反例即停，不擴充長批掩蓋。

## paint 因果補證優先於百萬字串

來源線索足夠具體：原 sampler `imageBounds` 取 **未裁切** `getBoundingClientRect()`，其後拿原 image AABB 與 text ink 求交；產品 national sprites 都在 `.stage` 下，而 `.stage` 有 `overflow:hidden; isolation:isolate`。CSS desktop 的 stage 與 controls-paper 分欄、gap20；mobile 分列。大幅平移的 sprite 原 AABB 可以跨入 controls，即使實際可繪區仍被 stage 裁切，故有形成 unresolved 的機制。

這是**根因假說＋可驗證條件**，目前不能替原flags洗白。每個重現應保存 raw image AABB、完整 clip ancestor computed／矩形、clip後可繪區、target 原 ink與safe、兩者交集、實際 paint hit與 scroll proof。若 clip後 bounds 與 target ink 為空集，且來源／computed證明無可逃出clip的濾鏡、外部覆蓋或不同 containing block，才可另設獨立的 `target_paint_clear_by_clip_proof`。原全局 flags／pass 仍照存。若目標或 clip 不可證，一律 NO，繼續原完整法。

若因果條件能成為逐筆可重算的守門，之後技術 probe 可保留原 Range／baseline／ink／safe／clip／control blockers，省去對不相交 stage 圖片的無效逐圖 paint 掃描。這比重跑數百萬次 full-page sampler 更接近真正需補的部分。

## 全域最大值還差哪一步

39筆校準只能決定方法能否拆分，不能把915,366文字縮成字數最長、NN.N幾種樣式或10例。readout 的實際字型／換行／墨跡上界仍未證明，現在 error-longest 應維持 NO。

通過投影後優先兩條可驗證路徑：

1. **精確保留 readout 有限域，減少每筆成本**：保留915,366索引與同camera耦合，用原版面同源clone逐批做僅target的已校準原生量測；hint五種、heading/progress三種、四output共224值另做小域 owner jobs。這不聲稱減少readout字串數，但避免10,980,702次joint full-page法。正式runner仍須先有scope/freeze/存儲與明確批准，不由本評估啟動。
2. **先研究能否作精確行片段／字型包絡證明**：對來源模板的合法字串語法、實際瀏覽器斷行與整段shaping建立可重算的有限自動機／保守墨跡包絡，再以獨立正常UI校準。不能假設逐字advance可相加、tabular等寬、pair kerning足以涵蓋所有shaping，也不能由小樣本直接宣布投影定理。這條尚無可執行證明／已知縮域筆數，成本不應先押在這裡。

output若因果投影成立，最多224 targets/context，共1344個owner-string jobs；正常反覆reversed capture可在61組輸入掃過三個−30…30 output，camera41值併在前41組，共366 context-input jobs。這仍需逐selector目標捲讀、保留原case與所有flags；不能因output只短數字就略過。來源能提供如此小的語意域，無需把55,837,326個控制態全部native重跑。

## 本輪實測與下一步

`node --test holiday-lab/layout-qa/national-independent-review-20261023/projection.test.cjs` → **6 pass、0 fail、exit0**，實際stdout在 `tests-output.txt`。測試直接載入產品純函式與真mount，使用無DOM的ctx接收器；涵蓋原完整域計數、三語各10組分散tuple、三幕五分支合法拒絕、readout相同但hint/output不同的反例、runner實際owner/clip來源線索，以及舊target paint flags。**這是來源語意測試，不是layout/native或字型證明。**

下一步應先由主控審查39筆校準範圍與paint因果條件，寫新專用freeze/scope後才執行；本目錄沒有collector、approval或任何預設長批入口。舊fast-domain、readout pilot與所有既有coverage保持原狀。
