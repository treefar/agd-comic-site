# 首頁師資照片：頭部大小與眼線正規化

2026-10-22，source_agent: codex。本機候選 `.review-faculty-05`；13 位老師，中／英／日文，1440px 與 390px。未發布、未 push、未碰 main、未啟動 Unity；原圖與師資資料未改。

## 畫面與範圍

- [13 位桌機拼版](all-13-desktop-contact-sheet.png)、[13 位日文手機拼版](all-13-mobile-ja-contact-sheet.png)。每張是實際 DOM 卡片截圖，再以 HTML 排成檢視頁，沒有繪製或重生人物。
- 13 張官方原圖逐張讀取並檢視，人工標記冠頂、下巴、雙眼中點與左右頭部範圍。各照片保持等比，只調整顯示大小與位置。
- 照片窗為正方形；冠頂至下巴占可見窗高 66%，雙眼中點置於窗高 50%、窗寬 50%。自然姿勢與頭型保持原樣。
- 只有 `chapters-2.jsx` 的首頁 FacultyCard 使用新呈現。詳情頁 `pages.jsx` 與系助理照片保持原構圖；沒有把卡片裁切盲套到寬幅詳情。
- 單純寫 `object-position:center top` 無法解決不同原圖的頭部比例，故每一位均有獨立 slug 與來源 URL 對映。未登錄或更換來源 URL 的照片回到一般呈現，不套別人的座標。

## 逐人標記

原圖均為 1024 × 1024、orientation 1。下表單位為原圖像素。人工標記是目視近似；後述 0.02px 是這些標記點經瀏覽器投影的排版誤差，不是生物辨識精度，也不包含人工定位的不確定性。

| 老師／slug | 冠頂 y | 下巴 y | 雙眼中點 x,y | 左／右界 x |
|---|---:|---:|---|---|
| 鄧樹遠 tengshuyuan | 112 | 608 | 490,354 | 300／690 |
| 江雅媚 chiangyamei | 36 | 534 | 560,296 | 330／758 |
| 陳重光 chenchungkuang | 50 | 604 | 428,354 | 306／668 |
| 楊智彰 yangchihchang | 18 | 496 | 490,244 | 355／730 |
| 陳慶鴻 chenchinghung | 156 | 600 | 552,394 | 452／778 |
| 張純雅 changchunya | 40 | 412 | 528,206 | 285／646 |
| 邱士展 chiushinchan | 26 | 510 | 500,276 | 380／772 |
| 陳美蓉 chenmeijung | 16 | 490 | 441,266 | 308／710 |
| 吳焉昇 wuyenshen | 46 | 610 | 546,312 | 394／834 |
| 王宗立 wangtsungli | 48 | 620 | 380,444 | 240／665 |
| 陳寀瑜 chentsaiyu | 50 | 416 | 592,238 | 466／758 |
| 蔣天華 chiangtienhua | 22 | 488 | 532,242 | 285／688 |
| 尹立 yinli | 66 | 556 | 485,342 | 300／656 |

完整來源 URL、原圖 SHA-256、每張原始檔及裁切衍生 SHA-256 在 [source-records.json](source-records.json) 與 [annotation-records.json](annotation-records.json)。不是從單一樣本推導其它老師的對映。

## 背景延展

眼位靠近原圖上方的照片，或頭部偏向一側的照片，置中後會露出缺少的背景區域。每張只裁原圖 `(left:0, top:0, width:1024, height:2)` 的純背景，保存到 `images/faculty-portrait-background/<slug>.png`。

13 條放大色帶已逐條檢視，均為純色／漸層，沒有頭髮或人物。測試逐張比對衍生檔的原始像素等於原圖前兩列；CSS 只拉伸，不鏡射、不平鋪，主圖仍使用原官方 URL。底層補齊四側露空，上層色帶對齊主圖的水平尺度，沒有重複人像。

## 實際驗收

