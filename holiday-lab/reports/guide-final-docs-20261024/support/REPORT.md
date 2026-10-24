# 獎助、權益與就業三卡：公開來源補查

2026-10-24，唯讀研究完成。只產出提案，未修改網站、切分支、提交或執行網站 QA。

- 研究題目：**6 yes／2 no**。兩個 no 為 UCAN 目的地當下顯示系統錯誤，以及未找到115-1校內履歷諮詢公開預約表。限縮查找後結案，不以近似服務冒充。
- 文件驗證：**82 yes／0 no，exit 0**。13份官方公開附件原件全部 HTTP 200，已保存 SHA；8份PDF共25頁，文字與頁圖均逐頁閱讀。另5份空白 ODT／DOCX完整文字已讀。
- 提案：`proposal.json`，31個精確 before／after 操作、13個新來源。`translations.json` 有16組可見內文英日建議；`source-visible-translations.json` 有38組來源標題、日期及白話註記建議。日文屬功能翻譯，不冒充官方日文專名。
- 不重新研究先前8聯絡窗口、請假與8879網站驗收；職發成員全文重用當日已保存證據。未登入、送表、聯絡校方、取得個案資料或開啟任何遊戲。

## 可採用的重點

1. **獎助與急難**：學產低收先在校務填表列印，再交紙本；勵學金先核補助身分，再依115-1學習項目申請、完成與繳件。校內急難114年11月19日規則第4點明定事件起六個月內、同事件一次，同校兄弟姐妹一人；綜合頁148萬／1000萬不能套成全體急難資格。
2. **求助與權益**：諮商、特教、一般學生申訴與校園性別事件分流。一般申訴原則於收到或接受學校處分、措施或決議的次日起30日內書面提出；性平調查另有表單與程序，並非先諮商才可申請。
3. **就業**：有真正公開的校方求職分類、學習歷程及UCAN說明，但UCAN目前暫時不可用。校內當期履歷預約未證成，保留承辦確認；額外提供政府台灣就業通Youth履歷自傳診斷，標明18–29歲及自行登入預約，與校內服務分開。

三大步的現有結構保留；只補說明及FAQ，不將完整細則塞入摘要。3卡仍各3步，各3FAQ。以原輸入做本組提案試算為15卡47步45FAQ76sources，**未含其他組後續整合**，主控須依最終資料重算。

## 逐題 yes／no

| 題目 | 結果 | 已讀依據、適用版本與邊界 |
| --- | --- | --- |
| 115-1不利處境／學產低收正文及公開表單 | yes | 兩頁正式公告、3份115年空白PDF與現列7頁操作手冊。10/20與10/8已截止；手冊2022年示例只用於操作，115-2「000年」不當有效日期。 |
| 校內急難完整現列規則 | yes | 1141119要點1頁全讀，區分校內規則與綜合校外急難說明。事件六個月不是一般助學截止日。 |
| 115-1勵學金主公告、115身分公告及空白文件 | yes | 9/1與9/9全文；身分文件專區、家庭突遭變故及其他經濟不利2份空白DOCX全文。未宣稱六類學習附件全部已讀。 |
| 一般學生申訴現列辦法及中英空白表 | yes | 1120426規則3頁、現列流程1頁及2份ODT全文，正式受理管道。規則第3／4／6／7／8條分流、收件、原則30日、書面與補正、副本。 |
| 校園性別事件程序及空白表 | yes | 1131225規則10頁、2.2版ODT全文。第17／18／20／22／23／31／36條分清提出、收件、受理通知、不受理申復、隱私例外、結果申復與後續救濟。 |
| UCAN目前可用的診斷入口 | **no** | 校方實鏈已到真正官方目的地，但只顯示系統錯誤。未登入、未測診斷、不照抄舊帳號／初始密碼。 |
| 115-1校內履歷諮詢公開預約表 | **no** | 未找到當期預約表；職掌、舊就博代收履歷與學習歷程不可當成同一服務。 |
| 公開求職與額外履歷資源 | yes | 校方求職網、外部資源、政府台灣就業通與Youth服務正文。僅證入口和說明，不承諾所有職缺還在收件、必有預約時段或錄取。 |

精確URL、原件SHA、正文／附件位置、逐題引用與缺件均在 `source-matrix.json`；`raw/download-results.json` 為實際13次下載狀態及原件雜湊。19份目前頁面正文由專用Chrome研究頁抄錄保存，各自以檔案實際保存時間列入matrix；未取得HTML HTTP狀態的頁面明列null，未拿Chrome可讀冒充HTTP 200。

## 衝突保留

- 一般申訴規則第6條是原則30日；中英空白表附註仍寫10–30日。不自行依表改成浮動期限，也不把可能例外省略成任何案件都30日。
- 學務法規彙編母頁標4/24，生輔母頁與完整規則正文標112/4/26；本組以完整規則的題記列來源版本，保留母頁差異。
- 中文空白申訴書正文V4.0；英文檔名V4.0、正文Version1.0，不改校方原件，連回官方母頁。
- 115勵學金身分公告寫當年度，現列114空白表寫開通一年，不能自行合併成同一期限；FAQ請承辦確認。
- 性平母頁與檔名多一「凌」，PDF正式題名沒有；提案採PDF正式題名。母頁舊2.1表與2018流程圖不採為現行完整程序。
- UCAN公開說明中舊2147與末段1713並列。重用10/24先前已實讀保存的完整成員表，**不是本分鐘重新抓取**：1713（UCAN／講座）、1712（證照／職缺）、1711（實習／學海）。career卡原1713可作職涯探索入口，不一律改成1712；其他卡電話由主控另案處理，本組沒有擴大修改。來源舊HTTP收據完整保留，不把10/22的202空回覆改成今天新讀全文。
- 校方求職網本次首頁最新列6/11，2026就博為5/5且已結束。列表可讀不代表各職缺現在仍開；未用過期活動作當期預約。

