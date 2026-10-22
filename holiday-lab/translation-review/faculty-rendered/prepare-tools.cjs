// Reuse the already reviewed browser/font method in a new owned folder only.
const fs=require('node:fs'),path=require('node:path'),dir=__dirname,prior=path.join(dir,'../rendered-delta');
let s=fs.readFileSync(path.join(prior,'audit.cjs'),'utf8');
s=s.replace("['all','faq','admission']","['all','faculty']").replace('[all|faq|admission]','[all|faculty]').replace("for(const kind of ['faq','admission'])","for(const kind of ['faculty'])");
s=s.replace("const sourceFiles=new Set(['index.html','styles.css','student-guide.css','data/students/guide.json','data/admission.json','data/en/admission.json','data/ja/messages.json','data/en/student-guide-ui.json']);","const sourceFiles=new Set(['index.html','styles.css','faculty-portrait.css','data/faculty.json','data/en/faculty.json','data/ja/messages.json']);");
s=s.replace('Only changed 17 FAQ strings and 3 eligibility paragraphs at 390 and 1440; character probes inherit the actual target style, and are not treated as visible product content.','Only this batch: eight active faculty changes plus one unchanged canonical MTA display, at 390 and 1440. Not a rendered audit of all thirteen faculty fields.');
s=s.replace("for(const kind of ['faculty']){","for(const kind of ['faculty'])for(const route of [...new Set(wanted.filter(t=>t.lang===lang&&t.group===kind).map(t=>t.route))]){");
s=s.replace('const selected=wanted.filter(t=>t.lang===lang&&t.group===kind);','const selected=wanted.filter(t=>t.lang===lang&&t.group===kind&&t.route===route);');
s=s.replace("const stem=kind+'-'+lang+'-'+width+'-'+i;","const stem=kind+'-'+t.slug+'-'+lang+'-'+width+'-'+i;");
if(s.includes("for(const kind of ['faq','admission'])")||s.includes("'data/admission.json'"))throw Error('SETUP_INCOMPLETE');
fs.writeFileSync(path.join(dir,'audit.cjs'),s);fs.copyFileSync(path.join(prior,'coverage.py'),path.join(dir,'coverage.py'));
console.log('Prepared isolated faculty audit tools. No product or old audit changed.');
