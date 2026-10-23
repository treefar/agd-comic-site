const fs=require('fs'),assert=require('assert/strict');
const source=fs.readFileSync('holiday-home.jsx','utf8'),match=source.match(/const STUDENT_HERO_WORKS = Object\.freeze\((\[[\s\S]*?\])\);/);assert.ok(match);
const works=JSON.parse(match[1]),post=JSON.parse(fs.readFileSync('data/news.json')).find(n=>n.id===7140);
assert.equal(works.length,3);
for(const work of works){const original=post.gallery.find(row=>row.title===work.title);assert.ok(original);assert.equal(work.designers,original.designers);assert.equal(work.mentor,original.mentor);assert.equal(work.image,original.image);assert.equal(work.sourceHref,'#/news/'+post.slug+'/work-'+original.rank.replace('No. ',''));assert.ok(fs.existsSync(work.image));}
assert.equal(fs.readFileSync('holiday-home.css','utf8').includes('holiday-lab/assets'),false);
console.log('STUDENT_METADATA 3/3 + HERO_CSS_GENERATED_IMAGE0 PASS');
