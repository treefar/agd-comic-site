# Hero整合獨立驗收方法

範圍：本機首頁Hero整合，不改產品與歷史權威，不進勞動節。

1. baseline.cjs 對舊8860跑三語×320/390/1440，9組都證實HolidayHome位於原tier-splash外，真exit1。baseline-8860保留JSON與PNG。
2. run.cjs 等主控新build凍結後以 HERO_QA_URL 指定入口，使用headless Chromium。真操作select/button/Tab/ShiftTab/Escape，不注入遊戲狀態、時間或文字。核心真DOM路徑引用既有phase-driver.cjs，記錄其SHA。
3. 三語9組：原Hero主格內唯一festival-preview與hero-title；14選項不含labor；初始與切選時沒有iframe/games/audio；控制項文字Range盒、橫捲與CJK單字末行；主要Hero連結；modal前後焦點、背景inert、iframe首尾Tab、Esc與scroll還原；reduced-motion不循環動畫。
4. 新年en1440、清明ja320再各一條嵌入真核心流程，故意失誤→完成作品→3段重播→關閉，保留artifact與PNG。未宣稱新完整84或2076發布合約皆過。
5. index、編譯bundle、CSS、iframe runtime與兩game來源均採HTTP SHA前後核對。原JS遊戲不變應由主控與03 build另作bytes比較，不能只信本輪摘要。
6. verify.cjs <run-directory> 唯讀核9context矩陣、兩個真實作品、錯誤/溢位/孤尾、PNG原SHA/尺寸、method與driver SHA、source前後相同。只在raw pass且其餘條件全過時exit0。

字型限制：DOM Range、document.fonts.ready及實圖只能證明本次可讀性；未逐字取cmap與fallback的部分不宣稱字元皆完證。原字型資料與遊戲字表覆蓋是前輪另範圍收據，本輪不偷當Hero所有動態字元的全站完成認證。
