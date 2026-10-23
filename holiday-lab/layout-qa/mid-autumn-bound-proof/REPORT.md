# 中秋動態拒絕全文：固定 08 字型與紙框上界

結果：六組三語／320、1440 的真合法極端拒絕，全文、固定紙框、frozen geometry 均 YES。全域動態墨跡 gate 仍 NO：實際 font face 的輪廓／flow 算式成立，但「TrueType hinting 與 raster 後仍只多1px」不是已證定理；獨立複核指出這項前提缺口，保留在 `verification.json.global_gap`。這不主張找到唯一最大墨跡，也不是整個專案驗收。

## 逐條驗收

| 條件 | yes/no | 實際證據 |
|---|---|---|
| 固定 served 08，不借 06 當 08 | yes | 原始 `runs/2026-10-23T00-39-20-283Z/report.json`；`verification.json.prior06`：06 基址 8843，08 為 8845；runner/module SHA 相同，lab.css SHA 不同；06 枚舉只留對照，不納入 08 採樣。 |
| 由真 module/slider 規格求合法集合 | yes | 三 phase 各 time 27 值、position 27×161 對、size 23 值；保存實際 error 格式集合。沒有三欄 Cartesian。 |
| 小數、％、前後 literal、native prefixes | yes | 每 context 312 個數值與完整鄰接 literal 組；英文 prefix additivity 誤差 0.2265625px，故沒有拿數字等寬或無 kerning 當證明。 |
| 真 DOM、真 preview、真 submit | yes | 先 phase 0 `{time:900,x:21.5,size:20}` 通過，再 phase 1 `{time:300,x:0,size:10}` 拒絕；實際誤差 `900 / 56.0 / 16.0`，進度仍 1/3。 |
| 六個完整原始案例／樣本／圖片／SHA | yes | 原 raw 與六份 frozen sample JSON、六張原 viewport PNG 都留底；`verification.json.canonical_candidates` 含完整原 case、raw SHA、原圖 SHA。另 `hint-images.json` 是同一真合法拒絕重新操作後的六張 hint 圖，原 mobile viewport 因送出捲到控制區而看不到 hint，沒有拿那張圖假稱可見。 |
| 全文 reconstructed、unclipped、固定 safe | yes | 以實際 baseline、x 排序回組文字，六組逐字相同；原 raw 的 320 false 是 collector 直接串接逆序 measurements 的工具假紅，原 raw 不改。 |
| 原紙框不放寬 | yes | 原 panel SHA `66178574e9b6b0558f0f1e509e1a0e994e06b3a60296cb683f015f510ed951a5`；逐邊 source 紙框／slice48／border18，加 offsetHeight 最壞 rounding 的 safe inset <12px；證明用更窄的四邊 12px。 |
| 字形全域界不由六個例子外推 | yes | CDP 完整允許 alphabet 在六 context 都只有 `MicrosoftJhengHeiUIRegular`。本機 msjh.ttc face1 SHA 存 `font-bound.json`；fontTools 讀全 29641 個有輪廓 glyph，所有 composite 含在 head bbox，連所有 GSUB 輸出一併包住。 |
| GPOS／kerning 不可偷偷越界 | yes | 實檔 GPOS 僅 mark-to-base type4；允許 cmap 與所有 GSUB 輸出均不在 MarkCoverage。kern 僅 horizontal，所有 advance+kern ≥232 font units，所有 hmtx advance 非負。沒有負字距／額外 CSS transform。 |
| 任意行數的 normal flow 輪廓條件界 | yes | 字型在16px 的整 face bbox `[-2.6953125,-4.1796875,20.1875,15.90625]`，暫設1px raster guard 的條件算式成立；最大 advance20.8515625 < 最小content220。原 hint 是單一純文字 node、normal/anywhere/start、lineHeight25.6，實測單 font strut baseline18。最窄右側仍餘0.8125px；左18.3047、上19.0938、下20.4203px。這一項只證明輪廓／flow 算式，不把未證 hinting guard 當無條件 PASS。 |
| 輪廓→實際 hinted/raster 墨跡的1px全域前提 | no | 字型 outline bbox 不等於 TrueType hinting 後的墨跡 bbox。下一個最小補證是有限可達glyph／kern 的實際 native rendered bound，不必訊息 Cartesian。獨立 review 原檔留 `independent-review/`。 |
| stage/sprite 不壓 hint | yes | hint 在 game-layout 之前的 static flow；sprite offsetParent 是 relative stage，stage overflow hidden。六真案例 frozen geometry0；固定 source 檢查與實際 computed 記錄保留。 |
| source pre/post與 closure 當下都相同 | yes | runner、CSS、module、panel 四個來源逐 byte SHA；closure 又 fetch 核對同值。sampler function 與 asset map 都核對 freeze06 原 SHA。 |
| 唯一最大 width／height／area 已求出 | no | 未做此主張。提供的是可包住所有合法動態拒絕全文的字形／flow 上界與六真極端 witness。 |
| 跨字型／跨作業系統／整個專案已通過 | no | 證明只限固定08、這個實檔face與16px、目前三phase/slider；任一來源／字型變動就失效。 |

