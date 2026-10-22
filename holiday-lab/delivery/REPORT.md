# 可攜試玩包與開場實錄交付

2026-10-22，codex/holiday-delivery。來源為主控唯讀 .review-local-04；未改主控程式、8800／8797／8785伺服器、main或交接C節，沒有push、刪檔。僅本機候選審閱，不等於美術使用者確認或正式上線。

## 交付物

- holiday-preview.zip：32168703 bytes，保留完整網站、指南與十款遊戲。解壓後雙擊Start-Preview.cmd；預設localhost 8801。
- holiday-preview.mp4：1697793 bytes、38.56秒、1280×720、H.264／AAC、faststart。唯一交付影片。
- preview.html：離線播放器，標示「自動操作錄製／預設靜音」。

ZIP 32168703 bytes大於20MB，主控已確認可接受並要求保留全檔hash一致，不另外壓圖。影片低於14MiB。ZIP只含site/、原樣複製的serve-review.mjs、launch-preview.mjs、ASCII Start-Preview.cmd、中文README、SHA256SUMS.json，不包含git、work-orders、tests、reports、art-source、audio-source或原音整包。音效只含六個實際使用的OGG片段。

## 驗收逐條

| 條件 | yes/no | 實際證據 |
|---|---|---|
| 白名單runtime複製後逐檔hash一致 | yes | 256檔，來源與複本逐筆SHA256相同；結尾再對來源核對一次 |
| ZIP實際解壓後逐檔hash與清單一致 | yes | 261檔，hashMismatches=0，unexpectedFiles=0 |
| 用ZIP解壓的CMD實際啟動 | yes | READY http://127.0.0.1:8802/ PID=31556；Keep the extracted folder while playing. |
| 首頁／指南／十模組HTTP與檔案hash一致 | yes | 12筆HTTP200，逐筆body SHA256相同，詳delivery-verification.json |
| 中英日指南與十款入口實際呈現 | yes | Playwright等待#student-guide-title可見，zh/en/ja皆有正確標題；入口cards=10 |
| Node不存在有清楚提示且不下載 | yes | 限制PATH模擬缺Node，CMD exit1，印Node.js is required與No software will be downloaded automatically |
| 先確認伺服器就緒才開瀏覽器 | yes | launcher實作最多40次讀首頁成功才呼叫default browser；本次測試用--no-browser避免另開使用者分頁 |
| 預設8801雙擊流程開預設瀏覽器 | no | 本次授權用8802進行同腳本驗證；未自動點開使用者預設瀏覽器 |
| 自己的8802伺服器完成後停止 | yes | PID 31556依自身JSON停止，再fetch已拒絕連線；原三個埠未動 |
| 五張CG完整播放、不加速、不跳過 | yes | 8800實錄，DOM首次觀察時間見下表，35.192秒才出選單，browser errors=0 |
| CG實際有圖、旁白往左、選單可用 | yes | 每張naturalWidth/Height>0；marquee X由355.639降至-1027.55；選單後實點開始出遊戲UI |
| 成片H.264／AAC／faststart／小於14MiB | yes | ffprobe及atom檢查，moov offset32早於mdat30324 |
| 成片音訊維持靜音且無新增配樂 | yes | 全程頁面顯示聲音關；原WebM無聲軌，僅補全零AAC靜音聲道以符合容器規格 |
| 離線HTML影片能實際播放與seek | yes | file://播放器duration38.56，seek10後播放前進至10.530651秒，error=null |
| 實錄達30fps | no | Playwright recordVideo原生25fps，成片維持25fps，未補幀冒稱30fps |
| 全十款開場都在本片 | no | 本片按任務只錄元旦款；其他款由主控另行遊玩驗收 |
| 實體手機／使用者美術確認 | no | 尚未進行，不用工具或代理自述替代 |

## 五CG與片段時間

以下是正常播放中每張CG首次被DOM輪詢觀察到的時間（有約250ms輪詢差，不宣稱是精確首影格）；實作每幕7秒。

| 段落 | 秒 | 畫面／旁白 |
|---|---:|---|
| 1 / 5 | 0.652 | assets/new-year/cg-1.webp |
| 2 / 5 | 7.305 | assets/new-year/cg-2.webp |
| 3 / 5 | 14.251 | assets/new-year/cg-3.webp |
| 4 / 5 | 21.181 | assets/new-year/cg-4.webp |
| 5 / 5 | 28.297 | assets/new-year/cg-5.webp |
| menu | 35.192 | menu |
| game-ui | 38.521 | game-ui |

抽看成片filmstrip與35.7秒選單、38秒UI：五張不同故事圖確實入鏡，旁白可見、選單按鈕可見、遊戲滑桿與角色可見。此為代理目視紀錄，不是使用者美術確認。evidence-filmstrip.jpg／evidence-menu.png／evidence-game-ui.png已納入交付分支。原始WebM保留但不stage、不當第二支交付影片：C:\agywork\agd-holiday-delivery\holiday-lab\delivery\source\page@3f97115a9fee102e2229e4419df733a8.webm。中間靜音AAC封裝檔也留delivery/source/recording-silent-aac.mkv。

