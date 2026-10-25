// 唯讀：從既有網站資料找「有圖、有署名」的學生作品，當首頁輪播候選池
const fs = require('fs'), path = require('path');
process.chdir(path.resolve(__dirname, '../../..'));
const news = JSON.parse(fs.readFileSync('data/news.json', 'utf8'));
const rows = [];
for (const n of news) {
  const gal = n.gallery || n.works || [];
  gal.forEach((g, i) => {
    const img = g.image || g.src || g.img;
    if (!img) return;
    rows.push({ news: n.slug || n.id, date: n.date, idx: i, title: g.title || g.name || g.caption, img, team: g.team || g.authors || g.members, advisor: g.advisor || g.mentor, award: g.award });
  });
}
console.log('news entries:', news.length, 'gallery items with image:', rows.length);
for (const r of rows) console.log(JSON.stringify(r));
