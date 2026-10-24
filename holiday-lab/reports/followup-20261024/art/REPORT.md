# 主網站素材引用與小颯首獎年份追查

source_agent: codex；2026-10-24。主網站8875六組DOM的82項引用已逐項分流：61個img、20種CSS背景、1個停用favicon。原圖、作品內容、署名與照片未改；本資料追查不等於製程或再製授權認證。

61張img中，27項精確對到既有JSON圖片欄位，20項精確對到既有影片ID及縮圖元件，13項是有原照URL／雜湊／2px裁切紀錄的教師背景帶，1項是使用者確認的小颯原畫。20種CSS背景含7種既有色彩效果、13種原照背景引用，不將82當成82件插畫。詳asset-reference-map.json；同一圖片可能同時作img和CSS背景。

新發現的真錯誤：作品資料中英兩筆year=2022，8875三語作品詳情皆顯示WIN 2022。主辦CELSYS公告日期2021-04-28，明列第27屆與優勝者XiaoSA 小颯；繁中賽事頁的報名、結果日期也都是2021。這項應修競賽年份為2021，保留作者與原畫。

- [CELSYS主辦公告](https://www.celsys.com/topic/2021042802)
- [繁中得獎及賽事日期](https://www.clipstudio.net/tc/cspcontest27/)
- [英文得獎公告](https://www.clipstudio.net/en/cspcontest27/)

primary.json保存原始主辦來源回覆；facts.json僅摘事實，不把比賽頁封面署名Ross Draws錯套成得獎作品作者。未把資料夾2025上傳路徑當成得獎年份。

驗證：`node art/year.test.cjs`在修前exit1（2022≠2021）；`node art/check-year.cjs http://127.0.0.1:8875/ baseline`三語均重現WIN2022、署名小颯保留，exit1。完整命令、stdout／stderr及exit在../root/year-red.json及year-browser-red.json。`trace-assets.cjs`追查82項exit0，但所有權利確認仍為false，不聲稱整包零AI。
