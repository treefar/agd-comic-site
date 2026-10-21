# 建議刪除清單：創作不斷線 v1

狀態：建議刪除，未執行，待使用者於對話確認。

共 29 檔，32706545 位元組。類型：封面、三張路線、兩張課程卡（原圖與 web 縮圖）；UI 切片與圖集；特效切片與圖集；routes.js 與 mask-seeds.json。

29 筆均逐筆跑 git log --follow，全部可追到 8914554 的原路徑；再逐筆 git show 驗證非空與內容。27 個二進位完全同 SHA；兩個文字檔因工作樹 CRLF 與 Git blob LF 不同，統一 LF 後一致。TSV 的 SHA 是工作樹實際位元組，不是 blob SHA。

## 建議的刪除指令（目前勿執行）

使用者確認後，先重算 TSV 每列 SHA-256 與位元組數，完全相同才執行。以下每行一個字面路徑。

```powershell
git rm -- "play/creative-line/_v1-rejected/card_anim.png"
git rm -- "play/creative-line/_v1-rejected/card_code.png"
git rm -- "play/creative-line/_v1-rejected/cover.png"
git rm -- "play/creative-line/_v1-rejected/fx/confetti.png"
git rm -- "play/creative-line/_v1-rejected/fx/gate.png"
git rm -- "play/creative-line/_v1-rejected/fx/orb.png"
git rm -- "play/creative-line/_v1-rejected/fx/spark.png"
git rm -- "play/creative-line/_v1-rejected/fx/stamp.png"
git rm -- "play/creative-line/_v1-rejected/fx_sheet.png"
git rm -- "play/creative-line/_v1-rejected/mask-seeds.json"
git rm -- "play/creative-line/_v1-rejected/route1.png"
git rm -- "play/creative-line/_v1-rejected/route2.png"
git rm -- "play/creative-line/_v1-rejected/route3.png"
git rm -- "play/creative-line/_v1-rejected/routes.js"
git rm -- "play/creative-line/_v1-rejected/ui/btnBack.png"
git rm -- "play/creative-line/_v1-rejected/ui/btnMute.png"
git rm -- "play/creative-line/_v1-rejected/ui/btnPause.png"
git rm -- "play/creative-line/_v1-rejected/ui/btnPrimary.png"
git rm -- "play/creative-line/_v1-rejected/ui/btnSecondary.png"
git rm -- "play/creative-line/_v1-rejected/ui/btnSound.png"
git rm -- "play/creative-line/_v1-rejected/ui/panelCard.png"
git rm -- "play/creative-line/_v1-rejected/ui/panelResult.png"
git rm -- "play/creative-line/_v1-rejected/ui_sheet.png"
git rm -- "play/creative-line/_v1-rejected/web/card_anim.png"
git rm -- "play/creative-line/_v1-rejected/web/card_code.png"
git rm -- "play/creative-line/_v1-rejected/web/cover.png"
git rm -- "play/creative-line/_v1-rejected/web/route1.png"
git rm -- "play/creative-line/_v1-rejected/web/route2.png"
git rm -- "play/creative-line/_v1-rejected/web/route3.png"
```

## 建議的復原方式

見 TSV 每筆 git show 指令。復原二進位時，建議以 Node execFileSync 取得 Buffer，再 fs.writeFileSync 回該列相對路徑；避免 Windows PowerShell 5.1 > 的文字轉碼。兩個文字檔視需求轉回 CRLF。原來源：mask-seeds.json 位於 play/creative-line/tools/，routes.js 在遊戲根目錄，其餘逐筆追到 art/；未用單一樣本推定。

## 引用掃描（非 0）

```text
rg -n --hidden -g !.git/** -g !node_modules/** -g !play/creative-line/_v1-rejected/** -g !work-orders/** "_v1-rejected|art/web/|art/ui/|art/fx/|routes\.js|mask-seeds\.json" .

.\LATEST_HANDOFF.md:22:2. `_v1-rejected` 29 檔要不要刪（WO-05 清單）。
.\play\creative-line\tools\prep-art.mjs:4:// 輸出：art/ui/*.png、art/fx/*.png（洋紅底去背後依序切開）、masks.js（碰撞用的可走區遮罩，來自路線圖的米色路面）、art/web/*（縮圖版）
.\play\creative-line\tools\prep-art.mjs:125:  const GW = 300, GH = 450, cfg = JSON.parse(fs.readFileSync(path.join(here, "tools", "mask-seeds.json"), "utf8"));
.\play\creative-line\tools\prep-art.mjs:163:      if (!reach) throw new Error(`${name}：半徑 ${rpx}px 時起點走不到終點，請調 mask-seeds.json 的 tol 或重生路線圖`);
```

LATEST_HANDOFF.md 是歷史待辦；prep-art.mjs 是舊前處理工具，仍引用 art/ui、art/fx、art/web 與 tools/mask-seeds.json，另有錯誤訊息字串。建議另開工單處理舊工具與交接記錄，本輪未改。未找到現行遊戲 runtime 引用。這些引用處理完成後才算清乾淨。

## 刪除後要跑的驗證（尚未刪除）

```text
node --test tests/en-play.test.mjs
node C:/AIHome/claude/skills/game-ui-art/scripts/ui-policy.cjs --project play/creative-line
```

後者預期仍因四張實景圖報非 Codex 來源，屬使用者既有例外；本輪未執行會寫報告的 ui-policy。
