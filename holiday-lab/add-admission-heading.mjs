import fs from 'node:fs';
for(const [lang,value]of [['en','Eligibility and application process'],['ja','出願資格・手続き']]){
 const file=`data/${lang}/ui.json`,data=JSON.parse(fs.readFileSync(file,'utf8')),key='報名資格與流程';
 if(Object.hasOwn(data,key))throw Error('Heading already exists; inspect before replacing');
 data[key]=value;fs.writeFileSync(file,JSON.stringify(data,null,2)+'\n');
}
