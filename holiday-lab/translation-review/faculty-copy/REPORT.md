# 13位師資主網站日英文案審校

2026-10-23；固定基準7bd59ab834b99cce3718a2431ccb7b8baf74ecb5，獨立codex/faculty-copy-review／C:/agywork/agd-faculty-copy。只新增holiday-lab/translation-review/faculty-copy/*；不改產品、不重做職級、不build/push/main/delete/Unity。

完成13人、349個來源文字葉欄位的中英日對照，其中73為論文年份，276是非年份語義欄位，共698目標值。348欄目前師資首頁/詳頁有程式引用；另陳美蓉books 1欄在資料但未render。職級、ID、URL、照片、聯絡資料及技術欄不列入本批。沒有新增原資料不存在的介紹/學歷。

packet.json保存原文、raw EN與實際locale值；reviewed.json每個欄位有兩語個別處置、理由、逐人說明與專名待查表。這不是以字典有key就算語義通過。

## 精確提案

9操作、2檔（data/en/faculty.json、data/ja/messages.json），其中8處影響重建後顯示，1處只同步未生效raw資料。每筆old/new、來源欄位、理由與證據在exact-plan.json。

- P2 tengshuyuan/courses/en：遊戲概論不自行增加設計限定；其餘課程完整保留。（active translation after locale rebuild）
- P1 chenchungkuang/courses/en：繪畫表現是視覺表現技法，不是表演performance。（active translation after locale rebuild）
- P1 chenchungkuang/experience/1/ja：職務漏翻；公司中文正式名及任職年份不動。（active translation after locale rebuild）
- P2 changchunya/research/en：空間介入藝術用自然英語，不改研究範圍。（active translation after locale rebuild）
- P1 chenmeijung/achievements/2/en：跨界合作是跨領域，不是跨國境；未核獎項官方英文名稱，仍待確認。（active translation after locale rebuild）
- P1 chenmeijung/achievements/1/ja：同列專題是被報導介紹，非特集遴選獲選；四作總計21+與四洲資訊保留。（active translation after locale rebuild）
- P1 yinli/papers/3/title/en：錯誤博物館名以高雄官方對照修正；計畫名稱未核英文，保留中文原名不自造專名。（active translation after locale rebuild）
- P2 chenmeijung/papers/1/title/en：中文作品原名逐字回到canonical的祕；英文正式作品名仍待確認，不擅自統一。（active translation after locale rebuild）
- P2 wangtsungli/certs/en：結構化英文資料拼字修正，canonical與真實render原已正確；不能當新增畫面修復。（raw-data-sync only; active rendering retains canonical English）

姓名正式拼寫不改。公司/作品/獎項/出版社名稱未取到一手確認時，不自行重拼或從同名推別名。6筆原文只說碩士、英文額外寫MA/MFA/MSc/MDesign者列待確認，本輪不擅改學位；國立交通大學保留取得時歷史校名，不改現名。

## 逐人逐欄範圍與保留判斷

|教師|全部葉欄位|非年份語義欄|逐人核對結果|
|---|---:|---:|---|
|鄧樹遠／tengshuyuan|39|31|遊戲/腳本/剪輯三項研究與專長對應；課程、美學專題及機制關卡無漏列。證照兩項保留。得獎指導與入圍沒有改成老師本人得獎；公司任期、八篇論文年份與研究方法保留。Click/Jin Diner等作品英名與公司英名缺一手核定，不能當官方名稱；設計博士是原稿資訊，未重新核學位取得狀態。|
|江雅媚／chiangyamei|28|22|六項研究與六門課清單保留；感性認知用Kansei可理解。工設博士日期與週二5–6/週三4、8節保留。三組指導成就與六篇論文逐句對照；原英文題名/會議保留英文，並非日文漏譯。ESG證照譯名及作品Box Squad等官方拼寫未核定。|
|陳重光／chenchungkuang|34|26|繪本/角色造形/電腦繪圖專長保留；九門課只修繪畫表現的performance誤義。學歷未列學位，兩語都不擅補碩博。四項經歷公司/年份保留，日文一職務漏翻另修。八篇動畫/社群論文大意對應，創作論述可接受；作品英名與公司英名未核，Mixcraft/Unity證照品牌等級未由原中文充分支持。|
|楊智彰／yangchihchang|4|4|Unity/VR/程式/大數據四項標籤與七項研究、十門課逐項對應。體感用Somatosensory較直譯但尚可理解為身體互動，非此輪必改。沒有補原資料缺少的學歷、證照、經歷或論文。|
|陳慶鴻／chenchinghung|33|25|數位設計/動畫/動態影像研究與五門課保留；進階譯応用較寬但未漏科目。學歷未列學位，不擅補。兩項指導成就保留9+國際影展與複賽等階段，不改數據。八篇論文視覺敘事/認知負荷/台語文白異讀等核心意義對應；廣告設計乙級英譯level與日文技術士是台灣資格，不能當日本技術士等同。|
|張純雅／changchunya|12|12|形象/字體/低多邊形/海報/空間五項研究清單完整，英語空間介入措辭另修。七門課SOHO、AI、起業與周邊商品均保留。六項成就的人數11/第二名、日期和展場保留；國際競賽/展場英文正式稱呼未核，國立雲科碩士不憑此推定MA正式學位類型。|
|邱士展／chiushinchan|33|25|動畫導演、鏡頭語言及平面攝影等六項研究與五門課對應。三家公司經歷職務/日期保留。八篇創作論述題目各有原作品中文，英文作品名多為解釋譯名未核定。原中文只說碩士，英文MFA須憑證再核，不能假裝已確定。|
|陳美蓉／chenmeijung|45|37|視傳/企業識別/推廣廣告與四項研究、五門課對應。14項成就保留入圍/佳作/優選差別及四作品總計21+，不歸為單作或單一老師得獎；修跨界與日文專題介紹。八篇論文內容可對照，Cyborg/Android與不同Stolen Recipe英名不一致，未核原作正式名故列待確認；一處祕字回原名。books一欄未render但資料翻譯一併留表，出版社英名未核。|
|吳焉昇／wuyenshen|12|11|平面/Web/影像研究三項與八門課逐項保留，無人機空拍、商品開發及中階電競均有譯出。107/106年、兩賀卡專案及學生會指導資訊保留，非新增當年現職。Flash back原字與俯視冒險意義保留；碩士類型MA未有一手核定。|
|王宗立／wangtsungli|30|22|3D角色/2D3D動畫/剪輯/遊戲五項研究與八門課完整。八篇論文質性統合/自我效能/VR地質/歷史核心大意對應，原英文發表題名維持英文。製造工程博士與2003保留；證照原稿英文拼字正確且實際畫面沿用canonical，只修未生效raw英文資料兩拼字，不冒稱畫面有錯字。|
|陳寀瑜／chentsaiyu|29|21|資訊介面/數位遊戲理論/互動裝置/企劃四項標籤，六項研究、七門課完整；AI素養、智財與電競產業未漏。工技教育博士日期保留。八篇量表/STEAM/幼兒特教/Live2D/VTuber論文逐句對照，圖卡譯flashcards較狹但原稿未交代形式，未自行改原正式論文名；研究發表英文題名正式性未逐篇核定。|
|蔣天華／chiangtienhua|25|20|互動/ARVRMR/IoT與演化計算研究完整，五門課含遊戲化非僅game design。四項活動/入圍資訊與2018地點不變。五篇紅外線飛鏢/MQTT/StormLights/正念擲筊論文語義對應；Moon Blocks屬解釋性文化譯法。台南成功大學係原活動地點字串，未擅擴官方名稱；資訊管理碩士不直接證實MSc。|
|尹立／yinli|25|20|設計展演/實務/應用三項保留；展演譯performance未漏展示面向。四項美展排名/年份及兩項經歷資訊保留；相關職務原即不詳，不補具體職銜。五篇策展/光束/環境劇場/見城互動/玩字論文語義對應；見城館錯名以官方對照修正，其它展演或公司英名待核。Master of Design類型需原證明，原中文僅碩士。|

完整版每個欄位的中文/EN/JA與兩語處置在reviewed.json，共349行資料列，含保留項；未為增加改動數量大量改寫合適譯文。

## 查證結果與未確認項

- 系所[官方首頁](https://www.dgd.stu.edu.tw/)本輪直接403；姓名+官方網域未取得可讀的13位完整本人頁。猜測WordPress ID/姓名路徑未能讀取，沒有把猜測網址當已驗來源。
- [高雄官方英語文章](https://takao.kcg.gov.tw/article/1030)搜尋索引Information並列The Center of Old Fongshan City History與見城館；直接頁面先只取得部分，後重取timeout，證據層級明列官方索引，不冒稱全文成功。據此修Hsingtiengu Museum，並保留未核英文計畫的中文原名。[官方日文頁](https://takao.kcg.gov.tw/article/1025)可讀且保留見城館原名。
- [Microsoft官方MTA FAQ](https://learn.microsoft.com/en-us/credentials/certifications/mta-retirement-faqs)可讀，表列Database Administration Fundamentals與Windows Operating System Fundamentals；只核拼字，不憑此說教師個人持證已驗實，也不拿停考當成持證無效。
- 第三方工商站出現UNION U INC.，但未取得公司/本人一手對照，因此沒有把通聯的Tonglian逕改成UNION U。Android/Cyborg及The Stolen Recipe/The Stolen Secret Recipe不一致亦列待確認，不以單一譯名全站取代。

236筆含專名的來源欄位逐列標記未完成正式名認證。這不是236欄沒讀，而是語義對照與官方名稱核定分開；尤其自用姓名、作品英名、學位類型、發表題名正式英譯、公司與證照持有事實不能由機器推定。詳official-checks.json及reviewed.json/officialPending。

實際程式pages.jsx的useDataset讀canonical data/faculty.json，再由siteCreateElement/locale轉譯；英語來源原本已是英文且不含中文時，沒有映射就保留canonical。王宗立MTA的raw英文拼錯，真實runtime原已正確，故計為資料同步而非畫面修復。英文原發表論文名與會議保留英文亦不是日文漏翻。

## 驗收與套用

|驗收|yes／no|實際指令/輸出|
|---|---|---|
|13位與349欄有逐欄兩語處置|yes|node extract.cjs／review.cjs → 349欄、276語義欄、73年、9操作；完整表保存|
|固定提交驗證原文及實際生效譯文|yes|測試用git show 7bd59ab:<path>，逐欄對canonical/raw EN/locale；非可變產品fixture|
|提案精確且沒有改姓名/職級/學位/日期|yes|node --test review.test.mjs → 10 pass、0 fail；完整深比非目標欄位|
|8處譯文可穿過真正字典overlay、1處raw不同層|yes|測試第5/6項分開驗；沒有拿raw拼字當實際渲染錯誤|
|舊值改動/並行/越界可拒絕|yes|回歸實際注入漂移、role路徑及並行寫入，觸發守門；SHA未變|
|主控目前樹可只讀檢查|yes|node apply-safe.mjs --project C:/agywork/agd-holiday-prototypes → exit0、9操作、product_files_written0；前後兩檔SHA相同，root-dry-run-evidence.json|
|正式專名及每人資格均已確認|no|236筆含專名欄仍未認證；阻擋/未查得範圍如上，沒有假造正式名|
|產品套用/Build/新譯文DOM字型及排版|no|本輪只交精確提案，未改產品或build，root審後才整合驗證|

重跑完整命令：

    node --test holiday-lab/translation-review/faculty-copy/review.test.mjs
    node holiday-lab/translation-review/faculty-copy/apply-safe.mjs --project C:/agywork/agd-holiday-prototypes

主控審9筆後可加--apply；預設不寫檔。所有old exact通過並重比並行變更後才寫入，保留其他新增；不是多檔原子交易。套用後另重建locale並驗DOM，不直接跑已套用來源期待old值還在。
