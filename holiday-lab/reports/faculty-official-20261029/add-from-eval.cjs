// 從 114 學年度自我評鑑報告（雲端 待辦/評鑑0811-final.docx，涵蓋 109–113 學年度）補其他老師資料
// 使用者 2026-10-29 於對話選定：證照＋教學優良獎、研究與產學計畫名稱、專利／帶隊／召集人；矛盾維持系網、只補陳重光學歷
// 抽取比對：eval-diff.json（子代理，134/139 筆逐字對到報告）。整理規則：重複合併、拿掉學生姓名與證照登錄號、可疑年份拿掉、年份照報告學年度
const fs = require('fs'), path = require('path'), assert = require('assert/strict');
process.chdir(path.resolve(__dirname, '../../..'));
const T = {
  tengshuyuan: {
    certs: [['工研院 DS-104 淨零永續基礎概論數位課程測驗證明（2024）', 'ITRI DS-104 Net-Zero Sustainability Fundamentals Online Course Certificate (2024)', '工業技術研究院 DS-104 ネットゼロ持続可能性基礎概論オンライン講座修了証明（2024）'],
            ['生成式 AI 美術設計能力認證－初級（2025）', 'Generative AI Art Design Certification – Basic (2025)', '生成AIアートデザイン能力認定－初級（2025）']],
    ach: [['112 學年度獲本校教學優良教師', 'AY 112 Excellent Teaching Award, Shu-Te University', '112学年度 本学教学優良教員'],
          ['111 學年度主持研究計畫「基於遊戲化八角理論評估遊戲學習系統」', 'AY 111 Principal investigator, research project "Evaluating Game-Based Learning Systems with the Octalysis Gamification Framework"', '111学年度 研究計画「ゲーミフィケーション八角理論に基づくゲーム学習システムの評価」を主持'],
          ['110 學年度主持研究計畫「基於線上面部情緒傳感器的遊戲可玩性評估系統」', 'AY 110 Principal investigator, research project "A Game Playability Evaluation System Based on Online Facial Emotion Sensors"', '110学年度 研究計画「オンライン顔表情感情センサーに基づくゲームプレイアビリティ評価システム」を主持']],
  },
  chiangyamei: {
    certs: [['企業電子化永續領域軟體應用師－ISO 14064-1 溫室氣體盤查（叡揚）', 'Enterprise e-Business Sustainability Software Specialist – ISO 14064-1 Greenhouse Gas Inventory (Galaxy Software Services)', '企業電子化サステナビリティ分野ソフトウェア応用師－ISO 14064-1 温室効果ガス棚卸（叡揚資訊）']],
    ach: [['111 學年度獲本校教學傑出教師', 'AY 111 Distinguished Teaching Award, Shu-Te University', '111学年度 本学教学傑出教員'],
          ['113 學年度主持計畫「結合ARCS動機模式與策略化合作以提升學習動畫製作之動機」', 'AY 113 Principal investigator, project "Combining the ARCS Motivation Model and Strategic Cooperation to Enhance Motivation in Learning Animation Production"', '113学年度 計画「ARCS動機づけモデルと戦略的協同によるアニメーション制作学習の動機向上」を主持'],
          ['113 年度指導 2 件國科會大專學生研究計畫：「單人動作冒險遊戲之使用介面設計屬性研究」、「影響冒險遊戲設計因素之研究」', '2024 (ROC 113) Supervised two NSTC undergraduate research projects: "A Study of Interface Design Attributes in Single-Player Action-Adventure Games" and "A Study of Factors Influencing Adventure Game Design"', '113年度 国家科学及技術委員会の大学生研究計画2件を指導：「シングルプレイヤー・アクションアドベンチャーゲームのUIデザイン属性の研究」「アドベンチャーゲームのデザインに影響する要因の研究」'],
          ['112 年度指導國科會大專學生研究計畫', '2023 (ROC 112) Supervised an NSTC undergraduate research project', '112年度 国家科学及技術委員会の大学生研究計画を指導'],
          ['111 學年度主持大專校院教學實踐研究計畫', 'AY 111 Principal investigator, MOE Teaching Practice Research Program', '111学年度 教育部 大学教学実践研究計画を主持'],
          ['111 學年度主持「品牌吉祥物（公仔）設計」計畫', 'AY 111 Principal investigator, "Brand Mascot (Figure) Design" project', '111学年度「ブランドマスコット（フィギュア）デザイン」計画を主持'],
          ['111 學年度發明專利「結合環境偵測之實境遊戲系統」（第一作者）', 'AY 111 Invention patent "Reality Game System with Environmental Sensing" (first inventor)', '111学年度 発明特許「環境検知を組み合わせた現実ゲームシステム」（筆頭発明者）'],
          ['發明專利「飲食互動管理系統、方法及電腦可讀取紀錄媒體」（第一作者）', 'Invention patent "Interactive Diet Management System, Method and Computer-Readable Recording Medium" (first inventor)', '発明特許「食事インタラクティブ管理システム、方法及びコンピュータ読み取り可能な記録媒体」（筆頭発明者）'],
          ['新型專利「策略遊戲平衡教具」（第一作者）', 'Utility model patent "Strategy Game Balance Teaching Aid" (first inventor)', '実用新案「戦略ゲームバランス教具」（筆頭考案者）'],
          ['113 學年度新型專利「烏龜保育桌遊教具」（第一作者）', 'AY 113 Utility model patent "Turtle Conservation Board Game Teaching Aid" (first inventor)', '113学年度 実用新案「カメ保護ボードゲーム教具」（筆頭考案者）'],
          ['109 學年度新型專利「飲食教學遊戲裝置」', 'AY 109 Utility model patent "Diet Education Game Device"', '109学年度 実用新案「食育ゲーム装置」'],
          ['109 年度指導科技部大專學生研究計畫', '2020 (ROC 109) Supervised a MOST undergraduate research project', '109年度 科技部の大学生研究計画を指導']],
    exp: [['107–109 學年度 校園設計師檢核召集人', 'AY 107–109 Convener, Campus Designer Assessment', '107–109学年度 キャンパスデザイナー検定 招集人']],
  },
  chenchungkuang: {
    education: ['國立高雄師範大學 視覺設計研究所 碩士', 'M.A., Graduate Institute of Visual Design, National Kaohsiung Normal University', '国立高雄師範大学 視覚デザイン研究所 修士'],
    exp: [['帶領學生國際見學', 'Led students on international study visits', '学生の海外見学を引率']],
  },
  yangchihchang: {
    certs: [['中華民國技術士電腦軟體應用乙級', 'Class B Technician Certificate in Computer Software Applications (ROC)', '中華民国技術士 電腦ソフトウェア応用 乙級'],
            ['中華民國技術士電腦硬體裝修乙級', 'Class B Technician Certificate in Computer Hardware Repair (ROC)', '中華民国技術士 電腦ハードウェア修理 乙級'],
            ['Internet Computing Core Certification（IC³，2008；GS4，2014）', 'Internet Computing Core Certification (IC3, 2008; GS4, 2014)', 'Internet Computing Core Certification（IC³、2008；GS4、2014）'],
            ['Adobe Certified Associate Photoshop CS3（2009）', 'Adobe Certified Associate Photoshop CS3 (2009)', 'Adobe Certified Associate Photoshop CS3（2009）'],
            ['Microsoft Office Specialist Master 2007（Word、Excel、PowerPoint、Outlook）', 'Microsoft Office Specialist Master 2007 (Word, Excel, PowerPoint, Outlook)', 'Microsoft Office Specialist Master 2007（Word、Excel、PowerPoint、Outlook）'],
            ['工研院 DS-104 淨零永續基礎概論數位課程測驗證明（2025）', 'ITRI DS-104 Net-Zero Sustainability Fundamentals Online Course Certificate (2025)', '工業技術研究院 DS-104 ネットゼロ持続可能性基礎概論オンライン講座修了証明（2025）'],
            ['生成式 AI 美術設計能力認證－初級（2025）', 'Generative AI Art Design Certification – Basic (2025)', '生成AIアートデザイン能力認定－初級（2025）']],
  },
  chenchinghung: {
    certs: [['勞動部圖文組版乙級技術士', 'Class B Technician Certificate in Desktop Publishing (Ministry of Labor)', '労働部 図文組版 乙級技術士']],
    ach: [['111 學年度主持「高雄市公車處新形象動畫專案」', 'AY 111 Principal investigator, new brand-image animation project for the Kaohsiung City Bus Administration', '111学年度「高雄市公車処 新イメージアニメーション」プロジェクトを主持'],
          ['111 學年度與陳俊瑋老師共同主持教育部數位人文計畫「Net Zero 氣候行動：讓地球從『零』出發教育活動計畫」', 'AY 111 Co-principal investigator with Prof. 陳俊瑋, MOE Digital Humanities project "Net Zero Climate Action: Starting the Earth from Zero"', '111学年度 陳俊瑋教員と共同で教育部デジタル人文計画「Net Zero 気候行動：地球を『ゼロ』から始める教育活動計画」を主持'],
          ['109 學年度與陳俊瑋老師共同主持「運用新興科技整合智慧農業與感測穿戴裝置推廣教育計畫」', 'AY 109 Co-principal investigator with Prof. 陳俊瑋, "Promoting Education on Smart Agriculture and Wearable Sensing Devices with Emerging Technologies"', '109学年度 陳俊瑋教員と共同で「新興技術によるスマート農業とウェアラブルセンサー推進教育計画」を主持']],
    exp: [['110–111 學年度 校園設計師檢核召集人', 'AY 110–111 Convener, Campus Designer Assessment', '110–111学年度 キャンパスデザイナー検定 招集人']],
  },
  changchunya: {
    certs: [['Adobe Certified Associate – Visual Design using Adobe Photoshop CC 2015', 'Adobe Certified Associate – Visual Design using Adobe Photoshop CC 2015', 'Adobe Certified Associate – Visual Design using Adobe Photoshop CC 2015'],
            ['Adobe Premiere CC', 'Adobe Premiere CC', 'Adobe Premiere CC']],
    ach: [['111 學年度獲本校教學優良教師', 'AY 111 Excellent Teaching Award, Shu-Te University', '111学年度 本学教学優良教員'],
          ['113 學年度主持「國家災害防救科技美術規劃與視覺設計案」', 'AY 113 Principal investigator, art planning and visual design project on national disaster prevention technology', '113学年度「国家災害防救科技 美術企画・ビジュアルデザイン案」を主持'],
          ['112 學年度主持「113 年大專校院辦理就業服務：複合媒材 AI 動畫創作與創業之路」', 'AY 112 Principal investigator, 2024 MOE college career services program "Mixed-Media AI Animation Creation and Entrepreneurship"', '112学年度「113年 大学就業サービス：複合メディアAIアニメーション創作と起業への道」を主持'],
          ['112 學年度主持「113 學海築夢：動漫美術設計與互動遊戲設計日本見習」', 'AY 112 Principal investigator, 2024 MOE overseas internship program (學海築夢) "Anime Art Design and Interactive Game Design Study Tour in Japan"', '112学年度「113 學海築夢：アニメ美術デザインとインタラクティブゲームデザイン 日本見習」を主持'],
          ['111 學年度主持「112 學海築夢：動漫遊戲與周邊設計（日本）」', 'AY 111 Principal investigator, 2023 MOE overseas internship program (學海築夢) "Anime, Games and Merchandise Design (Japan)"', '111学年度「112 學海築夢：アニメ・ゲームとグッズデザイン（日本）」を主持'],
          ['110 學年度執行「2021 名人講座活動影像紀錄」', 'AY 110 Video documentation for the 2021 Distinguished Lecture Series', '110学年度「2021 名人講座 活動映像記録」を担当']],
    exp: [['2023 年 7 月帶領 5 位學生赴日本株式会社オートクチュール（Hautecouture Inc.）進行兩個月海外實習（學海築夢）', 'July 2023 Led 5 students on a two-month overseas internship at Hautecouture Inc. in Japan (MOE overseas internship program, 學海築夢)', '2023年7月 学生5名を引率し、日本の株式会社オートクチュール（Hautecouture Inc.）で2か月間の海外実習（學海築夢）']],
  },
  chiushinchan: {
    ach: [['112 學年度主持「113 年大專校院辦理就業服務：數位內容互動遊戲娛樂產業前瞻趨勢」', 'AY 112 Principal investigator, 2024 MOE college career services program "Future Trends in the Digital Content and Interactive Game Entertainment Industry"', '112学年度「113年 大学就業サービス：デジタルコンテンツ・インタラクティブゲーム娯楽産業の将来動向」を主持']],
    exp: [['112 學年度 校園設計師檢核召集人', 'AY 112 Convener, Campus Designer Assessment', '112学年度 キャンパスデザイナー検定 招集人']],
  },
  chenmeijung: {
    certs: [['中華民國技術士陶瓷丙級', 'Class C Technician Certificate in Ceramics (ROC)', '中華民国技術士 陶磁 丙級'],
            ['英國標準協會 BSI Excellent Service Mark（ESM）Royal Mystery Shopper Lead Auditor 訓練證照', 'BSI Excellent Service Mark (ESM) Royal Mystery Shopper Lead Auditor Training Certificate', '英国規格協会 BSI Excellent Service Mark（ESM）Royal Mystery Shopper Lead Auditor 研修認定']],
    ach: [['113 學年度主持「新水工大樓展示空間先期建置規劃」', 'AY 113 Principal investigator, preliminary planning for the exhibition space of the new hydraulic engineering building', '113学年度「新水工ビル展示空間 先行整備企画」を主持']],
  },
  wangtsungli: {
    certs: [['Reallusion Certified Trainer for iClone 7'], ['Adobe Premiere CC'], ['PVQC 專業英文檢定－GLAD 數位多媒體設計', 'PVQC Professional English Certification – GLAD Digital Multimedia Design', 'PVQC 専門英語検定－GLAD デジタルマルチメディアデザイン'], ['Adobe After Effects CC'], ['Designing 3D Animation Games Using Maya'], ['Designing 3D Animation Games Using 3D Studio Max'], ['Cinema 4D Essential'], ['Autodesk 3ds Max Design 2011 Certified Professional'], ['Adobe Photoshop CS5'], ['The Certificate of Proficiency for Academic Subjects in Fundamentals of APP for eBusiness'], ['Academic Subjects in Fundamentals of Enterprise Resource Planning'], ['The Certificate of Implementing Microsoft Site Server 3.0'], ['The Certificate of Implementing a Commerce-Enabled Web Site Using Microsoft Site Server 3.0'], ['Professional Certificate Marketing Planning'], ['Advanced Professional Certificate Cloud Security Knowledge'], ['Adobe Certified Associate in Visual Communication using Adobe Photoshop CS3']],
    ach: [['112–113 學年度主持「遊戲關卡動畫製作專案」', 'AY 112–113 Principal investigator, game level animation production project', '112–113学年度「ゲームステージアニメーション制作」プロジェクトを主持'],
          ['110 學年度主持「109 科技部鼓勵技專校院從事實務型研究專案計畫」', 'AY 110 Principal investigator, MOST practice-oriented research project for technical and vocational colleges (2020)', '110学年度「109 科技部 技専校院の実務型研究奨励プロジェクト」を主持']],
  },
  yinli: {
    ach: [['112–113 學年度主持「香港展覽策略規劃案」', 'AY 112–113 Principal investigator, Hong Kong exhibition strategy planning project', '112–113学年度「香港展覧戦略企画案」を主持'],
          ['111 學年度擔任 2022 文博會品牌展主題展區「島中選物」策展顧問', 'AY 111 Curatorial consultant, "島中選物" theme area, Creative Expo Taiwan 2022 Brand Exhibition', '111学年度 2022 クリエイティブエキスポ台湾 ブランド展 テーマエリア「島中選物」のキュレーション顧問'],
          ['111 學年度主持「異態島嶼：台日藝術家交流展」', 'AY 111 Principal investigator, Taiwan–Japan artist exchange exhibition "異態島嶼"', '111学年度「異態島嶼：台日アーティスト交流展」を主持'],
          ['110 學年度主持「好時節：日本國際交流展」專案', 'AY 110 Principal investigator, Japan international exchange exhibition "好時節"', '110学年度「好時節：日本国際交流展」プロジェクトを主持']],
  },
};
const zhF = 'data/faculty.json', enF = 'data/en/faculty.json', jaF = 'data/ja/messages.json';
const raw = f => fs.readFileSync(f, 'utf8');
const zh = JSON.parse(raw(zhF)), en = JSON.parse(raw(enF)), ja = JSON.parse(raw(jaF));
const tri = r => [r[0], r[1] ?? r[0], r[2] ?? r[0]];
const counts = {};
for (const [slug, add] of Object.entries(T)) {
  const z = zh.find(x => x.slug === slug), e = en.find(x => x.slug === slug); assert.ok(z && e, slug);
  const c = counts[slug] = { certs: 0, ach: 0, exp: 0, edu: 0 };
  if (add.certs) {
    const rows = add.certs.map(tri), oldZh = z.certs || '', oldEn = e.certs || '';
    for (const [cz] of rows) assert.ok(!oldZh.includes(cz), slug + ' cert already present: ' + cz);
    const newZh = [oldZh, ...rows.map(r => r[0])].filter(Boolean).join('、');
    const newEn = [oldEn, ...rows.map(r => r[1])].filter(Boolean).join(', ');
    const oldJa = oldZh && ja[oldZh] ? ja[oldZh] : oldZh;
    const newJa = [oldJa, ...rows.map(r => r[2])].filter(Boolean).join('、');
    if (oldZh && oldZh in ja) delete ja[oldZh];
    z.certs = newZh; e.certs = newEn; ja[newZh] = newJa; c.certs = rows.length;
  }
  for (const [field, key] of [['achievements', 'ach'], ['experience', 'exp']]) {
    if (!add[key]) continue;
    z[field] = z[field] || []; e[field] = e[field] || [];
    assert.equal(z[field].length, e[field].length, slug + ' ' + field + ' zh/en length');
    for (const r of add[key].map(tri)) { assert.ok(!z[field].includes(r[0]), 'dup ' + r[0]); assert.ok(!(r[0] in ja), 'ja key exists ' + r[0]); z[field].push(r[0]); e[field].push(r[1]); ja[r[0]] = r[2]; c[key]++; }
  }
  if (add.education) { const [nz, ne, nj] = add.education; if (z.education in ja) delete ja[z.education]; z.education = nz; e.education = ne; ja[nz] = nj; c.edu = 1; }
}
const keep = (f, obj) => fs.writeFileSync(f, JSON.stringify(obj, null, 2) + (raw(f).endsWith('\n') ? '\n' : ''));
keep(zhF, zh); keep(enF, en); keep(jaF, ja);
console.log(JSON.stringify(counts));