## 可精確套用方式

`proposal.json.changes[]` 具有 `file/pointer/before/after/source_ids/reason`。先檢查現值等於before，再套after。`new_sources[]` 是來源物件本身，可在驗證id不存在後append；不是 `after` wrapper。既有來源僅修改本次實讀的 `checked_at/readability/note`，沒有改 `http_recheck`。

英日文案在 `translations.json.translations[]`（`zh/en/ja/type`）；來源側檔用 `pairs[]`。新的學期日文保留「115学年度第1学期」，未套日本年度／前期。所有可見新字串都有建議譯文；不代表使用者已確認或正式發布。

## 實際指令與輸出

執行目錄：`C:/agywork/agd-holiday-prototypes`。下面為實際執行；完整stdout／stderr在同名檔案，最後驗證的可重跑命令及精確executable由 `verify-command.json` 保留。

```text
node holiday-lab/reports/guide-final-docs-20261024/support/fetch-public.cjs
stdout: count=13, valid=13; each HTTP=200
stderr: (empty)
exit code: 0

C:/Users/treef/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe holiday-lab/reports/guide-final-docs-20261024/support/extract-public.py
stdout: 8 PDF / 25 pages; 5 OpenXML blank documents extracted
stderr: (empty)
exit code: 0

node holiday-lab/reports/guide-final-docs-20261024/support/prepare-proposal.cjs
stdout: {"changes":31,"new_sources":13,"visible_translations":16,"guide_before_sha256":"30f77faaa65107c0ad73ec265f92c787e1f89a5ad0a7c722278809f5d0c68bd4"}
stderr: (empty)
exit code: 0

node holiday-lab/reports/guide-final-docs-20261024/support/assemble-evidence.cjs
first stderr: ENOENT ... holiday-lab/followup-20261024/contacts/raw/career-members-dom.txt
first exit code: 1
method correction: research helper relative path only; product untouched
r2 stdout: {"questions":8,"yes":6,"no":2,"html_bodies":19,"attachments":13,"pdf_all_pages":25}
r2 stderr: (empty)
r2 exit code: 0

node holiday-lab/reports/guide-final-docs-20261024/support/record-verification.cjs
stdout: pass=true, yes=82, no=0
stderr: (empty)
exit code: 0
```

其中extract的「8 PDF / 25 pages」是實際逐檔stdout彙總，完整逐檔輸出保留 `extract.stdout.txt`，不是原命令直接印這一行。matrix首次失敗保存在 `matrix.stderr.txt`，修正後另存 `matrix-r2.*`，未覆寫失敗證據。Chrome曾遇selector期限與重複存檔EEXIST；已保留第一次取頁／錯誤與錯目標DOM，再依完整實鏈確認正確正文，沒有拿失敗當成功或修改產品配合方法。

| 文件驗證項目 | yes／no | 證據 |
| --- | --- | --- |
| 31項before均仍等於目前檔案 | yes | verification.json逐項before檢查 |
| 本組3卡全JSON前後相同 | yes | owned-card三項SHA內容比較；本組未寫產品 |
| 完整guide檔前後SHA相同 | **no** | 其他代理正在改其負責卡；完整before／after如下面所列，不將整份未變冒充綠燈 |
| 13原件SHA重算相符 | yes | verification attachment逐項；evidence-manifest.json |
| 25PDF頁圖存在並已逐頁閱讀 | yes | pages/及visual-review.json；非網站使用者驗收 |
| 摘要80字內、detail25–100字、FAQ答案120字內 | yes | 3卡逐項字數；3大步保留 |
| 新來源id與每步FAQ source_refs有效 | yes | 候選資料驗證；只是本組提案試算 |
| 新可見文案、標題、日期、caption具英日建議 | yes | 兩份翻譯側檔與驗證清單 |
| 所有舊http_recheck收據不被提案覆蓋 | yes | 0項http_recheck修改 |
| UCAN可用／當期校內履歷預約已證成 | **no** | 如上兩題缺件，未登入嘗試補空 |
| 產品Build與新版本畫面驗收 | **no** | 本階段沒有產品變更，不執行舊版QA；主控若套用由另一代理獨立驗收 |
| 本代理研究頁已關閉、背景工作已結束 | yes | raw/browser-cleanup.json；三個Node、Python命令均已exit，未啟本機server |

完整guide SHA：

```text
before 30f77faaa65107c0ad73ec265f92c787e1f89a5ad0a7c722278809f5d0c68bd4
after  4035c993a43e0e0bb82b53166b3b2e037fe2c2d4d3ccb1136c3648f604c6d468
```

驗證82／0只涵蓋研究文件與本組責任資料守門；上表與逐題matrix的no完整保留，不將未測或缺件計作通過。
