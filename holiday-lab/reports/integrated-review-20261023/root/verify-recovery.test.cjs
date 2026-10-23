const fs = require('node:fs');
const path = require('node:path');
const {test} = require('node:test');
const assert = require('node:assert/strict');
const {verify} = require('./verify-recovery.cjs');
const dir = path.join(__dirname, 'recovery-runs/2026-10-23T11-07-11-903Z');
const raw = JSON.parse(fs.readFileSync(path.join(dir, 'result.json')));
test('untouched real 9-case run passes with actual PNGs and current frozen runtime', () => assert.equal(verify(dir).pass, true));
const controls = {
  'missing language/scenario': r => r.cases.pop(),
  '503 hidden as successful response': r => r.cases[0].responses[0].status = 200,
  'keyboard retry missing': r => r.cases[0].keyboard_retry = false,
  'pending language not changed': r => r.cases[2].switched_to = 'zh',
  'font not ready': r => r.cases[0].snapshots[0].layout.fontStatus = 'loading',
  'image evidence hash tampered': r => r.cases[0].snapshots[0].sha256 = '0'.repeat(64),
  'generated game image loaded': r => r.cases[0].requests.push(r.base + '/holiday-lab/assets/extra.png'),
  'unrelated global approval claimed': r => r.full_project_approved = true,
  'source manifest changed': r => r.sources_after[0].sha256 = '0'.repeat(64),
};
for (const [name, mutate] of Object.entries(controls)) test('rejects ' + name, () => {
  const copy = structuredClone(raw); mutate(copy); assert.throws(() => verify(dir, copy));
});
