'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),D=require('./domain.cjs'),SC=require('./diagnostics.cjs');
function expected(p){assert.equal(p.contexts.length,6);assert.equal(p.normal_ui_jobs.length,1392);return{scope:SC.SCOPE,inherited_plan_file:'text-projection-v2.json',inherited_plan_sha256:D.hash(fs.readFileSync(path.join(__dirname,'text-projection-v2.json'))),contexts:p.contexts,pilot_cases:p.contexts.length*6,direct_calibrations:p.contexts.length*p.numeric_owner_values.reduce((n,a)=>n+a.values.length,0),stepper_calibrations:p.contexts.length*p.numeric_owner_values.reduce((n,a)=>n+2*(a.values.length-1),0),full_normal_ui_configurations:p.normal_ui_jobs.length,full_supported:false,native_approved:false,old_run_repaired:false,full_project_approved:false};}
function validate(scope,projection){assert.deepEqual(scope,expected(projection));return true;}
module.exports={expected,validate};
