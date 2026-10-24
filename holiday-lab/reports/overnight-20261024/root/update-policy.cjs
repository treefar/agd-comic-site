const fs=require('node:fs');
const file='holiday-lab/dashboard/progress-policy.json',p=JSON.parse(fs.readFileSync(file,'utf8'));
Object.assign(p,{dashboard_mode:'website-frozen-games',festival_games_frozen:true,source:'2026-10-24 使用者凌晨後一次全面核對；所有節日凍結',labor_note:'所有節日遊戲先凍結，含勞動節；不開發、不測玩、不續跑大量QA。',latest_local_review:'.measure-overnight-20261024-01',latest_local_port:8874,resume_scope:'website-only-overnight',resume_source:'中英日網站核對、在校指南補正、素材引用與指定交接夾回查；非C節授權。',product_write_scope:'僅網站必要修正與本機驗證；不改遊戲檔、不生圖、不push、不發布、不碰main、不刪檔、不執行C節。'});
fs.writeFileSync(file,JSON.stringify(p,null,2)+'\n');
console.log('Current dashboard mode: '+p.dashboard_mode+'; historical evidence fields retained separately.');
