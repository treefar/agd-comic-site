const fs=require('node:fs'),assert=require('node:assert/strict');
const files={
 'holiday-lab/dashboard/overnight-adapter.cjs':[
  ['function load(root){','function load(root,{state:override}={}){'],
  ["const state=JSON.parse(fs.readFileSync(path.join(root,statePath),'utf8'));","const state=override||JSON.parse(fs.readFileSync(path.join(root,statePath),'utf8'));"],
  ["user:'pending'","user:'user_pending'"],
  ["{key:'confirmed',label:'使用者確認'","{key:'user_pending',label:'待使用者審閱',tone:'warn',layer:'user'},{key:'confirmed',label:'使用者確認'"]
 ],
 'holiday-lab/dashboard/overnight-authority.cjs':[["r.user==='pending'","r.user==='user_pending'"]]
};
for(const[file,changes]of Object.entries(files)){let s=fs.readFileSync(file,'utf8');for(const[a,b]of changes){assert.ok(s.includes(a));s=s.replace(a,b);}fs.writeFileSync(file,s);}
