# 分類索引與海外見學更新｜2026-10-22

本稿取代原14卡/28FAQ顯示版本。程式分支codex/student-guide-ui，索引提交b3b5719、海外見學提交7a345a328694521527bf17e78bbd6de8f850bc19；未push、未上線，main及遊戲未動。

| 驗收 | yes/no | 實際證據 |
|---|---|---|
| 移除開頭兩段口號，改為八分類索引 | yes | 新回歸測試先紅後綠；索引點選後篩選並跳至辦理資訊 |
| 海外見學獨立卡片、快捷與2題FAQ | yes | 現為15卡/30FAQ/8快捷；實習機會顯示名改實習見學，id保持internships |
| 見學當期團、費用、補助與學分已查得 | no | 未查得完整當期文件；提醒先洽系辦，不以過去展演營保證目前可報名或抵實習/學分 |
| 來源可追查 | yes | 新增1筆官方校務計畫來源，既有2筆沿id更新，去重共35筆；新增PDF只讀索引，全文403，詳research.md與overseas-study-visit.json |
| 回歸測試 | yes | node --test tests/student-guide.test.cjs tests/en-release.test.cjs tests/shared-language.test.cjs → tests12/pass12/fail0 |
| build/check | yes | npm run build、npm run check → exit0；app-6PGY5HJU.js，8章節6373字 |
| 五種寬度分類/搜尋/快捷/FAQ操作 | yes | smoke.json：1440/1280/768/390/320，cards15/faq30/categories8/shortcuts8、errors=[]、fit=true |
| 字壓框 | yes | pre-commit執行核准Python檢查，1440/390/320各收合與展開，6組violations=0；negative-control detected |
| 單檔結果 | yes | single-file.json：cards15/faq30/visitVisible=true/fillerAbsent=true |
| 實體手機/公開發布 | no | 目前仍本機審閱，真手機未測 |

初版VERIFY-site-draft.md及VERIFICATION.md僅供歷史追溯；本次狀態以本報告、最新JSON與dashboard為準。
