// Supplemental evidence retains its original build and scope; it grants no release approval.
const path = require('node:path'), assert = require('node:assert/strict'), crypto = require('node:crypto');
module.exports = function(root, policy, read) {
  const out = {};
  if (policy.recovery_receipt) {
    const method = 'holiday-lab/reports/comprehensive-followup-20261023/root/verify-recovery.cjs';
    read(policy.recovery_receipt); read(method, false);
    out.recovery = require(path.join(root, method)).verify(path.dirname(path.join(root, policy.recovery_receipt)));
    assert.equal(out.recovery.pass, true);
    assert.equal(out.recovery.full_project_approved, false);
  }
  if (policy.webgl_recheck) {
    const r = read(policy.webgl_recheck);
    assert.equal(r.method, 'Google Drive list_folder, metadata only');
    assert.equal(r.source_projects_received, false);
    assert.equal(r.webgl_build_received, false);
    assert.equal(r.unity_started, false);
    assert.equal(r.remote_job_resent, false);
    assert.deepEqual(r.files.map(f => f.title).sort(), ['BACKGROUND-TESTING.md','WORK-ORDER-fat-hamster.md','WORK-ORDER-flora.md','WORK-ORDER-index.md','inspect-tf-base.ps1'].sort());
    out.webgl = {items:r.files.length, observed_at:r.observed_at, scope:r.scope};
  }
  if (policy.guide_research_receipt) {
    const r = read(policy.guide_research_receipt), dir = path.posix.dirname(policy.guide_research_receipt);
    for (const a of r.artifacts) {
      const text = read(dir + '/' + a.file, false);
      assert.equal(crypto.createHash('sha256').update(text).digest('hex'), a.sha256);
    }
    for (const a of r.inputs) {
      const text = read(a.file, false);
      assert.equal(crypto.createHash('sha256').update(text).digest('hex'), a.sha256);
    }
    const sources = JSON.parse(read(dir + '/sources.json', false));
    assert.equal(r.source_count, sources.length);
    assert.equal(r.product_writes, 0); assert.equal(r.publication, false);
    assert.equal(r.checks.find(c => c.id === 'current_complete_regulations_and_latest_forms_verified').result, 'no');
    assert.equal(r.checks.find(c => c.id === 'schoolwide_all_units_research_complete').result, 'no');
    out.research = {sources:sources.length, topics:r.structure.length, read_classes:r.read_classes};
  }
  if (policy.translation_review_receipt) {
    const r=read(policy.translation_review_receipt), v=JSON.parse(r.stdout);
    assert.equal(r.exit_code,0); assert.equal(r.method_unchanged,true);
    assert.equal(v.pass,true); assert.equal(v.receipt_sha256,r.receipt_sha256);
    assert.equal(v.native_speaker_approved,false); assert.equal(v.public_release,false);
    assert.equal(v.full_project_approved,false);
    out.translation=v;
  }
  return out;
};
