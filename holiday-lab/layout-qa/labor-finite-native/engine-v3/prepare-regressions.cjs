'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
// Original independently authored counterexample source and RED output remain separate, unchanged.
fs.writeFileSync(path.join(__dirname,'repro.test.cjs'),"// v2 original counterexamples retained in v2-counterexamples.source.cjs; v3 behavior tests below.\nrequire('./regressions.cjs');\n");
const file=path.join(__dirname,'native.cjs'),s=fs.readFileSync(file,'utf8'),needle='const checks={exact_dom:';assert.equal(s.split(needle).length,2);fs.writeFileSync(file,s.replace(needle,'const checks={method_flags:sample.violations.length===0,exact_dom:'));console.log('Prepared same three strengthened v3 regressions; native retains and gates original method flags');
