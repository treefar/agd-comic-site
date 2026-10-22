// Read-only semantic review packet from the pinned worktree.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const repo=path.resolve(__dirname,'../../..'),read=f=>fs.readFileSync(path.join(repo,f),'utf8'),norm=s=>s.replace(/\s+/g,' ').trim();
const previous=JSON.parse(read('holiday-lab/translation-review/followup/semantic-reviewed.json')).units.filter(x=>x.id.startsWith('faq/')).map(x=>x.id);
const ctx={};vm.createContext(ctx);vm.runInContext(read('locale-en.js')+';this.en=SITE_EN_MESSAGES',ctx);vm.runInContext(read('locale-ja.js')+';this.ja=SITE_JA_MESSAGES',ctx);
const guide=JSON.parse(read('data/students/guide.json')),units=[];
for(const c of guide.cards)for(const[i,f]of c.faq.entries()){const id=`faq/${c.id}/${i}`;if(previous.includes(id))continue;const pair=z=>({zh:z,en:ctx.en[norm(z)]??null,ja:ctx.ja[norm(z)]??null});units.push({id,card:c.title,source_ids:f.source_ids,question:pair(f.q),answer:pair(f.a)});}
const out={source_commit:'c8d4e3563dcddd0f2a16277075e6deb71ab09d15',checked_at:'2026-10-23',excluded_previously_reviewed:previous,counts:{faq_pairs:units.length,target_strings:units.length*4},units};
fs.writeFileSync(path.join(__dirname,'packet.json'),JSON.stringify(out,null,2)+'\n');console.log(JSON.stringify(out,null,2));
