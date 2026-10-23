# 聯合字串域分片 executor：3072 筆有界 checkpoint

已完成授權的 6 context 各 512 筆，共 3072 筆原生相對墨跡技術 probe；GLOBAL 仍為 **NO**。未啟動剩餘 401,616 筆，也沒有把 clone 畫面當成所有玩家 frame 已驗。

目前入口有 512/context 硬上限，沒有可直接啟動全集的開關；本輪交付的是 checkpoint 儲存／驗讀／斷點工程及實際先導。後續全 67,448/context 的迴圈啟用、原生極值放回玩家 UI、預設 seed128/context 的原完整 frozen 獨立複驗，仍需 root 核對及另行授權。不可把「bounded-complete」當成全集 executor 已跑完或全域證明。

|驗收項目|yes／no|實際結果|
|---|---|---|
|聯合 tuple 去重與排序|yes|從 served handler 的實際 submit、原生 JS Math.round／toFixed 重建 67,448 個聯合 tuple。每 tuple 保留原 phase／UI lattice input；沒有把 time／x token 拆開錯誤做笛卡兒積。完整有序 tuple 存 NDJSON；集合 SHA 與原 domain 相符。|
|獨立純域重算|yes|offline verifier 不呼叫 executor 的 build，而由保存 module 的 AST 逐 TARGET 讀取、原生算式重新枚舉三階段，核對 67,448 tuple 的順序、witness、集合 SHA。|
|320 寬用900高重新校準|yes|10 個真 UI 錯誤涵蓋三 phase；320 全部900高，1440為1000高。實際填值／試剪／等待／送出，真 feedback、進度與 computed／平台字型、完整 frozen 相對 ink／safe／Range／baseline 和 clone 完全符合既有0.05px比較門檻。未沿用1000高校準冒充900。|
|逐例必要量測落檔|yes|6×512 NDJSON，逐例 index／joint key／tokens／phase／input／文字、owner、相對 ink／safe、computed、Range advance／baseline probe／Canvas actualBoundingBox 均保存。各方向安全餘裕、寬／高／行數極值另保完整 hint node。|
|當筆拒收／失敗保留|yes|非有限、文字不符、固定 safe／clip 越界、baseline Range 改變、AST guard CSS／DOM／alphabet 不符當筆停止；批次來源或字型不符不寫 complete。首輪真的字型收據失敗、failed report 及已完成2048原檔全部保留。|
|每批前後收據|yes|module／runner／CSS／panel／paper／Windows字型檔 SHA、全56允許字元 CDP font／glyphCount、body／hint computed／skin cache、原 full frozen boundary 皆前後核；逐例亦走原 AST guard。3072沒有任何讀字失敗或安全區越界。|
|checkpoint 驗讀與斷點|yes（有界範圍）|NDJSON fsync後核逐行連續index／count／rolling hash／完整檔 SHA才寫 complete，再驗讀該 JSON；checkpoint 不覆寫。明確 --resume 才能讀既有run，已完成批次只重驗，不自動重測。resume-guard 另核 report 綁定的 checkpoint SHA、source／font、原 inherited method，且從不啟程序。|
|未完成／損壞負例|yes|3項 Node 測試：完整512可驗讀、511不可冒充512且原partial保留；byte tamper／index跳號／rolling錯誤全部拒絕，沒有 complete marker。|
|全集／全域最大／真人試玩|no|只做各 context 前512個排序 tuple，不是代表性全集抽樣。剩401,616個未測；每context極值仍只是本512筆的觀察極值。全玩家 UI／動態遮擋、seed128及全部極值真 UI複驗未做。|

## 實際紅燈及最小修正

首輪 bounded-01：10個真UI校準全過、ZH／EN四context各512批次已完成；JA320在批次開始前取得空 CDP 字型陣列，立即停止，未測任何JA tuple。原 execute.cjs、native.cjs、失敗 report 及完整四批保持不動。

