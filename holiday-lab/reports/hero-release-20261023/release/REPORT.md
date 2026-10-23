# 本機發布補驗（2026-10-23）

source_agent: codex。來源凍結build：C:\agywork\agd-holiday-prototypes\.measure-hero-festival-20261023-01；網址：http://127.0.0.1:8861。只驗本機操作／部署，不建立ZIP、不推送、不升格完整2076-case gate。

實際：12 yes／0 no／1 unknown；runtime 357檔全部HTTP200/body SHA一致，來源前後不變。

| 項目 | 工具yes/no/unknown | 實際原始證據 |
|---|---|---|
| runtime-allowlist | yes | {"files":357,"bytes":42501164,"privateFiles":0} |
| all-runtime-http-body-sha | yes | {"files":357,"hashMismatches":0} |
| server-private-path-and-real-missing-status | yes | {"rows":[{"path":"/.env","status":404},{"path":"/.git/config","status":404},{"path":"/holiday-lab/reports/private.json","status":404},{"path":"/definitely-missing-release-probe.png","status":404},{"path":"/%2e%2e%2fsecret.txt","status":403},{"path":"/%ZZ","status":400}],"icon":{"status":200,"bytes":66162,"sha256":"356075a7feaaa023f1998b1214823c4371af8b70436427fdc7b7e282cb55efc1"}} |
| server-listens-on-loopback-only | yes | {"listeners":[{"LocalAddress":"127.0.0.1","LocalPort":8861,"OwningProcess":43264}]} |
| keyboard-pause-audio-cleanup-zh | yes | {"keyboardRange":true,"keyboardPreview":true,"pauseFrozen":true,"pausedStyleChangedFromInitial":true,"mutedRequests":0,"audio":[{"src":"http://127.0.0.1:8861/holiday-lab/audio/click.ogg","volume":0.35,"readyState":4,"error":null}],"audioStopped":true,"cleanupCycles":3,"listeners":{"baseline":{"window:popstate":1,"window:pagehide":1,"window:keydown":1,"document:keydown":1,"document:visibilitychange":1,"window:__playwright_global_listeners_check__":1,"window:mousemove":1,"window:pointerdown":1,"window:pointerup":1,"window:touchstart":1,"window:touchend":1,"window:touchcancel":1,"window:mousedown":1,"window:mouseup":1,"window:click":1,"window:auxclick":1,"window:dblclick":1,"window:contextmenu":1},"after":{"window:popstate":1,"window:pagehide":1,"window:keydown":1,"document:keydown":1,"document:visibilitychange":1,"window:__playwright_global_listeners_check__":1,"window:mousemove":1,"window:pointerdown":1,"window:pointerup":1,"window:touchstart":1,"window:touchend":1,"window:touchcancel":1,"window:mousedown":1,"window:mouseup":1,"window:click":1,"window:auxclick":1,"window:dblclick":1,"window:contextmenu":1}},"errors":[]} |
| keyboard-pause-audio-cleanup-en | yes | {"keyboardRange":true,"keyboardPreview":true,"pauseFrozen":true,"pausedStyleChangedFromInitial":true,"mutedRequests":0,"audio":[{"src":"http://127.0.0.1:8861/holiday-lab/audio/click.ogg","volume":0.35,"readyState":4,"error":null}],"audioStopped":true,"cleanupCycles":3,"listeners":{"baseline":{"window:popstate":1,"window:pagehide":1,"window:keydown":1,"document:keydown":1,"document:visibilitychange":1,"window:__playwright_global_listeners_check__":1,"window:mousemove":1,"window:pointerdown":1,"window:pointerup":1,"window:touchstart":1,"window:touchend":1,"window:touchcancel":1,"window:mousedown":1,"window:mouseup":1,"window:click":1,"window:auxclick":1,"window:dblclick":1,"window:contextmenu":1},"after":{"window:popstate":1,"window:pagehide":1,"window:keydown":1,"document:keydown":1,"document:visibilitychange":1,"window:__playwright_global_listeners_check__":1,"window:mousemove":1,"window:pointerdown":1,"window:pointerup":1,"window:touchstart":1,"window:touchend":1,"window:touchcancel":1,"window:mousedown":1,"window:mouseup":1,"window:click":1,"window:auxclick":1,"window:dblclick":1,"window:contextmenu":1}},"errors":[]} |
| keyboard-pause-audio-cleanup-ja | yes | {"keyboardRange":true,"keyboardPreview":true,"pauseFrozen":true,"pausedStyleChangedFromInitial":true,"mutedRequests":0,"audio":[{"src":"http://127.0.0.1:8861/holiday-lab/audio/click.ogg","volume":0.35,"readyState":4,"error":null}],"audioStopped":true,"cleanupCycles":3,"listeners":{"baseline":{"window:popstate":1,"window:pagehide":1,"window:keydown":1,"document:keydown":1,"document:visibilitychange":1,"window:__playwright_global_listeners_check__":1,"window:mousemove":1,"window:pointerdown":1,"window:pointerup":1,"window:touchstart":1,"window:touchend":1,"window:touchcancel":1,"window:mousedown":1,"window:mouseup":1,"window:click":1,"window:auxclick":1,"window:dblclick":1,"window:contextmenu":1},"after":{"window:popstate":1,"window:pagehide":1,"window:keydown":1,"document:keydown":1,"document:visibilitychange":1,"window:__playwright_global_listeners_check__":1,"window:mousemove":1,"window:pointerdown":1,"window:pointerup":1,"window:touchstart":1,"window:touchend":1,"window:touchcancel":1,"window:mousedown":1,"window:mouseup":1,"window:click":1,"window:auxclick":1,"window:dblclick":1,"window:contextmenu":1}},"errors":[]} |
| reduced-narration-scroll-zh | yes | {"motion":{"image":"none","marquee":"none","whiteSpace":"normal"},"completeNarration":"新的一年，先畫下起跑的姿勢。準備三張關鍵格。停太久，動作就卡住；太快，又看不清。試著調整節奏，讓每一格接上下一格。把今年的第一個跳躍，送往明天。","scrollSamples":[{"requested":0,"actual":0,"clientHeight":120,"scrollHeight":167},{"requested":23.5,"actual":24,"clientHeight":120,"scrollHeight":167},{"requested":47,"actual":47,"clientHeight":120,"scrollHeight":167}],"scope":"three observed scroll positions, not every continuous position"} |
| reduced-narration-scroll-en | yes | {"motion":{"image":"none","marquee":"none","whiteSpace":"normal"},"completeNarration":"A new year begins with a pose. Prepare three keyframes. Hold too long and the motion stalls; rush and it disappears. Adjust the rhythm so each frame leads into the next. Send your first leap into tomorrow.","scrollSamples":[{"requested":0,"actual":0,"clientHeight":120,"scrollHeight":222},{"requested":51,"actual":51,"clientHeight":120,"scrollHeight":222},{"requested":102,"actual":102,"clientHeight":120,"scrollHeight":222}],"scope":"three observed scroll positions, not every continuous position"} |
| reduced-narration-scroll-ja | yes | {"motion":{"image":"none","marquee":"none","whiteSpace":"normal"},"completeNarration":"新しい年は一つのポーズから。3枚の原画を用意しよう。長すぎると止まり、短すぎると見えなくなる。コマ同士がつながるリズムを探そう。最初のジャンプを明日へ。","scrollSamples":[{"requested":0,"actual":0,"clientHeight":120,"scrollHeight":167},{"requested":23.5,"actual":24,"clientHeight":120,"scrollHeight":167},{"requested":47,"actual":47,"clientHeight":120,"scrollHeight":167}],"scope":"three observed scroll positions, not every continuous position"} |
| local-game-with-third-party-network-blocked | yes | {"thirdPartyBlocked":[],"localControlsUsable":true,"scope":"Local game only; whole university site and external office links are not offline-certified"} |
| module-load-failure-has-readable-recovery | yes | {"faultInjection":"Network abort of exact game module only; no source/state mutation","faults":["http://127.0.0.1:8861/holiday-lab/games/new-year.mjs"],"error":"This prototype could not load. Return to the list and retry.","recoveryArchive":true} |
| real-background-visibility-evidence | unknown | {"result":"unknown","documentHidden":false,"scope":"not promoted to suspension pass"} |

