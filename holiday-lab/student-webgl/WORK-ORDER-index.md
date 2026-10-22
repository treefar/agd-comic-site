# 學生遊戲 WebGL 工單索引

2026-10-22，source_agent: codex。這是建置接續工單，不是已完成的 WebGL 產物。

| ID | 使用者指定作品 | 系網已讀資料 | 來源身分狀態 | 單款工單 |
|---|---|---|---|---|
| flora | Flora | data/videos.json 的影片 oFMueTOvkX0、data/stats.json 的 FLORA 得獎紀錄 | 尚無原始專案可交叉核對 | WORK-ORDER-flora.md |
| fat-hamster | 你是一隻胖鼠 | data/videos.json 影片7lM3seaPts0的名稱為「你是一隻胖倉鼠」 | 不把兩名稱逕自視為同款，待用來源內產品名/標題畫面確認 | WORK-ORDER-fat-hamster.md |

## 0. 給執行代理：共同範圍鎖

- 唯讀定位原始專案；未確定來源與可回復副本以前，禁止開 Editor。
- 產出白名單：經驗證的本機獨立工作副本、該副本的 `codex/webgl-<id>` 分支、該副本外的 `WebGLReview/<id>/`、本工單的查核 JSON/報告/截圖。
- 原始正本及 main 一律唯讀；不 push、不發布、不刪檔，不改系網 C 節。原本未提交內容不得撤銷。
- 黑名單：原始正本的 `.cs/.unity/.prefab/.asset/.meta/.json/.yaml` 全不可修改；不得更動 `ProjectVersion.txt` 偽裝升版；不得改使用者安全/網路設定。
- 本輪不重新繪製正式美術/UI，不做替代遊戲；只有 exe 時，不把另一款或重寫網頁遊戲冒充移植成果。
- 違反範圍即停止並報告。共享程式庫裡有其他代理，不能撤銷其他人的修改。

## 1. 給 TF-BASE 執行代理：先取得證據

原封不動貼上，不要改寫、不要翻譯；此段只查核，不啟動 Unity：

```powershell
hostname
$PS = if (Get-Command pwsh -ErrorAction SilentlyContinue) { 'pwsh' } else { 'powershell' }
& $PS -NoProfile -File C:\AIHome\claude\skills\project-paths\resolve-project.ps1 -Name Flora -AsJson
& $PS -NoProfile -File C:\AIHome\claude\skills\project-paths\resolve-project.ps1 -Name '胖' -AsJson
& $PS -NoProfile -File C:\AIHome\claude\skills\unity-version-guard\scripts\assert-unity-version.ps1 -EditorOnly -Json
```

若解析器找不到，使用同目錄 `inspect-tf-base.ps1` 作唯讀擴充盤點；它先核對主機，再讀 MainData18TB 磁碟標籤，最多走12,000個目錄/五層，跳過 Library/Assets/Packages/node_modules 等。`truncated=true` 不是「沒有專案」。此腳本目前存在 TF-GO 工單目錄，尚未證明 TF-BASE 已取得，需先把檔案帶到 TF-BASE。

有來源後必讀該專案自己的 AGENTS/README/handoff、ProjectVersion、Packages/manifest、已啟用場景與相關程式，不能拿本工單替代實讀。核對產品名、場景標題/原作品畫面，逐款證明作品身分。

## 2. 給建置代理：恢復點及版本

1. 若有 Git，先記 `git status --short`、HEAD、分支與 origin；不得清掉髒檔。以乾淨且可恢復快照開獨立分支。
2. 無 Git 或原始專案有未提交工作時，先完整複製 Assets/Packages/ProjectSettings，逐檔 SHA-256 核對；不能假定舊備份最新。
3. 對實際副本跑版本守門的 `-ProjectPath <實際副本> -Json`。只有守門通過才開指定 Editor。舊專案需恢復點後依 skill 的 AllowUpgrade 流程；新於基準則停止，不降版。
4. 精確基準 `6000.5.10f1`，並查 `Editor/Data/PlaybackEngines/WebGLSupport`；缺 Editor/模組就 NOT_READY，禁止改用舊版或自動裝其他版本。
5. 編譯/Build/Console/Editor.log 都記實際版本；確認 scene list、原生 DLL、執行緒、檔案/網路、輸入、影片、音訊及記憶體相容性。

