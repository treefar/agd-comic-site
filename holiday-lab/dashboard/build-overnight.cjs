const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const root=path.resolve(__dirname,'../..'),data=require('./overnight-adapter.cjs')(root);
fs.writeFileSync(path.join(__dirname,'data.json'),JSON.stringify(data,null,2)+'\n');
const script='C:/AIHome/claude/skills/project-dashboard/scripts/build-dashboard.js';
cp.execFileSync(process.execPath,[script,path.join(__dirname,'data.json'),path.join(__dirname,'out')],{stdio:'inherit'});