## 指令與輸出

```text
C:\Program Files\nodejs\node.exe C:\agywork\agd-holiday-prototypes\holiday-lab\reports\hero-release-20261023\release\run.cjs --site=C:/agywork/agd-holiday-prototypes/.measure-hero-festival-20261023-01 --base=http://127.0.0.1:8861
YES runtime-allowlist
YES all-runtime-http-body-sha
YES server-private-path-and-real-missing-status
YES server-listens-on-loopback-only
YES keyboard-pause-audio-cleanup-zh
YES keyboard-pause-audio-cleanup-en
YES keyboard-pause-audio-cleanup-ja
YES reduced-narration-scroll-zh
YES reduced-narration-scroll-en
YES reduced-narration-scroll-ja
YES local-game-with-third-party-network-blocked
YES module-load-failure-has-readable-recovery
UNKNOWN real-background-visibility-evidence
RESULT pass-with-explicit-limitations {"yes":12,"no":0,"unknown":1}
EVIDENCE C:\agywork\agd-holiday-prototypes\holiday-lab\reports\hero-release-20261023\release\runs\2026-10-23T09-04-22-409Z
exit 0
node holiday-lab/reports/hero-release-20261023/release/verify.cjs C:\agywork\agd-holiday-prototypes\holiday-lab\reports\hero-release-20261023\release\runs\2026-10-23T09-04-22-409Z
{"schema_version":1,"pass":true,"scope":"Local release preflight only; no full ink-domain or global UI gate approval","site":"C:\\agywork\\agd-holiday-prototypes\\.measure-hero-festival-20261023-01","base":"http://127.0.0.1:8861","checks":13,"yes":12,"no":0,"unknown":1,"runtime_files":357,"http_sha_matches":357,"screenshots":6,"source_stable":true,"receipt":"C:\\agywork\\agd-holiday-prototypes\\holiday-lab\\reports\\hero-release-20261023\\release\\runs\\2026-10-23T09-04-22-409Z\\result.json","receipt_sha256":"34dc3dff1fd56b83b354196df8c81fd602942abb43785436be676e6314928770","full_project_approved":false,"public_release":false,"labor_played":false}
exit 0
```

