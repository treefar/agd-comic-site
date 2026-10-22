// Explicit per-key semantic review. Writes proposals/evidence only, never product.
const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');const dir=__dirname,repo=path.resolve(dir,'../..'),inv=JSON.parse(fs.readFileSync(path.join(dir,'inventory.json'))),cache=new Map(),fixed=f=>{if(!cache.has(f))cache.set(f,execFileSync('git',['show',`${inv.fixed_commit}:${f}`],{cwd:repo,maxBuffer:20*1024*1024}).toString());return cache.get(f);},parse=f=>JSON.parse(fixed(f)),escape=s=>s.replace(/~/g,'~0').replace(/\//g,'~1');
// One line for every one of the 103 keys, including retained labels and fragments.
const notes=`
實驗室用途為數位繪圖，Drawing對應；非持續確認正式英名。|デジタルドローイング可清楚表達電繪用途，實習室屬解釋譯名。
繪圖板、2D角色與場景三項完整，練功房轉成practice studio自然。|ペンタブレット與2D兩項設計內容均保留，練功房意象自然轉換。
設備、2D角色設定、場景、UI、插漫畫各項均保留。|作畫、角色、場景、UI及插漫畫實習清單完整。
3D列印工作坊意義明確，不把它當正式外部品牌名。|工房與3Dプリンティング清楚，未新增開放申請資格。
FDM與光固化、把模型實體化均保留，fleet雖偏直譯但可理解。|光造形與FDM兩種技術均保留，不推定品牌或機型。
三款軟體、兩種列印與公仔道具用途均保留。|SLA/DLP、三款軟體與實物輸出用途完整，不新增材料規格。
Motion Capture對應動作捕捉，與後述課程用途一致。|モーションキャプチャー清楚，實習室名稱為說明譯法。
不需後期是原中文宣稱，翻譯保留但設備能力仍需單位確認。|寫實不是高解析度，去掉原文未說的高精細；不需後製宣稱另標待確認。
五個教育目標與拍攝後製等功能完整；不以英語通過當設備效能查證。|五個教育目標及虛實攝影機連動均保留；不用翻譯解決原文不用後製卻列後製的界線。
Somatosensory偏感覺生理學，體感遊戲環境宜以motion-sensing說明。|体感型インタラクティブ可理解，不把正式日名視為已核定。
VIVE、跑步機、氣壓裝置與腳踏車四項不漏。|四類設備齊全；空壓水平裝置不猜型號或額外運動軸數。
主軸是體感遊戲製作、即時修正及驗證，設備四項應保留。|製作、修正、驗證及四項設備完整，未推定自行借用資格。
Puppet Animation表達偶動畫，不改成一般數位動畫。|パペットアニメーション與停格場域一致。
立體造型不只角色雕塑，應用physical model-making保留道具等可能。|手工立體造形和逐格拍攝的工藝感完整，無必改。
立體造型在停格語境是實體模型，避免誤讀數位3D建模。|立體造形物、光源、軌道、軟體與合成流程完整。
Merchandise Design表達週邊設計，未自行改原中文週字。|グッズデザイン自然、易懂；非核定官方日名。
直噴機未指定只能印衣服，不譯成direct-to-garment。|ダイレクトプリンター保持泛稱，不自作UV或印衣服規格。
設備四項和IP商品化完整；direct-to-substrate未限特定材質。|四類設備及角色IP實體化完整，不補收費或使用限制。
科藝館翻成Tech-Art Pavilion能保留運動科技藝術結合。|テクノロジーアート保留科藝意思，作為解釋譯名。
運動與科技的數位創新用途完整，非一般體育館。|運動與科技的複合設施意義完整。
digital innovative economy talent不自然，應保留智慧場館、戶外運動與四目標後重寫。|経済人材生硬，ロードレース也不準確表達路跑；保留四項目標改自然說法。
We-Media偏區域用語，自媒體改說independent media便於一般讀者理解。|自メディア生硬，個人が発信するメディア的簡明名稱更清楚。
四間攝影棚及四間錄音室數字正確，人才與工作領域均保留。|四加四與播報、配音、配樂及3D後製保留；不推導可隨到隨用。
各培育領域完整，但實驗室名與自媒體用語需和短名一致。|個人メディア取代自メディア，動畫到配音等清單完整保留。
橫山基地與括號全名對應，不造新的官方英文縮寫。|横山是日文常用寫法，工房功能說明可保留；正式日名未核。
Maker、DIY及科技跨域三項均保留，語意可理解。|メイカー、DIY、跨域創作意義完整，無必改。
Maker文化、DIY、科技、龐克反消費及四類設備均保留；文化通論是原稿說法未重新證實。|特異な興味帶異常意味，原文只是獨特興趣；改独自の関心，其他通論保留但列來源限制。
網路媒體是online media語境，不讓讀者以為只是網路工程課。|オンラインメディア比ネットワークメディア更貼合內容製作課堂。
從理論到使用引擎開發，不暗示學生必須從零製作引擎。|ゲームエンジン開発會誤作開發引擎本身，改為使用引擎開發。
兩類教室、設計學院B1及Unity/Unreal實作均保留，名稱與前列一致。|B1明確地下1階，地點保留設計學院原名避免把組織日譯冒充建築正式名稱。
Esports Professional Classroom偏直譯但清楚，不為改而改。|eスポーツ専門教室對應清楚，未宣稱職業隊訓練認證。
高規機台及賽事級設備忠實，沒有新增硬體型號。|高規與大會用設備保留；未重新驗實當前庫存。
三項活動及跨域整合完整；學程不升格為獨立學系。|實況串流不保證包含実況解說，改ライブ配信較準確。
Three-Creativity未表達創新及創業，保留三創原名加Maker Center。|三創基地與メイカーセンター保留原名，不假造已核日名。
三創三項意義需均呈現，不把三項都說成creativity。|創意、創新、起業與學生孵化過程均完整，無必改。
從提案原型到育成完整，基地名需與前三創原名一致並保留展演。|提案原型育成與IP品牌商模展演均齊全，不新增創業成功保證。
章節標題WHAT WE DO清楚，漫畫章次保留。|私たちがしていること可懂，不必為語氣偏好重寫。
AGD學生在學什麼，疑問語氣與原意保留。|讀者疑問句清楚，未擅自換學科名稱。
此為跨span片段，當前EN實為inanimation黏字，需整句上下文修正。|育成放句首無句法銜接，需整句重排，不能單鍵當通過。
動畫創作在本段用animation可理解，需配合完整句標點。|アニメーション制作正確，與結尾育成人材語序需一起處理。
game design正確，不因出現兩次而改成不同術語。|ゲームデザイン正確，兩個來源位置均列coveredKeys。
影音後製及AR/VR均保留，需與前後span整句組合。|映像後製漏聲音面向可補映像・音声；與片段育成整句處理。
結尾句點本身可用，但整句目前黏字及殘頓號，需上下文處理。|に必要な専門人材缺育成述語，需整句處理。
firstDepartment的空白遺失及殘引號是整段問題，不能只核此詞。|2006設立部分在整段缺設立動詞，需整段重排。
舊系名Digital Game Design與原文一致，仍保留歷史名稱不追改現名。|デジタルゲームデザイン学科可作舊系名譯法，歷史主張另列來源狀態。
asAnimation的空白遺失，整段更名句需一併處理。|更名語意與2011一致，放回整段檢查，而非單鍵單獨宣稱完整。
目前短譯Animation & Game Design可作學科簡稱，整段首次出現應說Department。|現系名對應清楚，與更名段落一併處理閉引號。
原文師生、掌握產業脈動在英譯不完整，且inVision黏字，需整段重翻。|充實課程、產學連攜與師生企業見學講座均保留，仍需補整段設立句。
主辦執行單位官方用Vision Get WILD，既有大小寫不改品牌實質。|活動原名保留；不是日文漏譯，不亂改成日本另一獎項。
Bahamut ACG品牌縮稱可保留，不擅補特定年度或獎別。|巴哈姆特 ACG保留活動原名，不機械翻譯品牌。
Times Young Creative Awards與主辦官方英文對應。|金犢獎是專名，保留中文名稱可辨識，不硬改成金の子牛賞。
Awardsand黏字且佳績主語跨前段，需整段處理。|継続して優秀な成果保留屢獲佳績語意，與整段連動。
課程地圖CTA清楚，書本符號和英文保留。|カリキュラムマップ自然，原英文裝飾不必再翻。
簡短標題雖保留128與四年，原本每學期上課的查詢意圖漏掉，可補。|疑問與四年128單位完整，不擅變更畢業學分規定。
core courses泛化專業必修，補required保留必修屬性。|四軸、專業必修、畢製實習齊全，無必改。
導覽按鈕explore清楚，箭頭保留。|按鈕動詞與目的地清楚，箭頭保留。
industry-experienced faculty保留業界背景，數字由外層提供。|名的量詞與業界背景正確，不自行增減教師數。
平均15年以上保留，不變成每位都15年以上。|平均與15+清楚，未視為逐人經歷新核定。
Meet the faculty比直譯陣容自然，動作目的一致。|教員陣を見る自然，未指向外部申請。
specialist labs保留特色實驗室，12由外層提供。|特色與室的量詞保留，12個設備現況未新盤點。
跨D/DB/H/B1位置資訊完整，不將B1當一棟樓命名。|複數フロア能表跨樓層，建築代號維持原樣。
Explore為動作入口，沒有新增報名或借用承諾。|探索する與漫畫語氣相容，原目的地不動。
原英譯空白抹去屆的單位，改cohorts明確第九批實習關係。|期配合數字9清楚，不改成年數。
HC Japan指日本合作方，正式公司名另於內文明列。|日本のHC社清楚，不把HC展開成未核名稱。
International internships較廣，仍可理解與HC合作；建議補partnership保留關係。|提携明確表合作關係，保留。
Read the story對點入實習報導自然，箭頭保留。|ストーリーを見る可理解，非宣稱遊戲劇情。
student competition awards對應得獎，120+由外層供給。|受賞実績保留得獎而非入圍，沒有混淆兩概念。
Across6academic years保留統計期間，不重設為最近六年。|過去6学年容易被看成滾動期間，但原無年度範圍；保留並註資料當期範圍待核。
Details符合開啟詳情，未新增下載功能。|詳細を見る自然，箭頭保留。
Animation production對動畫製作明確。|アニメーション制作一致，不需另造術語。
偶動畫與動捕兩項未漏，2D/3D保留。|人形アニメ可理解，與實驗室パペット稱呼差異不構成實質漏譯。
入口目的地motion capture正確，不推測設備品牌。|實習室名宜與標題一致，不把同一地點譯為不同實驗/實習室。
Unity/Unreal品牌及美術/程式完整保留。|軟體名、美術和程式完整，不補版本需求。
現interactive media lab太廣，應和體感實驗室名稱一致。|同一體感實習室入口需與標題統一。
Interactive media對互動媒體自然，非只說社群媒體。|インタラクティブメディア對應自然。
Digital media漏掉自媒體的自主經營意義，改creator-led media。|自メディア不自然，改個人メディア且體感用語不變。
center/Pavilion不一致，入口應用相同解釋名便於找同一設施。|既有標題完整重複加へ，能找到同一設施。
AWARDS符合榮譽榜，漫畫BOSS BATTLE保留。|栄誉の実績生硬，但漫畫榮譽榜語意可理解，非必要改動。
頁碼、第三話及ABOUT裝飾完整。|頁碼、第三話與ABOUT裝飾完整。
省略不需後期屬原文資訊漏出；補回但標原效能宣稱未核。|虛實攝影機、人才與即時拍攝保留；不新增超高畫質。
四類設備、體感遊戲及即時驗證完整。|エアロバイク將腳踏車限特定健身型號，改自転車型デバイス。
運動科技創新與戶外場域完整，可理解加值應用。|高付加価値応用拠点完整，不擅新增課程報名資格。
自媒體譯成Digital media太寬，需和全名一致。|自メディア換成個人メディア，與全名一致。
HengshanCreativeBase表意可用，非核定官方品牌新名。|基地與ベース兩種寫法不改識別，保留中國字原地名横山。
原文數位科技文化創意工坊的文化面向被省略，宜補cultural creativity。|デジタルテクノロジー文化クリエイティブ工房可理解，非正式認證名。
兩類教室簡稱正確，不擅加完整科目。|実習室在此屬教室用途說明，不影響原位置。
電競學程被縮成一般training，宜保留program。|プロ用超出賽事級原意，去掉額外職業級宣稱。
秘密基地與漫畫章名自然，章次保留。|秘密基地自然，章次保留。
設計大樓與動遊系地圖完整，未把設備地點擴到其他校區。|樹徳為日語寫法，地圖含實驗/實習室可理解。
Explorethelab比base直譯自然，入口功能一致。|基地を探索する與漫畫語氣一致，不新增自助參觀許可。
ZOOM傳達快速移動音效，不是Zoom會議服務連結。|ヒュンッ傳達漫畫移動音效，不必逐字轉中文讀音。
Internationalinternships對應國際實習，SIDEQUEST裝飾保留。|国際インターンシップ正確，英文裝飾保留。
9thcohort與8companies3countries完整，不推成三國各八家公司。|第9期與3カ国8社完整，不推成9年。
22學生/4年/3國8公司保留，但正式公司名需有據統一。|株式会社Hautecouture不是公司概要直接列出的日本名，採官網實列名稱，其他統計不改。
Fullpartnerlist清楚表名單目的地，不誤作實習申請。|提携先一覧與清單目的地一致。
YEAH保留歡呼語氣，非新增操作。|やった表達歡呼自然，非直譯音節。
Industrymentors可表業師，SIDEQUEST漫畫裝飾保留。|業界講師陣明確，非正式教職職階。
9industrytalks保留場次，不譯成9位教師。|9回保留場次，不推導師資人數。
co-teaching是協同授課，五學期完整。|共同開講是共同開設課程，協同授課應改共同で授業を担当。
SOHO獨立設計師不只是泛稱professionals，補designers；600+與高中職要保留。|20+以20名以上作概數可理解，不從加號推造精確人數；高校含台灣高中職，統計期間未重驗。
Meetthementors適合名單入口，箭頭保留。|業界講師一覧符合入口，不擅改人名。
Joinourstory是漫畫加入連載比喻，連招生章清楚。|連載に参加する保留漫畫比喻，目的章在申請區，不誤新增功能。
頁碼、第六話與LABS裝飾完整。|頁碼、第六話與LABS裝飾完整。
`.trim().split('\n').map(s=>s.split('|'));
if(notes.length!==inv.rows.length||notes.some(x=>x.length!==2))throw Error('Need explicit 103 EN/JA notes: '+notes.length);
const rows=inv.rows.map((r,i)=>({...r,decisions:{en:{action:'retain',proposed:r.en,note:notes[i][0]},ja:{action:'retain',proposed:r.ja,note:notes[i][1]}}}));
function change(n,l,text,note){const d=rows[n-1].decisions[l];d.action='revise';d.proposed=text;if(note)d.note=note;}
function replace(n,l,oldValue,newValue){const r=rows[n-1];if(!r[l].includes(oldValue))throw Error('Missing old fragment '+n+' '+l);change(n,l,r[l].replace(oldValue,newValue));}
change(2,'en','A graphics-tablet classroom for practicing 2D character and environment design.');
replace(8,'ja','高精細な実写風シーン','実写風のシーン');
change(10,'en','Motion-Sensing Interaction Lab');
replace(12,'en','The Somatosensory Interaction Lab','The Motion-Sensing Interaction Lab');
change(14,'en','A stop-motion studio combining physical model-making and hands-on, frame-by-frame animation.');
replace(15,'en','3D model sculpting','physical model-making');
replace(17,'en','direct-to-garment printers','direct-printing equipment');
change(21,'en',"The Virtual Sports Tech-Art Pavilion prepares students to create new digital applications and services combining sports and technology. It explores new models for smart indoor sports venues and uses technology to add value to outdoor activities such as mountaineering, road running and cycling.\n\nEducational objectives:\n● Build students’ knowledge of sports science\n● Develop applications that add value to traditional sports and digital sports content\n● Prepare students to innovate in the digital economy through sports and technology\n● Develop students’ ability to plan and deliver cross-disciplinary exhibitions and presentations combining sports and technology");
change(21,'ja','バーチャルスポーツ・テクノロジーアート館では、「スポーツ×テクノロジー」を通じて、デジタル技術による新しい価値や事業を生み出す人材を育成します。屋内スポーツ施設のスマート化に向けた新しい運営モデルを考えるとともに、登山、ロードランニング、サイクリングなどの屋外スポーツの特性に合わせて技術を活用し、屋外スポーツ施設の新たな運営モデルを開発します。\n\n教育目標：\n● スポーツ科学の専門知識を身につける\n● 従来のスポーツとデジタルスポーツコンテンツに新たな価値を加える応用力を養う\n● 「スポーツ×テクノロジー」によるデジタルイノベーションを担う人材を育てる\n● 「スポーツ×テクノロジー」に関する領域横断的な展示・実演を企画し、実践する力を養う');
change(22,'en','Audiovisual Post-Production and Independent Media Production Lab');
change(22,'ja','映像・音声ポストプロダクション／個人メディア番組制作実習室');
replace(24,'en','Audiovisual Post-Production and We-Media Program Production Lab','Audiovisual Post-Production and Independent Media Production Lab');
rows[23].decisions.en.proposed=rows[23].decisions.en.proposed.replace('self-media and communication','independent media and communication');
change(24,'ja',rows[23].ja.replace('映像音響ポストプロダクション・自メディア番組制作実習室','映像・音声ポストプロダクション／個人メディア番組制作実習室').replace('自メディア・メディアコミュニケーション','個人メディア・メディアコミュニケーション'));
replace(27,'ja','特異な興味','独自の関心');
change(28,'en','Multimedia / Games and Online Media Classrooms');
change(28,'ja','マルチメディア／ゲーム・オンラインメディア教室');
change(29,'en','Multimedia and game/online media classrooms: from theory to development with game engines.');
replace(29,'ja','ゲームエンジン開発','ゲームエンジンを使った開発');
change(30,'en',rows[29].en.replace('Game and Network Media Classroom','Games and Online Media Classroom'));
change(30,'ja',rows[29].ja.replace('デザイン学部B1','設計學院の地下1階').replace('ゲーム・ネットワークメディア教室','ゲーム・オンラインメディア教室'));
replace(33,'ja','実況配信','ライブ配信');
change(34,'en','三創基地 / Maker Center');
change(35,'en','三創 (Creativity, Innovation and Entrepreneurship) Base: an incubator supporting student proposals, prototypes and venture development.');
change(36,'en',rows[35].en.replace('Three-Creativity (Creativity, Innovation, Entrepreneurship) Base','三創 (Creativity, Innovation and Entrepreneurship) Base').replace('exhibition implementation','exhibitions and live presentations'));
change(54,'en','WHAT WILL YOU STUDY EACH SEMESTER? FOUR YEARS · 128 CREDITS');
replace(55,'en','Core courses plus','Required core courses plus');
change(63,'en','cohorts');
change(65,'en','International internship partnership');
change(72,'ja','モーションキャプチャー実習室へ');
change(74,'en','Visit the motion-sensing interaction lab');
change(74,'ja','体感型インタラクティブ実習室へ');
change(76,'en','VR / AR / Motion interaction / Creator-led media');
replace(76,'ja','自メディア','個人メディア');
change(77,'en','Visit the Virtual Sports Tech-Art Pavilion');
change(80,'en','Virtual production studio: capture realistic scenes in real time without post-production and learn to link virtual and physical cameras.');
replace(81,'ja','エアロバイク','自転車型デバイス');
change(83,'en','Audiovisual post-production / Independent media');
replace(83,'ja','自メディア','個人メディア');
change(85,'en','Digital technology and cultural creativity workshop: a maker-culture base for cross-disciplinary projects combining DIY and technology.');
change(87,'en','High-performance gaming computers and tournament-grade equipment for the esports industry program.');
replace(87,'ja','大会仕様のプロ用機材','大会仕様の機材');
replace(94,'ja','株式会社Hautecouture','株式会社オートクチュール');
change(99,'ja','共同で授業を担当：5学期');
replace(100,'en','independent professionals','independent designers');
const contextGroups=[{id:'about-main-sentence',rows:[39,40,41,42,43],source_file:'chapters-1.jsx',component:'AboutChapter',source_anchor:'培育<span style={{ color: "var(--accent-red)" }}>動畫創作</span>',zh:'培育動畫創作、遊戲設計、影音後製、互動設計（AR / VR）所需的專業人才。',en:'We train professionals in animation, game design, audiovisual post-production and interactive design (AR / VR).',ja:'アニメーション制作、ゲームデザイン、映像・音声のポストプロダクション、インタラクティブデザイン（AR / VR）に携わる専門人材を育成します。',reason:'Actual EN inanimation + Chinese enumeration mark; JA front-loaded育成 leaves no finite predicate. Requires whole-sentence/rich-text localized template, preserving red/blue spans and all fields, not a global punctuation mapping.'},{id:'about-history-paragraph',rows:[44,45,46,47,48,49,50,51,52],source_file:'chapters-1.jsx',component:'AboutChapter',source_anchor:'<b>2006</b> 年成立全國第一所',zh:'2006 年成立全國第一所「數位遊戲設計系」，2011 年依產業人才需求更名為「動畫與遊戲設計系」。完整的專業學習課程＋產學合作機制，師生定期參與企業參訪、教學講座，掌握產業脈動；持續在放視大賞、巴哈姆特 ACG、金犢獎等競賽屢獲佳績。',en:'Founded in 2006 as Taiwan’s first Department of Digital Game Design, the department was renamed the Department of Animation and Game Design in 2011 to meet industry needs. A comprehensive curriculum and industry partnerships connect students and faculty with regular company visits and professional talks, keeping them in touch with industry developments. The department continues to achieve strong results at Vision Get Wild, Bahamut ACG, the Times Young Creative Awards and other competitions.',ja:'2006年に台湾初の「デジタルゲームデザイン学科」として設立され、2011年に産業界の人材ニーズに応じて「アニメとゲームデザイン学科」へ名称を変更しました。充実した専門カリキュラムと産学連携の仕組みにより、教員と学生は定期的に企業見学や特別講座に参加し、業界の動向を学んでいます。また、放視大賞、巴哈姆特 ACG、金犢獎などのコンテストで継続して優れた成果を収めています。',reason:'Actual EN firstDepartment/asAnimation/inVision/Awardsand and residual Chinese punctuation. Restore faculty participation and staying connected to industry; JA needs the 2006 founding predicate. Use one localized rich-text paragraph with year/bold spans, not standalone fragment acceptance.'}];
for(const group of contextGroups)for(const n of group.rows)for(const l of ['en','ja']){const d=rows[n-1].decisions[l];d.action='context_fix_required';d.context_group=group.id;d.proposed=rows[n-1][l];}
function findPointer(obj,value,p=''){if(typeof obj==='string')return obj.replace(/\s*\[CHECK\]/g,'').trim()===value?[p]:[];if(!obj||typeof obj!=='object')return[];return Object.entries(obj).flatMap(([k,v])=>findPointer(v,value,p+'/'+escape(k)));}
const overlays=['ui','student-guide-ui','guide-labels','step-details-ui','editorial','flow-ui'].map(n=>'data/en/'+n+'.json'),ops=[];
for(const r of rows)for(const l of ['en','ja']){const d=r.decisions[l];if(d.action!=='revise')continue;let file,pointer;if(l==='ja'){file='data/ja/messages.json';pointer='/'+escape(r.key);}else{const overlay=[...overlays].reverse().find(f=>Object.hasOwn(parse(f),r.key));if(overlay){file=overlay;pointer='/'+escape(r.key);}else{file='data/en/labs.json';const matches=findPointer(parse(file),r.en);if(matches.length!==1)throw Error('No unique raw EN source '+r.id+' '+matches.length);pointer=matches[0];}}let old=parse(file);for(const part of pointer.slice(1).split('/'))old=old[part.replace(/~1/g,'/').replace(/~0/g,'~')];ops.push({id:r.id+'-'+l,lang:l,file,pointer,key:r.key,old,new:d.proposed,expected_active_old:r[l],reason:d.note,status:'proposal_only',official_name_status:'Explanatory translation unless specifically verified in official-checks; no claim of a newly approved formal name.'});}
const pending=rows.filter(r=>r.origins.some(o=>o.section==='labs')||[44,45,46,47,49,50,51,54,57,58,60,61,64,65,67,68,93,94,98,99,100].includes(rows.indexOf(r)+1)).map(r=>({id:r.id,key:r.key,reason:r.origins.some(o=>o.section==='labs')?'Current equipment quantities, formal lab names and feature claims not newly physically verified.': 'Original period/statistics/proper-name status is separate from translation fidelity; see official checks.'}));
const count={keys:rows.length,target_values:rows.length*2,revised_values:ops.length,context_values:rows.flatMap(r=>Object.values(r.decisions)).filter(d=>d.action==='context_fix_required').length};count.retained_values=count.target_values-count.revised_values-count.context_values;
fs.writeFileSync(path.join(dir,'reviewed.json'),JSON.stringify({date:'2026-10-23',fixed_commit:inv.fixed_commit,counts:count,rows,pending},null,2)+'\n');fs.writeFileSync(path.join(dir,'exact-plan.json'),JSON.stringify({date:'2026-10-23',fixed_commit:inv.fixed_commit,product_modified:false,operations:ops,context_fixes:contextGroups},null,2)+'\n');console.log(JSON.stringify(count));
