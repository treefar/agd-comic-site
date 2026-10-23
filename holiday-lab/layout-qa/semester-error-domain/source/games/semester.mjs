// Fictional comic map: consultation practice, not real campus navigation or approval.
export const id='semester';const W=(zh,en,ja)=>({zh,en,ja});
export const stops=Object.freeze([
 {id:'department',x:0,y:0,key:'actor2',name:W('系辦','Department office','学科事務室')},
 {id:'academic',x:4,y:0,key:'actor3',name:W('註冊課務組','Registration and Curriculum Section','註冊課務組（学籍・履修担当）')},
 {id:'classroom',x:2,y:2,key:'prop1',name:W('授課教室','Classroom','授業の教室')}
]);
export const tasks=Object.freeze([
 {id:'course-plan',cardId:'course-selection',contacts:['department','academic'],sourceIds:['academic-faq','academic-contact'],label:W('核對必修缺項','Check required courses','必修の不足を相談'),cardName:W('選課加退選','Course Selection and Add/Drop','履修登録・修正（科目追加・取り消し）'),next:W('可先向系辦或註冊課務組詢問，帶自己的入學年課表與缺項。','Ask the department office or Registration and Curriculum Section, with your entry-year plan and missing courses.','入学年度の履修表と不足科目を持ち、学科事務室か註冊課務組（学籍・履修担当）へ。')},
 {id:'course-record',cardId:'course-selection',contacts:['academic'],sourceIds:['academic-contact','academic-faq'],label:W('選課紀錄疑問','Ask about a course record','履修記録の疑問'),cardName:W('選課加退選','Course Selection and Add/Drop','履修登録・修正（科目追加・取り消し）'),next:W('到課不等於選到。紀錄維護的程序窗口是註冊課務組，先備好課程代碼與問題畫面。','Attendance does not register a course. Registration and Curriculum Section maintains records; bring the course code and a screenshot.','出席だけでは登録されません。記録の手続きは註冊課務組（学籍・履修担当）へ。科目コードと画面を準備。')},
 {id:'graduation',cardId:'graduation',contacts:['department','academic'],sourceIds:['academic-faq','dept-contact'],label:W('畢業缺項諮詢','Ask about graduation gaps','卒業要件の不足を相談'),cardName:W('畢業檢核','Graduation Audit','卒業要件の確認'),next:W('可先帶入學年課表與缺項向系辦或註冊課務組詢問，不把諮詢當作畢業核准。','Bring your entry-year plan and gaps to the department office or Registration and Curriculum Section. Advice is not graduation approval.','入学年度の履修表と不足項目を持ち、学科事務室か註冊課務組（学籍・履修担当）へ。相談は卒業認定ではありません。')},
 {id:'credit',cardId:'credit-transfer',contacts:['academic'],sourceIds:['credit-transfer-115-1','credit-transfer-procedure'],label:W('抵免程序詢問','Ask about credit-transfer steps','単位認定の手順を相談'),cardName:W('學分抵免','Credit Waiver and Transfer','単位認定・免除'),next:W('抵免程序疑問可洽註冊課務組。是否受理與審核順序要看當期規定，諮詢不等於申請成功。','Ask Registration and Curriculum Section about credit-transfer steps. Check current eligibility, dates and review order; advice is not approval.','単位認定の手順は註冊課務組（学籍・履修担当）へ。当期の資格・期限・審査順を確認。相談は承認ではありません。')}
]);
const taskBy=id=>tasks.find(t=>t.id===id),stopBy=id=>stops.find(s=>s.id===id);
export function newTrip(){return {round:0,selectedTask:null,selectedWindow:null,position:{x:0,y:2},route:[{x:0,y:2}],visits:[],attempts:0};}
export function availableTasks(state){return state.round===0?['course-plan']:state.round===1?['course-record']:state.round===2?['graduation','credit'].filter(id=>!state.visits.some(v=>v.taskId===id)):[];}
export function selectTask(state,id){if(!availableTasks(state).includes(id))return {accepted:false,state,reason:'task-unavailable'};return {accepted:true,state:{...state,selectedTask:id,selectedWindow:null}};}
export function selectWindow(state,id){if(state.round>=3||!stopBy(id))return {accepted:false,state,reason:'invalid-window'};if(!state.selectedTask)return {accepted:false,state,reason:'choose-task'};return {accepted:true,state:{...state,selectedWindow:id}};}
export function move(state,direction){const d={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[direction];if(!d||state.round>=3)return {state,accepted:false,reason:'edge'};const p={x:state.position.x+d[0],y:state.position.y+d[1]};if(p.x<0||p.x>4||p.y<0||p.y>2)return {state,accepted:false,reason:'edge'};return {accepted:true,state:{...state,position:p,route:[...state.route.map(p=>({...p})),p]}};}
export function interact(state){
 const fail=reason=>({accepted:false,reason,state:{...state,attempts:state.attempts+1}});
 if(state.round>=3)return {accepted:false,state,reason:'done'};
 const task=taskBy(state.selectedTask),window=stopBy(state.selectedWindow);
 if(!task||!availableTasks(state).includes(task.id))return fail('choose-task');
 if(!window)return fail('choose-window');
 if(window.x!==state.position.x||window.y!==state.position.y)return fail('travel');
 if(!task.contacts.includes(window.id))return fail('wrong-window');
 const visit={round:state.round,taskId:task.id,windowId:window.id,x:window.x,y:window.y,steps:state.route.length-1,cardId:task.cardId,sourceIds:[...task.sourceIds]};
 const visits=[...state.visits,visit],round=state.round<2?state.round+1:visits.filter(v=>v.round===2).length===2?3:2;
 return {accepted:true,state:{...state,round,selectedTask:null,selectedWindow:null,visits,attempts:state.attempts+1}};
}
export function guideHref(lang='zh'){return `../?lang=${['zh','en','ja'].includes(lang)?lang:'zh'}#/students/guide`;}
export function makeResult(state){
 const valid=state.round===3&&state.visits.length===4&&state.visits.every((v,i)=>{const t=taskBy(v.taskId),s=stopBy(v.windowId);return t&&s&&t.contacts.includes(s.id)&&v.x===s.x&&v.y===s.y&&v.round===[0,1,2,2][i]&&v.steps>=0&&v.steps<state.route.length&&state.route[v.steps].x===v.x&&state.route[v.steps].y===v.y;})&&state.visits[0].taskId==='course-plan'&&state.visits[1].taskId==='course-record'&&new Set(state.visits.slice(2).map(v=>v.taskId)).size===2&&state.visits.slice(2).every(v=>['graduation','credit'].includes(v.taskId));
 if(!valid)throw Error('Three acts with four task/contact consultations required');
 return {score:100,summary:W('完成三幕窗口練習。自由安排的是兩件諮詢，不是改動正式審核順序；請接著看真指南。繞路與探索不扣分。','Three consultation acts complete. You ordered two questions, not an official review process. Continue with the real guide. Detours and exploration do not reduce your score.','3幕の窓口練習が完了。自由にしたのは相談の順番で、正式な審査順ではありません。在校ガイドも確認。寄り道で減点しません。'),artifact:{fictionalMap:true,consultationOnly:true,route:state.route.map(p=>({...p})),visits:state.visits.map(v=>({...v,sourceIds:[...v.sourceIds]})),attempts:state.attempts,thirdActOrder:state.visits.slice(2).map(v=>v.taskId)},replay:state.visits.map((v,i)=>{
 const task=taskBy(v.taskId),stop=stopBy(v.windowId),points=state.route.slice(i?state.visits[i-1].steps:0,v.steps+1),duration=Math.max(900,Math.min(3600,(points.length-1)*220+700));
 return {duration,caption:W(`${task.label.zh} → ${stop.name.zh}｜諮詢，非核准`,`${task.label.en} → ${stop.name.en} · advice, not approval`,`${task.label.ja} → ${stop.name.ja}｜相談であり承認ではありません`),sprites:[{key:'target',x:50,y:50,width:92,height:90,opacity:.8,z:0},{key:'actor1',x:18+points[0].x*16,y:32+points[0].y*22,width:15,height:27,z:4,frames:points.map((p,n)=>({at:points.length===1?0:n*duration/(points.length-1),x:18+p.x*16,y:32+p.y*22}))},{key:stop.key,x:18+v.x*16,y:24+v.y*22,width:20,height:25,z:2},{key:`token${Math.min(i+1,3)}`,x:75,y:73,width:15,height:20,z:3}]};
 })};
}
const briefs=[W('第1幕｜我缺哪門必修？先選要問的事，再找可諮詢的窗口。','Act 1 · Missing a required course? Choose your question, then a place to ask.','第1幕｜必修が足りない？用事を選んで相談先へ。'),W('第2幕｜已經去上課，系統卻沒這門。教室能代替選課紀錄嗎？','Act 2 · You attended, but the course is missing in the system. Can the classroom fix a record?','第2幕｜出席したのに履修記録がない。教室で記録は直せる？'),W('第3幕｜畢業缺項與抵免資料，兩件獨立諮詢先問哪件？這不是正式審核順序。','Act 3 · Choose the order of two independent questions: graduation gaps and credit-transfer steps. This is not a review sequence.','第3幕｜卒業の不足と単位認定、別々の相談はどちらから？正式な審査順ではありません。')];
export function mount(ctx){
 let state=newTrip(),dead=false;const owned=[];
 owned.push(ctx.sprite('target',{id:'semester-fiction-map',x:50,y:50,width:92,height:90,opacity:.8}));
 stops.forEach((m,i)=>owned.push(ctx.sprite(m.key,{id:`semester-stop-${i}`,x:18+m.x*16,y:24+m.y*22,width:20,height:25,z:2})));
 const player=ctx.sprite('actor1',{id:'semester-player',x:18,y:76,width:15,height:27,z:4});owned.push(player);
 ctx.ui.text('semester-help',W('虛構漫畫示意圖，非真實校園導航。到站只是諮詢，不是選課、抵免或畢業核准。','Fictional comic map, not real campus navigation. A visit is advice, not registration, credit transfer or graduation approval.','架空の漫画マップです。実際の校内案内ではありません。到着は相談で、履修・単位・卒業の承認ではありません。'));
 const brief=ctx.ui.text('semester-brief',briefs[0]);
 const groups=[['course-plan'],['course-record'],['graduation','credit']].map((ids,i)=>ctx.ui.choice({id:`semester-task-${i}`,label:W('我要辦什麼？','What do I need?','何をしたい？'),options:ids.map(id=>({value:id,label:taskBy(id).label})),value:'',onChange:id=>{if(dead)return;const r=selectTask(state,id);if(!r.accepted){groups[state.round]?.setValue(state.selectedTask||'');ctx.hint(W('這件諮詢已完成，請選本幕還沒處理的事。','That consultation is complete. Choose a remaining question in this act.','その相談は完了しました。この幕の残りを選ぼう。'));return;}state=r.state;windows.setValue('');render();ctx.hint(taskBy(id).next);}}));
 const windows=ctx.ui.choice({id:'semester-window',label:W('想先找哪個窗口？','Which contact will you try?','どの窓口に聞く？'),options:stops.map(s=>({value:s.id,label:s.name})),value:'',onChange:id=>{if(dead)return;const r=selectWindow(state,id);if(!r.accepted){windows.setValue('');ctx.hint(W('先選你要辦的事，再判斷窗口。','Choose your question before choosing a contact.','先に用事を選び、それから窓口を考えよう。'));return;}state=r.state;render();ctx.hint(W('窗口選好了。移動到這站，再按「到站詢問」。','Contact chosen. Move to that stop, then Ask here.','窓口を選びました。移動して「ここで相談」を押そう。'));}});
 ctx.ui.text('semester-stops',W('圖上位置：系辦在左上，註冊課務組在右上，授課教室在下方中央。圖像只代表窗口。','Map key: department office at upper left, Registration and Curriculum Section at upper right, classroom at lower centre. Icons stand for contacts only.','図の左上は学科事務室、右上は註冊課務組（学籍・履修担当）、下中央は教室。絵は窓口の記号です。'));
 const plan=ctx.ui.text('semester-plan',W('','','')),location=ctx.ui.text('semester-position',W('','','')),guideNote=ctx.ui.text('semester-guide-note',W('','',''));
 const link=ctx.controls.ownerDocument.createElement('a');link.id='semester-guide';link.className='site-link';link.href=guideHref(ctx.lang);link.target='_blank';link.rel='noopener noreferrer';ctx.controls.append(link);
 function render(){
  player.update({x:18+state.position.x*16,y:32+state.position.y*22});ctx.setProgress(state.round,3);groups.forEach((g,i)=>{g.element.hidden=i!==state.round;});if(state.round<3)ctx.ui.setText(brief,briefs[state.round]);
  const t=taskBy(state.selectedTask),s=stopBy(state.selectedWindow),last=taskBy(state.visits.at(-1)?.taskId),shown=t||last;
  ctx.ui.setText(plan,W(`要問：${t?.label.zh||'先選事情'}｜窗口：${s?.name.zh||'尚未選擇'}${state.round===2?`｜已問 ${state.visits.filter(v=>v.round===2).length}/2 件`:''}`,`Question: ${t?.label.en||'choose one'} | Contact: ${s?.name.en||'not chosen'}${state.round===2?` | ${state.visits.filter(v=>v.round===2).length}/2 asked`:''}`,`用事：${t?.label.ja||'先に選択'}｜窓口：${s?.name.ja||'未選択'}${state.round===2?`｜${state.visits.filter(v=>v.round===2).length}/2件完了`:''}`));
  ctx.ui.setText(location,W(`目前：第${state.position.x+1}列、第${state.position.y+1}行，走了${state.route.length-1}步。方向按鈕或方向鍵皆可移動。`,`Position: column ${state.position.x+1}, row ${state.position.y+1}; ${state.route.length-1} steps. Use direction buttons or arrow keys.`,`現在：${state.position.x+1}列${state.position.y+1}行、${state.route.length-1}歩。方向ボタンか矢印キーで移動。`));
  const label=shown?.cardName||W('在校指南','Student guide','在校ガイド');link.textContent=ctx.words(W(`開啟在校指南｜${label.zh}`,`Open Student Guide | ${label.en}`,`在校ガイドを開く｜${label.ja}`));link.dataset.guideCard=shown?.cardId||'';
  ctx.ui.setText(guideNote,W(`打開後，在頁內搜尋「${label.zh}」；按指南確認當期規定與承辦。`,`After opening, search the guide for “${label.en}”. Check current rules and contacts there.`,`開いたら「${label.ja}」をページ内で検索。当期の規定と窓口を確認。`));
 }
 const go=d=>{if(dead)return;const r=move(state,d);state=r.state;if(!r.accepted){ctx.hint(W('到了圖邊，換個方向。','Map edge reached. Try another direction.','地図の端です。別の方向へ。'));return;}ctx.sound('click');render();};
 const directions=ctx.ui.group('semester-direction-controls');for(const[d,label]of [['up',W('往上','Up','上へ')],['left',W('往左','Left','左へ')],['down',W('往下','Down','下へ')],['right',W('往右','Right','右へ')]])directions.append(ctx.ui.button({id:`semester-${d}`,label,onClick:()=>go(d)}));
 ctx.ui.button({id:'semester-visit',label:W('到站詢問','Ask here','ここで相談'),onClick:()=>{
  if(dead||state.round>=3)return;const r=interact(state);state=r.state;if(!r.accepted){ctx.sound('error');const task=taskBy(state.selectedTask);ctx.hint(r.reason==='choose-task'?W('先選你要辦的事，走到座標本身不能完成任務。','Choose a question first. Reaching coordinates alone does not complete an errand.','先に用事を選ぼう。座標に着くだけでは完了しません。'):r.reason==='choose-window'?W('還沒選要找的窗口。先判斷誰能處理這件事。','Choose the contact you want to ask.','まだ窓口を選んでいません。誰に聞くか考えよう。'):r.reason==='travel'?W('還沒到你選的窗口。先看圖例，再移動。','You have not reached your chosen contact. Check the map key and move.','選んだ窓口にはまだ着いていません。図の説明を見て移動しよう。'):W(`${stopBy(state.selectedWindow).name.zh}不是這項任務的程序窗口。${task.next.zh}`,`${stopBy(state.selectedWindow).name.en} is not the process contact for this question. ${task.next.en}`,`${stopBy(state.selectedWindow).name.ja}は今回の手続き窓口ではありません。${task.next.ja}`));return;}
  ctx.sound('success');groups.forEach(g=>g.setValue(''));windows.setValue('');if(state.round===3){ctx.setProgress(3,3);ctx.complete(makeResult(state));return;}render();ctx.hint(W('找對諮詢窗口了，不代表申請核准。繼續選下一件事，或打開真指南。','You found a contact, not an approval. Choose another question or open the real guide.','相談先が見つかりました。承認ではありません。次の用事か実際のガイドへ。'));
 }});
 const off=ctx.onKey(e=>{if(['input','select','textarea','button','a'].includes(e.target?.tagName?.toLowerCase()))return;const d={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right'}[e.key];if(d){e.preventDefault();go(d);}});render();return {destroy(){dead=true;off();owned.forEach(s=>s.remove());}};
}
