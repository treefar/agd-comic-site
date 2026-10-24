# 英文 21 未成對／21 衝突逐筆核對

source_agent: codex；2026-10-24。唯讀產品、未切分支；只寫本資料夾，未 push／發布／main／刪檔／C 節／遊戲／Unity／生圖操作。

這 42 筆並不是 42 個目前畫面漏譯。21 個未成對路徑對應 39 個底層字串出現位置、30 個不同 key，全已有 `data/en/ui.json` 的 exact 英文；現行 loader 讀中文正本，再由全域字典顯示，因此沒有這批資料的 runtime 漏譯。主要問題是 `data/en/stats.json` 沒跟上中文正本。完整逐筆資料及分類在 [inspection.json](inspection.json)、[proposal.json](proposal.json)；每筆有實際中文／EN／字典、物理 JSON pointer 與顯示風險。

最小提案為 25 個 EN 資料操作：21 個衝突正規化、4 個結構新增。用實際 `scripts/build-translations.cjs` 原碼在記憶體虛擬 fs 套前後跑，未寫產品：unpaired 21→0、conflicts 21→0，最終有效字典 key/value 變更為 0。驗證 66 yes／0 no、exit 0。這證明資料對齊及現有顯示不變，不證明未查明英文專名已正確。

## 21 個 unpaired

| 路徑 | 數量 | 實況／處理 |
|---|---:|---|
| awards.highlights[5] | 1 | 缺 114 年度 39 件物件；已有 AY 114 字典，數字複用同一 canonical，不推算 |
| awards.groups[0] | 1 | 缺 2026／114 整群，10 個字串已全有 exact UI 翻譯 |
| awards.groups[113年度].items[0..17] | 18 | 中文 18、EN 17；建置器保守拒絕依索引配全部，因此一筆新增造成 18 個警告 |
| honors.groups[0] | 1 | 缺 2026／114 整群；與 awards 共 9 條項目重複，但群名不同，各有 exact UI key |

113 年度逐條對比年度、屆次、獎別、作品及原 EN 內中文後，確認只缺「第21屆全國技專校院電腦動畫競賽，四部佳作」一筆。proposal.explicit_item_alignment 列出全部 18 筆的精確原 EN pointer、完整原文與逐項識別依據；不是從一個樣本推出後面全都偏一格。插入缺筆後保留 17 個原 EN 字串及原 CHECK，不順手重翻。

四個實際新增操作依序為：114 highlight append、在原 AY113 第 9 項後插入缺筆、prepend awards 2026 群、prepend honors 2026 群。前面 21 個 conflict replace 先做；proposal 記明序列及 before guard，避免 prepend 後舊指標移位。

兩個新群共 18 條項目加上缺筆 1 條，均只複用已存在 UI 譯文，另加 `[CHECK]` 保留未核影展／作品正式英文名。這是開發資料註記，原建置器會移除顯示用 CHECK，再以原 UI exact 值覆蓋；不是移除待核義務。`Android／Cyborg`、`The Stolen Recipe／The Stolen Secret Recipe` 等舊研究已列待核，這次沒有建立新別名等值，也不把「字典已有」說成「作者正式片名已查證」。

## 21 個 conflicts

| 分類 | 筆數 | 處理及讀者風險 |
|---|---:|---|
| 同一中文姓名、EN 拼法不同 | 13 | 涵蓋 6 位教師；複用已存本系英名，不新造姓名，現行全域值本已取該英名 |
| 同一句費用翻譯語序／waivers 差異 | 4 | 同義，複用第一個既存 EN；不因此核准學費金額或貸款資格 |
| 研討會括號中文誤植 | 1 | 英文主句相同，括號「跨域級」應為「跨域設計」；複用正確原 EN，CHECK 保留 |
| 莫忘書衷作品名後冒號差異 | 1 | 複用已有冒號版本，作品英名及獎項 CHECK 保留 |
| Events／Event 分類單複數 | 1 | 複用已有 Events，沒有改分類邏輯 |
| soothing-sounds.kind 遊戲／Animation | 1 | 真義衝突；EN 來源改為 Game。現行畫面已因字典先取 Game 而正確，直接使用 EN 資料時才會重現錯分類 |

