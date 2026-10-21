# hide-pending

日期：2026-10-21（目錄依工單用 20261022）。

隱藏 team/year 的待補行，credit/license 含待補的片段也不顯示；不改資料。新增中英頁實際瀏覽器回歸測試。build 的既有 duplicate color 警告仍在，未越界修正。

分支：codex/hide-pending；基準：e492e58。

| 驗收 | yes／no | 證據 |
|---|---|---|
| 兩頁五張卡無待補 | yes | PLAY-CARDS 各 cards=5 pending=0 |
| creative-line 保留 team · year | yes | 回歸測試逐語系核對 |
| 測試全過 | yes | 17/17；原版新增測試先失敗，再修復轉綠 |
| 範圍／無刪檔 | yes | 下列 name-status 僅白名單與報告 |

## 實際指令輸出

```text
> node --test --test-name-pattern="試玩卡：中英頁" tests/en-play.test.mjs
✖ 試玩卡：中英頁均隱藏待補署名，保留已知 team · year (1965.1607ms)
ℹ tests 1
ℹ suites 0
ℹ pass 0
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 2055.7876

✖ failing tests:

test at tests\en-play.test.mjs:152:1
✖ 試玩卡：中英頁均隱藏待補署名，保留已知 team · year (1965.1607ms)
  AssertionError [ERR_ASSERTION]: #/play/zone 出現待補
  
  7 !== 0
  
      at TestContext.<anonymous> (file:///C:/agywork/agd-site-codex/tests/en-play.test.mjs:174:14)
      at async Test.run (node:internal/test_runner/test:1208:7)
      at async startSubtestAfterBootstrap (node:internal/test_runner/harness:385:3) {
    generatedMessage: false,
    code: 'ERR_ASSERTION',
    actual: 7,
    expected: 0,
    operator: 'strictEqual',
    diff: 'simple'
  }

exit=1

> node build.mjs
bundle.js 已更新 — 記得 bump index.html 的 ?v= 版本字串
▲ [WARNING] Duplicate key "color" in object literal [duplicate-object-key]

    _all.tmp.jsx:2183:44:
      2183 │         background: "var(--accent-yellow)", color: "var(--ink)",
           ╵                                             ~~~~~

  The original key "color" is here:

    _all.tmp.jsx:2182:8:
      2182 │         color: "inherit", textDecoration: "none", fontFamily: "'...
           ╵         ~~~~~


exit=0

> node --test tests/en-play.test.mjs
✔ data/en/faculty.json 與中文版結構一致 (4.8185ms)
✔ data/en/curriculum.json 與中文版結構一致 (1.6834ms)
✔ data/en/labs.json 與中文版結構一致 (1.212ms)
✔ data/en/works.json 與中文版結構一致 (1.1771ms)
✔ data/en/videos.json 與中文版結構一致 (1.1094ms)
✔ data/en/stats.json 與中文版結構一致 (1.8444ms)
✔ data/en/news.json 與中文版結構一致 (2.1586ms)
✔ data/en/admission.json 與中文版結構一致 (1.4796ms)
✔ play.json 每款遊戲的入口與封面都存在、層級有效 (2.0622ms)
✔ 創作不斷線：碰撞遮罩三段都從起點連到終點 (62.6193ms)
✔ 創作不斷線：用到的素材檔都存在，課程名稱都在 curriculum.json 裡 (5.7147ms)
✔ bundle.js 已包含英文頁與試玩區 (0.9292ms)
✔ 試玩區：五款都有雙語製作與授權欄位 (0.9819ms)
✔ 創作不斷線：調校預設鍵與原值完整 (1.1445ms)
AUTO-PLAY [{"level":1,"state":"won","fails":0},{"level":2,"state":"won","fails":0},{"level":3,"state":"won","fails":0}]
JITTER {"before":{"ink":72,"count":4},"after":{"ink":44,"count":4}}
✔ 創作不斷線：瀏覽器通關、即時調校、持久化與公開版隔離 (1645.5523ms)
✔ 創作不斷線：手感常數不可寫死回遊戲 (0.8474ms)
✖ 試玩卡：中英頁均隱藏待補署名，保留已知 team · year (1596.0122ms)
ℹ tests 17
ℹ suites 0
ℹ pass 16
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 3428.066

✖ failing tests:

test at tests\en-play.test.mjs:152:1
✖ 試玩卡：中英頁均隱藏待補署名，保留已知 team · year (1596.0122ms)
  AssertionError [ERR_ASSERTION]: #/play/zone 出現待補
  
  3 !== 0
  
      at TestContext.<anonymous> (file:///C:/agywork/agd-site-codex/tests/en-play.test.mjs:174:14)
      at async Test.run (node:internal/test_runner/test:1208:7)
      at async Test.processPendingSubtests (node:internal/test_runner/test:831:7) {
    generatedMessage: false,
    code: 'ERR_ASSERTION',
    actual: 3,
    expected: 0,
    operator: 'strictEqual',
    diff: 'simple'
  }

exit=1

> node build.mjs
bundle.js 已更新 — 記得 bump index.html 的 ?v= 版本字串
▲ [WARNING] Duplicate key "color" in object literal [duplicate-object-key]

    _all.tmp.jsx:2183:44:
      2183 │         background: "var(--accent-yellow)", color: "var(--ink)",
           ╵                                             ~~~~~

  The original key "color" is here:

    _all.tmp.jsx:2182:8:
      2182 │         color: "inherit", textDecoration: "none", fontFamily: "'...
           ╵         ~~~~~


exit=0

> node --test tests/en-play.test.mjs
✔ data/en/faculty.json 與中文版結構一致 (4.3043ms)
✔ data/en/curriculum.json 與中文版結構一致 (2.6377ms)
✔ data/en/labs.json 與中文版結構一致 (1.2845ms)
✔ data/en/works.json 與中文版結構一致 (1.5314ms)
✔ data/en/videos.json 與中文版結構一致 (1.2435ms)
✔ data/en/stats.json 與中文版結構一致 (1.9268ms)
✔ data/en/news.json 與中文版結構一致 (2.2895ms)
✔ data/en/admission.json 與中文版結構一致 (1.391ms)
✔ play.json 每款遊戲的入口與封面都存在、層級有效 (2.2865ms)
✔ 創作不斷線：碰撞遮罩三段都從起點連到終點 (60.0315ms)
✔ 創作不斷線：用到的素材檔都存在，課程名稱都在 curriculum.json 裡 (5.0655ms)
✔ bundle.js 已包含英文頁與試玩區 (0.9842ms)
✔ 試玩區：五款都有雙語製作與授權欄位 (0.3592ms)
✔ 創作不斷線：調校預設鍵與原值完整 (1.0383ms)
AUTO-PLAY [{"level":1,"state":"won","fails":0},{"level":2,"state":"won","fails":0},{"level":3,"state":"won","fails":0}]
JITTER {"before":{"ink":72,"count":4},"after":{"ink":44,"count":4}}
✔ 創作不斷線：瀏覽器通關、即時調校、持久化與公開版隔離 (1666.1867ms)
✔ 創作不斷線：手感常數不可寫死回遊戲 (0.7435ms)
PLAY-CARDS #/play/zone cards=5 pending=0 credit=動遊系 × Claude／Codex 協作（2026-10） · 2026
PLAY-CARDS #/en/play cards=5 pending=0 credit=AGD × Claude/Codex collaboration (Oct 2026) · 2026
✔ 試玩卡：中英頁均隱藏待補署名，保留已知 team · year (1688.9446ms)
ℹ tests 17
ℹ suites 0
ℹ pass 17
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 3537.3518

exit=0

> git diff --name-status
M	bundle.js
M	en-pages.jsx
M	index.html
M	pages.jsx
M	tests/en-play.test.mjs
warning: in the working copy of 'bundle.js', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'en-pages.jsx', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'tests/en-play.test.mjs', LF will be replaced by CRLF the next time Git touches it

exit=0

> git diff --stat e492e58
 bundle.js              |  4 ++--
 en-pages.jsx           |  5 +++--
 index.html             |  4 ++--
 pages.jsx              |  2 +-
 tests/en-play.test.mjs | 29 +++++++++++++++++++++++++++++
 5 files changed, 37 insertions(+), 7 deletions(-)
warning: in the working copy of 'bundle.js', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'en-pages.jsx', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'tests/en-play.test.mjs', LF will be replaced by CRLF the next time Git touches it

exit=0
```