最初「span可能在viewport外」假設未證：font-probe-diagnostic 實測舊位置y197仍在900高viewport，前後皆1font，該診斷 exit1 留底，不寫成根因。第二診斷刻意在新技術span建立後立即查CDP：20次17次空array；同span等待 document.fonts.ready 並取 getBoundingClientRect 完成原生layout後20/20取得 MicrosoftJhengHeiUIRegular、56glyph。這是字型收據量測時序，不是缺字。

native-layout.cjs 只為技術 alphabet span 補這個同步；原 sampler／AST／Canvas／Range 程式未動。明確執行 prepare-continuation 產生 bounded-02，列明 bounded-01 原 report／method／四checkpoint SHA。已完成2048與10校準保留並只驗讀繼承；只新測 JA兩context1024。沒有重跑2048，兩份run不合計成5120。

```text
node .../full-domain-run/execute.cjs --run=bounded-01
CALIBRATION 0…9 全 YES，手機320x900
ZH／EN四批各512完成
JA320 font receipt 0 !== 1 → exit1，首測留底

node .../full-domain-run/font-probe-diagnostic.cjs
1 !== 0 → exit1；viewport外假設未證

node .../full-domain-run/font-layout-diagnostic.cjs
FONT_LAYOUT RED_EMPTY=17/20 GREEN_LAYOUT=20/20 no candidate batch
exit0

node .../full-domain-run/prepare-continuation.cjs
CONTINUATION PREPARED explicit inherited2048 verified; zero new candidates; bounded-01 unchanged
exit0

node .../full-domain-run/execute-continuation.cjs --run=bounded-02 --resume=1
REUSE verified ZH／EN四批512
CHECKPOINT ja-320 512/67448 native 1.468s bytes=900711 GLOBAL=NO
CHECKPOINT ja-1440 512/67448 native 1.238s bytes=672348 GLOBAL=NO
BOUNDED COMPLETE 3072/404688 GLOBAL=NO; no further batch is authorized
exit0

node .../full-domain-run/verify.cjs bounded-02
OFFLINE YES jointTuples=67448 contexts=6 nativeRows=3072 incomplete_remaining=401616 GLOBAL=NO
exit0

node .../full-domain-run/resume-guard.cjs bounded-02
RESUME_GUARD YES verified=3072 allautomatic=false; authorized ceiling512/context; remaining unauthorized401616
exit0

node --test .../full-domain-run/checkpoint.test.cjs
tests3 pass3 fail0
exit0
```

上方 `...` 為 `holiday-lab/layout-qa/mid-autumn-finite-native`；完整可執行路徑及 stdout 都保存在本目錄。不要再次執行 prepare-continuation；目的資料夾已存在時它會拒絕，不覆寫原證據。日常只需 offline verify／resume-guard，不需再啟 browser。

## 速度、空間及續跑界線

六批純 native batch loop 加IPC回傳共9.763秒，NDJSON共4,666,962 bytes。依此局部觀察直接線性投影，全域純loop約21.44分鐘、逐例NDJSON約614.8MB；這**不含**792個批次前後source／font／skin／full frozen boundary、checkpoint驗讀、真UI極值、seed128、啟動及獨立複驗成本，不是全集完成時間承諾。第一批樣本的字串幾何與其他索引可不同，投影可能改變。

每個 context 保留 count512、最後index511，下一個尚未測index512。完整域67448需要132批／context，六context共792批（末批376）；未完成checkpoint永不提供覆蓋。資料以每批512條、每條NDJSON保存，不聚合全域nodes或巨JSON；當前一個browser順序處理，沒有排程或背景重啟。

executor 尚有兩個要由 root 下一階段決定的工程界線：現行授權硬鎖512/context，因此後續批次迴圈尚未啟用；獨立 verifier 現也刻意只接受六個512批。若將來開全集，須同批擴成連續0…67447的流式讀驗及per-batch method／source provenance，沿用store與resume-guard的拒收規則，不能只放大數字就宣稱全集通過。

本輪唯一新增 full-domain-run/；未改原pilot／domain／AST／產品／sampler／map／契約，未 stage、commit、push，未碰main或其他長程序。
