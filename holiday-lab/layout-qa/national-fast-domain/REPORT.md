# 國慶快速全集設計包：供審碼，全集未啟動

目前可交付：實源完整文字域模型、42 段 frozen AST 原文的 review-only 快法 draft、stream NDJSON／gzip 保存 prototype、13 項實跑測試、既有 pilot 的無損壓縮實驗。原生快法等價、320×900 校準、paint 因果隔離與 production resume runner 尚未完成，不能啟動長批，也沒有 GLOBAL PASS。

主要檔案：`PLAN.md`（完整路徑與資源／續跑設計）、`model.cjs`／`domain.json`、`extract-draft.cjs`／`fast-draft.js`／`extraction.json`、`gzip-store.cjs`、`compression-result.json`、`planning-receipt.json`、`resource-receipt.json`。

| 驗收 | yes／no | 實際證據 |
|---|---|---|
| 現 served source 與原08一致 | yes | `prepare-output.txt`，四份原 source SHA 逐筆相同 |
| 保留完整 readout 5,492,196 計算 | yes | 每語915,366，三語兩寬；相同 camera 下耦合 mid／far，原 toFixed(1)，未拼接聯集 |
| 完整拒絕 hint＋readout joint域 | yes（來源模型） | 每語1,830,117，三語兩寬10,980,702；原 capture 統計分支與615成功排除明列於 `domain.json` |
| 當作所有控制狀態的 native layout 等價 | no | 來源字串去重不等於 DOM／numeric layout 證明；`projection_proven:false` |
| 新 fast 與 full frozen 原生等價 | no | AST 幾何原文保留42段，只完成靜態查核；尚無國慶 fast native 校準 |
| 舊手機 pilot 可當320×900 | no | 舊程式皆 height1000，缺900校準；未重做10真例／60探針 |
| 原paint hit-order可以無條件略過 | no | 待因果隔離／完整法負例；draft明列scope未閉 |
| NDJSON／gzip stream完整保存 | yes（工程與既有資料） | 每row原欄位保留、原行rolling／raw SHA／gzip SHA；stream解壓逐值比原資料 |
| 既有pilot壓縮實驗 | yes | 99存檔records，4,576,303→220,312 bytes，4.814%；不是全集容量保證，native新增0 |
| 磁碟保留與硬停 | yes（prototype） | 真負例：32GiB保留參數、每檔64MiB上限；碰限保留uncredited partial，無complete receipt、自動重啟false |
| production跨批64GiB總上限／CIM續跑runner已完成 | no | 已設計，未實作；prototype不得冒充全集engine |
| 長全集／任何新native | no | 新量測0，沒有可預設啟動的engine |
| 產品／sampler／map／中秋檔案變動 | no | 只新增本目錄，未stage／commit／push／main／刪檔 |

實際命令與輸出：

```text
node holiday-lab/layout-qa/national-fast-domain/model.cjs
readout_per_language915366; six_context_readouts5492196;
joint_error_pairs_per_language1830117; six_context_joint_error_pairs10980702;
native_measurements_performed0; global_bound_provenfalse
exit0

node holiday-lab/layout-qa/national-fast-domain/extract-draft.cjs
REVIEW_ONLY 42 exact AST statements; native calls=0; equivalence=NO; no engine enabled
exit0

node holiday-lab/layout-qa/national-fast-domain/prepare-review.cjs
served_source_matches_original08true; existing_true_cases10; new_native_measurements0;
mobile900_equivalencefalse; fast_equivalencefalse
exit0

node holiday-lab/layout-qa/national-fast-domain/compress-existing-pilot.cjs
rows99; raw_bytes4576303; gzip_bytes220312; ratio0.048141917176375774;
losslesstrue; new_native_measurements0; full_domain_capacity_guaranteedfalse
exit0

node --test holiday-lab/layout-qa/national-fast-domain/model.test.cjs holiday-lab/layout-qa/national-fast-domain/store.test.cjs holiday-lab/layout-qa/national-fast-domain/draft.test.cjs holiday-lab/layout-qa/national-fast-domain/gzip-store.test.cjs
tests13 pass13 fail0
exit0
```

真紅缺模組輸出保留 `model-red-output.txt`、`store-red-output.txt`、`gzip-red-output.txt`；後續綠保留 `tests-output.txt`。測試小型合成 fixture 都留在本目錄，明列 native_credit=false，沒有刪除或當成原生量測。

下一個最小必要工作是 root 審核聯合域計數與快法 AST adapter／環境守門，再明確授權小型等價校準；在 paint／900尺寸／source因果問題未閉前，不做任何完整域啟動。
