// Supplemental evidence retains its original build and scope; it grants no release approval.
const path = require('node:path'), assert = require('node:assert/strict'), crypto = require('node:crypto');
module.exports = function(root, policy, read) {
  const out = {};
  if (policy.recovery_receipt) {
    const method = policy.recovery_verifier || 'holiday-lab/reports/comprehensive-followup-20261023/root/verify-recovery.cjs';
    assert.ok(['holiday-lab/reports/comprehensive-followup-20261023/root/verify-recovery.cjs','holiday-lab/reports/integrated-review-20261023/root/verify-recovery.cjs'].includes(method));
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
  if (policy.integrated_guide_receipt) {
    const method='holiday-lab/reports/integrated-review-20261023/guide-independent/verify.cjs';
    read(method,false);read(policy.integrated_guide_receipt);
    const v=require(path.join(root,method)).verify(path.dirname(path.join(root,policy.integrated_guide_receipt)));
    assert.equal(v.pass,true);assert.equal(v.full_project_approved,false);assert.equal(v.public_release,false);
    const freeze=read('holiday-lab/reports/integrated-review-20261023/guide-independent/freeze.json'),release=read(policy.release_receipt);
    assert.equal(freeze.base,release.base);assert.equal(path.resolve(freeze.site),path.resolve(root,policy.local_build));
    const files=new Map(release.source_before.map(r=>[r.path,r]));assert.equal(files.size,freeze.build_files.length);
    for(const f of freeze.build_files){assert.equal(files.get(f.file)?.sha256,f.sha256);assert.equal(files.get(f.file)?.bytes,f.bytes);}
    out.translation=v;out.guide_integrated=true;
  }
  if (policy.proper_names_research) {
    const r=read(policy.proper_names_research),input=read(r.input.file,false);
    assert.equal(crypto.createHash('sha256').update(input).digest('hex'),r.input.sha256_before);
    assert.equal(r.input.sha256_before,r.input.sha256_after);assert.equal(r.product_written,false);
    const supported=r.rows.filter(x=>x.review.candidate_as_name_change_supported===true).length;
    assert.equal(r.counts.primary_supported,supported);assert.equal(r.counts.values,r.rows.length);
    assert.equal(r.counts.retain_pending,r.rows.length-supported);
    out.proper_names={values:r.rows.length,supported,pending:r.rows.length-supported,product_written:false};
  }
  if(policy.additional_guide_research_receipt){
    const r=read(policy.additional_guide_research_receipt);
    for(const a of r.inputs){const text=read(a.file,false);assert.equal(Buffer.byteLength(text),a.bytes);assert.equal(crypto.createHash('sha256').update(text).digest('hex'),a.sha256);}
    assert.equal(r.product_written,false);assert.equal(r.current_complete_regulations_verified,false);assert.equal(r.public_release,false);
    assert.equal(r.topics.length,5);assert.ok(r.topics.every(t=>t.steps>=4&&t.faq===3));
    out.additional_research={topics:r.topics.length,steps:r.topics.reduce((n,t)=>n+t.steps,0),faq:r.topics.reduce((n,t)=>n+t.faq,0),current_complete_regulations_verified:false};
  }
  return out;
};
