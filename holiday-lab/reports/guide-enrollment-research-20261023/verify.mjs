import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

// 研究文件的結構與原始收據重算；不對未取得規章批准現行性。
const root = path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1');
const read = name => JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'));
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const draft = read('student-draft.json');
const catalog = read('source-catalog.json');
const context = read('context.json');
const visuals = read('visual-pages.json');
const report = fs.readFileSync(path.join(root, 'REPORT.md'), 'utf8');
const checks = [];
const add = (id, condition, evidence) => checks.push({ id, status: condition ? 'yes' : 'no', evidence });
const source = new Map(catalog.sources.map(s => [s.id, s]));
add('source_ids_unique', source.size === catalog.sources.length, source.size);
add('five_topics', draft.topics.length === 5, draft.topics.map(x => x.title));
for (const t of draft.topics) {
  add('structure_' + t.id, t.steps.length >= 4 && t.steps.length <= 6 && t.faq.length === 3,
    { steps: t.steps.length, faq: t.faq.length });
  for (const [i, step] of t.steps.entries()) {
    add('two_sentences_' + t.id + '_' + (i + 1), (step.text.match(/[。！？]/g) || []).length === 2,
      { kind: step.kind, title: step.title });
  }
  add('all_citations_' + t.id, [...t.steps, ...t.faq].every(item =>
    item.source_ids.length > 0 && item.source_ids.every(id => source.has(id) && source.get(id).url)),
  { cited: [...new Set([...t.steps, ...t.faq].flatMap(x => x.source_ids))] });
}
add('five_mermaid_blocks', (report.match(/~~~mermaid/g) || []).length === 5, 5);
add('status_flow_branches', report.includes('status0 -- "復學／續休"') &&
  report.includes('status5 -- "續休"'), draft.topics.find(x => x.id === 'status').branch_note);
const definitions = [...report.matchAll(/^\[(A\d+)\]: (.+)$/gm)];
add('exact_reference_urls', definitions.length === source.size &&
  definitions.every(m => source.get(m[1])?.url === m[2]), definitions.length);
const receipts = ['fetch-receipts.json', 'fetch-secondary-receipts.json', 'fetch-current-attempts.json']
  .flatMap(name => read(name).rows);
for (const r of receipts) if (r.file) add('http_raw_' + r.id,
  fs.existsSync(r.file) && fs.statSync(r.file).size === r.bytes && sha(r.file) === r.sha256,
  { status: r.status, bytes: r.bytes, file: r.file });
for (const s of catalog.sources) if (s.raw) add('source_raw_' + s.id,
  fs.statSync(s.raw.file).size === s.raw.bytes && sha(s.raw.file) === s.raw.sha256, s.raw);
for (const p of visuals.pages) add('visual_page_' + p.source_id + '_' + p.page,
  p.research_visual_read === true && sha(p.file) === p.sha256, p);
for (const i of context.inputs) add('input_unchanged_' + i.file,
  sha(i.file) === i.sha256, { file: i.file, expected: i.sha256, actual: sha(i.file) });
add('raw_empty_not_full_text', catalog.sources.filter(s => s.attempt?.bytes === 0)
  .every(s => s.read_level.startsWith('official_search_index')), '202空內容不計live全文');
add('word_not_full_text', source.get('A10').read_level === 'drive_word_raw_partial_only' &&
  source.get('A10').metadata.readable_fetch.content_characters === 0, 'DOC部分串不算完整解析');
add('incomplete_scope_explicit', catalog.not_all_current_documents_obtained === true &&
  report.includes('最新母法、115全部操作附件及表單已齊 | no'), '維持正式規章未齊');
const files = [];
const walk = dir => {
  for (const name of fs.readdirSync(dir)) {
    const file = path.join(dir, name);
    if (fs.statSync(file).isDirectory()) walk(file);
    else if (!['verification.json', 'verification-output.txt'].includes(name))
      files.push({ file, bytes: fs.statSync(file).size, sha256: sha(file) });
  }
};
walk(root);
const output = {
  as_of: draft.as_of,
  scope: '文件結構與收據重算；不是最新規章全齊、當期受理或個人核准',
  topics: draft.topics.length,
  steps: draft.topics.reduce((n, t) => n + t.steps.length, 0),
  faq: draft.topics.reduce((n, t) => n + t.faq.length, 0),
  sources: source.size,
  pdf_visual_pages: visuals.pages.length,
  source_levels: catalog.sources.reduce((counts, s) => {
    counts[s.read_level] = (counts[s.read_level] || 0) + 1;
    return counts;
  }, {}),
  http_receipts: receipts.length,
  http_counts: receipts.reduce((counts, r) => {
    counts[r.status || 'error'] = (counts[r.status || 'error'] || 0) + 1;
    return counts;
  }, {}),
  checks,
  summary: { yes: checks.filter(x => x.status === 'yes').length, no: checks.filter(x => x.status === 'no').length },
  not_ready: [
    '現行學則及學生選課準則全文', '115棄選／特殊逾期日程及表',
    '最新版抵免辦法與當期印表版本一致性', '完整最新請假規則、假別及操作附件',
    '休復學母法、本期表單及通知樣本', '115轉系申請表與各系審查附件',
    '本系轉系Word全文及當期適用', '匿名公開Drive及個人核准'
  ],
  formal_current_rules_complete: false,
  manifest: files
};
fs.writeFileSync(path.join(root, 'verification.json'), JSON.stringify(output, null, 2) + '\n');
console.log(JSON.stringify({ ...output, checks: undefined, manifest: undefined }, null, 2));
if (output.summary.no) process.exitCode = 1;
