# WO-05 執行報告

分支 `codex/wo-05-delete-list`；狀態：完成，4/4。未刪除、未移動任何既有檔案，未 push、未碰 main。

產出 `work-orders/20261021/DELETE-LIST-creative-line-v1.tsv` 與同名 `.md`。清單屬建議刪除，尚未獲使用者刪除確認。

## 實際驗證與逐條結果

1. yes：`git ls-files play/creative-line/_v1-rejected` 29 檔；Node 遞迴檔數、TSV 資料列 29。逐列 fs.readFileSync 與 crypto.createHash('sha256') 重算：29/29 一致，共 32,706,545 bytes；BOM false、CR false，UTF-8 無 BOM／LF。
2. yes：每筆 `git log --follow --format=%H --name-status -- <現路徑>` 追到搬遷前來源；29 個 `git show 8914554:<原路徑>` 實際輸出非空。27 張 PNG 的位元組與 SHA 完全相同；兩個文字檔 Git LF／工作樹 CRLF，正規化後全文一致。首次嚴格位元組比對在 mask-seeds.json 中止，確認為換行差後才分流文字檔比較，未更動來源檔。
3. yes：引用掃描有 4 行（非 0），已完整放入清單 md：LATEST_HANDOFF.md 1 行、prep-art.mjs 3 行。現行 runtime 無引用，舊工具仍需另案處理。
4. yes：新增清單後 `git status --short` 只有兩個工單產出，另有開工前既有 codex-prompt-run2.txt；交付時再加入本工單明訂的報告，無其他修改。

抽三筆 `git show` 執行證據（Node execFileSync Buffer，避免 PowerShell 轉碼）：

```text
git show 8914554:play/creative-line/art/cover.png
bytes 3661618 / SHA c02fa78b763413b8eda25d29d29f9ba292ee7f12b5807c935dec3dfb1c44c352
git show 8914554:play/creative-line/tools/mask-seeds.json
非空，LF 正規化後與現檔一致；現檔 127 bytes
git show 8914554:play/creative-line/routes.js
非空，LF 正規化後與現檔一致；現檔 2882 bytes
```

可重跑的 SHA 與筆數驗證（PowerShell 貼上，僅讀取）：

```powershell
@'
const fs=require('fs'),crypto=require('crypto');
const b=fs.readFileSync('work-orders/20261021/DELETE-LIST-creative-line-v1.tsv');
const rows=b.toString('utf8').trimEnd().split('\n').slice(1);
for(const row of rows){const [p,size,sha]=row.split('\t'),buf=fs.readFileSync(p);if(buf.length!==+size||crypto.createHash('sha256').update(buf).digest('hex')!==sha)throw Error(p);}
console.log('SHA verified '+rows.length+'/'+rows.length+'; BOM='+b.subarray(0,3).equals(Buffer.from([239,187,191]))+'; CR='+b.includes(13));
'@ | node
```

`node --test tests/en-play.test.mjs` → tests 12 / pass 12 / fail 0。ui-policy 是刪除後驗證，未執行；不在本輪範圍的修正與刪除都沒有做。

`git diff --cached --stat` 提交前執行：僅兩份清單與本報告，完整數字見提交。下一步：使用者確認清單後，另派刪除工單，刪前重新驗 SHA，並處理 prep-art.mjs 舊路徑引用。
