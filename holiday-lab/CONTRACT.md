# 節日番外篇：全面試作共同契約

使用者2026-10-22明確授權全面試作並派子代理分別完成。範圍是8節日＋開學/畢展共10款，30–90秒、漫畫官網、中英日、本機審閱；未獲公開授權，不push、不碰main、不刪檔、不改交接C節。此輪授權取代舊企畫的「先選一款」範圍，不能縮成只做1款。

## 各款最小可玩要求

- 每款有不同狀態與真正操作，不能全部用選答案/三個按鈕冒充原玩法；至少3個遞進任務或一段有明確限制/回饋的創作。
- 有可重試的完成條件；生成的重播要反映玩家實際選擇，不播放固定假結果。
- 每個可見字串提供zh/en/ja；單指、滑鼠、鍵盤皆能完成。拖曳必須有按鈕/滑桿替代。
- 不加雲端請求、帳號、排行榜或個資；不引用Google素材/程式/辨識性玩法組合。
- UI、CG、角色與道具由主控提供Codex生圖。子代理不能畫SVG、Canvas、程序角色、Emoji圖示或CSS面板當玩家美術。只能排版、transform生成圖片與繫結文字。
- 共用外框提供每款5張可跳過CG與跑馬燈、標題、開始/操作說明/設定/離開、暫停、靜音、結果與重播。美術皆候選，不宣稱使用者已確認。

## 模組（唯一各款程式）

路徑holiday-lab/games/<id>.mjs。ES module，export const id='<id>'; export function mount(ctx){...;return {destroy(){...}};}。另export可被Node測試的純規則/狀態函式。頂層不可存取document/window；透過ctx使用。不要修改共用檔案。

ctx介面（主控實作）：

- lang: 'zh'|'en'|'ja'; words({zh,en,ja}) → 當前文字。
- stage: HTMLElement，16:10舞台，百分比座標；controls: HTMLElement。
- ui.text(id, words) → HTMLElement；ui.setText(element, words)。只動態文字，不畫底圖。
- ui.button({id,label:{zh,en,ja},onClick,variant?}) → HTMLButtonElement。
- ui.slider({id,label,min,max,step,value,onInput}) → {element,input,setValue(value),getValue()}，onInput(value:number)。主控生成皮膚；不要自己建立裸input。
- ui.choice({id,label,options:[{value,label:{zh,en,ja}}],value,onChange}) → {element,setValue(value),getValue()}。
- ui.group(id) → HTMLElement；可將上述element附入group；UI的id固定，不加語言進id。
- sprite(key, props) → {element,update(props),remove()}。props={id?,x,y,width,height,rotation?,opacity?,scaleX?,scaleY?,z?,filter?}，百分比位置/尺寸。key可用actor1、actor2、actor3、prop1、prop2、prop3、target、token1、token2、token3。每款各有獨立生成圖片；scene由外框處理。update只transform/opacity/size/filter，不畫新圖形。圖不存在主控會修素材，不可用程序圖替代。
- onFrame(fn) → unsubscribe；fn({dt:秒,elapsed:秒})，已自動尊重暫停、背景分頁、關閉；不另用setInterval/requestAnimationFrame。
- onKey(fn) → unsubscribe，fn(event:KeyboardEvent)；不攔截表單內原有按鍵，除非模組確實需要且有替代操作。
- hint(words) → 更新舞台旁提示；setProgress(current,total) → 更新任務數。
- sound(kind) → 只有玩家開聲才播放已授權/生成的短聲；可用click/success/error/paper。不得自行AudioContext/外連音訊。
- complete({score:0..100,summary:{zh,en,ja},artifact:JSON,replay:[{duration:毫秒,caption:{zh,en,ja},sprites:[{key,...props}]}]})。外框顯示結果與可重播創作，artifact要含真實玩家選擇/完成資料，不可固定假值。每款至少3個replay鏡頭，位置/時間/表情/聲音標示須由玩法結果導出。外框處理重開與清理。
- reducedMotion:boolean。

模組destroy取消訂閱；所有節點可由外框卸載，不改父頁路由。主控負責場景位置、錯誤/清理/三語外框及整合測試；子代理負責規則、互動、各款三語說明、單元測試及可實際走的解法記錄。

## 每款素材語意

每款都有5張故事CG、scene舞台與10張可transform的生成Sprite。

| id | actor1/2/3 | prop1/2/3 | target | token1/2/3 |
|---|---|---|---|---|
| new-year | 同一學生角色起步/騰空/落地 | 鐘/新年門/筆 | 落地位置腳印 | 三張關鍵格圖 |
| lunar-new-year | 同一原創年獸中性/開心/鞠躬 | 眉表情/眼表情/嘴表情（可透明疊） | 拜年姿勢參考 | 驚喜/開心/拜年小卡 |
| lantern | 紙鶴/紙魚/紙山 | 舞台燈/屏風/燈架 | 紙鶴剪影（暗色可疊合） | 三種紙藝物剪影 |
| children | 木玩具/鐵玩具/紙玩具 | 木槌/鈴/摺紙 | 聲畫同步標記 | 木/金屬/紙材質小卡 |
| dragon-boat | 展開粽葉/第一次折葉/完成折葉 | 紙餡料/繩/圖樣 | 包住後輪廓 | 三片葉面/摺面 |
| mid-autumn | 月亮/車輪/圓形燈 | 分鏡板/鏡頭/剪輯筆 | 形狀銜接參考圓圖 | 三張對照鏡頭 |
| teachers | 學生聆聽/學生說謝謝/老師回應（原創角色非真人肖像） | 對話泡泡/感謝畫作/空白卡 | 完成漫畫構圖 | 三張漫畫動作格 |
| national-day | 城市前景/海岸中景/山遠景（可疊） | 學生主角/樹/車站 | 視線窗口 | 三種景深構圖參考 |
| semester | 學生/系辦/教室 | 作品室/指南書/校園指標 | 校園漫畫地圖（非真地理導航） | 新生任務物件3種 |
| exhibition | 動畫作品海報/遊戲作品海報/互動作品海報（原創虛構） | 展板/燈/導覽箭頭 | 展間平面構圖 | 作品資訊小卡3種 |

## 邏輯與視覺驗收

Node純函式測試先有失敗證據再實作，至少：合法/非法操作、完成不會憑空成功、重置/不同輸入影響結果。每款報告含實際命令輸出yes/no、解題操作序列、仍待驗證事項；禁止自己寫「人工/美術通過」。主控會真正用瀏覽器逐款完成與目視，不能只交綠燈。
