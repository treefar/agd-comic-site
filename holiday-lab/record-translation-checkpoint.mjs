import fs from 'node:fs';
import {createHash} from 'node:crypto';
const block=`## 2026-10-22 日英審校第二批本機套用（尚未取代09試玩版）

- 78操作／9產品檔已套用；首批職級維持助理教授→助教、副教授→准教授，合聘／從聘另說明。報告：C:/agywork/agd-holiday-prototypes/holiday-lab/translation-review/followup/ROOT-APPLIED.md。
- root實跑16 tests通過；翻譯測試曾因依賴已套用工作樹失敗，固定904ac79基準後轉綠，紅燈原始輸出保留。測量Build .measure-layout-02 exit0、356檔，兩筆既有duplicate color警告、21個stats未配對路徑仍列明。
- 同步三語修115甄選六校系、技優資格不限得獎應屆、繁星放棄仍禁當年甄選。導引可查合資格證照，非任意證照保證可報名；原selection對象仍需按簡章續查。
- 首頁3單位＋12FAQ共54日英字串已審；其餘18FAQ及其他長文未完成。新版字型／窄版／完整回放未驗完，不能引用09舊圖當新字串證據。
- 文字安全區新增2076必要案例契約與真DOM墨跡採樣器；跑馬燈真紅轉綠、72/72字元兩模式可達，負例真圖遮字可抓到；完整矩陣未跑完，交付gate仍紅。依game-ui-art第8節「任何 UI 放進使用者可測試包前，都必須有可重跑的版面證據」，measurement只供採樣，不得打包交付。
- 8800/.review-local-09與local09 ZIP保持既有版本；本輪未push、未發布、未碰main、未刪檔。下一輪先在測量版驗招生導引三語，再驗新文案字型與手機；新年新版仍在獨立分支待回收。TF-BASE兩遊戲原始碼未回，不重送背景工作、不跳Unity視窗。

`;
const handoff='C:/Projects/系網漫畫版_AGDComicSite/LATEST_HANDOFF.md';
const original=fs.readFileSync(handoff,'utf8');
const section=t=>t.match(/## C\.[\s\S]*?(?=\r?\n## )/)?.[0];
const sha=t=>createHash('sha256').update(t).digest('hex');
if(!section(original)||sha(section(original))!=='95ae06fb0e647d1d212fd467120bd209132c8c904cf193085f47fe806f293680')throw Error('C_SECTION_CHANGED');
if(!original.includes(block.split('\n')[0]))fs.writeFileSync(handoff,block+original);
if(section(fs.readFileSync(handoff,'utf8'))!==section(original))throw Error('C_SECTION_CHANGED_AFTER_WRITE');
for(const file of ['holiday-lab/STATUS.md','C:/TreeDesk/Obsidian Vault/00 Codex 永久記憶/專案紀錄/系網漫畫版_AGDComicSite.md']){
 const text=fs.readFileSync(file,'utf8');if(text.includes(block.split('\n')[0]))continue;
 if(text.startsWith('---')){const end=text.indexOf('\n---',3)+4;fs.writeFileSync(file,text.slice(0,end)+'\n\n'+block+text.slice(end));}
 else fs.writeFileSync(file,block+text);
}
console.log('CHECKPOINT_WRITTEN; C_SECTION_SHA='+sha(section(original)));
