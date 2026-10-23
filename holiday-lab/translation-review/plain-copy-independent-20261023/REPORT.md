# 十二處翻譯與指南換行：獨立驗收

source_agent: codex

2026-10-23。最新有效本機版本：`.measure-plain-copy-20261023-02`／`http://127.0.0.1:8865`。12 處翻譯精確核對通過；另授權的指南 CSS 換行修正，在以下實際頁面與狀態通過。這是機械差異、實際操作與指定畫面的審查，**沒有母語者確認，沒有上線或全站發布批准**。

最新有效 raw：`runs/2026-10-23T10-38-35-880Z/result.json`。原生 headless run-v4 真 exit0；唯讀 verify-v5 真 exit0；驗收器正反例 16/16，JSON delta 正反例 7/7。8 個頁面 context、24 次全文目標觀察、36 張 PNG。6 組指南的 46 份版面資料共 10364 次 leaf 文字觀察（含重複狀態），字型 loaded、孤字／單字母碎尾行 0、文字水平越界 0，Console/pageerror/requestfailed/HTTP400+ 皆空。

## 逐條 yes／no

| 條件 | yes／no | 證據 |
|---|---|---|
| 只套用核准的 12 個來源 pointer | yes | 4 份 JSON 遞迴差異恰為 12，逐筆 before/after 與主控原始 packet 相同；沒有加刪 key |
| 其他 16 個候選保持原樣 | yes | 每筆來源 pointer 與公開 locale 值均核對原始 expected_raw/current |
| 其他所有來源／字典 key 保持不變 | yes | 四份 JSON 全遞迴鍵值核對；英文 2315 key 僅變 5 值，日文 2344 key 僅變 7 值；其餘原 packet 來源逐 SHA 未變 |
| 生成 locale 與來源一致 | yes | 原生成器在記憶體重算，所有 write/mkdir 攔截，未寫產品；locale-en.js、locale-ja.js bytes 與重算結果完全相同 |
| 十二個值出現在實際頁面 | yes | 320/1440 各一次，共24；完整 candidate 及舊字串不再出現，CDP platform fonts 有實際 glyph |
| 指南 zh/en/ja ×320/1440 | yes | 六組各15卡、30題 FAQ 的初始結構；實測導覽、分類、身分、shortcut focus、FAQ鍵盤、搜尋與清除 |
| 指南指定狀態下所有 rendered leaf 均入量測 | yes | TreeWalker 葉文字 census、owner selector、Range每行、font、box 全保存；排除 aria-hidden 裝飾，沒有省略真實文字 |
| 孤字尾行／溢位／字型載入狀態符合規則 | yes | 所有保存的指南 layout 與24個 target loaded，CJK或英文字母單獨末行為0，頁面及文字水平溢位0 |
| 日文招生頁兩組改譯目標容器 | yes | `#/admission/selection` 的 `#admission-content` 全文，含「自伝（自己紹介・経歴をまとめた書類）」；其他招生舊文案不混入本批收尾 |
| 源檔、建置與 HTTP 前後一致 | yes | 18 local source、360 build逐檔核 SHA；15個實際HTTP來源與build bytes一致，before=after |
| 換行修正保留字型、字級與全部原文 | yes | 原 CSS bytes 完整保留後追加布局；font/size/zoom/transform 宣告序列與01完全同，沒有新增 display/hidden/clip/content 隱藏或替換文字 |
| 原01建置及真RED保留 | yes | 舊360檔逐 SHA 未變；02與01只有student-guide.css不同，另外359檔相同 |
| 所有15卡流程／30題答案與來源全展開獨立驗完 | no | 本輪獨立狀態為初始、第一題FAQ開關、改譯target所在展開流程、無結果與清除；未將作者其他全展開測試冒稱本代理完成 |
| 全英文完整單字都不會獨佔末行 | no | 完整單字末行另留資訊，不等同單字母碎尾；如完整「passing.」未裁切。32種文字／末行組合供目視複查 |
| 全站所有字元的 cmap／缺字均已驗完 | no | 核字型ready、target CDP fonts與代表原圖；未做全站字型涵蓋率／每個替補字型稽核 |
| 母語者或使用者已確認翻譯／視覺 | no | native_speaker_approved=false；本輪未取得這類確認 |
| 公開發布、push、main、C節或勞動節有操作 | no | 僅本機與本驗收目錄；沒有產品改動、build、push、刪檔、Unity或發布 |

## 精確12個變動

| ID | 語言 | 來源檔與內容方向 |
|---|---|---|
| JA-ABSENCE-01 | ja | messages：請假情境的長期休暇改為長期欠席 |
| JA-ABSENCE-02 | ja | messages：長期欠席／事後の欠席申請 |
| JA-ABSENCE-03 | ja | step-details：長期欠席 |
| JA-EFFECTIVE-DATE-01 | ja | step-details：有効開始日 |
| JA-MAKEUP-01 | ja | messages：不足科目の追加履修または認定 |
| EN-CERT-RECOGNITION-01 | en | student-guide-ui：recognition toward graduation requirements／financial awards or subsidies |
| EN-ENGLISH-RECOGNITION-01 | en | step-details-ui：submitted grades and certificates are recognized |
| JA-APPLICATION-DOCUMENT-01 | ja | messages：自伝（自己紹介・経歴をまとめた書類） |
| JA-CLEAR-BUTTON-01 | ja | messages：提醒使用「条件をリセット」 |
| EN-CONTACT-PLAIN-01 | en | student-guide-ui：responsible office |
| EN-CONTACT-PLAIN-02 | en | student-guide-ui：central point of contact to be confirmed |
| EN-CONTACT-PLAIN-03 | en | student-guide-ui：appropriate office to contact |

