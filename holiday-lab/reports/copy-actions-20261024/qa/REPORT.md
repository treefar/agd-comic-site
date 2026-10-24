# 8882兩項動作翻譯：獨立窄驗

2026-10-24。新候選 `http://127.0.0.1:8882/`、`.measure-copy-actions-20261024-01`、360檔、`app-R7TGU7Q2.js`。fresh `raw-r1`只跑一次EN／JA各390與1440四組；**44 yes／0 no，實際exit 0**。

兩個key的四個新語言值在畫面上都完整可見：分級後免修課程、返校手續與成果交件分開；舊錯譯全文沒有出現在可見文字。8張直接WebP已逐張查看。8881未開啟、未重啟，產品、Build、branch與其他代理資料未寫入。

## 逐組結果

| 語言／寬度 | yes | no | 畫面 |
| --- | ---: | ---: | --- |
| EN390 | 11 | 0 | raw-r1/en-390-graduation-faq.webp、en-390-overseas-return-step.webp |
| EN1440 | 11 | 0 | raw-r1/en-1440-graduation-faq.webp、en-1440-overseas-return-step.webp |
| JA390 | 11 | 0 | raw-r1/ja-390-graduation-faq.webp、ja-390-overseas-return-step.webp |
| JA1440 | 11 | 0 | raw-r1/ja-1440-graduation-faq.webp、ja-1440-overseas-return-step.webp |
| 合計 | 44 | 0 | 4組、8個實際目標文字觀察、8張直接WebP |

每組11條是：語言正確、畢業FAQ新譯文可見、該舊譯文不見、海外返校步驟新譯文可見、該舊譯文不見、全頁可見舊句不見、無水平溢位、無U+FFFD、iframe0、console／pageerror／HTTP錯誤0、遊戲請求0。沒有重跑導覽、搜尋、其他卡、首頁或任何遊戲功能。

## 精確動作與來源差異

| 核對項目 | yes／no | 實際證據 |
| --- | --- | --- |
| TR01 EN分級後免修課程 | yes | `placement-based course exemptions`在graduation相符FAQ答案可見，整段等於經審閱after。不是免做分級。 |
| TR01 JA分級後免修課程 | yes | `習熟度判定に基づく履修免除`在同一FAQ答案可見，`クラス分け免除`舊全文未出現在可見內容。 |
| TR02 EN返校報到與成果交件 | yes | 海外實習第3步實際為`report back to the university and submit the required outcomes afterward, as specified by the project`，保留依計畫條件。 |
| TR02 JA返校程序與成果交件 | yes | 同步驟`帰校手続きと成果提出`可見，保留`計画に従って`；未新增必須親自到特定處所或新期限。 |
| 與8881原47source比較 | yes | 僅`data/en/flow-ui.json`、`data/ja/flow-ui.json`、`locale-en.js`、`locale-ja.js`四檔SHA不同；每語言正好兩個key，值精確等於獨立語意提案before／after。其他43source與canonical guide原SHA相同。 |
| 生成locale只有預期兩值 | yes | 兩語各反向替換兩值後，位元組SHA精確還原8881原locale；未用換行正規化掩蓋差異。 |
| 新舊bundle四值反向還原 | yes | 新`app-R7TGU7Q2.js`反向替換四個after成before，可精確還原8881 `app-NOKAZJIM.js`原SHA；不只是聲稱code diff小。 |
| 新舊Build其他檔差異 | yes | 360對360；共同改動僅兩份flow-ui與index的app檔名；舊app移除於新候選清單、新app新增。8881原建置並未刪檔或修改。293圖像／字型檔SHA相同。 |
| 前後SHA守門 | yes | 47source／360build完整清單執行前後相同；最後純收據驗證再重算當時實檔也相同。 |
| 服務內容對應凍結候選 | yes | 前後各9個index／guide／flow-ui／JS／CSS回應，共18份HTTP200；回應SHA均等於指定build原檔。沒有打8881。 |
| 四組溢位／替代字元／錯誤 | yes | documentWidth分別390／1440，等於viewport；U+FFFD false、iframe0、console／pageerror／HTTP>=400均空。 |
| 來源與原始證據保留 | yes | 8881原`qa/ja-source-r3/result.json`SHA不變，舊收據未覆寫；沒有其他產品source變動。 |
| 瀏覽器及本次QA程序結束 | yes | finally內await browser.close後才記成功result；run命令exit0；實際程序查詢`COPY_QA_RUNNING=0`。兩個本機server均未停止或重啟。 |

