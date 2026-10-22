# 新文字安全區 gate：採樣方法與完整案例計畫

本輪依2026-10-22更新的 game-ui-art 第6至9點新增驗證，不把舊包原本的功能測試改寫成失敗。完整讀過SKILL與官方 `ui-layout-policy.cjs`。只新增根契約、layout-qa與layout-*測試，沒有改產品、打包程式或全域規則。

## 規劃的下限矩陣

`case-inventory.json`／根 `ui-layout-contract.json` 自動列15遊戲、zh/en/ja、320×900與1440×1000，共2076必要案例：每遊戲23個主狀態，另加每語言／解析度的作品列表。數字由產生器計算，測試逐一核對，不是手填完成數。

23種狀態：開場起／中／末，選單normal／hover／pressed／disabled或不可達證據，help、settings，遊戲初始、最長錯誤、動態最小／最大、暫停、預覽、第二／第三階段，結果摘要、展開實際作品紀錄，三段回放及重試。

這只是必需畫面的下限，**不是以一個最長錯誤名義省略其他錯誤**。每款還要列全部實際可達錯誤／提示、每顆按鈕的存在狀態及最長動態內容，附加實際scroll位置、每顆按鈕hover/pressed、每種可達disabled畫面。不存在的disabled狀態須證明所有當下按鈕disabled屬性與程式可達性，不自行造一個產品不會出現的狀態冒充。待root凍結新引導／譯文後，才定稿逐款錯誤字串宇集及執行全矩陣；目前不能宣稱清單已覆蓋所有未來動態分支。

## 墨跡與字型

- 在真正Playwright Chromium玩家頁讀Text節點，保留非空文字；依CSS祖先的display、visibility、opacity與details實際狀態判斷。頁面下方可捲到的文字使用文件CSS座標，不把整張內容截成首屏而漏字。
- `document.fonts.ready`後，用真DOM Range按grapheme取得每行advance。每行尾放0尺寸inline baseline探針讀基線，再移除；Canvas只呼叫measureText，讀actualBoundingBoxLeft/Right/Ascent/Descent，不畫任何圖像／文字美術。保留末字突出、字距、實際字型／字重／字級／行高、scale與描邊半徑。
- baseline探針不改可見文字，但會留下相鄰Text節點切分；因此後續採樣的文字節點數可變，不能用節點數代表文案增加。保留原文與量測明細；所有探針span都已移除。
- 每次採樣先清理本工具的owner診斷屬性，避免hash換頁／重採樣殘留id誤配；collector用CDP逐owner記錄實際platform_fonts，computed字型鏈與真實Segoe UI／Microsoft JhengHei UI等備援可以逐節點追查。
- 目前無法精確建模的旋轉/skew、text-shadow/filter會列violation，不能直接給PASS。Canvas字型鏈與DOM computed一致，但未逐字做CDP/cmap，不能拿本測量宣稱補字來源完全驗證。fallback glyph的像素微差、hinting／抗鋸齒、任意writing-mode仍有精度限制。

## 真底圖內框與縮放

`asset-safe-regions.json`保存8張實際Codex皮膚PNG的SHA、原始尺寸與紙面矩形。已實際看normal/hover/pressed/disabled/panel/header/hud/bubble，不從文字長度反推安全框；矩形排除原圖黑墨框與圓角。這是代理量測的保守候選，不是使用者已確認美術。

- 伸縮按鈕：將固定原圖紙面矩形映到DOM實際背景100%×100%尺寸，hover/pressed會依實際當下skin另取對應矩形。
- 九宮panel：依CSS實際border-image slice=48、四側實際border width映射原圖內框，沒有把整個panel邊界當可寫區。
- 自由文字：取實際未加框排版元素的CSS content box；有panel祖先則再與真紙面內框取交集。沒有safe=viewport捷徑。
- 遊戲中 `caption-stage-words`／`.replay-text` 的prop1/prop2紙張還未逐素材建立內框：目前明列 `UNMAPPED_STAGE_TEXT_PAPER` 並缺safe，fail closed，不能拿整個舞台或整張sprite代替。
- root改皮膚／padding／九宮參數後都需要再量。原圖SHA已由測試核對；不能沿用錯底圖的內框。

