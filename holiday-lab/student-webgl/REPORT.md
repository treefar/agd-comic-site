# 兩款學生遊戲 WebGL：來源與接續查核

2026-10-22，source_agent: codex。執行主機為 `treefarNB`（TF-GO），不是 TF-BASE。

目前不能宣稱完成 WebGL。兩款完整原始專案都尚未取得，沒有啟動任何 Unity 專案，也沒有 Build 或放入新系網的假遊戲入口。可行性須等實際來源與相容性查核。

## 已完成的可用產物

- `inspect-tf-base.ps1`：TF-BASE 唯讀盤點；先核對真實主機，再找來源、精確 Editor、WebGL 模組、版本/Git狀態。
- `verify-preflight.mjs`、`preflight-verification.json`、`preflight-output.txt`：實際 PowerShell 5.1/7 解析、錯機阻擋、本機 Editor 查核與冪等重送防護證據。
- `WORK-ORDER-index.md`、兩份單款工單：分清執行/生成/驗收對象，含第0節範圍鎖、失敗路徑、官方 Unity 6.5 來源與逐條驗收。
- `queued-inspection.json`：較早已送出的既有 fleet 唯讀盤點單。這是排隊資料，未當成執行結果；收到主控「不要再排單」後沒有再送。

## 逐條驗收

| 條件 | yes/no | 證據及邊界 |
|---|---|---|
| 執行主機確認 | yes | `hostname` → `treefarNB`；TF-GO |
| 正式 Vault 已讀 | yes | resolver → C:/TreeDesk/Obsidian Vault；入口、相關索引、TF-BASE歸檔/跨機記錄已讀；兩款無直接條目 |
| TF-GO 本機來源定位 | no | resolver 分別以 Flora、胖搜尋，均exit1；非「TF-BASE上不存在」 |
| 使用者「胖鼠」與系網「胖倉鼠」同一款 | no | 系網影片7lM3seaPts0標「你是一隻胖倉鼠」；尚無來源/標題畫面交叉證明，不建別名對照 |
| Flora來源身分確認 | no | 只讀到系網影片oFMueTOvkX0及得獎紀錄；不能拿同名其他作品代替 |
| GitHub找到兩款來源repo | no | `gh repo list treefar --limit 300 ...` 篩Flora/Hamster/胖，exit0無命中；非保證帳號所有repo都無來源 |
| TF-BASE網路可達 | yes | 既有Tailscale顯示LAPTOP-5K6L9A6M Online；不等於有執行權限 |
| TF-BASE檔案可讀 | no | SMB 445可連線，`net view`回System error 5／Access denied；兩種C$路徑Test-Path均False |
| TF-BASE可用直接執行通道 | no | 已設定目的主機的22/5985/3389探測均未開；沒有變更安全設定/開埠 |
| 已知遠端工單有實際結果 | no | 20261022-221358-tf-go-1412僅queued-not-executed；既有10/8舊pending使此通道不能視為即時可靠 |
| TF-GO精確Editor已裝 | yes | 原守門 `-EditorOnly -Json` exit0，PASS_EDITOR，6000.5.10f1；不替代TF-BASE查核 |
| TF-GO WebGLSupport存在 | yes | 精確Editor下Data/PlaybackEngines/WebGLSupport之Test-Path True；未跑Build，未推論所有工具鏈可用 |
| TF-BASE精確Editor/模組已驗 | no | 未有遠端執行回傳 |
| 腳本5.1及7均能解析 | yes | 兩者PARSE_ERRORS=0、exit0；完整命令見preflight-output.txt |
| 錯機時拒絕執行盤點 | yes | TF-GO實跑exit2，errors含WRONG_MACHINE；沒有掃TF-GO代充TF-BASE |
| PS1 BOM符合規範 | yes | TEMP先建/驗EF BB BF後整檔複製；bom_hex=efbbbf |
| 重跑送單工具不產生重複 | yes | 已有queued state時輸出EXISTING與原jobId、exit0，不重送 |
| 兩款程式相容性已實讀 | no | 來源尚未取得，沒有用平台一般限制假裝個案結論 |
| WebGL Build成功 | no | 未執行 |
| 真實遊戲wasm/HTTP/瀏覽器實玩已通過 | no | 未有真實Build，不拿工單/平台文件/空loader代替 |
| 未push、main、刪檔或發布 | yes | 只在codex/student-webgl所有權目錄新增；網站/原遊戲正本及8800/8797/8785未動 |

## 實際命令輸出摘要

```text
hostname
treefarNB

powershell -NoProfile -File .../project-paths/resolve-project.ps1 -Name Flora -AsJson
Project 'Flora' not found on this machine ().
Searched: C:\Projects; C:\Users\treef\Desktop
exit code 1

powershell -NoProfile -File .../project-paths/resolve-project.ps1 -Name 胖 -AsJson
Project '胖' not found on this machine ().
exit code 1

net view <TF-BASE Tailscale address>
System error 5 has occurred.
Access is denied.

TCP probes against the already configured TF-BASE Tailscale peer
22=false, 445=true, 5985=false, 3389=false

.../unity-version-guard/scripts/assert-unity-version.ps1 -EditorOnly -Json
{"machine":null,"state":"PASS_EDITOR","requiredVersion":"6000.5.10f1","editorPath":"C:\\Program Files\\Unity\\Hub\\Editor\\6000.5.10f1\\Editor\\Unity.exe","projectPath":"","projectVersion":"","detail":"Exact Editor is installed."}
exit code 0

Test-Path <exact Editor>/Data/PlaybackEngines/WebGLSupport
True

node holiday-lab/student-webgl/verify-preflight.mjs
YES powershell exit=0
YES <detected PowerShell 7> exit=0
YES powershell exit=2
YES powershell exit=0
YES node send-inspection.mjs exit=0
YES Read-only queued job state check exit=n/a
exit code 0
```

守門JSON的machine欄為null，因此另外以實際hostname辨識主機；沒有把null當TF-BASE。本輪工具子程序的COMPUTERNAME環境變數缺失，第一次呼叫既有fleet腳本失敗（ContainsKey空key／id空），未得到有效jobId；其既有機制寫出的空id單不刪，未當成執行成功。第二次僅將`os.hostname()`量到的真實主機名傳入該子程序，取得上列有效jobId；此後送單工具加了冪等防護。這個排隊動作早於主控後續「不要再排單」指示；後續沒有重送。

## 下一個具體步驟

主控正請使用者選擇來源取得方式。選TF-BASE續作後，在該機Codex貼本工單index第1節唯讀命令，或先將本目錄的腳本帶到TF-BASE再執行。回傳兩款真實路徑、ProjectVersion、Assets/Packages/ProjectSettings、產品名、Git狀態、精確Editor與WebGLSupport；取得結果才進來源副本分支及WebGL Build。

若只拿到exe，回報需要完整原始專案；若有Git repo則在本機非Drive工作副本取得來源，不push。網站整合及可玩驗收尚待後續，不能在本報告寫「已可試玩」。
