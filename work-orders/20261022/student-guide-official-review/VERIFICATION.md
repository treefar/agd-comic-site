# 精簡學生文案驗收

## 資料驗收與交付

實際執行 `node work/student-guide-official/recheck-sources.cjs`、`node work/student-guide-official/build-student-copy.cjs`、`node work/student-guide-official/verify-student-copy.cjs`，最後皆離開碼0。

34來源重取：12收到內容，22空內容或阻擋；這項僅是存取檢查，未將它等同內容全文核實。

```text
yes | 14張卡片 | 14
yes | 8個白話分類 | ["選課抵免","請假休學","畢業門檻","專題製作","實習機會","證照就業","繼續升學","獎助協助"]
yes | 來源保留34筆且id不重複 | 34
yes | 來源必要欄位齊全 | 34
yes | 分類對應筆數與14卡一致 | [{"title":"選課抵免","count":2},{"title":"請假休學","count":2},{"title":"畢業門檻","count":2},{"title":"專題製作","count":1},{"title":"實習機會","count":2},{"title":"證照就業","count":2},{"title":"繼續升學","count":1},{"title":"獎助協助","count":2}]
yes | 每張summary不超過80字 | [{"id":"graduation","length":38},{"id":"internship","length":36},{"id":"certification","length":40},{"id":"leave","length":39},{"id":"course-selection","length":40},{"id":"credit-transfer","length":42},{"id":"capstone","length":43},{"id":"english","length":45},{"id":"status-military","length":44},{"id":"financial-aid","length":48},{"id":"support-rights","length":41},{"id":"career","length":44},{"id":"graduate-study","length":45},{"id":"overseas-internship","length":46}]
yes | 每張最多3步且每步不超過45字 | 18
yes | 每卡1至2題FAQ且總數至少14 | 28
yes | FAQ每答不超過120字 | 70
yes | 每卡及FAQ來源全部可解析 | 112
yes | contact維持office結構 | 14
yes | 舊截止日不寫入summary或steps | true
yes | 三個明確短標與海外獨立卡 | true
yes | 7快捷全部可解析 | 7
yes | 主文來源讀取限制保留 | 22
yes | 學生可見欄位無研究讀取術語 | true
yes | 每卡有官方洽詢入口 | 14
```

student-copy.json SHA-256：21ceea19b2c9f9b31d572c72fb5c380cd1c39507a727e8b5a047375bf43cf1c4。

資料與文案可交給主控接漫畫版型；本子任務未操作網站程式、發布或寄信，也沒有以資料結構驗證取代畫面與校規驗收。
