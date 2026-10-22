// Changes are located in actual news/work pages; the excerpt and fixed headline are homepage text.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../../..'),folder='holiday-lab/translation-review-content-next',read=f=>JSON.parse(fs.readFileSync(path.join(root,f),'utf8'));
function targets(){
 const plan=read(folder+'/exact-plan.json'),review=read(folder+'/reviewed.json'),news=read('data/news.json'),works=read('data/works.json');
 const targets=plan.operations.map(o=>{
  const r=review.rows.find(r=>o.id===r.id+'-'+o.lang);if(!r)throw Error('MISSING_REVIEW_SOURCE '+o.id);
  let route='#news';
  if(r.file==='data/news.json'&&!r.pointer.endsWith('/excerpt')){const post=news[Number(r.pointer.split('/')[1])];route='#/news/'+post.slug;}
  if(r.file==='data/works.json'){const work=works[Number(r.pointer.split('/')[1])];route='#/works/'+work.id;}
  return{id:o.id,route,lang:o.lang,text:o.new,source_file:o.file,group:'content'};
 });
 const c=plan.canonical_proposals[0];targets.push({id:c.id+'/zh',route:'#/news/'+news[4].slug,lang:'zh',text:c.new,source_file:c.file,group:'content'});
 return{sourcePlans:{content:{path:folder+'/exact-plan.json',sha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(root,folder+'/exact-plan.json'))).digest('hex')}},targets};
}
module.exports={targets};