runtime清單、逐筆HTTP header/hash與source_before/after在原result.json；所有PNG與方法SHA可由verify.cjs唯讀重核。no不是缺字0或全域批准；unknown也沒有算成yes。原故障注入是精確網路中斷測試，未改遊戲狀態或產品來源。

## 仍不能升格的門檻

- 正式ui-layout-contract共2076項，含labor138項。使用者暫緩labor，不能縮合約取得PASS。
- 舊R0只有13cases、空source_fingerprints且含獨立negative-effect故障負例，原檔完整保留。未把它包裝成新正向report，亦未刪負例。
- 固定08歷史缺30，其中非labor24項是game/error-longest完整動態墨跡證據；本輪共享外框preflight並非該證明，不移轉舊來源coverage為新build全域完成。
- 實體手機觸控、真人音效實聽與使用者美術確認仍需使用者實際確認；媒體readyState、音量與停止屬工具證據。
- 本機遊戲第三方網路封鎖可用不代表全站完全離線；校方處室連結與部分官網照片／字型仍需外網。
- Headless Chromium leaves both tabs visible: real background suspension still requires an actual visibilitychange; no mocked hidden state used.

本輪沒有啟動／操作labor，只有runtime完整性驗證讀取隨原build保留的檔案；無Unity、有視窗測試、push、main、C節或刪檔操作。
