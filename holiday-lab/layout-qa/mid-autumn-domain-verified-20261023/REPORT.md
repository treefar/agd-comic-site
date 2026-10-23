# 中秋數值文字全集：原生量測與完整串流驗讀

2026-10-23，source_agent: codex。原單一engine18628/driver68760於03:31:28.847Z開始、04:23:46.635Z正常exit0，launch_count1；404688筆全部量測結束，沒有重啟或重測已完成3072繼承筆。這是數值文字的原生相對墨跡技術probe，不是404688張玩家畫面或整包UI通過。

主控先確認terminal與PID消失，再實讀core/state/verify並執行完整offline verifier，04:25:27.821Z–04:25:44.457Z，exit0。

```text
node holiday-lab/layout-qa/mid-autumn-finite-native/full-domain-run/exhaustive/verify.cjs --manifest=holiday-lab/layout-qa/mid-autumn-finite-native/full-domain-run/exhaustive/manifests/prepared-01/freeze.json
STREAM_VERIFY integrityYES 404688/404688 missing=0 domainComplete=true GLOBAL=NO
```

|context|完整原生筆數|checkpoint|完整域|
|---|---:|---:|---|
|zh-320|67448|132|yes|
|zh-1440|67448|132|yes|
|en-320|67448|132|yes|
|en-1440|67448|132|yes|
|ja-320|67448|132|yes|
|ja-1440|67448|132|yes|

核對包含：精確67448 joint tuple/phase/input/原語言字串、連續index、每筆native Range/baseline/有限數值/fixed safe、NDJSON完整SHA及rolling鏈、每批source/font/DOM/cache、checkpoint前鏈、原始繼承方法、7類極值及完整極值node。合計792完成checkpoint、原始NDJSON 673278733bytes；原data在ignored raw-runs或bounded繼承位置，仍僅本機，不能宣稱已跨機備份。

驗證文件SHA 79cfb47fba92eedaa312dc5c65c7af7efe18df947d58993d68ac4e827c809da5；此folder verification.json與原文件byte-exact。原immutable freeze SHA64b5b6840c243d33cee047b1c3e206ea43a30904b134636d920387505b6d3448未改。

|驗收|yes/no|證據|
|---|---|---|
|單一原job正常terminal exit0|yes|root-launch-status.json與原stdout|
|404688完整串流，6×67448/132batch|yes|verification.json/summary.json，root verifier exit0|
|原source/font/safe/原始資料鏈一致|yes|verify/state/core逐筆/逐批核對；未改sampler/map|
|42極值obligations已用正常玩家UI複驗|no|新工具mid-autumn-ui-validation-20261023正在準備|
|固定seed128/context的768 full-frozen實UI比較完成|no|計畫須保持原seed與原row，尚未開新native|
|seed原fast fullnode是否原本就完整存錄|no|原設計只存完整relative measurements/computed等row，極值另存fullnode；缺欄位明列null，不捏造原node|
|可把6個中秋error-longest升級canonical|no|仍待正常UI/extrema/seed校準與typed閉合|
|整包UI、使用者美術、發布|no|globalBoundProven/full_project_approved皆false，官方R0不改|

下一步由獨立代理新建實UI驗證工具，root查碼後才啟單一headless批次；不重測完整404688，亦不修改任何原checkpoint/原始row。