| 條件 | yes／no | 證據 |
|---|---|---|
| 13 位各有一對一來源與人工座標 | yes | 5 項純測試、annotation-records.json |
| 三語共用正確照片來源，沒有配錯老師 | yes | 瀏覽器 78／78 張來源回應 SHA 與保存原圖吻合 |
| 頭高一致、雙眼中點同列對齊 | yes，標記點投影 | 六組各 13 人；最大眼位誤差 0.0165px、頭高誤差 0.0087px，同組 13 頭高差不超過 0.0084px |
| 冠頂、下巴與左右頭部範圍位於照片窗內 | yes，標記幾何 | browser.json 逐人 crown／chin／left／right；另已檢視桌機及手機 13 張實圖 |
| 沒有拉扁臉或改寫原圖 | yes | scaleX／scaleY 差小於 0.001，原圖 SHA 不變 |
| 原本露紙色的側邊已用該原照背景補齊 | yes | 王宗立側邊實際 RGB 178,93,96，與原背景預期相同 |
| 日文長職稱自然換行、無橫溢 | yes | 每卡 role 的 white-space:normal、overflow:false、寬度在資訊區內 |
| 詳情維持原寬幅照片構圖 | yes | 中文桌機／手機詳情 object-fit:cover、object-position:50% 0%；pages.jsx 未修改 |
| 真實使用者已確認照片效果 | no | 本輪只有代理檢視與工具驗證，未取得對話確認 |

逐人、逐 viewport 的 frame／image 邊界、眼位、頭高、裁切餘裕、角色職稱文字與來源 SHA 在 [browser.json](browser.json)。[build-fingerprints.json](build-fingerprints.json) 保存本機候選與關鍵來源雜湊。

## 修正過程保留

1. 舊 `.review-local-08` 第一排四位原本眼位最大差 34.70px，頭高約 150.78–174.75px；before.json 與 before-zh-1440-first-four.png 保留比較。
2. 初版在手機被既有 150px 高度規則壓過，王宗立標記冠頂只餘 1.39px；mobile-crown-red.json 保留三組手機失敗。新 CSS 提高指定範圍的 specificity，並留完整髮頂餘裕。
3. 幾何通過後仍從實際截圖發現側邊露紙色；side-background-red.json 的像素回歸先失敗，補足純背景後轉綠。沒有把幾何綠燈當成畫面完成。
4. 末排空格沒有實際卡片的負 gutter，會讓第 13 位照片較窄；只對老師卡片後的空格補同樣 gutter，使 13 位實際窗寬一致。
5. 兩個測試器問題另外保留：曾誤以為日文有獨立 faculty.json，讀實際 loader 後改驗共用資料；曾對放大的 img 呼叫 scrollIntoView，造成 overflow:hidden 父層捲動，harness-scroll-red.json 為此假故障。現改捲動可見卡片；這兩項不列產品修復。

## 指令輸出

```text
node tests/faculty-portrait-browser.cjs --first-four --baseline
NO zh 1440: all thirteen directory heads have the same physical height
TOTAL 0/1, page/errors 0
exit code 1
# baseline 指令本次樣本只有第一排四位，詳見 before.json 的 firstFour:true。

node --test tests/faculty-portrait.test.cjs
tests 5
pass 5
fail 0
exit code 0

node --test tests/faculty-portrait.test.cjs tests/shared-language.test.cjs
tests 10
pass 10
fail 0
exit code 0

node holiday-lab/build-review.mjs .review-faculty-05
UI policy: pass true, assets 257, screens 9, errors []
REVIEW_ONLY: .review-faculty-05; 356 files; no publication performed.
exit code 0

$env:FACULTY_BUILD='.review-faculty-05'; node tests/faculty-portrait-browser.cjs
YES zh 1440: 13 portraits; eyeError=0.0164px; headError=0.0071px; rowSpread=0.0158px
YES zh 390: 13 portraits; eyeError=0.0164px; headError=0.0069px; rowSpread=0.0154px
YES en 1440: 13 portraits; eyeError=0.0164px; headError=0.0071px; rowSpread=0.0158px
YES en 390: 13 portraits; eyeError=0.0164px; headError=0.0087px; rowSpread=0.0138px
YES ja 1440: 13 portraits; eyeError=0.0164px; headError=0.0071px; rowSpread=0.0158px
YES ja 390: 13 portraits; eyeError=0.0164px; headError=0.0087px; rowSpread=0.0138px
TOTAL 6/6, page/errors 0
exit code 0

$env:FACULTY_BUILD='.review-faculty-05'; $env:FACULTY_SINGLE_LANG='ja'; node tests/faculty-portrait-browser.cjs --single
YES ja 390: 13 portraits; eyeError=0.0164px; headError=0.0087px; rowSpread=0.0138px
TOTAL 1/1, page/errors 0
exit code 0
```

Build 仍有既有 JSX color 重複 key 警告（SSR／client 各一），與本項無關。未跑遊戲全套與 Unity 測試：本項只改首頁師資呈現。測試自行使用 8806 並結束自己啟動的程序；沒有操作 8800／8804／8805。
