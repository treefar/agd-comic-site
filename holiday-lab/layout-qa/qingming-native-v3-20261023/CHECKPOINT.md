# 清明v3隔離工具準備 checkpoint

2026-10-23。主控指派僅離線工具準備，未准native。本目錄已建立，僅從原v2逐SHA驗過後複製20份方法／來源／輸入／測試；繼承收據在V2-INHERITANCE.json。原v2所有方法/runtime/inputs/freeze/root-pilot-01沒有改動。

主控已確認原root-pilot-01於06:10:12.703Z真exit1；已存6份zh320完整targetpass/geometry0案例，但session console有一條404、原callback未存location、未source_after，整run仍failed，不能回填成pass。另次新導航diagnostic確實觀察favicon URL `http://127.0.0.1:8845/favicon.ico`、404、Network resourceType Other；此為獨立新診斷，不能補舊run缺欄。

目前v3分類器、新scope、新freeze與新唯讀run verifier尚未完成；複製過來的native-run仍是舊行為，不得執行。沒有approved=true檔、native-runs或自有browser/native/server／背景程序。

下一步僅在本目錄：先寫真RED故障測試，再建立完整Console location與CDP Network request/response/loadingFailed原事件收據及精確分類器。只有同一requestId的favicon exact URL＋404＋Other，且Console location相同，才可列non-target；全部原console/http/page/network flags保留、global=false。缺location、未知error、任何遊戲資源404一律stop。不route mock、不清console、不補.measure08或伺服器。

成功payload沿用原v2完整nodes/fonts/PNG/chain/source/font before-after，不縮6context/36PNG pilot或1392後續域。須新scope＋方法freeze＋故障TDD＋唯讀verifier後交root審，未核准不可啟native。

中秋已讀發現保存於隔壁mid-autumn-canonical-review-20261023/CHECKPOINT.md；尚未開始其可重現離線檢查或typed adapter，沒有promote/改coverage/index/contract/sampler/source。