## 實際命令與輸出

```text
node holiday-lab/delivery/prepare-bundle.mjs
sourceFiles=256 sourceBytes=33963128 packageFiles=261 verifiedCopies=256
exit code 0

Compress-Archive -Path holiday-lab/delivery/portable/* -DestinationPath holiday-lab/delivery/holiday-preview.zip -CompressionLevel Optimal
holiday-preview.zip 32168703
exit code 0

node holiday-lab/delivery/verify-delivery.mjs
Student guide rendered: zh
Student guide rendered: en
Student guide rendered: ja
verifiedFiles=261 hashMismatches=0 unexpectedFiles=0
READY http://127.0.0.1:8802/ PID=31556
Keep the extracted folder while playing.
HTTP 200: /
HTTP 200: /?lang=zh#/students/guide
HTTP 200: /holiday-lab/games/new-year.mjs
HTTP 200: /holiday-lab/games/lunar-new-year.mjs
HTTP 200: /holiday-lab/games/lantern.mjs
HTTP 200: /holiday-lab/games/children.mjs
HTTP 200: /holiday-lab/games/dragon-boat.mjs
HTTP 200: /holiday-lab/games/mid-autumn.mjs
HTTP 200: /holiday-lab/games/teachers.mjs
HTTP 200: /holiday-lab/games/national-day.mjs
HTTP 200: /holiday-lab/games/semester.mjs
HTTP 200: /holiday-lab/games/exhibition.mjs
zh: 在校指南; en: Student Guide; ja: 在学生ガイド; cards=10
ownServerStopped=true
exit code 0

node holiday-lab/delivery/record-intro.mjs
CG1=0.652 CG2=7.305 CG3=14.251 CG4=21.181 CG5=28.297 menu=35.192 gameUI=38.521
errors=[] speed=1 skipped=false defaultMuted=true
exit code 0

ffmpeg -hide_banner -loglevel error -i "C:\agywork\agd-holiday-delivery\holiday-lab\delivery\source\page@3f97115a9fee102e2229e4419df733a8.webm" -f lavfi -i anullsrc=r=48000:cl=stereo -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 96k -shortest holiday-lab/delivery/source/recording-silent-aac.mkv
exit code 0 (no output)

New-MobilePreview.ps1 -Path holiday-lab/delivery/source/recording-silent-aac.mkv -OutDir holiday-lab/delivery -OutName holiday-preview.mp4 -MaxMB 14
OUTPUT=holiday-lab/delivery/holiday-preview.mp4
SIZE_MB=1.6
DURATION=0:39
HEIGHT=720 CRF=28
exit code 0

ffprobe -v error -show_entries format=duration,size,format_name -show_entries stream=codec_name,codec_type,width,height,r_frame_rate,sample_rate,channels -of json holiday-lab/delivery/holiday-preview.mp4
{
  "streams": [
    {
      "codec_name": "h264",
      "codec_type": "video",
      "width": 1280,
      "height": 720,
      "r_frame_rate": "25/1"
    },
    {
      "codec_name": "aac",
      "codec_type": "audio",
      "sample_rate": "48000",
      "channels": 2,
      "r_frame_rate": "0/0"
    }
  ],
  "format": {
    "format_name": "mov,mp4,m4a,3gp,3g2,mj2",
    "duration": "38.560000",
    "size": "1697793"
  }
}
exit code 0

node holiday-lab/delivery/verify-video.mjs
{
  "offlineFilePlayback": true,
  "metadata": {
    "duration": 38.56,
    "width": 1280,
    "height": 720,
    "muted": true,
    "error": null
  },
  "seekedTo": 10,
  "advancedTo": 10.530651,
  "autoRecorded": true,
  "disclosure": "自動操作錄製／預設靜音",
  "checkedAt": "2026-10-22T13:44:36.085Z"
}
exit code 0

node --check holiday-lab/delivery/prepare-bundle.mjs -> exit 0 (no output)
node --check holiday-lab/delivery/record-intro.mjs -> exit 0 (no output)
node --check holiday-lab/delivery/verify-delivery.mjs -> exit 0 (no output)
node --check holiday-lab/delivery/verify-video.mjs -> exit 0 (no output)
```

封裝驗證前兩次發現的是測試等待／日文標題預期錯誤：第一次太早讀h1/h2，第二次預期在校ガイド但實際為在学生ガイド。改以正式#student-guide-title等待，按實際翻譯核對，第三次通過；為讓驗證可重跑且不刪舊檔，又改為自動新建unpacked序號，最終重跑完整驗證仍通過。所有舊展開檔保留verification/，不stage、不當交付。

## SHA256

ZIP：5e36bbf8d86b619182105c492fb31605ec6403155231d292269803c9b7a4fb42
MP4：a6e8866b3a4e9d1d6022901292ca1138c1f8a9616396fa8caf3f0f5646f87ad4
完整逐檔清單：bundle-manifest.json；完整HTTP與瀏覽器輸出：delivery-verification.json；ffprobe與atoms：video-verification.json；離線播放：player-verification.json。