完整 JSON pointer、原文、譯文及所有其他鍵差異在 `source-audit-v2.json`；沒有用上述摘要取代逐筆檢查。基準是主控 current packet／preimage 的實際 SHA，並核對本 copy 的 input.json 與主控原始 packet 全物件相同，沒有從單一樣本推導其他對照。

## 實際指令與輸出

以下均在 `C:/agywork/agd-plain-guide-copy` 執行：

```text
node holiday-lab/translation-review/plain-copy-independent-20261023/run-v4.cjs
PASS guide-zh-320
PASS guide-zh-1440
PASS guide-en-320
PASS guide-en-1440
PASS guide-ja-320
PASS guide-ja-1440
PASS admission-ja-320
PASS admission-ja-1440
PLAIN_COPY_INDEPENDENT pass EVIDENCE C:\agywork\agd-plain-guide-copy\holiday-lab\translation-review\plain-copy-independent-20261023\runs\2026-10-23T10-38-35-880Z
NATIVE_EXIT=0
```

```text
node holiday-lab/translation-review/plain-copy-independent-20261023/verify-v5.cjs holiday-lab/translation-review/plain-copy-independent-20261023/runs/2026-10-23T10-38-35-880Z
{"pass":true,"contexts":8,"guide_contexts":6,"admission_contexts":2,"translation_values":12,"target_observations":24,"pngs":36,"guide_layout_samples":46,"guide_leaf_observations":10364,"source_files":18,"build_files":360,"source_build_manifest_sha256":"a10b2da304be8b9733ea6f0183be363334303c02a5a2e745780fefddcddf5337","receipt_sha256":"f27a00cc0ea753b99de985ba2706e4df38dd1db0e6bb18f18d91fab67bbf2616","scope":"exact12 local translated guide and admission review; all rendered guide leaf text in specified UI states; admission changed container only","native_speaker_approved":false,"public_release":false,"full_project_approved":false}
EXIT=0
```

```text
PLAIN_QA_RUN=<上列run的絕對路徑> node --test holiday-lab/translation-review/plain-copy-independent-20261023/verify-v5.test.cjs
tests 16 / pass 16 / fail 0 / skipped 0 / EXIT=0

node --test holiday-lab/translation-review/plain-copy-independent-20261023/delta.test.cjs
tests 7 / pass 7 / fail 0 / skipped 0 / EXIT=0
```

逐項完整 stdout：`run-v4-output.txt`、`verify-v5-output.txt`、`verify-tests-v5-output.txt`、`delta-tests-output.txt`。驗收器有真原始receipt與相同VM mutation harness未修改正例；負例涵蓋缺context／target／leaf、假orphan=false、loading字型、水平越界、source/build漂移、未操作FAQ、Console例外、假PNG SHA、錯譯文、偽母語或全站批准。不能以負例因環境缺漏而全拒絕當通過。

## 版本、SHA與失敗保全

- 01 原生真RED：`runs/2026-10-23T10-23-40-971Z`，首個zh320發現14處CJK孤尾（8快捷鈕＋6段落），真exit1後停批次，其餘未執行。`red-layout-minimal.json` 及 `red-zh320-00..13.png` 保存精確selector／行框／原圖SHA。
- 02 v2 工具失敗：`runs/2026-10-23T10-35-08-182Z`，初始全leaf通過，導覽selector誤匹配兩個語言連結，strict mode exit1；原方法與raw保留。
- 02 v3 工具失敗：`runs/2026-10-23T10-36-13-606Z`，導覽錯誤假設英文1440無抽屜，click隱藏nav timeout；改依實際hamburger可見性操作。原raw與部分結果保留，不算全批通過。
- 02 v4 原生完整通過；唯讀v4因招生key期望沒有同樣排序而錯誤拒絕，正例與unchanged-harness正例真失敗，`verify-v4-output.txt`／`verify-tests-v4-output.txt`保留。另開verify-v5只修該期望排序，不改native raw／sampler／產品；16/16正反例才採認。

| 對象 | SHA-256 |
|---|---|
| 最新原始result.json | `f27a00cc0ea753b99de985ba2706e4df38dd1db0e6bb18f18d91fab67bbf2616` |
| 02完整build manifest | `a10b2da304be8b9733ea6f0183be363334303c02a5a2e745780fefddcddf5337` |
| 新student-guide.css | `000e42128edbec1390cafda7ed1c09f27d9a7eabaebc5be4a4282987f68dee13` |
| source-audit-v2.cjs | `3e90f542b38ab219dd92a84937b2ab206ecf6d4c26cfcfd7e3265f7f0ddd56f3` |
| measure-v2.cjs | `373d5aefb978244293076c5ba2fff94c0320adcaee58208256d85f5fcd9376e1` |
| run-v4.cjs | `cbb0d9cacd8e3c6ac710b692fa54ac056d5b7bdee87b245a4d9c6e718f419226` |

18份來源的逐檔SHA在 `source-audit-v2.json`／raw sourceBefore/sourceAfter；360份build逐檔SHA位於被獨立核對的 `../plain-copy-layout-20261023/freeze-v2.json`，其SHA也綁入source audit。原01全部360檔已逐檔重驗未變。新方法 freeze：`method-freeze-v4.json`；唯讀方法與測試 SHA：`verifier-freeze-v5.json`。

已看實際新圖：zh320初始快捷鈕不再3+1、ja320請假警告全文、en1440證照認列段落；未見缺字方框或裁掉文字。這是指定畫面觀察，不代表所有字元或全站美術通過。英文整字末行資訊保存於 `english-whole-word-observations.json`，原觀察在 `visual-observation.json`。本輪未跑全站大型QA、勞動節、Unity、手機硬體或外部單位連結的最新政策查證。
