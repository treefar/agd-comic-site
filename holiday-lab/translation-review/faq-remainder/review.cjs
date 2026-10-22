// Explicit human-readable decisions after comparing all 18 Chinese/EN/JA FAQ pairs.
const fs=require('node:fs'),path=require('node:path'),{createHash}=require('node:crypto');
const root=path.resolve(__dirname,'../../..'),read=f=>fs.readFileSync(path.join(root,f),'utf8'),norm=s=>s.replace(/\s+/g,' ').trim(),packet=JSON.parse(fs.readFileSync(path.join(__dirname,'packet.json'),'utf8'));
const notes={
 'faq/internship/0':'保留兩語問答。112–115、2學分、160小時及當期認列規定均對應原文；eligible recognized duties略生硬但沒有漏掉認列限制。不重驗課表制度。',
 'faq/internship/1':'日文保留。英文問句waive可能讓人以為整個實習義務被免除，改工作時數能否計入實習要求；答案不把等待認列回覆強化成已獲學分核准。公司、職務、工作內容與先確認再安排仍完整。',
 'faq/certification/0':'兩語保留。114-2歷史公告限定、入學前證照不補助、畢業認列須另核清單、1713均保留；沒有把獎助與畢業門檻混為同一資格。未重驗當期獎助全文。',
 'faq/certification/1':'兩語保留。登錄與申請分開、一括登錄後仍可能另申請、證照生效半年內、先問個案期限均保留。日文公示/発効較正式但可理解，不為風格全面重譯。',
 'faq/leave/0':'英問答、日答保留。日文問題休暇易被理解成休假，改欠席申請。兩語仍明確未回覆不等於核准、以系統最終結果為準、向導師追蹤。',
 'faq/leave/1':'兩語問題將請假申請說清楚。英文extended breaks與日文長期休暇可能被理解成學校放假，按本卡請假脈絡改較長期間的缺席；保留2日以上、2114、導師/生輔先確認及考試/長假再詢註冊課務。未新增准假標準。',
 'faq/course-selection/0':'兩語問句與日答保留。英答sole authority較原文強硬，改直接核對校務系統課表，保留實際登錄才算數，沒有新加排他法律效力。',
 'faq/course-selection/1':'兩語保留。115-1、2026/9/14上午9時已截止及棄選/特殊情況另問均完整；不改成仍可一般加退選，亦不改歷史日期。日文窗口名全站統一不在本輪範圍。',
 'faq/capstone/0':'兩語保留。112–115、一般班、專題設計ⅠⅡ必修、依入學年度、不可跨班套用完整。日文保留台灣原課名並加卒業制作說明；英文Capstone Design為解釋性課名，未宣稱官方課名對照已核。',
 'faq/capstone/1':'英文保留。日文追審査不自然且容易猜測重考機制，改保留本系原詞補審並加追加の審査說明；組隊、異動、向系辦取當屆辦法及不可套往年均保留。不定義補審的實際資格或次數。',
 'faq/financial-aid/0':'英文保留。日文學産低所得世帯支援對台灣方案辨識不足，改保留中文顯示標籤不利處境助學/學產低收並加功能說明；115-1、10/20、10/8及2124都不動。不捏造官方日文方案名，沒有重新確認截止日是否延期。',
 'faq/financial-aid/1':'兩語保留。先告知申請/已領案件、可能重複請領限制、名稱不同不代表併領均完整；沒有新增一律不得併領的規則。',
 'faq/support-rights/0':'兩語都將線上預約誤讀成線上諮商服務，問題與答案改成在線上辦理諮商預約；不承諾遠距服務。服務頁決定方式/時段、找不到請導師協助仍保留。',
 'faq/support-rights/1':'兩語保留。不要假設共用、請導師找承辦、先確認案件類型/方式/期限再用對表均完整。gender equity/性別平等屬台灣制度解釋；未引入他國申訴制度或承辦人。',
 'faq/career/0':'兩語保留。職涯規劃、UCAN職能檢測、講座、就業輔導及當期資源確認都在；不把職掌清單說成每項服務必定現正開放。',
 'faq/career/1':'兩語保留。活動日期/職缺看當期公告、過往報名連結不可直接沿用均完整；沒有補辦理頻率或保證職缺。',
 'faq/graduate-study/0':'英問答與日答保留。日問推薦選抜多加推薦制度概念，官方116系統實讀用碩士班甄試，改修士課程の甄試（選抜入試）解釋。115應屆可依規定報考、附表一/核章、註冊前學士資格不變。未逐所驗推薦函要求。',
 'faq/graduate-study/1':'英問答與日答保留。日問題同樣逐句對官方116碩士班甄試名稱核對後去除推薦，非從大學甄選單樣本套用。2026/11/2下午4時、特定資格10/27及他校各查116簡章均完整。'
};
const changes=[];
function change(id,part,lang,text,severity,reason){const u=packet.units.find(u=>u.id===id);if(!u)throw Error('MISSING_UNIT '+id);const key=norm(u[part].zh),file=lang==='en'?'data/en/student-guide-ui.json':'data/ja/messages.json',old=JSON.parse(read(file))[key];if(old!==u[part][lang])throw Error('ACTIVE_SOURCE_MISMATCH '+id);changes.push({id:`${id}/${part}/${lang}`,kind:'set-json',file,key,old,new:text,severity,reason,source_ids:u.source_ids,canonical_chinese:u[part].zh});}
change('faq/internship/1','question','en','Can my part-time work hours count toward the internship requirement?','P1','抵實習是認列時數，不等於waive整個義務。');
change('faq/internship/1','answer','en','Not necessarily. First ask the department office or your internship faculty advisor to review the company, position, and job duties. Wait for confirmation of whether the work can be recognized before making arrangements.','P2','把認列回覆譯清楚，不先宣稱已核准學分。');
change('faq/leave/0','question','ja','申請後も返答がない場合、欠席申請が承認されたと考えてよいですか？','P2','使用學生缺席申請，避免休暇的休假語感。');
change('faq/leave/1','question','en','Can absence requests for two or more days always be handled entirely online?','P2','修正leaves語法並保留一定/只在線上兩個限定。');
change('faq/leave/1','question','ja','2日以上の欠席申請は、必ずオンラインだけで手続きできますか？','P2','請假是欠席申請，非學校休假。');
change('faq/leave/1','answer','en','First ask your class advisor or the Student Assistance Section at ext. 2114 about the required documents and approval process. If your absence involves exams or a longer period, also check with the Registration and Curriculum Section if you are unsure.','P2','長假在請假脈絡指較長缺席，不能譯成學校extended breaks。');
change('faq/leave/1','answer','ja','まず担任教員または生活指導組（内線2114）に、必要な証明書類と承認手続きを確認してください。試験に重なる場合や長期間の欠席で不明な点がある場合は、登録・履修課にも確認してください。','P2','長期休暇改成長期間の欠席；不新增流程規則。');
change('faq/course-selection/0','answer','en','Check the course registration record in the Academic Information System and make sure the course actually appears on your schedule.','P2','刪去原文沒有的sole authority強化語氣，保留正式紀錄。');
change('faq/capstone/1','question','ja','チームの人数、脱退、「補審」（追加の審査）の規定はどこで確認できますか？','P2','保留本系原詞補審並用通用說明，不猜重考/複審制度。');
change('faq/capstone/1','answer','ja','学科事務室から自分たちの年度に適用される正式な規定を入手し、チーム編成、メンバー変更、「補審」（追加の審査）について確認してください。他学科や過去年度の規則をそのまま適用しないでください。','P2','追審査改原詞加說明；保留當屆、異動與不可套他系舊規。');
change('faq/financial-aid/0','answer','ja','制度ごとに個別に手続きします。115-1学期の「不利處境助學」（就学支援）は10/20、「學產低收」（低所得世帯向け支援）は10/8にすでに締め切られています。緊急時の支援は事案と制度によって異なるため、まずは生活指導組（内線2124）に相談してください。','P2','保留台灣方案的中文顯示標籤，解釋性日文不是官方名稱。');
change('faq/support-rights/0','question','en','Where can I book a counseling appointment online?','P1','線上是預約管道，非承諾遠距諮商。');
change('faq/support-rights/0','question','ja','カウンセリングをオンラインで予約するには、どこから手続きすればよいですか？','P1','修正オンラインカウンセリング服務方式誤讀。');
change('faq/support-rights/0','answer','en','The university’s “Current Students” page has a link for booking counseling appointments online. Check the service page for booking instructions and available time slots. If you cannot find the link, ask your class advisor to help you contact the service.','P1','區別online booking和online counseling，保留服務頁及導師協助。');
change('faq/support-rights/0','answer','ja','本学の「在校生」ページに、カウンセリングをオンラインで予約するためのリンクがあります。予約方法と時間枠はサービス案内ページで確認してください。リンクが見つからない場合は、担任教員に連絡のサポートを依頼してください。','P1','不把預約入口當成遠距諮商服務。');
change('faq/graduate-study/0','question','ja','卒業見込みでまだ卒業証明書を受け取っていませんが、本学の116学年度修士課程の甄試（選抜入試）に出願できますか？','P1','官方原詞是碩士班甄試，不憑中文簡稱加入日本推薦選抜制度。');
change('faq/graduate-study/1','question','ja','本学の116学年度修士課程の甄試（選抜入試）の出願締切はいつですか？他大学も同じですか？','P1','逐筆核對116碩士班甄試；明示修士層級，去除推薦。');
const review={...packet,scope:'Only the remaining 18 FAQ pairs; semantic comparison, not recertification of all underlying school rules or native-speaker certification.',units:packet.units.map(u=>({...u,review:{decision:changes.some(c=>c.id.startsWith(u.id+'/'))?'revise':'retain',note:notes[u.id],strings:['question','answer'].flatMap(part=>['en','ja'].map(lang=>{const c=changes.find(c=>c.id===`${u.id}/${part}/${lang}`);return{part,lang,decision:c?'revise':'retain',reason:c?.reason??'已逐句對照：原意、限制、數字與聯繫方式保留；無需為風格改寫。',proposed:c?.new??u[part][lang]};}))}}))};
const files=[...new Set(changes.map(c=>c.file))].map(file=>({file,before_sha256:createHash('sha256').update(read(file)).digest('hex')}));
const plan={source_commit:packet.source_commit,checked_at:packet.checked_at,scope:'proposal only; 18 FAQ pairs, 72 target strings',files,changes};
fs.writeFileSync(path.join(__dirname,'reviewed.json'),JSON.stringify(review,null,2)+'\n');fs.writeFileSync(path.join(__dirname,'exact-plan.json'),JSON.stringify(plan,null,2)+'\n');
console.log(JSON.stringify({units:review.units.length,strings:review.units.length*4,revise_units:review.units.filter(u=>u.review.decision==='revise').length,retain_units:review.units.filter(u=>u.review.decision==='retain').length,changed_strings:changes.length,retained_strings:review.units.length*4-changes.length,files:files.map(f=>f.file),P1:changes.filter(c=>c.severity==='P1').length,P2:changes.filter(c=>c.severity==='P2').length},null,2));
