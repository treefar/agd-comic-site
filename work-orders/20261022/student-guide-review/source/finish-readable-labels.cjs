const fs=require('node:fs'),path=require('node:path');
const p=path.join(__dirname,'build-review.cjs');let s=fs.readFileSync(p,'utf8');
s=s.replace('aria-label="優先順序"><option value="">全部優先順序</option><option>P0</option><option>P1</option><option>P2</option>','aria-label="重要程度"><option value="">全部重要程度</option><option value="P0">先看這些</option><option value="P1">延伸資訊</option><option value="P2">延伸資訊：職涯</option>');
s=s.replace("e(c.priority)+'</span><span class=\"tag\">待審閱", "e(c.priority==='P0'?'先看這些':'延伸資訊')+'</span><span class=\"tag\">待系辦確認");
fs.writeFileSync(p,s);console.log('Visible labels updated; data priorities and sources preserved.');
