const fs=require('fs'),path=require('path'),crypto=require('crypto');
module.exports=ctx=>{const root=path.resolve(__dirname,'../..'),read=p=>fs.readFileSync(path.join(root,p),'utf8'),catalog=[...read('holiday-lab/catalog.mjs').matchAll(/\{id:'([^']+)'/g)].map(m=>m[1]),q=JSON.parse(read('holiday-lab/qa/playthrough.json')),shell=JSON.parse(read('holiday-lab/qa/shell.json')).runs.at(-1),manifest=JSON.parse(read('ui-art-manifest.json'));return[
 {name:'每款由catalog逐筆核對',pass:ctx.section('games').length===catalog.length&&catalog.every(id=>ctx.section('games').some(g=>g.id===id))},
 {name:'每款程式與五張CG確實存在',pass:catalog.every(id=>fs.existsSync(path.join(root,`holiday-lab/games/${id}.mjs`))&&fs.readdirSync(path.join(root,`holiday-lab/assets/${id}`)).filter(p=>/^cg-\d\.webp$/.test(p)).length===5)},
 {name:'通關來源與目前模組SHA一致',pass:catalog.every(id=>q.servedSourceSha256[`games/${id}.mjs`]===crypto.createHash('sha256').update(fs.readFileSync(path.join(root,`holiday-lab/games/${id}.mjs`))).digest('hex'))},
 {name:'外框每條結果由最新原始run核對',pass:ctx.section('shell').length===shell.checks.length&&shell.checks.every((c,i)=>ctx.section('shell')[i].result===(c.pass?'pass':'unknown'))},
 {name:'未驗證保留，不升格使用者確認',pass:ctx.section('games').every(g=>g.user==='pending')&&ctx.section('shell').some(r=>r.result==='unknown')},
 {name:'候選素材檔案雜湊逐張核對',pass:manifest.assets.every(a=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,a.path))).digest('hex')===a.sha256)}];};
