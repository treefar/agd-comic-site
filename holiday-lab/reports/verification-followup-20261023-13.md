# 本機全面試作：可見證據整合與全集續跑

2026-10-23，source_agent: codex。前一goal輪完成專責語言複核派工及13人譯值重驗，屬進展；本輪完成主控離線核對並保存嚴格可見覆蓋，另確認兩個特定長任務實際存活。全案尚未完成，不發布。

## 讀者可見成果與目前限制

8款遊戲的窄版中英日有限拒絕提示已補150次真操作與165張新圖；81張舊secondary證據逐筆跨run綁定，不冒稱新圖。原先選中畫面不在viewport的24個窄版項已撤回。加入開學完整session的90項後，權威規劃索引為1914/2076、缺162，與完整nodes組裝計畫逐key相符。官方R0仍未替換，不能據此宣稱全案UI通過。

日文兩個末行「に。」「く。」仍列可讀性P3；幾何不越界不代表使用者要求的孤字問題已全面解決。原失敗旗標、清明及開學原採集缺after與未知末旗標各1都保留。

## 本輪實際指令與輸出

工作目錄：`C:/agywork/agd-holiday-prototypes`。

```text
node --test holiday-lab/tests/layout-report-store.test.cjs holiday-lab/tests/layout-static-proof-contexts.test.cjs holiday-lab/tests/semester-session-evidence.test.cjs holiday-lab/tests/finite-visibility-scope.test.cjs holiday-lab/tests/finite-visibility-integration.test.cjs
ℹ tests 28
ℹ pass 28
ℹ fail 0
# root exit0；含SHA、錯誤context、不可見窄版、覆蓋升級及session來源負例

node holiday-lab/layout-qa/finite-hints-native-20261023/verify.cjs run-01
# root session7819，exit0
"pass": true, "contexts": 24, "finite_keys": 50,
"actual_refusals": 150, "new_png": 165,
"reused_secondary": 81, "required_secondary": 96,
"new_case_geometry_error_count": 0,
"source_and_font_stable": true,
"full_project_approved": false

node holiday-lab/translation-review/check-current-ranks-20261023.cjs
# root exit0
"count": 13, "expected_values_match": "13/13",
"product_files_written": 0, "pass": true
```

28測試先前紅綠及獨立重建舊版負例證據保存在 `finite-viewport-audit-20261023/independent-review/`、`semester-session-composite/`。本輪重跑未修改產品，未執行新網站Build或上線測試。新165補證尚待嚴格typed adapter接入索引；peace/retro新60圖已有derived trace 4/4測試，但完整892舊sample/fullcase與新60圖綁定仍由獨立代理續做，不能計為12個已閉合canonical。

## 長任務：依真程序判斷

主控 `Get-Process -Id 18628,68760,2352,57024` 於本輪均回傳真程序及StartTime/CPU。中秋全集engine18628、driver68760為同一份03:31:28.847Z啟動工作；stdout由97144前進至109432/404688，GLOBAL=NO。凍結manifest SHA `64b5b6840c243d33cee047b1c3e206ea43a30904b134636d920387505b6d3448`；完整串流驗證、極值及固定seed完整UI仍待全集結束。不得改凍結runtime或因觀測逾時重跑。原3072繼承，非重新測量。

清明舊46996已terminal，舊聚合JSON字串爆限；代理恢復1042 fullcase並獨立重驗。只有ja1440缺線由2352/57024補採，原另外5線不重跑。恢復不等於補回缺失after，舊unknown=1仍NO。

## yes／no驗收

| 項目 | yes／no | 實際證據 |
|---|---|---|
| 開學684補採完成，完整12session可嚴格組合90項 | yes | semester-missing-native-20261023/verification.json、semester-session-composite/evidence.json |
| 選中畫面不可見不得升級覆蓋 | yes | finite-viewport audit與28 tests中的負例 |
| 索引1914／缺162，組裝逐key相同 | yes | coverage-bound-current.json、plan-consistency.json |
| 新165圖與96 secondary義務離線核對 | yes | root verify exit0，原165sample/PNG與81跨run收據 |
| 這些新補證已全部轉為canonical | no | typed adapter／完整join未完成 |
| 中秋404688全集完成且全域驗證 | no | 真程序仍live，GLOBAL=NO |
| 所有遊戲數值域、UI method與最新來源全部閉合 | no | 國慶等域及source provenance尚未完成 |
| 日英13師資職級當前譯值一致 | yes | root13/13；不代表個人最新聘任認證 |
| 28譯值候選已套產品、全站母語驗收 | no | 專責複核中，候選未套用 |
| 新Build／新試玩包／發布／push | no | 本輪QA工具及文件，8800與舊ZIP保留 |
| 官方R0、C節與origin/main保持原指紋 | yes | verification13-invariants.json |

接續順序：確認同一長任務；完成有限提示與peace/retro typed join；清明完整補採後整合；中秋全集串流及真UI極值/seed驗證；再處理國慶與其餘未閉合域。TF-BASE兩個WebGL來源仍待回，沒有啟動Unity。資料與圖片保存本機，不宣稱尚未進版控的raw已有跨機備份。

## 本機版控保全

新增限於本批六個證據目錄及四個SHA綁定方法檔的 `-text` attributes，避免Windows的core.autocrlf=true使未來checkout改掉原始位元組。實際以 `git hash-object --no-filters --stdin-paths` 比對index：577 staged files，其中569個QA檔逐筆raw-byte blob相符，hash_mismatches=0。未碰執行中的中秋raw/manifests或清明補採，也沒有重啟程序。

`git diff --cached --check`回報舊紅燈工具輸出中的三行尾端空白，以及finite-errors報告末尾空行。前者為原始失敗證據，刻意保留不清洗；不宣稱全部diff whitespace通過。主控修改的coverage-index、assembly-plan、STATUS定向diff-check通過。這些空白不是產品或執行碼錯誤。

## 本輪收尾更新

清明2352/57024已於03:48:29.960Z正常exit0，193frames；代理完成193份SHA/geometry與三shot/retry，root已讀報告，6context合併驗證仍在建置，不計新覆蓋。日英複核主控verify實跑exit0：17來源穩定、13人、28候選（27保留/1獎助金保義微調）、productWrites0。和平/光復candidate verifier主控exit0，但root另發現完整domain最大面積須有明確assert；12筆實值比對皆相等，正在補負例守門，暫未接索引。勞動的完整輸入含start值，不能稱729；僅負載文字有729指派投影待源碼因果與實UI校準。

已本機提交c7a0e68（可見證據與方法）、3791fc1（106穩定全集方法/凍結啟動檔）；569及106份分別逐筆raw-byte blob核對一致，freeze SHA不變。兩repo fsck connectivity exit0，列有dangling objects，保留未清理。原repo交接提交fdf0a1d；本段後續更新另作本機提交，不push。
