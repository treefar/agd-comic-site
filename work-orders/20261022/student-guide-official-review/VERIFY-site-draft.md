# 在校指南｜官網版型審閱稿驗收

日期：2026-10-22。分支 `codex/student-guide-ui`，提交 `65af4643d0c729bb5d09056247aeafab68e9d4a2`。基底為已上線的 `origin/main` 1b8322e；工作樹 `C:/agywork/agd-student-guide-preview`。本輪未 push、未發布，遊戲與 C 節未動。

入口：本資料夾 index.html（單檔，可直接開啟）。本機整合預覽 `http://127.0.0.1:8797/#/students/guide`；維持原遊戲伺服器 8785。

## 學生第一眼看見的變化

- 沿用官網 TopNav、BackBar、FooterChapter 與紙底、網點、黃紅藍配色；新增「在校指南」導覽入口。
- 八分類、七快捷、14項說明；每項摘要最長48字、三步以內、每步最長18字。承辦單位、電話及官方入口直接可點。
- 主文後放28題原生 details／summary FAQ，可用鍵盤開合；分類與搜尋一起篩選問題。來源及查核限制收進折疊區。
- 中文審閱稿；英文導覽的 Student Guide 先連到中文稿，不宣稱本專區英文翻譯完成。既有中英頁面維持。

## 逐項 yes／no

| 條件 | 結果 | 實際證據 |
|---|---|---|
| 官網共用版型與元件 | yes | student-guide.jsx、pages.jsx dispatcher、comic-components.jsx；1440與390截圖已查看 |
| 白話、精簡說明與來源連結 | yes | 14卡／28FAQ／34來源；validation.json 17項全yes，112筆卡片及FAQ引用可解析 |
| 官方來源重新查核 | yes | source-recheck.json；34筆重新讀取，12筆有回應內容、22筆阻擋或空內容，方法與版本限制列research.md |
| 全部現行規章已取得全文 | no | 當屆專題、現行英檢細則、下一屆海外甄選等仍待承辦確認；不把索引或過期公告當現行完整規章 |
| 先紅後綠的回歸測試 | yes | 新增3項測試最初0/3，實作後3/3；連同原中英文測試共11/11，tests.log附實際輸出 |
| 建置與靜態檢查 | yes | npm run build、npm run check，exit0；8章節、6373字，app-5VY3MYMQ.js；build.log/check.log |
| 分類、搜尋、七快捷、FAQ鍵盤操作 | yes | smoke.json：1440、1280、768、390、320五種寬度全部通過，0 JS／站內HTTP錯誤、無水平溢位 |
| 新頁文字不壓線 | yes | 使用核准text_on_border_audit.py；1440／390／320，FAQ收合及全展開共6組0違規；刻意條紋背景負向控制可被抓到 |
| pre-commit執行文字檢查 | yes | 本次以git -c core.hooksPath=.githooks commit執行，3項測試及6組文字檢查皆過；未改其他worktree的Git設定 |
| 單一HTML能獨立查看與搜尋 | yes | single-file.json：14卡、28FAQ、搜尋海外1項、0頁面錯誤；首頁連結導向正式站 |
| 正式站與遊戲未變更 | yes | 無push；main仍1b8322e。新程式只在codex/student-guide-ui；遊戲檔未進分支 |
| 實體手機測試 | no | Chromium模擬螢幕，未操作實體手機 |
| 使用者已確認可上線 | no | 尚待本次審閱 |

## 實際指令輸出摘要

```text
node --test tests/student-guide.test.cjs
# 實作前：tests 3 / pass 0 / fail 3
# 實作後：tests 3 / pass 3 / fail 0

node --test tests/student-guide.test.cjs tests/en-release.test.cjs tests/shared-language.test.cjs
tests 11 / pass 11 / fail 0

npm run build
[build] 完成：dist/index.html 129.0 KB、app-5VY3MYMQ.js 637.7 KB
npm run check
[check] 通過：8 個章節、6373 字、head 標記一致、bundle app-5VY3MYMQ.js

node scripts/student-guide-smoke.cjs
PASS student guide: 1440,1280,768,390,320
cards=14 faq=28 categories=8 shortcuts=7 search=true keyboard=true fit=true errors=[]

C:/agywork/agd-guide-qa-venv/Scripts/python.exe scripts/student-guide-text-audit.py
1440 expanded=False violations=0
1440 expanded=True violations=0
390 expanded=False violations=0
390 expanded=True violations=0
320 expanded=False violations=0
320 expanded=True violations=0
negative-control detected
```

QA環境：PLAYWRIGHT_MODULE與SHARP_MODULE指向既有C:/agywork/agd-site-codex/node_modules對應套件；QA_OUTPUT指向本資料夾。Python測試環境獨立安裝於C:/agywork/agd-guide-qa-venv。

字壓框檢查先抓到頁內麵包屑與章節標題底下網點，已補不透明紙底。另修正收合details的隱藏樣式，避免隱藏內容保留Range外框而產生誤報。超過16384px的整張截圖在最小寬度出現邊界異常，驗證改為9000px分段、區段重疊800px；沿用核准檢查器的門檻，未放寬或替新頁加豁免。

既有duplicate color警告保留。單檔內建樣式、程式與資料；網路字型及外連學校頁面仍需連線。開啟審閱檔不會公開發布或送出學生資料。
