const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),cp=require('node:child_process'),assert=require('node:assert/strict');
const root=process.cwd(),original='C:/Projects/系網漫畫版_AGDComicSite',vault='C:/TreeDesk/Obsidian Vault/00 Codex 永久記憶/專案紀錄/系網漫畫版_AGDComicSite.md',handoff=path.join(original,'LATEST_HANDOFF.md'),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const c=text=>{const match=text.match(/## C\.[\s\S]*?(?=\r?\n## )/);assert.ok(match,'C section missing');return sha(match[0]);},before=fs.readFileSync(handoff,'utf8'),expected='95ae06fb0e647d1d212fd467120bd209132c8c904cf193085f47fe806f293680';assert.equal(c(before),expected);
const main=cp.execFileSync('git',['-C',original,'rev-parse','refs/remotes/origin/main'],{encoding:'utf8'}).trim();assert.equal(main,'1b8322e69d84549db220d849afb1aac0fb9d7c2a');
const official=path.join(root,'holiday-lab/layout-qa/layout-report.json'),r0=sha(fs.readFileSync(official));assert.equal(r0,'cbaa1849002fe4682650fb653385a62d91ebf9aca3c94090cdaf0df7bbf34336');
const block=`## 2026-10-23 最新：分片存檔修復、2964案例復原與獨立複驗

- source_agent: codex。前一輪完成翻譯專責派工；本輪為實際進展：模組9/9、獨立8/8及六種負例、真DOM21frames與三段回放，v1/v2 coverage一致14/2076，組裝計畫56wrapper SHA全同。主報告：C:/agywork/agd-holiday-prototypes/holiday-lab/reports/verification-followup-20261023-12.md。本輪沒有網站Build12，8852仍11內部量測，8800與舊ZIP保留。
- semester原535MB報告聚合字串爆限，已終止；在新ignored recovered-run恢復2964 fullcase、sample／image SHA與11session metadata原值。原10complete，JA1440 graduation partial／credit未開始；末旗標全文缺1、無原after，明列NO。單一新定向補採collector22768／driver69380／session27559，原清明46996仍live；不重啟原其他程序。勞動1571frames／光復622frames已結束geometry0，完整method仍未結案。
- 最新固定08覆蓋1848/2076、缺228、geometry0（report-store-integration/coverage-current.json），不含恢復partial或另存peace6預覽。元旦11有限key／414精確match／6context已證；peace6真聆聽預覽已驗。artifact72/72、2799/2799行補證；preview12/30閉合，剩18family／37branch原false保留，僅另補constitution JA1440原生收尾。
- 日英新審查26key／28譯值候選，13職階與49既有值、41來源SHA核對，未套產品；專名／校務全文與個人資格不冒稱認證。中秋第二先導720原法對照、10真例、13完整極值相符，全集仍未啟；國慶60探測／10真例，原法全量約174h未啟，GLOBAL均NO。
- 儀表板23/23真重驗，15模組功能／外框56yes1未驗／使用者確認0；全UI gate仍NO，官方R0 SHA不變。TF-BASE本輪仍僅5工單／腳本，未回來源，未啟Unity。未push、未發布、未碰main、未刪檔，C節不動。大raw只留本機，沒有跨機備份成功宣稱。
- 下一輪第一件事：追同一22768／69380／session27559及46996真狀態，完成才讀分片與來源收據；依精確typed ledger補原生缺口、回收peace／retro有限錯句審查，再更新索引。舊closure/export未全支援v2需逐來源改，不以manifest索引當fullcase。正式gate通過前不產新ZIP／不發布。

`;
assert.ok(!before.startsWith(block.split('\n')[0]),'Already recorded; inspect instead of duplicating');fs.writeFileSync(handoff,block+before);assert.equal(c(fs.readFileSync(handoff,'utf8')),expected);
const status=path.join(root,'holiday-lab/STATUS.md');fs.writeFileSync(status,block+fs.readFileSync(status,'utf8'));
const old=fs.readFileSync(vault,'utf8'),fm=old.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/);assert.ok(fm);fs.writeFileSync(vault,fm[0]+'\n'+block+old.slice(fm[0].length).replace(/^\s*\r?\n/,''));
const result={at:new Date().toISOString(),source_agent:'codex',machine:cp.execFileSync('hostname',{encoding:'utf8'}).trim(),C_section_sha256:expected,origin_main:main,official_R0_sha256:r0,handoff_and_vault_written:true,vault_remote_sync_performed:false,full_project_approved:false};fs.writeFileSync(path.join(root,'holiday-lab/reports/verification12-invariants.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
