# WO-04 執行報告

分支 `codex/wo-04-en-check`。狀態：部分完成，3/5。未 push、未碰 main。

完成 validate.mjs 搬移（僅路徑改成 repo data/、data/en/，預設列八份翻譯檔），保留全部驗證規則。官方開頁查證青春設計節與智冠名稱；改 15 個名稱字串，移除 9 個 CHECK。對照與逐筆 JSON 路徑見 `docs/qa/en-check/20261021-batch1.md`。

## 實際指令與輸出

`node tools/validate-en.mjs`（exit 1）：

```text
admission.json PASS [CHECK]=0
curriculum.json PASS [CHECK]=0
faculty.json FAIL 1 [CHECK]=200
   - 純英文原值被改 $[9].certs
labs.json PASS [CHECK]=0
news.json PASS [CHECK]=37
stats.json PASS [CHECK]=265
videos.json PASS [CHECK]=0
works.json PASS [CHECK]=16
```

`node tools/validate-en.mjs stats news works faculty` 同樣前三個 PASS、faculty FAIL 1，exit 1。改前即為相同錯誤（201 CHECK），非本輪引入。原中文 certs 內的頓號變英文逗號；此欄為證照敘述，不屬名稱覆核，未越界改它或放寬驗證。

`node --test tests/en-play.test.mjs`：tests 12 / pass 12 / fail 0。

以 Node 讀 `git show feature/en-site-and-play-zone:data/en/<檔>.json` 與現檔遞迴比較 Object.keys、型別、陣列長度與非字串值，實際輸出：

```text
STRUCTURE PASS: only 15 string values changed; keys/order/arrays/numbers unchanged
```

| 檔案 | 改前 CHECK | 改後 CHECK | 減少 |
|---|---:|---:|---:|
| stats | 273 | 265 | 8 |
| news | 37 | 37 | 0 |
| works | 16 | 16 | 0 |
| faculty | 201 | 200 | 1 |
| 合計 | 527 | 518 | 9 |

來源交接寫 513，本 clone 實際四檔為 527，以實測為準。15 筆名稱修正中，6 筆是混合摘要／多獎項名稱，仍有未查項目，保留 CHECK；不能以移除標記來湊數。

## 驗收逐條

1. no：保留 baseline faculty certs 失敗。其餘七份 PASS，未宣稱全部 PASS。
2. yes：兩列皆實際開啟官方頁，有標題／短摘錄；金點官方 403／502，不採摘要、未改。
3. no：527→518 確有下降，下降 9 不等於名稱修正影響筆數 15。逐筆表的「移除標記數」合計精確為 9；避免將尚待查的混合句誤標完成。
4. yes：結構比較 PASS；15 個字串值變動，未動鍵、順序、陣列長度、數值與中文原檔。
5. yes：12/12；僅白名單加本報告，既有 codex-prompt-run2.txt 未動。

## 修改統計與下一步

`git diff --stat`：faculty.json 2 行、stats.json 28 行；新增 tools/validate-en.mjs、名稱對照文件、本報告。沒有動 JSX，未 build。

下一步：主控另開證照標點校正；官方頁可讀時續核金點、KT、金犢、合作機構法人名稱；6 筆混合名稱維持 CHECK，不視為整句已查證。
