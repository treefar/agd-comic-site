// Read-only verification of a completed, bounded network-recovery run.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const {manifest, hash} = require('../../hero-release-20261023/release-student/lib.cjs');
const ROOT = path.resolve(__dirname, '../../../..');
const SITE = path.join(ROOT, '.measure-student-hero-20261023-02');
const BASE = 'http://127.0.0.1:8863';
function verify(dir, receipt) {
  dir = path.resolve(dir);
  const bytes = fs.readFileSync(path.join(dir, 'result.json'));
  const r = receipt || JSON.parse(bytes);
  assert.equal(r.schema, 1);
  assert.equal(r.status, 'pass');
  assert.equal(r.base, BASE);
  assert.equal(path.resolve(r.site), SITE);
  assert.equal(r.public_release, false);
  assert.equal(r.full_project_approved, false);
  assert.ok(Date.parse(r.finished) >= Date.parse(r.started));
  assert.equal(r.method_sha256, hash(fs.readFileSync(path.join(__dirname, 'demo-recovery.cjs'))));
  assert.deepEqual(r.sources_before, r.sources_after);
  assert.deepEqual(r.sources_before, manifest(SITE));
  assert.equal(r.sources_before.length, 360);
  assert.deepEqual(r.summary, {pass: 9, fail: 0});
  const keys = ['zh', 'en', 'ja'].flatMap(lang => ['http-503', 'missing-gallery', 'pending-language-change'].map(s => lang + '-' + s));
  assert.deepEqual(r.cases.map(c => c.id), keys);
  let screenshots = 0;
  for (const c of r.cases) {
    assert.equal(c.id, c.lang + '-' + c.scenario);
    assert.equal(c.status, 'pass');
    assert.deepEqual(c.errors, []);
    assert.ok(c.requests.length >= 6);
    for (const url of c.requests) {
      assert.equal(new URL(url).origin, BASE);
      assert.ok(!/\/holiday-lab\/(assets|audio|games)\//.test(url));
    }
    const pending = c.scenario === 'pending-language-change';
    const outage = c.scenario === 'http-503';
    assert.equal(c.news_requests, pending ? 1 : 2);
    assert.equal(c.requests.filter(u => u === BASE + '/data/news.json').length, c.news_requests);
    assert.deepEqual(c.responses.map(x => x.status), pending ? [200] : outage ? [503, 200] : [200, 200]);
    assert.ok(c.responses.every(x => x.url === BASE + '/data/news.json'));
    assert.equal(c.expected_console_error, outage);
    assert.equal(c.console.length, outage ? 1 : 0);
    if (outage) assert.match(c.console[0], /503/);
    if (pending) {
      assert.equal(c.switched_to, {zh:'en', en:'ja', ja:'zh'}[c.lang]);
      assert.equal(c.no_fake_work_during_loading, true);
    } else {
      assert.equal(c.no_fabricated_work, true);
      assert.equal(c.keyboard_retry, true);
      assert.ok(c.failureMessage.length > 10);
    }
    assert.deepEqual(c.snapshots.map(s => s.label), pending ? ['loaded'] : ['failure', 'recovered']);
    for (const s of c.snapshots) {
      assert.equal(s.file, c.id + '-' + s.label + '.png');
      const png = fs.readFileSync(path.join(dir, s.file));
      assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
      assert.equal(hash(png), s.sha256);
      assert.equal(s.layout.width, 320);
      assert.equal(s.layout.height, 900);
      assert.equal(s.layout.fontStatus, 'loaded');
      assert.deepEqual(s.layout.issues, []);
      assert.deepEqual(s.layout.orphans, []);
      assert.ok(s.layout.rows.length >= 8);
      const ids = s.layout.rows.map(row => row.id);
      if (s.label === 'failure') {
        assert.ok(ids.includes('curation-retry'));
        assert.ok(!ids.includes('curation-check'));
      } else {
        assert.ok(ids.includes('curation-check'));
        // The layout collector records leaf paragraphs, not their credits wrapper.
        const text = s.layout.rows.map(row => row.text).join('\n');
        const works = JSON.parse(fs.readFileSync(path.join(SITE, 'data/news.json')))
          .find(item => item.id === 7140).gallery.slice(3, 6);
        for (const work of works) {
          for (const name of work.designers.split(' · ')) assert.ok(text.includes(name));
          assert.ok(text.includes(work.mentor));
        }
      }
      screenshots++;
    }
  }
  assert.equal(screenshots, 15);
  return {pass:true, cases:9, screenshots, runtime_files:360, receipt_sha256:hash(bytes),
    scope:'320px student-curation network recovery on frozen student02 only', public_release:false, full_project_approved:false};
}
module.exports = {verify};
if (require.main === module) {
  try { console.log(JSON.stringify(verify(process.argv[2]), null, 2)); }
  catch (e) { console.error(e.stack); process.exitCode = 1; }
}
