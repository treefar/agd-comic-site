// The approved 17 FAQ strings and three eligibility paragraphs; no whole-site audit claim.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const dir=__dirname,parent=path.dirname(dir),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
function targets(){const faqFile=path.join(parent,'faq-remainder/exact-plan.json'),eligibilityFile=path.join(parent,'selection-eligibility/exact-plan.json'),fb=fs.readFileSync(faqFile),eb=fs.readFileSync(eligibilityFile),faq=JSON.parse(fb),eligibility=JSON.parse(eb);return{sourcePlans:{faq:{path:faqFile,sha256:hash(fb)},eligibility:{path:eligibilityFile,sha256:hash(eb)}},targets:[...faq.changes.map(c=>({id:c.id,route:'#/students/guide',lang:c.file.split('/')[1],text:c.new,source_file:c.file,group:'faq'})),...Object.entries(eligibility.paragraphs.proposed).map(([lang,text])=>({id:'selection-eligibility/'+lang,route:'#/admission/selection',lang,text,group:'admission'}))]};}
module.exports={targets};
