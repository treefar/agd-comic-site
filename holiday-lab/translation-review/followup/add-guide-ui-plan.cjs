const fs=require('node:fs');let p='holiday-lab/translation-review/followup/build-plan.cjs',s=fs.readFileSync(p,'utf8');const addition=`
const newUi=[
 ['持有勞動部乙級以上技術士證（職種仍須符合簡章）','I hold a Class B or higher technician certificate issued by Taiwan’s Ministry of Labor (the trade must also meet the guide).','台湾の労働部発行の乙級以上「技術士證」を持っている（職種は募集要項への適合が必要）'],
 ['沒有，或只有其他證照／尚未確認資格','No, or I only have other credentials / have not checked eligibility.','該当なし／その他の資格のみ／出願資格を未確認'],
 ['優先找進修部，想邊工作邊讀','I’d prefer continuing education so I can work while studying.','働きながら学ぶため、進修部を優先して探したい'],
 ['有簡章認可的技藝技能競賽獲獎','I have an award from a skills competition recognized in the guide.','募集要項で対象とされる技能競技大会で入賞している']
];
for(let i=0;i<newUi.length;i++)for(const[lang,column]of[['en',1],['ja',2]]){const file='data/'+lang+'/ui.json',key=newUi[i][0],d=doc(file);if(Object.hasOwn(d,key))throw Error('New UI key already exists; inspect before patch '+key);changes.push({id:'GUIDE-UI-'+(i+1)+'/'+lang,group:'guide-ui',kind:'add-json',file,pointer:'/'+esc(key),new:newUi[i][column],expectedAbsent:true});d[key]=newUi[i][column];}
`;
s=s.replace('const after={};',addition+'\nconst after={};');fs.writeFileSync(p,s);