## 遮擋、捲動與跑馬燈

- 真實button/link/input控制面積列blockers；只允許自身文字穿過自己的控制底圖。生成背景skin只allow其自身內容，沒有把世界角色／特效塞進allow清單。
- 掃描所有實際img，包含未註冊sprite；與文字有交集時暫時只改pointer-events做elementsFromPoint繪製順序檢查，隨即還原。真正在字上方的圖列遮擋。文字節點外的偽元素、SVG、Canvas、video、WebGL、CSS背景特效還沒有全自動發現；若出現這些，須補collector，不能宣稱無遮擋。
- 圖片遮擋目前採實際繪製順序＋保守AABB，尚未逐像素算透明度輪廓，可能產生假陽性；不能為避假陽性把未註冊圖漏掉。附截圖供root核對。
- 對普通文字，不用clip後的小片段掩蓋出框；記錄原墨跡與clip清單，出框或尚未捲讀內容列violation。全被內部scroll剪掉的節點另留hidden_scroll_text，要求後續真實捲動取樣，不默默遺失。
- 跑馬燈只交實際mask後墨跡，另保留完整文字、完整墨跡、WebAnimation keyframes、currentTime與duration；完整可讀內容驗證尚未完成就列 `MARQUEE_COMPLETE_CONTENT_NOT_YET_PROVEN`。只在開場第一幀看見一段文字，不算全篇已讀到。

R1補充：root修成 `.marquee-viewport` 內層遮罩後，於measurement-only `.measure-layout-01`（8814）重測。new-year／zh／320一般動畫真實觀察28.369秒、沒有seek時鐘，72／72非空白grapheme曾完整進入mask；減少動態以真實scrollTop逐半頁捲到末端，同為72／72，字串與該build catalog完全相等、兩模式幾何錯誤0。這證明全部內容能抵達可見區，不代表人類能在0.198秒內讀完減少動態文字，也不等於學生閱讀理解測試。

collector僅在game/lang/解析度、完整story與runner/catalog/CSS三份served SHA全部相同時採用這份獨立proof，才移除相符的「完整內容尚未證明」提醒；新語言／新故事／新source仍會fail closed。原09紅燈與原始證據保持不變。

## 真實負例與恢復

在已暫停的new-year場景，把原本actor1生成PNG移到真正「回首頁」文字上方，保留原parent／nextSibling／style，抬到z-index2147483647，沒有生成新美術／程序面板。實際截圖可見圖覆字；官方validator新增 `unregistered-effect-negative` 遮擋錯誤。恢復原parent／nextSibling／style後，該錯誤消失。

`negative-proof.json`與前／負例／還原畫面可重查。這是測試故意造成的失敗，必須保留於獨立負例證據；本R0診斷報告為顯示紅燈而包含此案例。未來真正交付報告需採恢復後實際畫面，不能將故意破壞畫面留在最後報告，也不能刪掉真實產品錯誤來求PASS。

## 來源、凍結與目前能力界線

目前09仍由8800供使用者看；root正在改P2翻譯與遊戲引導。本R0只保存當時實際served runtime receipts於metadata，**不填最終source_fingerprints**。官方gate因此明確紅燈。契約列283個實際UI程式／素材路徑，待root宣布freeze後才生成最終指紋並核對served build與工作樹一致。

當前collector只實作單款／單語／單解析度的小批選單、help、settings、初始錯誤、動態min/max、paused與真負例。結果／真實通關／每款全部錯誤、全部scroll、完整跑馬燈讀取、stage字幕紙面與最長動態字串的逐分支證明仍未完成。2076是必做案例數，**不是已通過數**；沒有放寬官方validator，沒有把過去功能分數當新文字gate通過。

上段「完整跑馬燈讀取」的未完成範圍是其餘遊戲／語言／解析度；new-year／zh／320的普通與減少動態已由上述R1獨立proof完成。下一階段先實際檢視constitution的prop1／prop2紙面、記錄每張PNG與內框，再擴新freeze版本，不能拿全舞台代替。
