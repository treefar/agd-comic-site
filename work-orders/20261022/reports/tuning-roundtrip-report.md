# tuning-roundtrip

日期：2026-10-21（目錄依工單用 20261022）。

只驗不改：從面板按複製 JSON 取得實際文字，將整份 JSON 寫在 window.TUNING 等號後（保留後續面板程式），在真正檔案上跑 autoplay，最後以原始 bytes 還原。未以 route.fulfill 代替磁碟貼回。

分支：codex/tuning-roundtrip；基準：e492e58。

| 驗收 | yes／no | 證據 |
|---|---|---|
| JSON貼回後正常載入 | yes | 實際檔案服務給瀏覽器，桌機與手機三關皆 won |
| 三關自動試玩 | yes | 兩種 viewport 各三關 won、fails=0、errors=0 |
| 附貼回diff及驗完還原 | yes | 下列實際 git diff 與還原SHA256一致 |
| 程式無永久改動 | yes | 還原後 tuning.js diff 空白 |

## 實際指令輸出

```text
面板實際輸出：28鍵；ink.costTouch=12；{
  "common": {
    "grabRadius": 68,
    "touchOffset": 40,
    "orbHitRadius": 10,
    "failFreeze": 0.25,
    "rewind": 0.25,
    "forgiveAfterFails": 2,
    "ghostAfterFails": 3,
    "checkpointAfterFails": 6,
    "checkpointRatio": 0.25,
    "maxSpeed": 900
  },
  "step": {
    "interval": 0.083,
    "maxJump": 48
  },
  "ink": {
    "sampleMs": 50,
    "angleMouse": 70,
    "angleTouch": 90,
    "costMouse": 10,
    "costTouch": 12,
    "regenAngle": 30,
    "regenPerSample": 1.5,
    "minSpeed": 80,
    "lowInk": 30,
    "shakeInk": 15
  },
  "spring": {
    "omega": 14,
    "zeta": 0.85,
    "afterimageMinSpeed": 100,
    "tiltMaxDeg": 2.5,
    "tiltSpeedDiv": 160
  },
  "stars": {
    "maxFails": 2
  }
}
> git diff -- play/creative-line/tuning.js
diff --git a/play/creative-line/tuning.js b/play/creative-line/tuning.js
index 50a6dec..86360e7 100644
--- a/play/creative-line/tuning.js
+++ b/play/creative-line/tuning.js
@@ -1,10 +1,43 @@
 // 調校預設；可將面板複製的 JSON 貼在等號後。orbHitRadius 保留供後續碰撞規格確認。
 window.TUNING = {
-  common: { grabRadius:68, touchOffset:40, orbHitRadius:10, failFreeze:0.25, rewind:0.25, forgiveAfterFails:2, ghostAfterFails:3, checkpointAfterFails:6, checkpointRatio:0.25, maxSpeed:900 },
-  step: { interval:0.083, maxJump:48 },
-  ink: { sampleMs:50, angleMouse:70, angleTouch:90, costMouse:10, costTouch:7, regenAngle:30, regenPerSample:1.5, minSpeed:80, lowInk:30, shakeInk:15 },
-  spring: { omega:14, zeta:0.85, afterimageMinSpeed:100, tiltMaxDeg:2.5, tiltSpeedDiv:160 },
-  stars: { maxFails:2 }
+  "common": {
+    "grabRadius": 68,
+    "touchOffset": 40,
+    "orbHitRadius": 10,
+    "failFreeze": 0.25,
+    "rewind": 0.25,
+    "forgiveAfterFails": 2,
+    "ghostAfterFails": 3,
+    "checkpointAfterFails": 6,
+    "checkpointRatio": 0.25,
+    "maxSpeed": 900
+  },
+  "step": {
+    "interval": 0.083,
+    "maxJump": 48
+  },
+  "ink": {
+    "sampleMs": 50,
+    "angleMouse": 70,
+    "angleTouch": 90,
+    "costMouse": 10,
+    "costTouch": 12,
+    "regenAngle": 30,
+    "regenPerSample": 1.5,
+    "minSpeed": 80,
+    "lowInk": 30,
+    "shakeInk": 15
+  },
+  "spring": {
+    "omega": 14,
+    "zeta": 0.85,
+    "afterimageMinSpeed": 100,
+    "tiltMaxDeg": 2.5,
+    "tiltSpeedDiv": 160
+  },
+  "stars": {
+    "maxFails": 2
+  }
 };
 (() => {
   if (new URLSearchParams(location.search).get('tune') !== '1') return;
warning: in the working copy of 'play/creative-line/tuning.js', LF will be replaced by CRLF the next time Git touches it

exit=0

> node C:/agywork/agd-site-qa-scripts/autoplay.cjs C:/agywork/agd-site-codex "" desktop brief
desktop (no query) {"coarse":false,"hasTuning":"object","hasStats":"object","tunePanel":false} L1:won/fails=0/ink=100/then=card L2:won/fails=0/ink=100/then=card L3:won/fails=0/ink=100/then=card errors=0 

exit=0

> node C:/agywork/agd-site-qa-scripts/autoplay.cjs C:/agywork/agd-site-codex "" mobile brief
mobile (no query) {"coarse":true,"hasTuning":"object","hasStats":"object","tunePanel":false} L1:won/fails=0/ink=100/then=card L2:won/fails=0/ink=100/then=card L3:won/fails=0/ink=100/then=card errors=0 

exit=0

還原 SHA256 before=71909e16e067ef761d3184c198477394995974ea475906c1e05130aae04c28ee after=71909e16e067ef761d3184c198477394995974ea475906c1e05130aae04c28ee
> git diff -- play/creative-line/tuning.js

exit=0

> git diff --stat e492e58

exit=0
```
