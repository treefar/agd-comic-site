// 陳慶鴻老師指導作品（來源：老師提供「指導動遊系學生國際影展獲獎作品列表(陳慶鴻師).txt」，使用者 2026-10-29 於對話交付）
// 每件一筆摘要；片名沿用站內既有英文名，沒有既有英文名的保留中文原名；國外影展只寫國名，不自創影展英文名
const fs = require('fs'), path = require('path'), assert = require('assert/strict');
process.chdir(path.resolve(__dirname, '../../..'));
const rows = [
  ['2024 指導《神癒》獲第20屆全國技專院校電腦動畫競賽佳作，入圍印度孟買國際影片獎、巴塞隆納作者電影節決賽',
   '2024 Supervised Divine Healing (《神癒》), Honorable Mention at the 20th National Computer Animation Competition for Technical and Vocational Colleges; selected for the Mumbai International Film Awards (India) and a finalist at the Author Film Festival (Barcelona)',
   '2024 指導作品《神癒》が第20回全国技専院校コンピュータアニメーション競技会で佳作、インド「ムンバイ国際映画賞」入選、バルセロナ「作者映画祭」ファイナリスト'],
  ['2023 指導《砂魚》獲 2023 TISDC 台灣國際學生創意設計大賽動畫組佳作、第19屆全國技專院校電腦動畫競賽佳作，入圍法國、立陶宛、義大利、土耳其 4 國影展',
   '2023 Supervised Sandfish (《砂魚》), Honorable Mention in the Animation Category at the 2023 TISDC Taiwan International Student Design Competition and at the 19th National Computer Animation Competition for Technical and Vocational Colleges; selected for film festivals in France, Lithuania, Italy and Turkey',
   '2023 指導作品《砂魚》が2023 TISDC台湾国際学生創意設計大賞アニメーション部門佳作、第19回全国技専院校コンピュータアニメーション競技会佳作、フランス・リトアニア・イタリア・トルコの4か国の映画祭に入選'],
  ['2023 指導《White Crow》參展西班牙停格影展，入圍立陶宛標誌性影像影展、巴塞隆納作者電影節',
   '2023 Supervised White Crow, screened at a stop-motion film festival in Spain; selected for a film festival in Lithuania and the Author Film Festival (Barcelona)',
   '2023 指導作品《White Crow》がスペインのストップモーション映画祭に出品、リトアニアの映画祭とバルセロナ「作者映画祭」に入選'],
  ['2023 指導《螢光棲地》獲第19屆全國技專院校電腦動畫競賽佳作，入圍西班牙停格影展 2 項競賽單元及立陶宛、巴塞隆納、印度孟買等國際影展',
   '2023 Supervised Fluorescent Habitat (《螢光棲地》), Honorable Mention at the 19th National Computer Animation Competition for Technical and Vocational Colleges; selected for 2 competition sections at a stop-motion film festival in Spain and for festivals in Lithuania, Barcelona and Mumbai',
   '2023 指導作品《螢光棲地》が第19回全国技専院校コンピュータアニメーション競技会佳作、スペインのストップモーション映画祭2部門、リトアニア・バルセロナ・ムンバイの国際映画祭に入選'],
  ['2022 指導《貓雨 Raining Cat》獲第十四屆小花豹青年短片大賽動畫類首獎、第18屆全國技專院校電腦動畫競賽入選，入圍金點新秀設計獎、放視大賞 2D 動畫類',
   '2022 Supervised Raining Cat (《貓雨》), First Prize in the Animation Category at the 14th Little Leopard Young Short Film Awards; selected at the 18th National Computer Animation Competition for Technical and Vocational Colleges; shortlisted for the Golden Pin Design Award (Young Talent) and the 2D Animation Category of Vision Get Wild',
   '2022 指導作品《貓雨 Raining Cat》が第14回小花豹青年短片大賽アニメーション部門で第1位、第18回全国技専院校コンピュータアニメーション競技会入選、金點新秀設計賞と放視大賞2Dアニメーション部門にノミネート'],
  ['2022 指導《西吉克．巴魯》獲第18屆全國技專院校電腦動畫競賽直接參賽組佳作',
   '2022 Supervised Sijike Baru (《西吉克．巴魯》), Honorable Mention in the Direct Entry Division at the 18th National Computer Animation Competition for Technical and Vocational Colleges',
   '2022 指導作品《西吉克．巴魯》が第18回全国技専院校コンピュータアニメーション競技会直接参加部門で佳作'],
  ['2022 指導《最高傑作》獲第18屆全國技專院校電腦動畫競賽直接參賽組入選',
   '2022 Supervised 《最高傑作》, selected in the Direct Entry Division at the 18th National Computer Animation Competition for Technical and Vocational Colleges',
   '2022 指導作品《最高傑作》が第18回全国技専院校コンピュータアニメーション競技会直接参加部門で入選'],
  ['2021 指導《春曉》獲巴哈姆特 ACG 創作大賽動畫組優選',
   '2021 Supervised Spring Dawn (《春曉》), Merit Award in the Animation Category at the Bahamut ACG Creation Contest',
   '2021 指導作品《春曉》が巴哈姆特 ACG 創作大賽アニメーション部門で優秀賞'],
  ['2021 指導《Daddy Look!》獲第17屆全國技專院校電腦動畫競賽直接參賽組佳作',
   '2021 Supervised Daddy Look!, Honorable Mention in the Direct Entry Division at the 17th National Computer Animation Competition for Technical and Vocational Colleges',
   '2021 指導作品《Daddy Look!》が第17回全国技専院校コンピュータアニメーション競技会直接参加部門で佳作'],
  ['2020 指導《化羽》獲日本 TBS DigiCon6 台灣區金獎、新北市學生影像新星獎最佳動畫片、全國技專院校電腦動畫競賽優勝等 5 項獎，入圍白俄羅斯、韓國、印度等國際影展並於義大利放映',
   '2020 Supervised Plumage (《化羽》), Taiwan Gold Winner at TBS DigiCon6 (Japan), Best Animation at the New Taipei City Student Film Awards and a Winner at the National Computer Animation Competition for Technical and Vocational Colleges among 5 awards; selected for international festivals in Belarus, South Korea and India and screened in Italy',
   '2020 指導作品《化羽》が日本TBS「DigiCon6」台湾エリア金賞、新北市学生映像新星賞最優秀アニメーション、全国技専院校コンピュータアニメーション競技会優勝など5つの賞を受賞、ベラルーシ・韓国・インドなどの国際映画祭に入選、イタリアで上映'],
  ['2020 指導《越線》獲第16屆全國技專院校電腦動畫競賽佳作、小花豹青年短片大獎評審團特別推薦獎，入圍法國、韓國國際影展並於西班牙放映',
   '2020 Supervised Crossing the Line (《越線》), Honorable Mention at the 16th National Computer Animation Competition for Technical and Vocational Colleges and the Jury Special Recommendation at the Little Leopard Young Short Film Awards; selected for international festivals in France and South Korea and screened in Spain',
   '2020 指導作品《越線》が第16回全国技専院校コンピュータアニメーション競技会佳作、小花豹青年短片大獎審査員特別推薦賞、フランス・韓国の国際映画祭に入選、スペインで上映'],
];
const zhF = 'data/faculty.json', enF = 'data/en/faculty.json', jaF = 'data/ja/messages.json';
const zh = JSON.parse(fs.readFileSync(zhF, 'utf8')), en = JSON.parse(fs.readFileSync(enF, 'utf8')), ja = JSON.parse(fs.readFileSync(jaF, 'utf8'));
const z = zh.find(x => x.slug === 'chenchinghung'), e = en.find(x => x.slug === 'chenchinghung');
assert.equal(z.achievements.length, 2); assert.equal(e.achievements.length, 2);
for (const [c] of rows) assert.ok(!z.achievements.includes(c), 'duplicate ' + c);
z.achievements.push(...rows.map(r => r[0])); e.achievements.push(...rows.map(r => r[1]));
for (const [c, , j] of rows) { assert.ok(!(c in ja)); ja[c] = j; }
const keep = (f, obj, raw) => fs.writeFileSync(f, JSON.stringify(obj, null, 2) + (raw.endsWith('\n') ? '\n' : ''));
keep(zhF, zh, fs.readFileSync(zhF, 'utf8')); keep(enF, en, fs.readFileSync(enF, 'utf8')); keep(jaF, ja, fs.readFileSync(jaF, 'utf8'));
console.log(JSON.stringify({ zh: z.achievements.length, en: e.achievements.length, jaAdded: rows.length }));
