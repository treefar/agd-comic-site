const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'../../../..'),original=path.join(root,'holiday-lab/reports/overnight-20261024/qa');
for(const f of ['check.cjs','http-bind.cjs'])fs.copyFileSync(path.join(original,f),path.join(__dirname,f));
let t=fs.readFileSync(path.join(__dirname,'check.cjs'),'utf8');
t=t.replace("'locale-en.js','locale-ja.js'","'locale-en.js','locale-ja.js','data/works.json','data/en/works.json'");
t=t.replace("const faq=p.locator('.sg-faq-item');row.faqCount=await faq.count();","const faq=p.locator('.sg-faq-item');row.faqCount=await faq.count();check('fifteen topics and 34 FAQs retained',row.guide.cards===15&&row.faqCount===34,{cards:row.guide.cards,faq:row.faqCount});");
const needle="check('thirteen teacher cards',await cards.count()===13);";
t=t.replace(needle,needle+"row.playPlacement=await p.evaluate(()=>{const play=document.getElementById('student-play'),admission=document.getElementById('admission'),footer=document.querySelector('footer.foot');return{exists:!!play,admissionBefore:!!(admission?.compareDocumentPosition(play)&Node.DOCUMENT_POSITION_FOLLOWING),footerAfter:!!(play?.compareDocumentPosition(footer)&Node.DOCUMENT_POSITION_FOLLOWING),top:play?.getBoundingClientRect().top,iframes:document.querySelectorAll('iframe').length};});check('play entry remains after admissions and before footer',row.playPlacement.exists&&row.playPlacement.admissionBefore&&row.playPlacement.footerAfter,row.playPlacement);");
fs.writeFileSync(path.join(__dirname,'check.cjs'),t.replace("document.getElementById('admission')","document.getElementById('join')"));console.log('Copied isolated website QA; no product writes.');
