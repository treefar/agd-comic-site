// Preserve verified progress without changing C, official R0, or frozen running jobs.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),cp=require('node:child_process'),assert=require('node:assert/strict');
const root=process.cwd(),original='C:/Projects/系網漫畫版_AGDComicSite',vault='C:/TreeDesk/Obsidian Vault/00 Codex 永久記憶/專案紀錄/系網漫畫版_AGDComicSite.md',sha=b=>crypto.createHash('sha256').update(b).digest('hex'),read=f=>JSON.parse(fs.readFileSync(f)),qa=path.join(root,'holiday-lab/layout-qa');
const handoff=path.join(original,'LATEST_HANDOFF.md'),before=fs.readFileSync(handoff,'utf8'),section=s=>{const m=s.match(/## C\.[\s\S]*?(?=\r?\n## )/);assert.ok(m);return sha(m[0]);},expected='95ae06fb0e647d1d212fd467120bd209132c8c904cf193085f47fe806f293680';assert.equal(section(before),expected);
assert.equal(cp.execFileSync('git',['-C',original,'rev-parse','refs/remotes/origin/main'],{encoding:'utf8'}).trim(),'1b8322e69d84549db220d849afb1aac0fb9d7c2a');
const official=path.join(qa,'layout-report.json'),r0=sha(fs.readFileSync(official));assert.equal(r0,'cbaa1849002fe4682650fb653385a62d91ebf9aca3c94090cdaf0df7bbf34336');
const coverage=read(path.join(qa,'semester-session-composite/coverage-bound-current.json')),plan=read(path.join(qa,'semester-session-composite/plan-consistency.json')),native=read(path.join(qa,'finite-hints-native-20261023/runs/run-01/verification.json')),live=read(path.join(qa,'mid-autumn-finite-native/full-domain-run/exhaustive/root-launch-status.json'));
assert.equal(coverage.covered,1914);assert.equal(coverage.missing_count,162);assert.equal(plan.exact_selected_and_missing_keys,true);assert.equal(native.pass,true);assert.equal(native.new_png,165);assert.equal(native.full_project_approved,false);
const block=`## 2026-10-23 最新：嚴格可見覆蓋1914項、中秋全集已啟動

- source_agent: codex。本輪實際進展：開學補採684 frames完成，舊10個完成session與新2個session嚴格組合90個canonical案例。新增選中畫面viewport稽核，撤回24個窄版過度計入項；故1848舊快照減24加90，最新1914/2076、缺162、geometry0。索引 semester-session-composite/coverage-bound-current.json；plan-current/plan.json與plan-consistency.json逐key相符。這是PARTIAL_RED，不是正式gate通過。
- 主控實跑相關28 tests全過；中秋全集工具7工程測試及繼承3072筆串流核對已過。中秋單一engine ${live.engine_pid}／driver ${live.driver_pid}已在${live.started}啟動，當次觀測${live.last_stdout}：${live.last_line}。prepared-01 freeze SHA ${live.manifest_sha256}。觀測後數字會變，先查同PID及log，不因等待逾時重啟；全域完整性、真正極值與seeded full UI仍未驗完。
- 清明原46996已terminal exit1，原因為舊聚合JSON字串爆限；1042案例恢復並重驗，原after缺與未知旗標1保留NO。僅缺的ja1440路線另補採collector2352／driver57024／session52328，最近實查仍live。原開學補採22768已正常結束，不再重跑。
- 窄版8款×3語：150真拒絕、165新PNG、96 secondary義務（新15＋舊81跨run逐筆核對）離線verify主控exit0；source/font穩定、Range/safe/clip/viewport及全case geometry0。finite-hints-native-20261023/REPORT.md。尚須strict typed adapter才計入覆蓋，不改舊eligible。新peace/retro60張與constitution真6011.5ms收尾亦已補證；60張trace派生輸入另存，不能假稱原case有inputs，完整join仍未完。
- 日英專責組正獨立複核既有26key/28候選與13人職級；13/13現譯值核對過，助理教授→Assistant Professor→助教有官方來源，TA另列；個人最新聘任與正式機構名仍待確認。未把候選套入產品。窄版日文「に。」「く。」孤行為P3待處理，未用geometry0掩蓋可讀性問題。
- 主報告 holiday-lab/reports/verification-followup-20261023-13.md。沒有新網站Build、ZIP或8800替換；8852仍11內部量測。官方R0不變，遊戲不發布，未push／未碰main／未刪檔，C節SHA不變。TF-BASE來源/WebGL仍待回，未啟Unity。大raw僅本機，未宣稱跨機備份。
- 下一輪第一件事：查同18628/68760與2352/57024真程序及log；完成後串流驗全集/分片，再採用獨立typed join更新索引與assembly，保留原失敗、缺after與unknown。中秋極值/seeded實UI、國慶完整數值域、其餘error-longest及來源provenance仍必須完成；不能以部分綠燈產正式包。

`;
assert.ok(!before.startsWith(block.split('\n')[0]),'Already recorded');fs.writeFileSync(handoff,block+before);assert.equal(section(fs.readFileSync(handoff,'utf8')),expected);
const status=path.join(root,'holiday-lab/STATUS.md');fs.writeFileSync(status,block+fs.readFileSync(status,'utf8'));
const old=fs.readFileSync(vault,'utf8'),fm=old.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/);assert.ok(fm);fs.writeFileSync(vault,fm[0]+'\n'+block+old.slice(fm[0].length).replace(/^\s*\r?\n/,''));
const result={at:new Date().toISOString(),source_agent:'codex',C_section_sha256:expected,official_R0_sha256:r0,covered:coverage.covered,missing:coverage.missing_count,full_project_approved:false,handoff_and_vault_written:true,vault_remote_sync_performed:false};fs.writeFileSync(path.join(root,'holiday-lab/reports/verification13-invariants.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
