# 日英翻譯增量複核（2026-10-23）

台灣「助理教授」在本網站日文譯為「助教」正確，可保留；不是TA。日本「助教」是教育研究的教師職階；學生教學助理則用 **Teaching Assistant（TA）／ティーチング・アシスタント（TA）**。[JST職階表](https://jrecin.jst.go.jp/html/app/seek/dsc_jobtype_j.html)、[筑波大學TA制度](https://www.sie.tsukuba.ac.jp/student/ta/)

不能把所有中文「助教」都直接換成學生TA；台灣編制助教仍須看實際任用身分。日本「助教授」則是舊職名，不用來翻現在的助理教授。文科省通知區分助教與助手，並明示各校自行訂英文名，故此處是有官方用例的職階對照，不代表台日權責、資格與聘任制度完全等同。[文科省制度通知](https://www.mext.go.jp/b_menu/shingi/chukyo/chukyo4/003/gijiroku/06062315/006.htm)

|中文|英文|日文|本輪判定／套用|
|---|---|---|---|
|教授|Professor|教授|yes，用詞有據；現有13人無此職階，不新增人數。|
|副教授|Associate Professor|准教授|yes；目前相應教師已套用。|
|助理教授|Assistant Professor|助教|yes；目前相應教師已套用，沒有誤成TA。|
|講師|Lecturer|講師|yes；目前相應教師已套用。|
|系主任|Department Chair|学科長|yes；鄧樹遠現用角色如此，未加代理職務。|
|教學助理TA|Teaching Assistant|ティーチング・アシスタント|yes，術語有據；未拿它替換教師職稱。|

前四項逐列核JST；系主任另核[日本大學同頁日英標題](https://www.lit.otsuma.ac.jp/english/message.html)。此為翻譯核對，不是重新核定個人現任職務。

## 本輪可以閉合的增量

|檢查|yes／no|結果|
|---|---|---|
|13人canonical角色與目前生效EN／JA一致|yes|13／13；`issues.json/roles`逐人保原文、實值與yes/no。|
|前次六筆學位多加MA／MFA／MSc／MDesign仍存在|no|六筆已整合為一般`Master's degree`，raw EN與active locale均逐筆相同；中文原學校／領域／年份未變。|
|六筆學位中性化已套用|yes|張純雅、邱士展、陳美蓉、吳焉昇、蔣天華、尹立，6／6，對照前次exact-six.json。|
|因此可宣稱六人正式學位種類／取得事實已認證|no|移除翻譯多加的細類不等於取得本人或授予學校證明。|
|指南英文註冊課務組一致|yes|24／24現用值是Registration and Curriculum Division；日文保原中文名＋功能解釋，沒有冒稱正式日文機關名。|
|九筆資格已取得個人一手證書|no|仍待確認，逐人目前EN／JA及原文保存在`issues.json/certificates`，沒有從品牌頁推定持證人或級別。|
|所有教師最新聘任已重新取證|no|系所成員頁直接403。校方舊英文頁／搜尋索引不能當2026全部人事現況。|

六筆學位的先前「翻譯多加類型」已解決，不應再報成仍未套用；個人學位與九筆資格的一手認證仍分開保留pending。前次349欄與26個人頁DOM審查未重做，本輪也未把資料核對升格為新DOM／字形／全站驗收。

## 新發現與仍未決

- **P2跨表面名稱差異**：主站指南24處已用Division；目前`holiday-lab/games/semester.mjs`仍有6處Section。樹德[官方索引](https://www.aca.stu.edu.tw/服務對象-services/)支持Division，直接頁本輪仍403。列為下一輪非凍結產品迭代待統一，這輪不改遊戲、不使既有QA來源失效。
- **九筆資格仍pending**：其中陳重光原「Mixcraft 混音設計師」現EN多`Certified`，原「Unity 藝術設計」被具體化為認證名的風險仍在。先前已指出，本輪確認字串尚在；不能因尚無證書就斷言持證為假，也不能認證其英文正式名稱。其餘八筆同樣不冒稱一手已核。
- **抵免與免修仍按程序分辨**：現標題EN是Credit Transfer，JA是単位認定・免除。[九州大學官方用語](https://www.gg.design.kyushu-u.ac.jp/en/current_students/accreditation-of-credits-obtained-credit-transfer)支持credit transfer與單位認定，但不證明樹德抵免和免修必為同程序。這項保留待當期規則，未擅改標題。
- **學生指南用詞**：現用選課為履修登録、休學／復學為休学／復学，EN請假用absence requests、休學用leave of absence，沒有再混成同一程序；現值另存`issues.json/terms`。日本大學[程序索引](https://www.sie.tsukuba.ac.jp/student/procedure/)也將這些項目分開，但其資格／期限不可搬成樹德規定。專題、見學、升學等保留前次語義審校，本輪沒有另認證全校正式英日專名。

## 實際查核與限制

```text
node holiday-lab/translation-review-followup-20261023/check.cjs
RANK_CURRENT 13/13 YES; assistant-professor JA助教, not TA
NEUTRAL_DEGREES 6/6 APPLIED YES; prior extra MA/MFA/MSc/MDesign NO_LONGER_PRESENT
CERTIFICATES 9 PRIMARY_PROOF_PENDING; no personal qualification certified
OFFICE_GUIDE 24/24 Division YES; semester Section occurrences 6 unchanged
SOURCE_READONLY 8/8 YES; browser/build NO
exit0
```

本輪先讀title-check、final-specialist、neutral-degrees及既有翻譯摘要，再讀pages.jsx真正canonical載入路徑與現用locale。沒有把raw EN的CHECK或非生效覆寫當畫面現況。`official-sources.json`保留本輪實際搜尋與網址／存取日期，全文可讀、官方搜尋索引可讀但403／503／timeout分別標示；沒有把日本制度原頁說成2026新法，也沒有拿外校人事頁認定樹德個人職務。

只新增此資料夾；未改產品／舊證據、未Build／瀏覽器驗證／stage／commit／push／main／刪檔。下一步先取個人學位／資格的正式資料及校方單位正式名稱；不用為字面疑慮把正確的「助教」改成錯誤職階。