姓名逐人依官方中英對照核讀：陳美蓉 CHEN, MEI-JUNG、江雅媚 CHIANG, YA-MEI、鄧樹遠 TENG, SHU-YUAN、邱士展 CHIU, SHIN-CHAN、陳慶鴻 CHEN, CHING HUNG、張純雅 CHANG, CHUN-YA。[本系教師頁](https://www.dgd.stu.edu.tw/系所成員/) 本系頁陳慶鴻是 CHING HUNG，既有資料保留 CHING-HUNG 的連字號格式；本提案複用目前顯示值，沒有宣稱大小寫／空格／連字號每個字元都與網頁逐字相同。本輪沿用今日已保存的官方搜尋正文收據 `overnight-20261024/program/web-research-02.json`，其來源讀取層次與 403 邊界不變，不冒稱新的原生瀏覽器全文。

另查張純雅官方頁，研討會列表明列「2022第十五屆跨域設計產學國際研討會」，可支持括號中文修正；未查得此次會議官方英文專名，不移除 CHECK。[官方教師研討會列表](https://www.dgd.stu.edu.tw/系所成員/張純雅/) 本次原始回應在 web-research.json。沒有把某一教師頁當作全部姓名、職稱或會議英名的依據。

## Runtime 與實際顯示的邊界

已讀 `pages.jsx` useDataset，實際 fetch 是 `data/${type}.json`，不是依語言讀 `data/en/${type}.json`；`en-pages.jsx` 的 siteText 先以正規化 exact key 查全域字典。`build-translations.cjs` 先處理成對來源，衝突保留先到值，最後 UI／指南／editorial／flow 依既定順序覆蓋。因此這次不修改配對器或 runtime，也不把 audit.unpaired 直接解讀成漏了 21 筆英頁資訊。

所有 42 個警告逐筆都有 canonical、EN 定義、dictionary 值、override 來源和風險。21 個 conflict 是出現次數，並非 21 個不同 key。對齊後字典變更 0，表示修正目前被字典遮住的資料債；不以數字歸零掩蓋舊 UI 翻譯及專名仍待查。完整英文語意／正式名確認仍是獨立工作。

## 實際驗證

```text
node holiday-lab/reports/followup-20261024/i18n/run.cjs
{"unpaired":21,"conflicts":21,"unpaired_matches_frozen":true,"conflicts_match_frozen":true,"dictionary_matches":true}
# 隨後 stdout 逐筆列出 21 U 與 21 C，完整在 commands.json
{"classifications":42,"conflict_fixes":21,"unpaired_structural_fixes":4,"operations":25,"product_written":false}
{"yes":66,"no":0,"unpaired_before":21,"unpaired_after":0,"conflicts_before":21,"conflicts_after":0,"effective_dictionary_changes":0,"product_written":false}
exit code 0
stderr: ""
```

run.cjs 真正以 spawnSync 分流保存各子指令 stdout／stderr／exit；每條 yes/no 及虛擬建置前後結果在 verification.json。原始 build 程式在 VM 內使用記憶體 fs，4 個 writeFileSync 全被攔成記憶體輸出，不改 locale 或 docs/qa。程式碼／runtime 沒變，本輪未實際 Build 或另跑瀏覽器；不得把模擬結果冒充新成品驗收。

初版有一條真正的序列 before guard 失敗：先插入 AY113 缺筆後，prepend 該組仍拿原 17 項當 before。原 proposal／commands／verification-red01.json 全保留。修正的是提案 guard，使其綁定插入後 18 項狀態；沒有放寬比較或改產品來配合。最新 66/0 為改正後新跑。

| 完成條件 | yes/no |
|---|---|
| 42 筆全部逐筆分類並有物理指標 | yes |
| 與前輪 frozen 21／21 路徑逐筆一致 | yes |
| 17 舊 AY113 字串與 CHECK 全保留 | yes |
| 新增只複用已有 exact UI 譯值 | yes |
| 實際配對原碼記憶體模擬 0／0，字典差異 0 | yes |
| 產品已套用、真實 Build 或代表頁複驗 | no |
| 未查明專名／整站母語及數據已批准 | no |

主控若套用：先核各 before、按記載序列在 codex 分支套 25 操作，重產翻譯與新本機候選；確認 catalog 0／0、有效字典與本輪基線一致、CHECK 待核未抹掉，再看英文 awards／honors／soothing-sounds 代表頁，不需要重跑節日遊戲或舊巨量 QA。
