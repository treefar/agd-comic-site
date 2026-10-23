# 學生首頁、英日文案與指南手機排版：同版本機整合

source_agent: codex

2026-10-23。前輪完成的 `codex/plain-guide-layout`（5cc447aa，含12譯值、指南CSS及獨立證據）已合入新 `codex/student-review-integrated`，merge commit `73f91f6a8a12573bc86548358705689b1dceea7e`。不合 main，不推送、不發布、不刪檔，C 節與勞動節不動。舊各埠及收據保留。

新本機入口：<http://127.0.0.1:8866/>，指南 `/?lang=zh#/students/guide`，策展示範 `/holiday-lab/student-curation.html?lang=zh`，進度 `/progress/`。建置 `.measure-student-integrated-20261023-01` 為內部 measurement 審閱，沒有產發布ZIP。

## 可判定的本輪驗收

| 項目 | yes／no | 實際證據與限制 |
| --- | --- | --- |
| 兩分支已在本機整合，既有未提交內容沒有還原 | yes | merge唯一衝突是.gitattributes，保留兩側規則；4份實質dirty逐SHA前後相同，沒有把舊QA或勞動暫存提交進merge |
| 12譯值及其他所有字典鍵保持 | yes | 整合前與build後各跑原copy.test，均16／16，未套其餘16正式名稱候選 |
| 新建置成功且沒有私密報告進runtime | yes | build-review --measurement exit0，360檔，明確runtime白名單；沒有發布批准 |
| 與8865候選的實際差異已核對 | yes | 同360檔，16個文字檔SHA不同；逐檔原文去CRLF後完全相同，app bundle bytes相同；沒有把byte不同謊稱完全相同 |
| 新版首頁三語／三寬、3張原作完整署名、手動切換 | yes | 新run 9／9，點擊前無季節插畫／遊戲素材請求，iframe只在開始後載入 |
| 單款策展三語／三寬操作、鍵盤／語言保留／重設 | yes | 新run 9／9，原作品與署名、展位與資訊卡檢查都有實際狀態 |
| 兩款代表嵌入試玩到結果／重播／返回 | yes | 英文桌機跨年與日文手機清明2／2；不是14款全UI重新驗完 |
| 新版整合首頁／示範證據可嚴格唯讀重核 | yes | 47PNG、54份字型loaded量測；新run SHA0e834b47…；verify-v2 exit0，原方法逐byte複製，不修改舊run |
| 新版全部360檔HTTP／body SHA、路徑隔離與實際404 | yes | release新run與source_before／after一致，verify exit0；不借8863的360檔收據 |
| 發布前技術清單13條全部完成 | no | 12yes／0no／1unknown；真分頁hidden仍沒有真實背景狀態證據，不偽造document.hidden |
| 整合版指南／招生8組新獨立驗收 | yes | 新8866獨立run 8組、24譯文觀察、36PNG、46指南layout／10364leaf；孤尾／越界0，18來源／360build前後穩定，root唯讀verify exit0；不移轉舊8865收據 |
| 單款示範手機三語故障恢復補驗 | yes | 503／空gallery／等待載入中換語言9／9、15PNG，root唯讀重核exit0，未改舊收據 |
| 補研五題有大流程、步驟說明及FAQ | yes | 實習三題12步9FAQ，專題／升學兩題10步6FAQ；結構與來源檢查52及16項通過，不等同現行適用或獨立政策核定 |
| 16個正式名稱全部可直接套用 | no | 12個僅名稱有來源支持；4個學制完整句仍待核，全部未套產品 |
| 校務指南所有處室現行全文已取得／可直接公開 | no | 新補研會逐件分層；新發現官網表單Google Sites入口可直讀，不代表內容最新適用已核定 |
| 使用者已確認畫面、完整UI gate已通過 | no | 方向確認與對話畫面確認分開，正式R0／完整合約仍維持既有狀態 |
| 儀表板權威數字、相關回歸與桌機／手機／離線 | yes | build34／34、回歸27／27、smoke2／2＋離線通過，全部使用新8866；不升格完整發布 |

## 實際指令與輸出

```text
git merge --no-commit --no-ff codex/plain-guide-layout
exit 1: only .gitattributes conflict
（核對兩側規則後解決，只stage.gitattributes；既有dirty未還原）
git commit -m "Integrate verified English Japanese copy and student guide layout locally"
merge 73f91f6a8a12573bc86548358705689b1dceea7e
git fsck --connectivity-only
exit 0

node --test holiday-lab/translation-review/plain-copy-20261023/copy.test.cjs
tests 16; pass 16; fail 0; skipped 0
exit 0（build前與build後各一次，原輸出分別保留）

node holiday-lab/build-review.mjs .measure-student-integrated-20261023-01 --measurement
Translations: 2315 Static candidates: 26 Unpaired paths: 21
Japanese exact translations: 2344
MEASUREMENT_ONLY: .measure-student-integrated-20261023-01; 360 files
exit 0
```

21個Unpaired paths有既有人工字典覆蓋，不等於本輪21個漏譯。上述build是本機審閱，不觸發對外部署。

