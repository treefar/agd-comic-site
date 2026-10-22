// Decisions record an actual source/EN/JA reading, not catalogue-key acceptance.
const fs=require('fs'),path=require('path');
const dir=__dirname,repo=path.resolve(dir,'../../..'),packet=JSON.parse(fs.readFileSync(path.join(dir,'packet.json'))),read=f=>fs.readFileSync(path.join(repo,f),'utf8'),faculty=JSON.parse(read('data/en/faculty.json')),norm=s=>s.replace(/\s+/g,' ').trim();
const changes=[];
function change(slug,p,lang,transform,priority,reason,source='canonical Chinese; explanatory translation, not official course/title certification'){
 const row=packet.rows.find(r=>r.slug===slug&&r.path===p);if(!row)throw Error('NO_ROW');
 let file,old,newValue,kind;
 if(lang==='en'){file='data/en/faculty.json';old=p.slice(1).split('/').reduce((v,k)=>v[k],faculty.find(f=>f.slug===slug));kind='set-record-path';}
 else{file='data/ja/messages.json';old=JSON.parse(read(file))[norm(row.zh)];kind='set-key';}
 newValue=transform(old);if(old===newValue)throw Error('NO_CHANGE '+slug+p);
 changes.push({id:slug+p+'/'+lang,file,kind,slug,path:p,key:norm(row.zh),old,new:newValue,priority,reason,source,canonical:row.zh,active_old:row[lang],expected_active_new:newValue.replace(/\s*\[CHECK\]/g,'').trim(),runtime_effect:lang==='en'&&!/[㐀-鿿]/.test(row.zh)?'raw-data-sync only; active rendering retains canonical English':'active translation after locale rebuild'});
}
change('tengshuyuan','/courses','en',s=>s.replace('Introduction to Game Design','Introduction to Games'),'P2','遊戲概論不自行增加設計限定；其餘課程完整保留。');
change('chenchungkuang','/courses','en',s=>s.replace('Painting Performance Techniques','Techniques of Pictorial Expression'),'P1','繪畫表現是視覺表現技法，不是表演performance。');
change('chenchungkuang','/experience/1','ja',s=>s.replace('動畫設計師','アニメーションデザイナー'),'P1','職務漏翻；公司中文正式名及任職年份不動。');
change('changchunya','/research','en',s=>s.replace('Art in Space Interventions','Artistic Interventions in Space'),'P2','空間介入藝術用自然英語，不改研究範圍。');
change('chenmeijung','/achievements/2','en',s=>s.replace('cross-border collaboration','crossover collaboration'),'P1','跨界合作是跨領域，不是跨國境；未核獎項官方英文名稱，仍待確認。');
change('chenmeijung','/achievements/1','ja',s=>s.replace('に選出','で紹介'),'P1','同列專題是被報導介紹，非特集遴選獲選；四作總計21+與四洲資訊保留。');
change('yinli','/papers/3/title','en',s=>s.replace('Hsingtiengu Museum','Center of Old Fongshan City History (見城館)').replace('the Fortifying Old City Project','the 見城計畫 project'),'P1','錯誤博物館名以高雄官方對照修正；計畫名稱未核英文，保留中文原名不自造專名。','https://takao.kcg.gov.tw/article/1030 ; official indexed Information label: The Center of Old Fongshan City History / 見城館; checked 2026-10-23');
change('chenmeijung','/papers/1/title','en',s=>s.replace('《失竊的秘方》','《失竊的祕方》'),'P2','中文作品原名逐字回到canonical的祕；英文正式作品名仍待確認，不擅自統一。');
change('wangtsungli','/certs','en',s=>s.replace('Adminstration Fundmentals','Administration Fundamentals').replace('Operationg System','Operating System'),'P2','結構化英文資料拼字修正，canonical與真實render原已正確；不能當新增畫面修復。','https://learn.microsoft.com/en-us/credentials/certifications/mta-retirement-faqs ; exact exam titles listed lines72/82; checked 2026-10-23');

