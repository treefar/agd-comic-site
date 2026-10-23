// Read current dictionaries without running the browser application or changing product files.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const files = ['data/faculty.json', 'locale-en.js', 'locale-ja.js'];
const read = file => fs.readFileSync(file, 'utf8');
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const before = Object.fromEntries(files.map(file => [file, sha(file)]));
const context = {};
vm.runInNewContext(read('locale-en.js') + ';this.en=SITE_EN_MESSAGES;' + read('locale-ja.js') + ';this.ja=SITE_JA_MESSAGES;', context);
const faculty = JSON.parse(read('data/faculty.json'));
assert.equal(faculty.length, 13);
const ranks = [
  ['助理教授', 'Assistant Professor', '助教'],
  ['系主任 · 副教授', 'Department Chair · Associate Professor', '学科長・准教授'],
  ['副教授 · 從聘', 'Associate Professor · Secondary Appointment', '准教授・共同任用（本学科は従たる所属）'],
  ['助理教授 · 從聘', 'Assistant Professor · Secondary Appointment (從聘)', '助教・共同任用（本学科は従たる所属）'],
  ['助理教授 · 留職停薪', 'Assistant Professor · On Leave Without Pay (留職停薪)', '助教・無給休職中'],
  ['助理教授 · 電競娛樂系合聘', 'Assistant Professor · Joint Appointment with Department of Esports and Entertainment Industries (電競娛樂系合聘)', '助教・eスポーツエンターテインメント学科との共同任用（原職：助理教授・合聘）'],
  ['講師 · 電競娛樂系合聘', 'Lecturer · Joint Appointment with Department of Esports and Entertainment Industries (電競娛樂系合聘)', '講師・eスポーツエンターテインメント学科との共同任用（原職：講師・合聘）']
];
const rows = faculty.map(f => {
  const expected = ranks.find(row => row[0] === f.role);
  assert.ok(expected, 'Unreviewed role: ' + f.slug);
  assert.equal(context.en[f.role], expected[1], f.slug + ' en');
  assert.equal(context.ja[f.role], expected[2], f.slug + ' ja');
  return {slug: f.slug, zh: f.role, en: context.en[f.role], ja: context.ja[f.role], value_match: 'yes'};
});
for (const file of files) assert.equal(sha(file), before[file], file + ' changed during audit');
console.log(JSON.stringify({source_agent: 'codex',
  scope: 'Current source rank values; not independent official recertification of all people or browser layout',
  rows, count: rows.length, expected_values_match: '13/13', product_files_written: 0,
  source_sha256: before, pass: true}, null, 2));
