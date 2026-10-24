// Export review suggestions; retain Chinese policy/document titles.
const fs=require('fs'),path=require('path'),d=__dirname,p=JSON.parse(fs.readFileSync(path.join(d,'proposal.json')));
const pairs=[];
for(const op of p.operations){
 if(typeof op.after==='string'&&op.translations)pairs.push({zh:op.after,...op.translations});
 if(Array.isArray(op.translations))for(const x of op.translations)for(const k of ['q','a'])pairs.push({zh:x.zh[k],en:x.en[k],ja:x.ja[k]});
}
const sourceTr=[
 ['學生校外實習辦法 (university internship rules)','學生校外實習辦法（全学の学外実習規則）',
 'The full rules currently listed by the university have been checked. Departments still determine placement, duration, assessment and alternatives; these rules do not confirm the department’s current cohort requirements.',
 '現在大学が掲載している規則の全文を確認しました。実習先・期間・評価・代替方法は各学科が定めるため、本学科の現学年の細則を確認済みという意味ではありません。'],
 ['學生校外實習施行細則 (university internship procedures)','學生校外實習施行細則（全学の実習実施手続き）',
 'The listed university procedures have been checked in full, including agreements, individual plans, insurance, reports and evaluation. Departmental deadlines and assessment weights still require confirmation.',
 '掲載中の全学細則の全文を確認し、契約・個別計画・保険・報告・評価を照合しました。学科の期限と現学年の成績配分は別途確認が必要です。'],
 ['學生校外實習說明 (student application and submission guide)','學生校外實習說明（学生向け申請・契約・提出案内）',
 'The listed application route and submission instructions have been checked. ROC 113 wage figures and insurance-year information are not current standards. Confirm the actual portal screens and current cohort checklist with the coordinator.',
 '掲載中の申請経路と提出案内を確認しました。民国113年の賃金額や保険年度を現在の基準には使いません。実際のシステム画面と現学年の提出一覧は担当者に確認してください。'],
 ['校外實習轉換／停止實習機構申請表 (placement change or termination form)','校外實習轉換／停止實習機構申請表（実習先の変更・中止申請書）',
 'The blank form and its student → supervisor → department chair approval sequence have been checked. The department must confirm current cohort applicability and how completed hours are treated.',
 '空白申請書の全文と学生→指導教員→学科長の申請順序を確認しました。現学年への適用と実施済み時間の扱いは学科に確認してください。'],
 ['本校學海築夢專案計畫甄選要點 (university rules for overseas internship projects)','本校學海築夢專案計畫甄選要點（海外実習計画に関する学内選考規則）',
 'The listed university rules have been checked in full. They govern project selection, not the department’s current ROC 115 student recruitment or an individual grant agreement. Award amounts and new-round conditions require separate confirmation.',
 '掲載中の学内要点の全文を確認しました。これは大学の計画選考規則であり、本学科の民国115年の学生募集要項や個人補助契約ではありません。補助額と新しい募集条件は別途確認が必要です。']
];
for(const [i,s]of p.new_sources.entries()){
 const [enTitle,jaTitle,enRead,jaRead]=sourceTr[i];
 pairs.push({zh:s.title,en:enTitle,ja:jaTitle},{zh:s.readability,en:enRead,ja:jaRead});
}
pairs.push({zh:p.new_sources[0].note,en:'The version currently listed and its applicability to the present cohort are checked separately. Original documents and version evidence are retained in this review report.',ja:'現在の掲載版と現学年への適用は分けて確認します。原文と版の根拠は今回の確認報告に保存しています。'});
pairs.push(
 {zh:'113年10月9日修正通過',en:'Revisions approved on ROC 113/10/9 (2024-10-09)',ja:'民国113年10月9日改訂承認'},
 {zh:'113年9月18日修正通過',en:'Revisions approved on ROC 113/9/18 (2024-09-18)',ja:'民国113年9月18日改訂承認'},
 {zh:'2024年12月5日學生版',en:'Student version dated 2024-12-05',ja:'2024年12月5日学生版'},
 {zh:'現列V3.0空白表；表內未見修訂日期',en:'Currently listed blank form, filename V3.0; no revision date found in the form',ja:'現在掲載中の空白書式。ファイル名はV3.0で、本文に改訂日の記載は確認できません'},
 {zh:'112年9月13日修正通過',en:'Revisions approved on ROC 112/9/13 (2023-09-13)',ja:'民国112年9月13日改訂承認'}
);
const unique=[...new Map(pairs.map(x=>[x.zh,x])).values()];
fs.writeFileSync(path.join(d,'translations.json'),JSON.stringify({status:'review_suggestions_not_official_name_equivalences',notes:['中文專名與文件原名保留；括號只是功能說明。','尚未經母語者簽核；本組不改產品字典。'],pairs:unique},null,2)+'\n');
console.log(JSON.stringify({pairs:unique.length,duplicates:pairs.length-unique.length}));
