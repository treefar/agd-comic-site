# 指南快捷與孤尾修整：獨立本機02版

2026-10-23，source_agent: codex。分支 `codex/plain-guide-layout`，自 `ffb00e52a694e34717ee3a6353d40cca5f81e6d3` 分出；12個保義翻譯提交 `382f9c788677d637d43c28f933f092c123538e93` 保留不改。

只在 `student-guide.css` 尾端追加5行布局／換行規則：手機常用項目改單欄，按鈕採正常詞組換行，閱讀段落避孤尾，短摘要與聯絡說明採均衡換行。沒有改字型、字級、文案、人名、資料、縮放、隱藏或截字。

新候選 <http://127.0.0.1:8865/?lang=zh#/students/guide>，建置 `.measure-plain-copy-20261023-02`；原01／8864連同freeze、14個真孤尾及失敗證據完整保留，不當通過候選。主樹8863學生作品首頁仍是原先主視覺審閱版；此分支維持獨立，不合併主樹、不重用8863全站收據。

## 真RED與根因

獨立代理在原01的zh320、字型loaded時抓到14個真孤尾：8個快捷按鈕均3字＋1字；身分提醒、證照／請假／加退選／權益摘要及底部聯絡說明有單字加標點末行。原圖 `plain-copy-independent-20261023/red-zh320-00..13.png` 與 `red-layout-minimal.json` 的exact selector／Range／PNG SHA保持原樣。

原手機常用項目仍2欄，113px按鈕扣掉padding、箭頭、gap後放不下4個中文字；原摘要採一般換行，不會主動避免末字孤行。先完整讀student-guide.css及相關selector後，作者用同14個exact selector在原8864再現：`red owners14 orphan14 overflow0`，真exit1。原圖已目視，未把測試工具標記當唯一依據。

## yes／no與實際指令

下列省略前綴均為 `holiday-lab/translation-review/plain-copy-layout-20261023/`，cwd為 `C:/agywork/agd-plain-guide-copy`。

| 驗收 | yes／no | 實際結果 |
| --- | --- | --- |
| 原14個孤尾可重現 | yes | `node .../probe.cjs red` → actual exit1，14/14孤尾、overflow0；red.json／red.png |
| 寫來源CSS前先有失敗測試 | yes | `node .../command.cjs source-red --test .../layout-source.test.cjs` → exit1，tests2／pass1／fail1；沒有CSS追加時必失敗 |
| 只追加核准CSS，不動字型與字級／藏字 | yes | source-green → exit0，2/2；原CSS完整作prefix，新增內容精確等於candidate.css，並拒font/size/line-height/zoom/transform/hidden/clip類屬性 |
| 原12翻譯／其他16候選仍保持 | yes | `node .../command.cjs copy-regression --test holiday-lab/translation-review/plain-copy-20261023/copy.test.cjs` → exit0，16/16；17封存翻譯來源SHA完全相同 |
| fresh02建置成功 | yes | `node .../command.cjs build02 holiday-lab/build-review.mjs .measure-plain-copy-20261023-02 --measurement` → actual exit0，360files，app-X5G5MOSD.js；build02.json保留完整命令與stdout |
| 01所有360檔仍不變 | yes | `node .../freeze.cjs` → old01360 unchanged；原freeze與舊build逐檔重核 |
| 02與01唯一內容差異為指南CSS | yes | build-delta.json：360檔集合相同、359逐byte相同，唯一changed=student-guide.css；bundle相同不代表用舊頁測新CSS |
| 新8865正式六組全可見葉文字 | yes，所選範圍 | `PLAIN_LAYOUT_URL=http://127.0.0.1:8865 node .../leaf-check.cjs` → actual exit0；zh/en/ja ×320/1440，6/6、6656 rendered leaf、4508 owner、孤尾0、overflow0、JS pageerror0，所有量測fonts loaded |
| 所有流程、來源、FAQ均真正展開後量測 | yes | 六組各真點15流程、15來源、30FAQ summary，再TreeWalker讀rendered文字；每組1108–1110leaf，750–752owner。沒有為跳過內容改篩選或隱藏 |
| 保持獨立判定原樣 | yes | `measure-v2.snapshot.cjs`是獨立代理提供工具的byte-copy，與原檔SHA均373d5aefb978244293076c5ba2fff94c0320adcaee58208256d85f5fcd9376e1；不改其孤尾條件 |
| 實際畫面可見快捷鈕整詞 | yes，作者有限檢視 | 已目視新02 zh320截圖，八快捷單欄、4字完整；不是使用者畫面已確認 |
| 新版獨立驗收 | no，本作者不預填 | 已交同一代理fresh02／8865／freeze-v2.json；獨立結論由主控整合 |
| 全站／遊戲／實體裝置／發布通過 | no，非本次範圍 | 未跑全站或遊戲QA；不宣稱所有寬度、所有互動狀態、母語全文或發布門檻通過 |

正式作者raw：`actual-2026-10-23T10-33-03.096Z/result.json`，含6PNG、6656份原leaf記錄與4508組文字／Range行／font資料。這是實際build CSS，沒有注入style。freeze-v2.json含18來源與360建置檔的精確SHA。

## 診斷與失敗保留

- candidate.css先以暫時CSS注入原8864做診斷，原14owner轉0；這批不是正式通過證據。注入前後字型font值相同。
- 第一版全leaf診斷將末行「助）·07-…」中的數字排除後錯算成僅一字，且未對齊獨立代理的圖示與owner分組，曾回報額外17個候選。原 `diagnostic-2026-10-23T10-28-58.039Z` 與leaf-check-v1.cjs.txt保留，不當成真產品bug或通過收據。
- 之後使用獨立代理已提供且凍結的measure-v2原bytes快照，保留所有rendered leaf、inline全文與混合行框；aria-hidden裝飾不量測，純icon／數字不作孤尾拒絕但仍可留在leaf清冊，不改判定。新注入診斷6/6通過，才落來源CSS；正式02另以新6組真頁驗證，不用注入結果代替。
- 英文完整單字末行另有englishSingleWholeWordLastLine資訊保留，不把正常英文短標兩行直接判成單字母孤行；不是降低CJK一字加標點的拒絕條件。

## 範圍與重啟

產品只改student-guide.css；本目錄是唯一新證據範圍。沒有改plain-copy原input、01freeze、原測試／失敗或獨立代理檔案。沒有覆寫其他工作者變更，未push、發布、main、刪檔、C節、勞動節或Unity。Build照原工具寫本副本latest-build.json，這份記錄副作用不帶進內容提交。

8865開始前確認沒有listener，服務只bind127.0.0.1；目前exec session68289。重啟時先確認既有程序：

```text
node scripts/serve-local-review.cjs --site=.measure-plain-copy-20261023-02 --dashboard=holiday-lab/dashboard/out --port=8865
```

整合與使用者審閱由主控安排；不能因本次選定指南6組通過而把整站／所有遊戲或其他16候選升格。
