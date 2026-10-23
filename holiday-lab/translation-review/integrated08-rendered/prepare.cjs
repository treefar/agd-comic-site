const fs=require('fs'),path=require('path'),cp=require('child_process'),assert=require('assert/strict');
const fixed=(commit,file)=>JSON.parse(cp.execFileSync('git',['show',commit+':'+file],{encoding:'utf8',maxBuffer:20e6}));
const A=fixed('cbcfed1','holiday-lab/translation-review-about-labs/exact-plan.json'),AI=fixed('cbcfed1','holiday-lab/translation-review-about-labs/inventory.json'),N=fixed('a11cc9c','holiday-lab/translation-review-news-works-final/exact-plan.json');
const news=JSON.parse(fs.readFileSync('data/news.json')),works=JSON.parse(fs.readFileSync('data/works.json')),labs=JSON.parse(fs.readFileSync('data/labs.json'));
const valueAt=(j,p)=>p.slice(1).split('/').reduce((v,k)=>v?.[k.replace(/~1/g,'/').replace(/~0/g,'~')],j);
const targets=[],excluded=[];
for(const [group,ops]of [['about-labs',A.operations],['news-works',N.operations]])for(const o of ops){
 if(o.id==='NEWSWORK-a9a863dd86b4-en'){excluded.push({...o,reason:'Root explicitly excluded the complete FF paragraph; retained old value is not a missing rendered translation.'});continue;}
 const origins=o.origins||AI.rows.find(r=>o.id===r.id+'-'+o.lang)?.origins;assert.ok(origins,o.id);
 let route='#about';const source=origins.find(x=>/data\/(news|works|labs)\.json$/.test(x.file));
 if(source){const [index,field]=source.pointer.slice(1).split('/');if(source.file==='data/news.json')route=field==='excerpt'?'#news':'#/news/'+news[+index].slug;if(source.file==='data/works.json')route='#/works/'+(works[+index].id||works[+index].slug);if(source.file==='data/labs.json')route='#/labs/'+labs[+index].slug;}
 else if(origins.some(x=>x.file==='chapters-1.jsx'&&/NEWS/.test(x.pointer)))route='#news';
 else if(origins.some(x=>x.file==='chapters-2.jsx'&&/WORK|Works/.test(x.pointer)))route='#works';
 else if(origins.some(x=>/Labs|LABS/.test(x.section||x.pointer)))route='#labs';
 const classification=origins.some(x=>/\/(alt|imageAlt|thumbnailAlt)$/.test(x.pointer))?'alt':origins.some(x=>/\/(meta|metaTitle|seoTitle|metaDescription)$/.test(x.pointer))?'metadata':'visible-candidate';
 const j=JSON.parse(fs.readFileSync(o.file)),actual=valueAt(j,o.pointer);let resolvedPointer=o.pointer;
 if(actual!==o.new&&o.id==='NEWSWORK-dae8485cd431-ja'){const p=N.canonical_proposals[0].locale_migration;assert.equal(o.pointer.slice(1).replace(/~1/g,'/').replace(/~0/g,'~'),p.old_key);assert.equal(j[p.new_key],o.new);resolvedPointer='/'+p.new_key.replace(/~/g,'~0').replace(/\//g,'~1');}
 else assert.equal(actual,o.new,'fixed plan newly applied actual value '+o.id);
 targets.push({id:o.id,group,lang:o.lang,route,text:o.new,key:o.key,origins,classification,sourceFile:o.file,sourcePointer:o.pointer,resolvedPointer,reason:o.reason});
}
assert.equal(targets.filter(t=>t.group==='about-labs').length,44);assert.equal(targets.filter(t=>t.group==='news-works').length,82);
for(const lang of ['en','ja'])targets.push({id:'WORKS-HEADING-'+lang,group:'works-heading',lang,route:'#works',text:N.context_proposals[0][lang],classification:'rich-heading',sourceFile:'chapters-2.jsx'});
fs.writeFileSync(path.join(__dirname,'targets.json'),JSON.stringify({plans:{about:'cbcfed1',news:'a11cc9c'},targets,excluded},null,2));
fs.writeFileSync(path.join(__dirname,'semantic-packet.txt'),targets.map(t=>`${t.id} [${t.classification}] ${t.route}\nZH ${t.key||'(Whole Works heading)'}\n${t.lang.toUpperCase()} ${t.text}\n`).join('\n'));
console.log(JSON.stringify({targets:targets.length,plannedVisible:targets.filter(t=>t.classification==='visible-candidate').length,plannedAlt:targets.filter(t=>t.classification==='alt').length,metadata:targets.filter(t=>t.classification==='metadata').length,heading:2,excluded:excluded.length,routes:[...new Set(targets.map(t=>t.route))]},null,2));
