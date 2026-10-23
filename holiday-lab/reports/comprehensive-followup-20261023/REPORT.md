# 學生作品首頁後續補驗

source_agent: codex

2026-10-23，本機 `codex/qingming-final-checks`。首頁沿用已驗證的 student02（8863），不發布、不推送、不碰 main、不刪檔，C 節與勞動節不變。本文件在補驗階段持續追加，尚未回來的翻譯與研究不寫成完成。

| 項目 | yes／no | 證據與範圍 |
| --- | --- | --- |
| 首頁依已選方向呈現學生完整海報與小型入口 | yes | 前輪獨立 9 首頁＋9 示範＋2 嵌入；本輪沒有新增插畫或擴大其他遊戲美術 |
| 三語載入失敗可讀、可用鍵盤重試 | yes | zh/en/ja × HTTP503／空 gallery；每組錯誤後實際 Enter 重試，真署名／原作圖回來，未造假作品 |
| 真正等待 fetch 時切換語言仍有效 | yes | 3 語各一組；只攔截網路、不注入 DOM 或遊戲狀態，原請求完成後保留新語言 |
| 補驗狀態字型就緒、沒有溢位或孤字末行 | yes | 320×900，15 份原圖與 layout；每次先重排、等 fonts.ready；issues／orphans 0 |
| 證據可唯讀重核且負例會失敗 | yes | 9 個真案例；1 正例＋9 篡改負例共 10／10，範圍限此收據與凍結 build |
| 清明來源域準備經另一代理核對 | yes | 作者 7／7、獨立 13／13 與 readonly；28 owner、213 分軸候選、22 來源模型序列，未啟 browser |
| 清明 error-longest／全部 owner 原生墨跡上界已通過 | no | 尚缺原生序列化、聯合布局、可見性、墨跡極值證據；不能拿純測試當畫面通過 |
| TF-BASE 交接夾已回查 | yes | 10:06:12 UTC Google Drive list_folder，直接項目 5 份工單／腳本；來源 metadata 見 root/webgl-source-recheck.json |
| 已收到兩款 Unity 專案或可玩 WebGL | no | 這個交接夾未見來源或 Build；未重送遠端工單、未啟動 Unity，不推論其他位置也沒有 |
| 使用者已確認新版畫面、完整公開發布驗收完成 | no | 方向已確認；畫面／單款示範待看。真背景 hidden、實體裝置、完整 UI 合約與母語校對仍保留 |

## 實際指令輸出

工作目錄：`C:/agywork/agd-holiday-prototypes`。

```text
node holiday-lab/reports/comprehensive-followup-20261023/root/demo-recovery.cjs
PASS zh-http-503
PASS zh-missing-gallery
PASS zh-pending-language-change
PASS en-http-503
PASS en-missing-gallery
PASS en-pending-language-change
PASS ja-http-503
PASS ja-missing-gallery
PASS ja-pending-language-change
RESULT pass {"pass":9,"fail":0}
exit_code 0
```

原始結果：`root/recovery-runs/2026-10-23T10-10-27-722Z/result.json`，SHA-256 `8ac3801f5790d90dd27d99f23579e2bd40daecf273e413f62d5dcfb0418aca07`。360 runtime before／after 完全相同。HTTP503 的一筆 console 錯誤是故障注入預期，其他 console／pageerror 0；未宣稱全環境全網路狀況已驗。

```text
node holiday-lab/reports/comprehensive-followup-20261023/root/verify-recovery.cjs holiday-lab/reports/comprehensive-followup-20261023/root/recovery-runs/2026-10-23T10-10-27-722Z
pass true; cases 9; screenshots 15; runtime_files 360
public_release false; full_project_approved false
exit_code 0
node --test holiday-lab/reports/comprehensive-followup-20261023/root/verify-recovery.test.cjs
tests 10; pass 10; fail 0; skipped 0
exit_code 0
```

完整 stdout／stderr 與退出碼保存在 `root/recovery-readonly-command.json`、`root/recovery-tests-command.json`。唯讀核對初稿誤把 credits 外層 id 當成葉段落 id，因此曾 exit1；讀取實際 collector 後改為核對葉段落內每位作者與指導老師全文。沒有改原結果或產品來配合驗證器。