## 3. 給網站整合代理：產物邊界

- 只接真實 Build 的 index/loader/framework/wasm/data/StreamingAssets；以清單與 SHA 驗完整性。未 Build 前，入口不得假裝可玩。
- 使用者點「開始試玩」才載入 iframe 和大型資料；離開卸載實例。系網中英日外框沿用原站生成介面；遊戲語言依原作支援範圍揭露。
- 本機先驗無壓縮開發產物；正式壓縮版本再依實際主機設定，不假定公開站支援自訂 header。
- `.wasm` 及 `.wasm.gz/.br`：`Content-Type: application/wasm`；gzip/br檔案另加對應 `Content-Encoding`。`.js` 及壓縮JS：`application/javascript`。fallback的`.unityweb`由Unity loader解壓，不可錯加重複壓縮。
- 不在一般站台全域強開 COOP/COEP；只有實際選用並驗證 Web 多執行緒後，才對隔離遊戲 host 設必要條件。
- 操作提示需明確標鍵盤/滑鼠/手把/觸控實際支援。沒有原生觸控就先明列桌機試玩，不用假虛擬搖桿宣稱手機可玩。

## 4. 給影像生成模型

不派生圖。保留原作素材，本工單沒有新美術 prompt；若後續確有介面素材缺口，另由主控走 Codex 生圖，不由建置代理程式繪製替代。

## 5. 給獨立驗收者：每款逐條 yes/no

| 條件 | 必附證據 |
|---|---|
| 正確作品身分 | 來源路徑、產品名、標題畫面及系網資料逐筆對照 |
| 完整來源而非僅EXE | Assets/Packages/ProjectSettings實際存在 |
| 恢復點完整 | 分支/HEAD/乾淨狀態或副本SHA比對 |
| 精確版本通過 | 守門JSON、Editor.log中的6000.5.10f1 |
| WebGL模組可用 | 安裝路徑及Build實際結果 |
| 編譯與Build成功 | 完整命令、exit code、BuildReport/錯誤數 |
| 主機header正確 | 實際HTTP status/MIME/Encoding，不只看副檔名 |
| 瀏覽器可玩 | 首畫面、開始、一段實際玩法、輸贏或切場景、重試、離開後重開 |
| 兩款獨立通過 | 分開報告，不以一款結果代另一款 |
| 遵守不發布/不push/main/C節/刪檔 | diff、refs、操作紀錄及保護節雜湊 |

## 6. 失敗路徑

來源缺失、只有Windows執行檔、版本/模組缺件、插件不相容、Build失敗、只有載入畫面等，皆交部分查核並列精確阻礙；不得把工單排隊、影片連結或空白loader寫成WebGL完成。需要使用者提供來源/TF-BASE執行通道時，一次彙整交由主控詢問。

## 7. 官方來源（2026-10-22查核）

- [Unity 6.5 Web部署與壓縮header](https://docs.unity.com/en-us/engine/6000.5/manual/platform-specific/webgl/building-distribution/deploying)
- [Web多執行緒](https://docs.unity.com/en-us/engine/6000.5/manual/platform-specific/webgl/develop/web-multithreading)
- [.NET API支援範圍](https://docs.unity.com/en-us/engine/6000.5/manual/platform-specific/webgl/develop/web-dotnet-api-support)
- [Web原生插件](https://docs.unity.com/en-us/engine/6000.5/manual/platform-specific/webgl/develop/native-plugins-with-emscripten)
- [Web記憶體](https://docs.unity.com/en-us/engine/6000.5/manual/platform-specific/webgl/develop/memory)
- [Web音訊](https://docs.unity.com/en-us/engine/6000.5/manual/platform-specific/webgl/develop/audio)
- [Web影片](https://docs.unity.com/en-us/engine/6000.5/manual/platform-specific/webgl/develop/video)

上述為平台能力與限制，不代表兩款專案已相容。來源尚未取得，沒有對未讀程式下結論。