## 實際指令與輸出

```text
node holiday-lab/layout-qa/mid-autumn-bound-proof/check.cjs
NO zh/320 ... complete=false; unclipped=true; fixedSafe=true; geometry=0
YES zh/1440 ... complete=true; unclipped=true; fixedSafe=true; geometry=0
NO en/320 ... complete=false; unclipped=true; fixedSafe=true; geometry=0
YES en/1440 ... complete=true; unclipped=true; fixedSafe=true; geometry=0
NO ja/320 ... complete=false; unclipped=true; fixedSafe=true; geometry=0
YES ja/1440 ... complete=true; unclipped=true; fixedSafe=true; geometry=0
SOURCE_STABLE=true; NATIVE=3/6; GLOBAL_BOUND=NO
```

以上是第一段診斷的原輸出，保留工具假紅與當時尚未加入 font 檔案證明的 NO，沒有改成全綠。之後只讀回核原 sample，依 baseline/x 重組全文；未重跑六個 frozen sample，也沒改真狀態。

```text
python -X utf8 holiday-lab/layout-qa/mid-autumn-bound-proof/font-bound.py
{"postscript_name":"MicrosoftJhengHeiUIRegular","glyphs_checked":29641,
 "whole_face_outline_css_px":[-2.6953125,-4.1796875,20.1875,15.90625],
 "minimum_advance_after_kern":232,"all_cmap_present":true}

node holiday-lab/layout-qa/mid-autumn-bound-proof/capture-hints.cjs
ACTUAL_HINT_IMAGES=6

node holiday-lab/layout-qa/mid-autumn-bound-proof/close-proof.cjs
YES zh/320: font-face global padding margins={"left":18.3046875,"right":0.8125,"top":19.09375,"bottom":20.4203125}; true native complete; geometry0
YES zh/1440: ... same margins; true native complete; geometry0
YES en/320: ... same margins; true native complete; geometry0
YES en/1440: ... same margins; true native complete; geometry0
YES ja/320: ... same margins; true native complete; geometry0
YES ja/1440: ... same margins; true native complete; geometry0
GLOBAL_BOUND=NO; actual6/6 geometry0; conditional_outline_flow=YES; universal1px_hinting_premise=UNPROVEN
```

完整最後輸出在 `output-closure.txt`，字型輸出在 `output-font.txt`。第一次未指定 UTF-8 的 Python 因 cp950 讀 JSON 失敗；改用 `-X utf8` 後才成功，沒有使用失敗結果。

`font-bound.py` 是唯讀字型技術驗證，沒有複製字型、改字型、畫 UI。沒有產品、contract、sampler、map 變更；沒有 push、main、刪檔或 Unity 操作。圖片已實際打開檢視日文320 hint與英文1440畫面；不代替使用者的美術確認。