```text
STUDENT_QA_URL=http://127.0.0.1:8866 node holiday-lab/reports/integrated-review-20261023/home/run-v2.cjs
PASS home-zh/en/ja-320/390/1440（9組逐條原輸出）
PASS demo-zh/en/ja-320/390/1440（9組逐條原輸出）
PASS embedded-new-year-en-1440
PASS embedded-qingming-ja-320
STUDENT_ACCEPTANCE pass
exit 0

node holiday-lab/reports/integrated-review-20261023/home/verify-v2.cjs holiday-lab/reports/integrated-review-20261023/home/runs/2026-10-23T10-55-01-190Z
pass true; contexts9; demo_contexts9; embedded_routes2; pngs47
full_project_approved false
exit 0

node holiday-lab/reports/integrated-review-20261023/release/run.cjs --site=.measure-student-integrated-20261023-01 --base=http://127.0.0.1:8866
RESULT pass-with-explicit-limitations {"yes":12,"no":0,"unknown":1}
exit 0

node holiday-lab/reports/integrated-review-20261023/release/verify.cjs holiday-lab/reports/integrated-review-20261023/release/runs/2026-10-23T10-55-01-135Z
pass true; checks13; yes12; no0; unknown1
runtime_files360; http_sha_matches360; screenshots6
public_release false; full_project_approved false; labor_played false
exit 0
```

完整命令、stdout／stderr與退出碼在 `root/*-command.json`。首頁raw SHA `0e834b47693efa23bc32c4891c08e300e194f1ef23a63d754c5450928cf17355`；release raw SHA `781a5494f21dd61fbedf66257111b9727eb0fe163b067041f900218ad4c82c76`。源方法保持原文件，不用修改舊raw配合新版本。

## 調研補件已交草稿，現行適用仍待核

- 實習／海外實習／海外見學：`../guide-internship-research-20261023/`。
- 專題製作／繼續升學：`../guide-capstone-study-research-20261023/`。
- 16個正式名稱候選逐筆核對：`../../translation-review/proper-names-research-20261023/`。
- 原證照／英文兩題草稿仍在 `../guide-graduation-research-20261023/`，沒有宣稱已取得現行所有規章。

root以一般Chrome開官方常用表單頁，實際iframe src為Google Sites AGD Files；嵌入拒絕但直開可讀學生事務下實習／畢業專題folder，再由既有學校Drive連接讀必要相關資料。引鏈收據見 `root/official-form-entry.json`。沒有建立權限或驗證匿名公開存取，沒有讀教師專用、行政、個人填寫申請或名冊。各文件修正日與相互矛盾由子代理另列，不能拿Google Drive修改時間代替現行規章判定。

實習草稿讀到官網107/4/3版手冊全文；109年南臺跨校A+公文與2026 HC成果消息分開。115當期適用、本期海外甄選與見學費用／學分仍無完整證據。兩舊DOC只有原檔與片段，未算完整Word閱讀。專題官網規章為108/12/30修正，換組截止在規章與表單分別寫第三／第二次審查前，尚未解決；116升學簡章亦有書審／口試及附件年份衝突。細節與逐頁證據見各報告，未把過期名額、費用或日期寫入學生產品。

```text
node holiday-lab/reports/integrated-review-20261023/guide-independent/verify.cjs holiday-lab/reports/integrated-review-20261023/guide-independent/runs/2026-10-23T11-02-24-863Z
pass true; contexts8; target_observations24; pngs36
guide_layout_samples46; guide_leaf_observations10364
source_files18; build_files360; public_release false
exit 0

node holiday-lab/reports/integrated-review-20261023/root/close-phase.cjs proof
guide-readonly 0; internship-readonly 0
all true; manifest_files61; sources24; raw_receipts22
pdf_visual_pages18; steps12; faq9; errors[]
exit 0
```

獨立指南raw SHA `e2d575628c762be80ef3f27fe99cdfa7d8a56628696d91451789873fb3b3ec16`；恢復raw SHA `94799a5c4d7442beaa7a5ea50a078d6b4ff2f09dccd46541acc1d685d8e6768f`。指南檢查範圍是已呈現文字與指定互動狀態，沒有宣稱獨立展開所有30FAQ或全部15卡答案。英文完整單字末行另列資訊，並非所有英文末行審美皆通過。

## 儀表板與階段保全

```text
node holiday-lab/reports/integrated-review-20261023/root/close-phase.cjs dashboard
dashboard-build exit0: 34/34 PASS
phase-regression exit0: tests27; pass27; fail0; skipped0
dashboard-smoke exit0: DASHBOARD_SMOKE 2/2 + OFFLINE PASS
exit 0

node holiday-lab/reports/integrated-review-20261023/root/update-handoffs.cjs
updated3; c_section_unchanged true
exit 0
```

回歸涵蓋儀表板來源重算、拒絕混用不同build、膨脹名稱支持數、假使用者批准，以及恢復收據1正9負例。原始stdout／stderr在root對應-command.json。五題草稿計數22步15FAQ由結構資料讀取，來源檔SHA逐件核對，不手填完成率。首頁、指南及單款示範已合在8866；Chrome實開見三作品輪替與署名，首頁分頁留給使用者。未取得完整現行規章、真背景hidden、實體手機、母語逐句與使用者畫面確認，這些沒有標成完成。

本輪先更新工作樹holiday-lab/STATUS.md與原clone LATEST_HANDOFF.md，再同步Vault專案紀錄；未推送任何repo。最終分支／main／C節／R0及既有dirty保存檢查與提交結果另見root/local-preservation.json，保存腳本只允許本輪明列路徑，禁止stage刪除。

保存前置檢查首版誤以為存在本機main，`git rev-parse main`實際exit128，腳本在任何stage／commit前立即停止。兩repo實讀均只有origin/main、沒有本機main；未建立main。首版留save-local-v1.cjs.txt，新版比較refs/heads/main與refs/remotes/origin/main前後整組一致。這是保存工具前提修正，沒有重跑產品或畫面驗收。