基準：`C:/agywork/agd-holiday-prototypes/holiday-lab/reports/guide-final-docs-20261024/qa/ja-source-r3/result.json`。語意對照：`C:/agywork/agd-holiday-prototypes/holiday-lab/reports/goal-audit-20261024/translation-review.json`的四項`proposed_changes`。這兩份只讀，hash記在raw result。

canonical guide仍為15卡47步56FAQ89sources；本次不是重新展開所有15卡驗數量，而是canonical guide SHA與原凍結版相同：

```text
data/students/guide.json
83fd03e1ec3a2aae48f8455473ed3a37eb2b8446a54649f62ea1f6754a0f7a19

new app-R7TGU7Q2.js
efe0b5eaa84ceaca4e183cf612214231a5ef56945c0bdac8ffa18926275e46a6

reversed new bundle == original 8881 app-NOKAZJIM.js
1775ddeabec3c17c579bcfc12cf5a897791897e4bdd3d85adbf84c0f78c53224
```

## 實際命令與stdout／stderr

執行目錄 `C:/agywork/agd-holiday-prototypes`。完整執行器、參數、時間、stdout／stderr與exit在`raw-r1-command.json`；`raw-r1/result.json`保存每條yes／no、目標實際文字、HTTP綁定及47／360兩份完整SHA清單。

```text
node holiday-lab/reports/copy-actions-20261024/qa/run.cjs http://127.0.0.1:8882/ .measure-copy-actions-20261024-01 raw-r1 --freeze-ready

stdout:
PASS en 390 11/11
PASS en 1440 11/11
PASS ja 390 11/11
PASS ja 1440 11/11
{"pass":true,"contexts":4,"yes":44,"no":0,"source_files":47,"build_files":360,"source_stable":true,"build_stable":true,"browser_closed":true,"bundle_reversed":true}
stderr: (empty)
exit code: 0
```

最後純收據驗證沒有新開browser或發HTTP：

```text
node holiday-lab/reports/copy-actions-20261024/qa/verify.cjs
stdout: pass true, 11 yes, 0 no
stderr: (empty)
exit code: 0
```

此命令實際由Node spawnSync執行並保存於`verify-command.json`，逐項實際結果在`verification.json`。8張WebP原件SHA、RIFF／WEBP格式、服務綁定、bundle還原與目前實檔SHA另被重算，未重新跑四組。準備階段只有兩支`node --check`，stdout／stderr空、exit0，記在`prepare-command.json`；不把syntax當UI通過。

實際程序查詢（唯讀）：

```powershell
$copyQaProcesses=Get-CimInstance Win32_Process -Filter "Name='node.exe'" | Where-Object {$_.CommandLine -match 'copy-actions-20261024[\\/]qa[\\/](check|run)\.cjs'}
Write-Output "COPY_QA_RUNNING=$(@($copyQaProcesses).Count)"
# stdout: COPY_QA_RUNNING=0
# stderr: (empty), exit 0
```

原始UI執行一次即完成，沒有candidate方法失敗或重跑。準備前曾因目標copy-actions目錄尚未建立而使一個只讀Get-ChildItem命令exit1；不當產品失敗、不拿它冒充候選驗收。準備後只在本QA目錄建立腳本與收據。

## 限制與停止

此通過只涵蓋兩個動作文字及其四context呈現／精確來源差異。沒有宣稱全部翻譯母語核定、每字實際fallback、實體手機、所有指南政策當期性、全站回歸或發布批准。沒有進遊戲、Unity、生成素材、main、push、刪檔或C節操作。原未驗／外部依賴維持既有紀錄。

本代理只擁有此QA目錄；產品變更由執行代理與主控處理。本組完成後停止，保留8881使用者頁面及8882候選服務。
