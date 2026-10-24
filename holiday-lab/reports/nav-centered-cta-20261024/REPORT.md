# 導覽集中、右側快捷恢復與作品抽選評估

2026-10-24；source_agent: codex；分支 `codex/nav-centered-cta24`。最新本機 <http://127.0.0.1:8888/>，指南 `/?lang=zh#/students/guide`，儀表板 `/progress/`。未 push、發布、修改 main、刪檔或執行 C 節。

## 已改動與未實作

- 桌面導覽從 `justify-content:space-between` 改為 `center`，十個章節／語言標籤集中。實際元件仍用原 inline 的12／14px間距，沒有改字型或字級。
- 右側四快捷沒有被刪掉；原本 `max-width:1900px` 強制 static，導致一般桌面也被移到文末。本次縮至1180px，桌面1181px以上恢復fixed，平板／手機維持文末排列。原LINE目標及其他三入口不變。
- 原漫畫首頁、最新英日與指南、教師照片／職稱及頁底策展保持。產品只改 styles.css，HTML與app-WMPKTSKM.js逐SHA等同8887；361其他來源、320保全檔及策展三檔不變。
- 使用者另提出集中線中央快速換作品、點後慢停、顯示海報並連作品。已完成可行性評估與步驟草案，見「作品抽選評估.md」。本輪沒有實作這個功能，也沒有恢復節日、WebGL或任何AI生成素材。

## 驗收 yes／no

| 條件 | yes／no | 實際證據 |
| --- | --- | --- |
| 修前能重現導覽分散與桌面快捷不浮動 | yes | browser-red.json：1440px、space-between、static；red-command exit1 |
| 僅改預定CSS規則 | yes | green-command exit0，only_product_file=styles.css |
| 建置成功，首頁／JS／CSS HTTP200與SHA相符 | yes | build-command、http.json、finalize-command，均exit0 |
| 中英日桌面1440及手機390，另中文2518／1181／1180正確排列 | yes | 9組、12個有效排版條件共108yes，browser-summary.json；不是15組驗收 |
| 桌面置中、標籤不拆字、無頁面橫溢 | yes | 同9組中適用的條件，逐組保留原觀察值 |
| 桌面fixed、平板／手機static及四快捷目標保持 | yes | 同9組，LINE網址及_blank只讀核對，未發訊息 |
| 右側快捷實際跟隨頁面捲動 | yes | english-follow.json：英文1440，scrollY 0→11776，上下座標不變，4項true。其他寬度只核位置模式，不拿scrollY未動當捲動證據 |
| 原首頁及招生→策展→頁尾順序保持、無自動iframe | yes | 同9組排版證據；未進行節日或策展再通關 |
| 原圖／遊戲／四dirty+R0、main refs保持 | yes | green-command：320檔SHA及main refs保持；C節交接保存時另核 |
| 作品抽選完成評估且有官方動態設計依據 | yes | 作品抽選評估.md，2026-10-24讀取W3C SC2.2.2及SC2.3.1官方說明 |
| 作品抽選功能已完成或符合完整WCAG | no | 目前只有提案，未建程式、未測閃爍量測，不把評估升格成功能完成 |
| 儀表板數字與證據可重算 | yes | 52列／46yes／6no／使用者0、1543來源綁定，dashboard-verify-command 18/18 PASS、exit0 |
| 儀表板新評估列搜尋／展開與狀態明確 | yes | dashboard-browser.json：52列，單一搜尋列、展開、文字明列「僅提案」 |
| 官方規章／名稱／完整字型真機／素材來源限制全部解除 | no | 沿用原六項限制，本輪未重研、未升格；不是六個已知網站bug |
| 新獨立代理或全站全路由驗收 | no | 本次為主控CSS窄驗；前版獨立證據僅留原範圍 |

## 指令與輸出

完整command、cwd、時間、stdout、stderr、exit code在同目錄command JSON。成功收據stderr皆空。

```text
node holiday-lab/reports/nav-centered-cta-20261024/check.cjs verify
修前 exit1：AssertionError: Desktop navigation is not centered

node scripts/build.mjs --local-review --out=.measure-nav-centered-cta-20261024-01
exit0
Translations: 2551 Static candidates: 29 Unpaired paths: 0
Japanese exact translations: 2595
[build] 完成：.measure-nav-centered-cta-20261024-01/index.html 135.1 KB、app-WMPKTSKM.js 1283.6 KB

node holiday-lab/reports/nav-centered-cta-20261024/check.cjs verify .measure-nav-centered-cta-20261024-01
exit0
{"pass":true,"only_product_file":"styles.css","other_sources_preserved":361,"protected_files_preserved":320,"curation_preserved":3,"main_refs_unchanged":true,"html_and_bundle_unchanged":true,"build":".measure-nav-centered-cta-20261024-01"}

node holiday-lab/reports/nav-centered-cta-20261024/finalize.cjs
exit0：9組排版108yes、英文實際捲動4yes、HTML／bundle不變，抽選功能implemented=false

node holiday-lab/build-dashboard.mjs
exit0：52列／46yes／6no／使用者0

node C:/AIHome/claude/skills/project-dashboard/scripts/verify-dashboard.js holiday-lab/dashboard/out --authority holiday-lab/dashboard/overnight-authority.cjs
exit0：18/18 PASS
```

以上Build與finalize是已執行記錄；不要覆寫舊候選或凍結結果。唯讀回歸命令是check.cjs verify。

## 原始失敗與取證限制

最初15組長批次超過CUA 60秒，kernel reset，只留下4張中間畫面，沒有完整case JSON，不能當驗收完成。之後改成逐組落檔，重新取得9組必要排版證據；未因逾時重啟網站服務。重連舊頁一度debugger未附著，重新列tabs並使用獨立新測試頁；沒有操作使用者遠端桌面或私人頁面。

早期測試把緊湊gap錯定為最少16px，實際原元件inline為12／14px；修正方法範圍為12至28px，不為測試改產品。原case-json不覆寫。另同一CUA呼叫中native scroll／End後立即讀值，常得到scrollY仍0，無法建立捲動前提；不採那些scrolled／ctaFollows欄位當成功證據。最終browser-summary只採12項真正排版條件；捲動用分開兩次呼叫的英文實測，完整before／after保存。原紅旗與timeout均保留。

作品抽選的下一步是先審閱提案，再決定是否做可撤回的本機試作；目前沒有把評估指示當實作授權。原圖署名、節日凍結、不上線及C節限制持續。