const personNotes={
tengshuyuan:'遊戲/腳本/剪輯三項研究與專長對應；課程、美學專題及機制關卡無漏列。證照兩項保留。得獎指導與入圍沒有改成老師本人得獎；公司任期、八篇論文年份與研究方法保留。Click/Jin Diner等作品英名與公司英名缺一手核定，不能當官方名稱；設計博士是原稿資訊，未重新核學位取得狀態。',
chiangyamei:'六項研究與六門課清單保留；感性認知用Kansei可理解。工設博士日期與週二5–6/週三4、8節保留。三組指導成就與六篇論文逐句對照；原英文題名/會議保留英文，並非日文漏譯。ESG證照譯名及作品Box Squad等官方拼寫未核定。',
chenchungkuang:'繪本/角色造形/電腦繪圖專長保留；九門課只修繪畫表現的performance誤義。學歷未列學位，兩語都不擅補碩博。四項經歷公司/年份保留，日文一職務漏翻另修。八篇動畫/社群論文大意對應，創作論述可接受；作品英名與公司英名未核，Mixcraft/Unity證照品牌等級未由原中文充分支持。',
yangchihchang:'Unity/VR/程式/大數據四項標籤與七項研究、十門課逐項對應。體感用Somatosensory較直譯但尚可理解為身體互動，非此輪必改。沒有補原資料缺少的學歷、證照、經歷或論文。',
chenchinghung:'數位設計/動畫/動態影像研究與五門課保留；進階譯応用較寬但未漏科目。學歷未列學位，不擅補。兩項指導成就保留9+國際影展與複賽等階段，不改數據。八篇論文視覺敘事/認知負荷/台語文白異讀等核心意義對應；廣告設計乙級英譯level與日文技術士是台灣資格，不能當日本技術士等同。',
changchunya:'形象/字體/低多邊形/海報/空間五項研究清單完整，英語空間介入措辭另修。七門課SOHO、AI、起業與周邊商品均保留。六項成就的人數11/第二名、日期和展場保留；國際競賽/展場英文正式稱呼未核，國立雲科碩士不憑此推定MA正式學位類型。',
chiushinchan:'動畫導演、鏡頭語言及平面攝影等六項研究與五門課對應。三家公司經歷職務/日期保留。八篇創作論述題目各有原作品中文，英文作品名多為解釋譯名未核定。原中文只說碩士，英文MFA須憑證再核，不能假裝已確定。',
chenmeijung:'視傳/企業識別/推廣廣告與四項研究、五門課對應。14項成就保留入圍/佳作/優選差別及四作品總計21+，不歸為單作或單一老師得獎；修跨界與日文專題介紹。八篇論文內容可對照，Cyborg/Android與不同Stolen Recipe英名不一致，未核原作正式名故列待確認；一處祕字回原名。books一欄未render但資料翻譯一併留表，出版社英名未核。',
wuyenshen:'平面/Web/影像研究三項與八門課逐項保留，無人機空拍、商品開發及中階電競均有譯出。107/106年、兩賀卡專案及學生會指導資訊保留，非新增當年現職。Flash back原字與俯視冒險意義保留；碩士類型MA未有一手核定。',
wangtsungli:'3D角色/2D3D動畫/剪輯/遊戲五項研究與八門課完整。八篇論文質性統合/自我效能/VR地質/歷史核心大意對應，原英文發表題名維持英文。製造工程博士與2003保留；證照原稿英文拼字正確且實際畫面沿用canonical，只修未生效raw英文資料兩拼字，不冒稱畫面有錯字。',
chentsaiyu:'資訊介面/數位遊戲理論/互動裝置/企劃四項標籤，六項研究、七門課完整；AI素養、智財與電競產業未漏。工技教育博士日期保留。八篇量表/STEAM/幼兒特教/Live2D/VTuber論文逐句對照，圖卡譯flashcards較狹但原稿未交代形式，未自行改原正式論文名；研究發表英文題名正式性未逐篇核定。',
chiangtienhua:'互動/ARVRMR/IoT與演化計算研究完整，五門課含遊戲化非僅game design。四項活動/入圍資訊與2018地點不變。五篇紅外線飛鏢/MQTT/StormLights/正念擲筊論文語義對應；Moon Blocks屬解釋性文化譯法。台南成功大學係原活動地點字串，未擅擴官方名稱；資訊管理碩士不直接證實MSc。',
yinli:'設計展演/實務/應用三項保留；展演譯performance未漏展示面向。四項美展排名/年份及兩項經歷資訊保留；相關職務原即不詳，不補具體職銜。五篇策展/光束/環境劇場/見城互動/玩字論文語義對應；見城館錯名以官方對照修正，其它展演或公司英名待核。Master of Design類型需原證明，原中文僅碩士。'
};
const officialPending=[];
for(const r of packet.rows){
 const notes=[];
 if(r.path==='/name')notes.push('保留canonical姓名與既有en拼寫；沒有重新編拼姓名，正式自用拼寫仍以本人資料為準。');
 if(r.path==='/education')notes.push('學校/系所與原有年份語義已讀；學位與就學事實未重新向本人核實。'+(/Master of Arts|Master of Fine Arts|Master of Science|Master of Design/.test(r.en)?'英文額外指定學位類型，原中文只列碩士，列待確認。':''));
 if(r.path==='/certs')notes.push('保留資格名/版本與項目；發證機關、官方英日名稱及個人持證事實未全面核定，不把台灣技術士當日本資格。');
 if(r.path.startsWith('/experience'))notes.push('職務及起訖年對照原文；除另列修正外公司名稱保留，非一手確認的正式英名。');
 if(r.path.startsWith('/achievements'))notes.push('逐句核入圍/受獎/指導/展覽身分與原數字；作品、活動與獎項英日名稱仍須分清正式名和解釋譯名。');
 if(r.path.startsWith('/papers')&&!r.path.endsWith('/year'))notes.push(/[㐀-鿿]/.test(r.zh)?'原中文題名/會議的研究主題與方法逐句對照；譯名屬解釋，不宣稱原發表官方英文標題。':'原稿本為英文的發表題名/會議保留原文，不計為日文漏翻。');
 if(r.path.endsWith('/year'))notes.push('年份是來源標記，兩語原樣保留；不把數字存在性算成長文語義審查。');
 if(['/spec','/research','/courses'].includes(r.path))notes.push(personNotes[r.slug]);
 if(r.path==='/officeHours')notes.push('星期與節次逐一對照，未將課節改成鐘點。');
 if(r.path.startsWith('/books'))notes.push('書名/出版年月保留；出版社英文未核，且目前未render。');
 const langs={};for(const lang of ['en','ja']){const c=changes.find(c=>c.slug===r.slug&&c.path===r.path&&c.id.endsWith('/'+lang));langs[lang]={semantic_decision:c?'revise':'retain',note:c?.reason??notes.join(' '),proposed:c?.expected_active_new??r[lang],official_name_status:r.proper_name_sensitive?'not certified; see pending table':'general descriptive translation'};}
 if(r.proper_name_sensitive&&!r.path.endsWith('/year'))officialPending.push({slug:r.slug,path:r.path,source:r.zh,current_en:r.en,current_ja:r.ja,reason:notes.join(' '),state:r.path==='/name'?'protected; no respelling':r.path==='/education'?'degree/name verification pending':'proper-name certification pending; semantic review complete'});
 r.review={person_note:personNotes[r.slug],notes,langs};
}
const reviewed={...packet,scope:'13 faculty; all source leaf fields except role, IDs, photos and contact/technical metadata; semantic comparison only',personNotes,officialPending,summary:{source_fields:packet.rows.length,year_fields:packet.rows.filter(r=>r.path.endsWith('/year')).length,semantic_fields:packet.rows.filter(r=>!r.path.endsWith('/year')).length,operations:changes.length,active_operations:changes.filter(c=>!c.runtime_effect.startsWith('raw-data-sync')).length,raw_sync_operations:changes.filter(c=>c.runtime_effect.startsWith('raw-data-sync')).length,official_pending_rows:officialPending.length}};
fs.writeFileSync(path.join(dir,'reviewed.json'),JSON.stringify(reviewed,null,2)+'\n');fs.writeFileSync(path.join(dir,'exact-plan.json'),JSON.stringify({source_commit:packet.source_commit,date:packet.date,files:[...new Set(changes.map(c=>c.file))],changes},null,2)+'\n');console.log(JSON.stringify(reviewed.summary,null,2));
