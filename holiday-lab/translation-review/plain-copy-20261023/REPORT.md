# 已審12個保義翻譯：獨立本機分支

2026-10-23，source_agent: codex。工作樹 `C:/agywork/agd-plain-guide-copy`，分支 `codex/plain-guide-copy`，基底 `d16d2ebc76652f59cff08ed6b223da4bf6ebec83`。

已精準套用核准的12個譯值：日文7、英文5；其他16個候選與全部其他字典鍵值保持原樣。不改日期、資格、處室原稱、學制、人名、字級或字型。單次本機建置 `.measure-plain-copy-20261023-01` 可在 <http://127.0.0.1:8864/> 審閱，指南 <http://127.0.0.1:8864/?lang=ja#/students/guide>。這是本機measurement版，尚非發布批准。

## 精準內容

| ID | 語言 | 實際修正 |
| --- | --- | --- |
| JA-ABSENCE-01 | ja | 長期休暇改長期欠席，對應請假情境 |
| JA-ABSENCE-02 | ja | 長期欠席、事後の欠席申請，保原承辦與考試提醒 |
| JA-ABSENCE-03 | ja | 詳細段落中的長期休暇改長期欠席 |
| JA-EFFECTIVE-DATE-01 | ja | 有効期間（発行日）改有効開始日，保生效日期原意 |
| JA-MAKEUP-01 | ja | 再履修／単位認定改不足科目の追加履修／認定，不擅加已修課或學分限制 |
| JA-APPLICATION-DOCUMENT-01 | ja | 自己推薦書改自伝（自己紹介・経歴をまとめた書類），保留自傳文件類別 |
| JA-CLEAR-BUTTON-01 | ja | 空結果說明引用實際按鈕「条件をリセット」 |
| EN-CERT-RECOGNITION-01 | en | 區分畢業門檻認列與 financial awards or subsidies，不增加學分認列暗示 |
| EN-ENGLISH-RECOGNITION-01 | en | 認列的是送交的成績與證明，不一概翻成credits |
| EN-CONTACT-PLAIN-01 | en | intake window 改 responsible office |
| EN-CONTACT-PLAIN-02 | en | centralized contact window 改 central point of contact，仍保待確認 |
| EN-CONTACT-PLAIN-03 | en | appropriate contact window 改 appropriate office to contact |

精確中文key、前值、候選全文、JSON pointer及來源SHA均封存在 `input.json`，只採 `direct_semantic_subset=true`。來源為主樹 comprehensive-audit-20261023/translation-candidates.json；該檔已逐bytes複製作本工單preimage，未引用工作中的可變檔來重新定義預期。

## 逐條 yes／no 與實際命令

| 驗收 | yes／no | 實際證據 |
| --- | --- | --- |
| fresh副本基底與指定分支吻合 | yes | `git branch --show-current` → codex/plain-guide-copy；`git rev-parse HEAD` → d16d2ebc…ebec83（實作前） |
| 來源17檔等於審查封存SHA | yes | `node .../prepare.cjs` → PREPARE sourceSHA 17/17; CRLF-only aligned7; approved12; preimage6 |
| 修改前測試會抓到舊值 | yes | `node .../run-node.cjs red-v2` → actual exit1；tests16／pass2／fail14。12來源值與兩語生成字典失敗，其餘鍵與16候選保持檢查通過 |
| 只改12pointer與其他值不變 | yes | `node .../run-node.cjs green` → actual exit0；tests16／pass16／fail0 |
| Build後生成字典仍精準 | yes | `node .../run-node.cjs green-postbuild` → actual exit0；tests16／pass16／fail0 |
| 單次本機Build | yes | `node holiday-lab/build-review.mjs .measure-plain-copy-20261023-01 --measurement` → actual exit0，360files，app-X5G5MOSD.js；完整原輸出複製存build-output.txt，未重跑Build |
| 六組指南代表 | yes | browser第二批：zh/en/ja ×320/1440，15卡、30FAQ、水平溢位0、JS pageerror0 |
| 12譯值在實際DOM全文可見 | yes | 同批每值320/1440，合24/24目標，candidate全文與原值不再出現檢查；包含日文招生頁#/admission/selection、自傳實際可讀 |
| 日文空結果引用正確按鈕且可清除 | yes | 真填無結果搜尋，說明精確candidate；按鈕条件をリセット，點擊回15卡 |
| 目標文字載入後換行 | yes | 每目標先觸發layout、等fonts.ready與loaded，再Range逐字測行；孤字末行0、文字水平超出0；未縮字或改人名 |
| 目標字型有實際載入證據 | yes，限定範圍 | 24目標保存CSS樣式與CDP實際平台字型，Noto Sans TC Thin／Yu Gothic；兩代表目標圖已目視可讀。不是全字元fallback或全站cmap認證 |
| 來源與build在測後不變 | yes | `node .../verify-freeze.cjs` → FREEZE_UNCHANGED sources17/17 build360/360；freeze.json逐檔SHA |
| 全站／實體裝置／完整UI發布門檻 | no，非本次範圍 | 本次精準翻譯與所選頁；未重跑14遊戲或所有路由，未發布 |
| 獨立驗收完成 | no，交主控整合 | 已將freeze與8864入口交另一代理；本作者報告不預填獨立結果 |

