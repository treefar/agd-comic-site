// Reviewed wording changes: credit recognition is not course exemption;
// do not invent a required syllabus, stamp, receipt or household transcript.
const fs=require('node:fs'),guide=JSON.parse(fs.readFileSync('data/students/guide.json'));
const key=(id,i)=>guide.cards.find(c=>c.id===id).step_details[i].detail;
const original=JSON.parse(fs.readFileSync('data/ja/step-details.json')),ja={},en={};
ja[key('graduation',2)]=original[key('graduation',2)].replace('単位免除や学籍','単位認定や学籍');
ja[key('course-selection',0)]=original[key('course-selection',0)].replace('単位免除、再履修','単位認定、再履修');
ja[key('credit-transfer',0)]='まず新入生、編入生、転科生などの身分を伝え、以前履修した科目の情報や成績資料を持参して相談してください。今期も申請を受け付けているか、適用規定は何かを担当者に確認し、科目名が似ているだけで認定されると判断しないようにしましょう。';
ja[key('credit-transfer',1)]='申請可能期間内に単位認定システムに入力して申請書を印刷し、前籍校の成績証明書原本を用意してください。案内に従って開講部署と所属学科の承認を受け、登録・教務組へ提出して再審査を受けます。オンライン入力だけで完了したと考えないでください。';
ja[key('credit-transfer',2)]='まず単位認定が承認された科目を確認し、今学期の時間割を自分で調整する必要があるかを問い合わせてください。結果が申請内容と異なる場合は申請書と成績証明書を持って確認し、提出や一次審査だけで全て完了したと考えないようにしましょう。';
ja[key('english',0)]='まず入学時のクラス分け結果と、履修済み・単位認定済みの英語や外国語科目を自分のカリキュラムと照合してください。履修免除がある場合は、ほかにどの外国語単位を補う必要があるかを通識教育中心に確認し、免除だけで必要単位を満たしたと考えないようにしましょう。';
ja[key('financial-aid',1)]='担当者が案内した支援策に従い、申請書、在学証明書、医療や失業の証明など、事情に関する書類を準備してください。所得・財産・戸籍に関する資料が必要か、どの形式が必要かも先に確認してから取り寄せましょう。';
ja[key('overseas-study-visit',0)]='学科事務室に見学を希望する分野と渡航可能な時期を伝え、現在海外研修（見学）や短期の移地教学（現地での授業）があるかを確認してください。今期の予定を確認してから計画を立て、過去の展演キャンプや交流写真を現在の募集と受け取らないようにしましょう。';
en[key('credit-transfer',0)]='State whether you are a new student, transfer student, a student changing departments, or have another status, and bring information about previous courses and grades. Ask whether applications are still open and which rules apply; similar course names do not automatically mean credits can transfer.';
en[key('credit-transfer',1)]='During the application period, complete the credit transfer system, print the form, and prepare the original transcript from your previous school. Follow the notice to obtain approval from the course-offering unit and your department, then submit it to the Division of Registrar and Curriculum for further review; online entry alone is not completion.';
en[key('credit-transfer',2)]='Check which credits have been approved, then ask whether you need to adjust this semester’s timetable yourself. If the result differs from your application, bring the application form and transcript to ask; submitting documents or passing the first review does not finish the process.';
fs.writeFileSync('data/ja/editorial.json',JSON.stringify(ja,null,2)+'\n');fs.writeFileSync('data/en/editorial.json',JSON.stringify(en,null,2)+'\n');console.log('Reviewed language edits:',Object.keys(ja).length,'Japanese,',Object.keys(en).length,'English');
