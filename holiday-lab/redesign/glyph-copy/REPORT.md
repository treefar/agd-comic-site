# 中日文字缺字：先保留字體、必要才改句（第一批）

2026-10-22，固定預覽 `http://127.0.0.1:8805/`（`.review-local-08`）。本輪只寫 `holiday-lab/redesign/glyph-copy/*`，沒有改 locale、資料、文案或 CSS，沒有 push、main、刪檔、停止伺服器。

**本批沒有確認的中日漢字／假名缺字，待改句清單為 0。** 沒有把正常 fallback 當成缺字，也沒有為了改句而改人名、校系名稱或政策名稱。這是下列有限範圍的字形可用性結果，不是整站所有內容、所有裝置均已通過。

## 實際涵蓋

- 中／日各 6 個網站狀態：首頁、展開全部 details 的在校指南／FAQ、課程地圖、作品總覽、家長指南、首頁師資錨點。師資錨點仍是完整首頁，不能算每位教師詳頁已驗證。
- 15 款遊戲 × 中／日 × 開場／選單／初始操作頁，共 90 狀態。操作後提示、後續關卡、結果與回放文字不是本輪字型矩陣的涵蓋範圍。
- 390px 中／日展開導覽、1440px 日文展開導覽，共 3 狀態；不是手機全部指南／全部遊戲字型驗證。
- 合計 **105 個狀態、11,138 個 CSS 可見文字節點、1,462 種漢字／假名字元、77,608 組字元／文字節點配對**。同節點內重複字只算一次；不是頁面實際 glyph 總數。

採用紀錄：[最新主批次索引](latest.json)、[導覽批次索引](nav-latest.json)、[可攜文字與實際字型精簡證據](evidence/corpus.json)、[字元與字型對照](coverage.json)。字元表覆蓋 77,608／77,608，unknown 0、缺字候選 0、字型解析錯誤 0。原始scan.json保留本機；精簡corpus可獨立重算上述總數。

## 方法及可信範圍

每個 CSS 可見文字父節點記錄原文、tag/class、computed 字型／字重／描邊／行高、CDP 實際平台字型與 glyphCount；再以那些實際字型的 cmap 聯集逐字核對。隱藏的收合內容不算已驗，所以指南先展開，導覽另開選單。CSS 可見包括頁面下方尚未捲入視窗的內容。

自訂 webfont 復用前一輪 127 份回應證據，主批只另存 13 份新遇到子集、導覽另遇 2 份；原始網址、SHA-256 在 scan.json。系統字型讀本機 `C:/Windows/Fonts` 的 cmap，含中、日語 name table 別名，所以 `微軟正黑體` 與英文家族名不會誤算未知。沒有用 fonts.check 當字形證據。

父節點可能包含混合字體。本方法確認該節點實際採用字型具備所需 glyph，不能把聯集可用性當成每個字一定由哪個 font 渲染，也不能排除 CSS 裁切、描邊太粗、字間擠壓。這些需看截圖與實際畫面。此輪已檢視最新中日首頁及上一項追加 QA 的日文390回放截圖，沒有宣稱逐張讀完全部長頁，也沒有代替使用者美術驗收。

## 新版實際用字與處理決定

|位置／原文|實際字型證據|等義替換提案|原因／專名規則|
|---|---|---|---|
|中文主標「畫出來，動起來。」|Reggae One，實際8 glyphs；其 cmap 可用|保留原句|新版字型鏈已用現有 Reggae One 補足；沒有真缺字，不任意改標語|
|日文主標「描いて、動かす。」|Yu Gothic Bold，實際8 glyphs；其 cmap 可用|保留原句|現有日文備援鏈運作，不需要換字體或加長標語|
|「鄧樹遠」|Noto Sans TC，cmap 可用|保留原文|人名不能為避字而改名|
|「海外見學」|Noto Sans TC，cmap 可用|保留原文|不是缺字；保留使用者指定項目|
|「畢業門檻」|Noto Sans TC，cmap 可用|保留原文|制度用語不因外觀疑慮擅改|
|「四技日間部英文畢業門檻注意事項」|Noto Sans TC，cmap 可用|保留正式標題|來源文件名稱不應自行換句或刪字|
|日文「履修・認定」「卒業要件」|Yu Gothic，漢字／假名 cmap 可用|保留原文|一般說明可在真正缺字時換等義寫法，本批無此必要|

上表是已檢查後「保留」的判定，**不是假稱已找到七項缺字**。本輪沒有可提出「原句→替換句」的確認缺字案例。

後續若發現真正缺字：先附 URL、原句、缺字 codepoint、實際 font、cmap 與截圖；一般說明再提出短的等義改句，不改原意。人名、校系名稱、法規與政策正式名稱維持原文，透過既有合法備援處理。若同一字體大量缺字，再提出同角色、外形接近且字集可驗的候選比較，不能先換整站。前輪合法候選與授權已在 `../font-audit/REPORT.md`，本批沒有理由啟用替換方案。