清明逐項 yes／no 與 20 個測試的完整實際輸出另見 `../qingming-release-20261023/independent/REPORT.md`。舊準備因方法新增 font-ready 義務而真 exit1；新 freeze `10-11-30-237Z` 重新驗證通過，不改寫舊失敗、不開巨大原生批次。

在校指南的完整各單位調研仍未完成；既有 45 來源、47 步說明、30 FAQ 不能代表所有相關規章與附件已實讀。本輪另補證照與英文門檻的官方資料，成果回來再按實際範圍登記。英文／日文一般語意 12 處修正放獨立 `codex/plain-guide-copy`，其餘 16 個涉及正式名稱、資格的候選仍逐筆查證，不一併套用。

## 翻譯與指南排版的中途真失敗

12 值語意修正已本機保存：產品 commit `382f9c788677d637d43c28f933f092c123538e93`，文件補記後 `ffb00e52a694e34717ee3a6353d40cca5f81e6d3`。獨立來源核對精確 12 pointer、locale 英 5／日 7，其餘 16 候選與其他所有字典鍵保持；作者只驗新譯目標，不能當全指南沒有孤尾。

獨立實際 browser 首個 zh320 指南 case 真 exit1：快捷按鈕「我要請／假」等 3＋1，及幾段中文摘要／聯絡文字單字末行。首 case 停止，原訂其餘 7 context 未跑，不能宣稱 8／8 通過。原始記錄保存在 `C:/agywork/agd-plain-guide-copy/holiday-lab/translation-review/plain-copy-independent-20261023/runs/2026-10-23T10-23-40-971Z/`；01／8864 freeze 保留。

已交原作者另開 `codex/plain-guide-layout`，限 `student-guide.css` 的整詞換行與平衡排版，維持字型、字級、原文及所有資料。預定另建 fresh02／8865，再由同一獨立代理重驗；這段是授權與進行中狀態，尚未宣稱修復完成。不把 8863 的舊全站／首頁證據移轉成新版全通過。

## 指南兩題補研已落地，未套產品

證照與英文門檻各有「大流程 → 四步、每步二至三句 → 三 FAQ」的[學生版草稿](../guide-graduation-research-20261023/STUDENT-DRAFT.md)。12 筆官方來源分層為：當日 PDF 兩頁視覺 1、公開 HTML 1、官方索引相關正文 7、未完成原頁視覺的 PDF 文字 2、未取得 iframe 內容的外框 1。不是 12 份現行完整規章已讀。

原 HTTP 200 兩筆、202 空白五筆、403 兩筆均保留；結構與引用驗證 exit0 只代表草稿結構與所存證據可核。115 普通班與技優班條件分開；114-2 獎助、111 起英文替代方案與 115-1 報名排程各保適用日期，不混用。現行完整認列清單、獎助與英文辦法及表單仍未取得；不直接套到官網。[逐條 yes／no 與原始指令](../guide-graduation-research-20261023/REPORT.md)已列明。

本輪沒有再次執行會覆寫原收據的 `verify.mjs`；root 儀表板唯讀核對其來源、草稿、方法及輸入 SHA，再呈現局部研究狀態，沒有將其升格成校方政策核定或全部處室研究完成。

## 新版 02 翻譯與手機指南獨立驗收通過

