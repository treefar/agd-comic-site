# 20筆逐條驗收

指令：`node holiday-lab/translation-review/ja-guide-terms-applied/terms.cjs`

實際輸出：`APPLIED: 20/20 changed; rows20 yes; winning sources20 yes; all other JSON values and keys unchanged; ui unchanged`

每列yes均取verification.json實際assert；不是20個畫面或最新窗口業務再查證。

|ID|生效檔案|完整key／原文|固定old、新值、生效來源與非名稱內容保護|
|---|---|---|---|
|JA-UNIT-01|data/ja/messages.json|考試、長假或補請假，先向導師確認流程；考試處理另洽註冊課務組。|yes|
|JA-UNIT-02|data/ja/messages.json|請先問導師或生輔組2114，確認需要的證明與簽核方式；遇考試或長假，不確定時再向註冊課務組確認。|yes|
|JA-UNIT-03|data/ja/messages.json|重開系統確認結果，有問題找註冊課務組|yes|
|JA-UNIT-04|data/ja/messages.json|動遊系辦／註冊課務組|yes|
|JA-UNIT-05|data/ja/messages.json|已核對的115-1加退選於2026/9/14上午9時截止，現在不能當作仍開放。棄選或特殊情況是否可辦，請查當期公告並洽註冊課務組。|yes|
|JA-UNIT-06|data/ja/messages.json|開課單位／動遊系辦／註冊課務組|yes|
|JA-UNIT-07|data/ja/messages.json|公告列2026/8/3至9/21受理，已截止且註明逾期不受理。不要自行假設可補交；有特殊身分或程序疑義，請洽註冊課務組。|yes|
|JA-UNIT-08|data/ja/messages.json|先向系辦及註冊課務組確認程序|yes|
|JA-UNIT-09|data/ja/editorial.json|找系辦時一起帶入學年課表、成績與未通過項目的畫面，直接問缺課要補哪門、已有證明如何認列。若涉及抵免或學籍，再請註冊課務組協助確認。|yes|
|JA-UNIT-10|data/ja/step-details.json|送件後回到系統查看是否核准；沒有回覆時，主動找導師追蹤。若會影響考試或需請長假，再向導師與註冊課務組確認後續，別把送出當核准。|yes|
|JA-UNIT-11|data/ja/step-details.json|到教務處確認現在屬於初選、加退選還是棄選，再依該階段公告辦理。過去的加退選日期不能繼續使用；遇到逾期或特殊情況，先問註冊課務組。|yes|
|JA-UNIT-12|data/ja/step-details.json|操作後重新開啟系統課表，確認課名、班別與時間真的正確。若和預期不同，記下課程代碼及問題畫面找註冊課務組，不以出席或老師同意代替系統結果。|yes|
|JA-UNIT-13|data/ja/editorial.json|在可申請的期間填寫抵免系統並列印表格，備妥原校成績證明正本。依公告送開課單位與就讀系所簽核，再交註冊課務組複審，別只完成線上輸入。|yes|
|JA-UNIT-14|data/ja/step-details.json|辦理前先聯絡系辦與註冊課務組，說明要休學或復學，以及自己的學籍情況。詢問導師或代理人可辦理的時間，再安排到校，避免領表後找不到簽核人員。|yes|
|JA-UNIT-15|data/ja/flow-ui.json|文件交註冊課務組|yes|
|JA-UNIT-16|data/ja/flow-ui.json|將申請表及證明交註冊課務組|yes|
|JA-UNIT-17|data/ja/flow-ui.json|依規定把經初審的申請表與證明資料交到教務處註冊課務組。資料請一次備齊，送件仍須在當期受理期間內完成。|yes|
|JA-UNIT-18|data/ja/flow-ui.json|送件後回校務系統查詢最後核定情形，再與自己的課表及畢業檢核核對。有落差時，帶結果找註冊課務組確認。|yes|
|JA-UNIT-19|data/ja/flow-ui.json|先約好導師或系所承辦，再到註冊課務組登記領表。依當期公告完成訪談、離校與交回文件；領表日期會影響退費計算。|yes|
|JA-UNIT-20|data/ja/flow-ui.json|收到復學通知後，依通知期限回覆復學或繼續休學，確認下一學期的註冊安排。若因服役辦理休復學，另問註冊課務組需要哪些證明。|yes|
