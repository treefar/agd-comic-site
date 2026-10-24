// Research-only proposal. Writes only this report directory, never product data.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),cp=require('node:child_process');
const root=path.resolve(__dirname,'../../../..'),out=__dirname;
const read=f=>JSON.parse(fs.readFileSync(path.join(root,f),'utf8'));
const hash=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const esc=x=>String(x).replace(/~/g,'~0').replace(/\//g,'~1');
const norm=x=>x.replace(/\s+/g,' ').trim();
const zh=read('data/admission.json'),en=read('data/en/admission.json'),ja=read('data/ja/messages.json');
if(zh[6].slug!=='evening'||en[6].slug!=='evening')throw Error('Record order changed');
const old=read('holiday-lab/translation-review/program-currentness-20261023/proposals.json');
const fields=[];
const add=(p,z,e,j,sources,reason)=>fields.push({pointer:p,zh:z,en:e,ja:j,sources,reason});
const sources=['quota-native','closed-20261024','B6','D1','C5','E7','E8','E9'];
add('title','四技進修部招生','Four-Year Continuing Education Admissions','四技進修部の入試',['B6'],'本頁改為本系實際招生學制，其他學制仍在內容解釋且不誤稱本系有開。');
add('quota','115學年度一般單招30名，已截止','AY 115: 30 general-admission places; closed','115学年度：一般募集30名、募集終了',sources,'30是115歷史名額，不代表現在可報名。');
add('schedule_short','115招生已結束｜書面資料審查','AY 115 admissions closed | Application-document review','115学年度の募集終了｜出願書類審査',['closed-20261024','B6'],'刪除不成立的統一面試敘述；未主張全管道免統測／學測。');
add('summary','115學年度本系四技進修部一般單獨招生30名，招生已結束。二技、二專及產學攜手是不同管道，該年度招生名單未列本系。','For academic year 115, AGD listed 30 general-admission places in its four-year continuing education program. Admissions have ended. The separate two-year and industry–academia admission lists did not include AGD that year.','115学年度、本学科の四技進修部は独自入試の一般募集で定員30名でした。募集は終了しています。二技・二專・産学連携は別の入試区分で、同年度の募集一覧に本学科は記載されていません。',sources,'PROGRAM-01；修正未列本系名額，區分學制與資格層次。');
add('content','本系115學年度四技進修部一般單獨招生30名，採書面資料審查；查核至2026年10月24日，招生已結束。該年度二技、二專及產學攜手招生名單未列本系。\n\n學制：二技、四技為學士課程；二專為二年制專科課程，修滿規定可取得副學士學位。報考前請核對各管道簡章的學歷、身分與應備資料。\n\n四技進修部原則上安排週一至週五晚間，輔以週六、週日；特殊課程可另行排課，實際時段以課表為準。二技、二專的時段依各系科規定。\n\n下一次招生請查看新學年度公告；舊名額不代表目前仍可報名。','AGD listed 30 general-admission places in four-year continuing education for academic year 115. Selection used application-document review. Admissions were closed when checked on 24 October 2026. The separate two-year and industry–academia admission lists did not include AGD that year.\n\nProgram levels: 二技 is a two-year bachelor’s completion program; 四技 is a four-year bachelor’s program; 二專 is a two-year associate-degree program. Check the education, applicant-status and document requirements in the relevant admission guide.\n\nFour-year continuing education classes are generally scheduled on weekday evenings, supplemented by weekend classes. Special courses may have other arrangements; follow the actual timetable. Schedules for the two-year programs vary by department.\n\nFor the next intake, check the new academic year’s announcements. A past quota does not mean applications remain open.','115学年度、本学科の四技進修部は独自入試の一般募集で定員30名、選考方法は出願書類審査でした。2026年10月24日の確認時点で募集は終了しています。同年度の二技・二專・産学連携の募集一覧に、本学科は記載されていません。\n\n課程区分：二技は2年制の学士課程、四技は4年制の学士課程、二專は修了要件を満たすと副學士の学位を取得できる2年制の専科課程です。学歴・身分・提出書類などの出願条件は、各募集要項を確認してください。\n\n四技進修部の授業は原則として平日の夜間に行われ、土日にも開講されます。特別な授業は別の日程となる場合があるため、実際の時間割を確認してください。二技・二專の授業時間は学科ごとに異なります。\n\n次回の募集は新学年度の案内を確認してください。過去の募集定員は、現在も出願できることを意味しません。',sources,'PROGRAM-02；不保留未證實的面試、免兩測及固定18:30–21:30保證；原台灣學制名保留。');
add('key_notes/0','115本系四技進修部一般單招30名，已截止；新年度以招生網公告為準。','AY 115 listed 30 AGD general-admission places in four-year continuing education; admissions have closed. Check the admissions portal for the next intake.','115学年度の本学科・四技進修部の一般募集は30名で、募集は終了しています。次年度は入試サイトの案内を確認してください。',sources,'同摘要名額、狀態一致。');
add('key_notes/2','四技進修部原則上平日晚間、輔以週末；特殊課程與實際時間以課表為準。','Four-year continuing education generally uses weekday evenings and weekend sessions; special courses and actual times follow the timetable.','四技進修部は原則として平日の夜間と土日に開講されます。特別な授業を含む実際の日時は時間割を確認してください。',['B6'],'不提供簡章沒有的固定時段。');
add('key_notes/3','四技進修部符合修業與畢業規定者授予學士學位。','Students who meet the four-year continuing education program’s study and graduation requirements are awarded a bachelor’s degree.','四技進修部では、修業・卒業の要件を満たすと学士の学位が授与されます。',['B6'],'已證成學位層次，未證成證書外觀／文字完全一樣；改為可核學位。');
add('stu_focus/0','上課安排以當學期課表為準，先評估工作與課程時間能否配合。','Check the semester timetable before deciding whether classes fit your work schedule.','仕事と両立できるか、学期ごとの時間割を確認してください。',['B6'],'保留在職受眾實際用途，去掉無來源固定時段。');
add('stu_focus/1','課程、師資與教學空間請查看本系及進修部當期公告。','Check current department and continuing education announcements for courses, instructors and teaching spaces.','授業・担当教員・教室は、本学科と進修部の当期の案内を確認してください。',['B6'],'共用所有資源無直接來源；改成查證路徑而非保證。');
add('stu_focus/2','在職或再次升學者，先依簡章核對學歷、身分與應備資料。','Working applicants and those returning to study should check the guide’s education, applicant-status and document requirements.','社会人や再進学を希望する方は、募集要項で学歴・身分・提出書類の条件を確認してください。',['B6'],'適合不是資格保證；不泛化所有學制對象。');
add('stu_focus/3','學雜費、就學貸款與補助須分別核對當期公告及申請資格。','Check current fee schedules, student-loan rules and subsidy eligibility separately.','授業料・諸費用、就学ローン、補助制度は、それぞれ当期の案内と申請条件を確認してください。',['B6'],'費用比日間部低及工讀補助承諾未證成，不作金額／資格保證。');
add('timeline/0/date','115招生已結束；新年度待公告','AY 115 closed; await the next intake announcement','115学年度は募集終了。次年度の案内を確認',['closed-20261024'],'去除像現在可報名的無年度時程。');
add('timeline/0/label','查看新年度簡章 → 核對本系名額與資格 → 依公告報名及上傳資料','Check the new guide → Confirm AGD places and eligibility → Follow the announced application and document-upload schedule','新年度の募集要項を確認 → 本学科の定員・出願資格を確認 → 案内に従って出願・書類提出',['B6','closed-20261024'],'未新增假日期；不保留本系未證成的面試流程。');
add('fees/apply','依新學年度招生簡章；115學年度招生已結束。','Follow the new academic year’s admission guide; AY 115 admissions have closed.','新学年度の募集要項を確認してください。115学年度の募集は終了しています。',['B6','closed-20261024'],'不拿115費用推新年度。');
add('fees/tuition','以當學期學雜費表為準；就學貸款與減免另依資格申請。','Follow the semester’s published tuition and fee schedule. Student loans and fee waivers have separate eligibility requirements.','授業料・諸費用は当該学期の公表額を確認してください。就学ローンや減免は別途申請条件があります。',['B6'],'刪除未核的費用比較與通通可貸保證。');
const get=(o,p)=>p.split('/').reduce((a,k)=>a[k],o);
const operations=[];
for(const x of fields){
 const beforeZ=get(zh[6],x.pointer),beforeE=get(en[6],x.pointer),oldKey=norm(beforeZ),newKey=norm(x.zh);
 operations.push({id:'PROGRAM-'+x.pointer,lang:'zh',op:'replace',file:'data/admission.json',pointer:'/6/'+x.pointer,before:beforeZ,after:x.zh,source_ids:x.sources,reason:x.reason});
 operations.push({id:'PROGRAM-'+x.pointer,lang:'en',op:'replace',file:'data/en/admission.json',pointer:'/6/'+x.pointer,before:beforeE,after:x.en,source_ids:x.sources,reason:x.reason});
 operations.push({id:'PROGRAM-'+x.pointer,lang:'ja',op:Object.hasOwn(ja,newKey)?'replace':'add',file:'data/ja/messages.json',pointer:'/'+esc(newKey),before:Object.hasOwn(ja,newKey)?ja[newKey]:null,after:x.ja,legacy_key:oldKey,legacy_before:ja[oldKey]??null,legacy_pointer:'/'+esc(oldKey),retain_legacy_key:true,source_ids:x.sources,reason:x.reason});
}
const roleMap={
 '助理教授':'助理教授（台湾の職名／Assistant Professor）',
 '助理教授 · 電競娛樂系合聘':'助理教授（台湾の職名／Assistant Professor）・電競娛樂系との合聘',
 '助理教授 · 從聘':'助理教授（台湾の職名／Assistant Professor）・従たる所属としての任用（從聘）',
 '助理教授 · 留職停薪':'助理教授（台湾の職名／Assistant Professor）・無給休職中'
};
const faculty=read('data/faculty.json'),enFaculty=read('data/en/faculty.json');
const title_checks=faculty.map((f,i)=>({name:f.name,file:'data/faculty.json',pointer:`/${i}/role`,before:f.role,english_role:enFaculty[i].role,source_url:'https://www.dgd.stu.edu.tw/系所成員/',decision:f.role.startsWith('助理教授')?'Preserve Taiwan rank; change JA display only':'retain',caveat:f.name==='蔣天華'?'官方雙語同列英文Assistant Professor(T)與中文副教授(技)衝突；依中文保留，不自行降等':'現有中文合聘／從聘狀態未被本輪主頁全部證成；保留原有狀態，不另推定新任命'}));
const roles=Object.entries(roleMap).map(([key,after])=>({lang:'ja',op:'replace',file:'data/ja/messages.json',pointer:'/'+esc(key),before:ja[key],after,source_ids:['dgd-faculty-20261024','mext-rank-not-equivalence'],reason:'日本助教可有Assistant Professor譯名，但並無台日任用等值證明。保留台灣原職、官方英稱，不把臺灣助理教授斷言為日本助教。',references:faculty.flatMap((f,i)=>f.role===key?[{file:'data/faculty.json',pointer:`/${i}/role`,name:f.name}]:[]),generated_reference:{file:'locale-ja.js',key,action:'由建置重產，不手改'}}));
const watched=['data/admission.json','data/en/admission.json','data/ja/messages.json','data/faculty.json','data/en/faculty.json'];
const p={schema:1,as_of:'2026-10-24',scope:'research only; root must apply and verify in local branch',product_written:false,native_speaker_approved:false,public_release:false,operations,title_operations:roles,title_checks,source_ids:[...old.sources,{id:'closed-20261024',url:'https://reg.aca.stu.edu.tw/',layer:'官方搜尋正文擷取；直接open403',read_scope:'115四技進修部及二技／二專均招生已結束，首頁寫請期待116；非即時原生頁',receipt:'web-research-02.json'},{id:'dgd-faculty-20261024',url:'https://www.dgd.stu.edu.tw/系所成員/',layer:'官方搜尋正文擷取',read_scope:'逐人中文與英職稱，鄧樹遠主任/副教授；蔣天華雙語衝突保留',receipt:'web-research-02.json'},{id:'mext-rank-not-equivalence',url:'https://www.mext.go.jp/b_menu/shingi/chukyo/chukyo4/003/gijiroku/06062315/006.htm',layer:'本輪web open全文',read_scope:'通知記7：不定日本准教授與助教公定英文，英文參考不等於跨國職級等值',receipt:'web-research-02.json'}],input_sha256:watched.map(file=>({file,sha256:hash(path.join(root,file))})),implementation_notes:['本提案不刪任何舊JA字典key。中文canonical字串變更後新增JA新key，避免只改原key造成翻譯失聯。','locale-en.js／locale-ja.js由原建置工具重產；勿把JSON pointer的~1視為一般字元。','key_notes/1既有本系電話保留；links原有三個URL保留，以免擴大變動。year維持115歷史紀錄，不拿未核116替代。','英文與日文為審閱翻譯，不是官方逐字譯名／母語簽核。','官方教師頁部分英中列本身矛盾；不從單一Assistant Professor翻譯推定所有人的任用。'],pending:['部分官方頁直接讀取403；本輪搜尋正文擷取不是即時Chrome完整頁。狀態另有10/23原生收據。','新年度116是否已有本系簡章／名額，未實讀全部116附件，不提供數字或申請承諾。','全部處室日文正式名稱未查得；不得以Student Assistance Section推導官方日文職名。','蔣天華官網中英職稱衝突，保留中文原資料，尚待校方資料更新。']};
fs.writeFileSync(path.join(out,'proposal.json'),JSON.stringify(p,null,2)+'\n');
const result={fields:fields.length,operations:operations.length,title_operations:roles.length,faculty_checked:title_checks.length,program_values:operations.filter(o=>['PROGRAM-summary','PROGRAM-content'].includes(o.id)&&o.lang!=='zh').length,all_before_present:operations.filter(o=>o.lang!=='ja').every(o=>o.before!==undefined),product_written:false};
fs.writeFileSync(path.join(out,'verification.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result));