另一本機審閱版：[8865 在校指南](http://127.0.0.1:8865/?lang=zh#/students/guide)。分支 `codex/plain-guide-layout`，產品／作者證據 commit `5b2f838dd65953d482ab4a69896ae3cf2dd93766`。12 個譯值與指南 CSS 保持在這條分支，未合併主工作樹，不發布。

| 02 項目 | yes／no | 實際證據 |
| --- | --- | --- |
| 精確 12 處英日譯值、其他鍵值保持 | yes | 四資料檔 12 pointer、locale en5／ja7，其他 16 候選未動；16 個資料回歸通過 |
| 快捷鈕整詞、指南孤尾修正，原字型字級與全文保留 | yes | 只改 student-guide.css，359 個 build 檔與01完全相同，沒有改文案或隱藏文字 |
| 獨立真 UI 8 組／24 次譯值全文 | yes | 6 指南三語雙寬、2 日文招生目標容器；36 PNG、46 份指南 layout、10364 leaf observations；字型 loaded、孤字尾與越界 0 |
| 導覽、分類、身分、快捷聚焦、FAQ Enter、搜尋／清除操作 | yes | 同一 v4 run 正常操作，完整來源、build 與 HTTP 前後相同 |
| 母語者確認、新版全站／完整遊戲 UI 已通過 | no | 本批只限上述頁面、狀態與目標；不移轉 8863 舊版全站收據 |

獨立原始 run：`C:/agywork/agd-plain-guide-copy/holiday-lab/translation-review/plain-copy-independent-20261023/runs/2026-10-23T10-38-35-880Z/`；raw SHA `f27a00cc0ea753b99de985ba2706e4df38dd1db0e6bb18f18d91fab67bbf2616`。

```text
cwd C:/agywork/agd-plain-guide-copy
node holiday-lab/translation-review/plain-copy-independent-20261023/verify-v5.cjs holiday-lab/translation-review/plain-copy-independent-20261023/runs/2026-10-23T10-38-35-880Z
pass true; contexts 8; translation_values 12; target_observations 24
pngs 36; guide_layout_samples 46; guide_leaf_observations 10364
source_files 18; build_files 360
native_speaker_approved false; public_release false; full_project_approved false
exit_code 0
```

root 真實重核 stdout／方法 SHA 保存 `root/translation-readonly-green-command.json`。首個 root 呼叫使用錯工作目錄而被 `run from repo root` 守門拒絕，exit1 收據另保留；改指定正確 cwd 後通過，沒有改方法期望。獨立 v2／v3 的導覽 selector／收合斷點錯誤、v4 verifier key 排序錯誤均保留原失敗，由新方法版本修正工具；01 真布局失敗不回填成通過。

## 儀表板、交接與保全

```text
node holiday-lab/reports/comprehensive-followup-20261023/root/finalize-evidence.cjs
dashboard-final-build exit 0; 34/34 PASS
dashboard-final-tests exit 0; tests 24; pass 24; fail 0; skipped 0
dashboard-final-smoke exit 0; DASHBOARD_SMOKE 2/2 + OFFLINE PASS
```

本輪新增補驗、兩題研究、WebGL回查與另分支翻譯狀態已呈現；完整 UI 仍 0／1、使用者確認 0，勞動節暫緩。最後只把交接的下一步連結由失敗 8864 修正為通過 8865，再重產34／34；沒有重跑未變的 UI 冒充新證據。實際 stdout／stderr／退出碼在 `root/dashboard-*-command.json`；最後 smoke 原始 JSON 亦另存，不只引用會更新的 dashboard/smoke-result.json。

原 clone 的 LATEST_HANDOFF.md、主工作樹 holiday-lab/STATUS.md、Vault 既有專案紀錄均已更新；Vault 沒有啟動整庫推送。C 節與本機 origin/main／正式 R0 的唯讀檢查見 root/verify-boundaries.cjs，未變。各來源與證據的本機 Git 保存不代表已做跨機備份。

主要證據已本機保存 `6c971a027a9e8f12696cfcdc6fcc43f208df0569`，104 個帶雜湊的來源／證據檔逐筆與 Git index bytes 相同（另 4 個一般文字未列為 byte 證據）。原 clone 交接提交 `7b224a79b182fdc2eb5358b24ea648f32a669101`；兩處 fsck exit0，完整輸出另存 root/local-preservation.json、root/original-commit-verification.json。

交接保存時曾錯把 CRLF 工作檔的 C 節 SHA（95ae06…）拿去和 LF Git index 比較，斷言失敗後 PowerShell 仍繼續提交；這是命令串接與比較基準錯誤。隨後直接重讀父提交與新提交，C 節逐 byte 完全相同，兩者 SHA 均 e3ade88b1055a4f6b6fa8cadad02ed7e402fe1f3e20e037a8ab8c456bccb5840；工作檔 SHA 仍95ae06…，正規化後也完全相同。沒有改 C 節來配合斷言，之後相依 Git 操作改由單一 Node 程序逐步檢查退出碼。
