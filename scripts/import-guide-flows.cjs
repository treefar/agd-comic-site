// Import reviewed, source-linked process diagrams without copying research notes into student text.
const fs=require('node:fs'),assert=require('node:assert/strict');
const input=JSON.parse(fs.readFileSync(process.argv[2])),guide=JSON.parse(fs.readFileSync('data/students/guide.json'));
assert.equal(input.cards.length,15);const changes={};
for(const source of input.new_sources){if(!guide.sources.some(s=>s.id===source.id))guide.sources.push({id:source.id,title:source.title,url:source.url,checked_at:source.checked_at,readability:source.read_status==='full_text'?'官方網頁全文已讀；未登入個人系統。':'官方搜尋索引可讀；直接開啟403或202空內容，未讀即時全文。',note:source.scope});}
const sourceIds=new Set(guide.sources.map(s=>s.id));
for(const item of input.cards){const card=guide.cards.find(c=>c.id===item.id);assert.ok(card,item.id);assert.ok(['sequence','choices','branch'].includes(item.flow_type));
 if(item.revised_steps){assert.ok(['credit-transfer','status-military'].includes(item.id));card.steps=item.revised_steps;card.step_details=item.revised_step_details.map(({title,detail,source_ids})=>({title,detail,source_ids}));changes[item.id]={fields:{steps:card.steps}};}
 card.flow_type=item.flow_type;card.flow=item.flow;card.flow_note=item.flow_note;
 assert.equal(card.flow.length,card.steps.length,item.id);card.flow.forEach((node,i)=>{assert.equal(node.step_index,i);assert.ok(node.source_ids.every(id=>sourceIds.has(id)));});
 card.source_ids=[...new Set([...card.source_ids,...card.flow.flatMap(n=>n.source_ids),...card.step_details.flatMap(n=>n.source_ids)])];
}
// A staff workplace survey and a lecture do not establish student case procedures.
const support=guide.cards.find(c=>c.id==='support-rights'),removed=['gender-contact','gender-event'];
support.source_ids=support.source_ids.filter(id=>!removed.includes(id));support.faq=support.faq.map(f=>({...f,source_ids:f.source_ids.filter(id=>!removed.includes(id))}));
changes['support-rights']={fields:{faq:support.faq},removedSourceIds:removed};
const newsLabels={past_results:'歷屆成果，非當期甄選',past_results_index_only:'僅消息索引，非當屆規定',past_announcement_index_only:'過去學期，非當期報名'};
for(const card of guide.cards){const related=(input.related_news||[]).filter(n=>n.card_ids.includes(card.id));if(related.length)card.related_news=related.map(n=>({title:n.title,url:n.url,date:n.date,status_label:newsLabels[n.status]}));}
fs.writeFileSync('data/students/guide.json',JSON.stringify(guide,null,2)+'\n');
fs.writeFileSync('docs/qa/japanese/flow-review-amendments.json',JSON.stringify(changes,null,2)+'\n');
console.log('IMPORTED',guide.cards.length,'topics;',guide.cards.reduce((n,c)=>n+c.steps.length,0),'flow nodes and explanations;',guide.sources.length,'source records');