## 診斷失敗與修正

初版在 hash 換頁後沿用診斷 data id，與新內容編號碰撞，把中文指南 footer 的「專任教師」「招生」「科技繁星」誤配到另一節點 Bangers，產生 10 筆假陽性；另未讀系統字型所有語言別名而產生 957 筆 unknown。這是採樣器缺陷，不能報產品缺字。

已在每次採樣先移除本工具加上的診斷 id，並讀完整字型 name 別名；完整102狀態全部重跑，再加3個導覽狀態。原始首輪留於 `runs/2026-10-22T15-00-24-891Z`，最終主批是 `runs/2026-10-22T15-03-00-833Z`，導覽是 `runs/2026-10-22T15-06-00-115Z`。沒有用刪檔掩蓋首輪錯誤。

## 實際指令與輸出

在 `C:/agywork/agd-holiday-prototypes`，需要8805預覽、bundled Playwright、Python fontTools／Pillow、前輪字體證據與本機系統字型。

```powershell
node holiday-lab/redesign/glyph-copy/scan.cjs
$env:GLYPH_NAV_ONLY='1'
node holiday-lab/redesign/glyph-copy/scan.cjs
$env:PYTHONIOENCODING='utf-8'
python holiday-lab/redesign/glyph-copy/coverage.py
python holiday-lab/redesign/glyph-copy/convert_evidence.py
node holiday-lab/redesign/glyph-copy/pack_evidence.cjs
node holiday-lab/redesign/glyph-copy/verify.cjs
node --check holiday-lab/redesign/glyph-copy/scan.cjs
node --check holiday-lab/redesign/glyph-copy/verify.cjs
git diff --cached --check -- holiday-lab/redesign/glyph-copy
```

重跑完整主批前需清除 `GLYPH_NAV_ONLY` 環境變數。實際輸出見 `scan-corrected-output.txt`、`nav-output.txt`、`coverage-final-output.txt`、`verify-output.txt`：

```text
TOTAL 102 pages; 13 new font responses; existing 127 response files reused
TOTAL 3 pages; 2 new font responses; existing 127 response files reused
PAGES 105 CJK_POSITIONS 77608 CMAP_VERIFIED 77608 UNKNOWN 0 MISSING_CANDIDATES 0 FONT_PARSE_ERRORS 0
WEBP 6 BYTES 1314642
RESULT 8 YES / 0 NO
```

Node 語法與 staged diff 檢查成功時空輸出、exit 0。

|驗收|yes／no|證據／限制|
|---|---|---|
|先保留既有字體、沒有直接改句或換字體|yes|產品檔未變更，本批0項確認缺字|
|105狀態具實際 computed／CDP／cmap及截圖紀錄|yes|scan.json、coverage.json、原始截圖與6張WebP|
|漢字／假名測試配對全部有實際字型cmap可用性|yes|77,608／77,608，unknown0，missing候選0|
|全部網站路由與每個資料詳頁完成|no|news/faculty/labs/admission/videos/stats/quiz/reels等個別詳頁尚未逐筆採樣|
|全部遊戲後續提示／結果／重播文案字型完成|no|本批僅開場、選單與初始控制；追加QA是功能驗證，不能自動算本批字型矩陣|
|所有標點、箭頭、emoji／所有Unicode完成|no|本批自動逐字比對聚焦漢字與假名；其他字元未取得同級覆蓋證據|
|手機指南全文／其他作業系統完成|no|只有三個展開導覽代表性手機／桌面狀態，系統字型是本機Windows|
|root後續final build複驗完成|no|本證據對8805 local-08，不冒稱後續build已驗|

## 版控證據與原始備份限制

6張代表 WebP 在 [evidence](evidence/manifest.json)：中日首頁、指南開頭、中日390展開導覽。總1,314,642 bytes；指南原圖過長，技術裁切為前2400px，保留原始完整PNG。每張轉檔來源絕對路徑、原始SHA、尺寸、裁切範圍、WebP SHA與參數均在 manifest，不重畫圖像／文字。

原始兩輪長頁PNG／新字型二進位合計約197MB，按root指示保留不刪，由範圍內 `.gitignore` 排除重複PNG／WOFF2及原始大份scan.json。可攜corpus保留全部採用文字、computed字體／字重、實際字型／glyphCount、tag/class；run-manifest保留原始JSON的本機位置、SHA、大小、採用狀態、來源雜湊、新字型網址／SHA。精簡證據、腳本、報告與代表WebP納版控，verify直接由corpus重算105／11138／1462／77608。

**被忽略的原始圖、原始scan.json與新字型檔沒有Git備份，跨機不能直接讀到全部原始圖，也不能只靠clone就重跑coverage.py。** clone後可讀精簡文字／metadata／代表圖與跑verify.cjs；完整重採樣須可用預覽與網路／本機字型，或先由root另行備份原始檔。沒有把本機路徑當成跨機保存完成。