上述 `.../` 均為 `holiday-lab/translation-review/plain-copy-20261023/`。Node原stdout、actual exit code與參數在 red-v2.json／green.json／green-postbuild.json；browser raw在 `browser-2026-10-23T10-17-30.156Z/result.json`，8/8 route、24/24目標、30PNG、sourceStable=true。

## 範圍保全與失敗紀錄

- fresh worktree的17封存來源中7檔只有CRLF位元差；prepare先證明正規化換行後全文完全相等，保存checkout-before原bytes，再依主控授權從主樹逐檔複製原bytes，核17/17 SHA。沒有用此操作覆蓋語意差異，沒有改主樹。
- 所屬內容修改僅4 JSON與2生成locale。其他5個raw換行對齊檔可能被Git顯示為M，但 `git diff --stat` 沒有它們的內容差異；不納入提交。
- 兩個翻譯生成腳本照現有規則執行。Build工具會記錄本副本的holiday-lab/latest-build.json，這是已授權Build的記錄副作用，留本機但不納入精準內容提交；不把這份metadata選移回主樹。
- 第一版Node assertion直接比較整本字典，RED輸出過大，原始red-output.txt與copy-test-red-v1.cjs.txt保留。後改為12個逐值測試及精準不符key列表，預期值仍來自同一input，非削弱斷言；新red-v2捕捉actual exit1再套用。
- browser第一批 `browser-2026-10-23T10-16-38.565Z` 因 `.sg-empty` 同時匹配卡片空結果div與FAQ空結果p，元素截圖strict mode失敗；4/5 route、16/24目標的partial資料原樣保留。保留browser-v1.cjs.txt，僅將截圖selector改為 `#student-topics .sg-empty`，未改產品或預期，第二批完成8/8、24/24。
- 不以8個所選route通過宣稱三語母語全文、招生資格最新或完整全站字型認證。其他10個單位名、4個學制、2個證照原名候選本輪不套；也未碰九筆個人資格待查。
- 本輪未push、發布、碰main、刪檔、C節、勞動節或Unity；未修改照片、遊戲、美術、CSS、中文版原文或其他工作者檔案。

## 本機重啟

```text
# cwd C:/agywork/agd-plain-guide-copy；先確認8864沒有既有listener，勿重複啟動
node scripts/serve-local-review.cjs --site=.measure-plain-copy-20261023-01 --dashboard=holiday-lab/dashboard/out --port=8864
```

本次server只bind127.0.0.1，exec session89741。最新回歸與UI結果均以此副本新build為來源，未把主樹8863舊畫面當本次證據。最終local commit與fsck結果另附COMMIT.md，整合與獨立驗收由主控處理。
