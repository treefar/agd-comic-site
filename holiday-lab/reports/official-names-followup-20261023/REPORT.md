# 正式名稱落地與指南現行規章補研

source_agent: codex。2026-10-23。本輪延續全面試作，禁止push／發布／main／刪檔／C節操作，勞動節暫緩。首頁以既有學生作品審閱版維持，沒有擴大美術。

## 已有具體成果

- 獨立分支codex/official-guide-names，作者產品80f280596bd5bbd13aff519f10ca452a05a44979／文件0da385c6a9f71f7eeccc79065deb4432f13861ec：10英文Student Assistance Section名稱＋2日文「技術士證」（台湾の技能検定資格）片段。只改4資料＋2locale，原12語意修正、4PROGRAM與CSS/中文保留。新phase21／21通過，舊phase4條『其他16必須不變』依合法新delta真失敗，原測試不改；新phase對兩批24值／其他所有keys做完整比較。
- 8867先供獨立驗收：C:/agywork/agd-plain-guide-copy/.measure-official-guide-names-20261023-01，360檔；root新啟session81616，沒有重啟8866。作者freeze-v3.json才是manifest，freeze.json為先前同名命令收據。
- PROGRAM研究補到原生115員額表與6份官方簡章：本系一般單招30名、已截止。不是『未列本系』；書審／晚間輔週末不等於所有學制固定面試與18:30–21:30。四值新候選及其他相依欄位見program-currentness-20261023/REPORT.md，尚未套用，避免摘要和同頁舊欄位互相矛盾。
- 選課／抵免／請假／休復學／轉系第一版已交24步15FAQ。另從教務處法規真href發現現行抵免1140910、選課1140219、休學1120426、轉系1140219與學則1150202／離校1150610，兩代理分讀原文補第二版，不覆寫首版收據。
- 畢業檢核／獎助急難／校內協助／就業資源四題另由一代理補研。新增轉系會另列審閱提案，不自行改既有15卡資訊架構。
- 真背景暫停Chrome另試：觀察頁35秒353樣本，真hidden事件0；保持unknown。沒有注入hidden或將11個驗證器測試當真UI通過，細節real-tab-visibility-20261023/REPORT.md。

## 完成條件與證據狀態

| 條件 | yes／no | 證據或下一步 |
|---|---|---|
| 作者12名稱有精確delta＋原文／其他keys保持 | yes | 作者21tests與新preimage，root將在合併前檢查diff |
| 12名稱與前12語意都在實際UI到達 | 待獨立最終報告 | 不借作者自述或8866舊收據 |
| 主工作樹已整合新名稱 | no，尚待獨立報告 | 不先改8866凍結build |
| 四PROGRAM與相依欄位全部修好 | no | 新候選只研究，產品仍待完整一致性實作 |
| 15指南題現行原文及新文案都已套用 | no | 草稿與產品分開，現行新母法補讀中 |
| 真背景hidden驗收完成 | no | 原工具12yes／1unknown保持 |
| 全部公開上線／使用者畫面確認 | no | 不在本輪批准範圍 |

## 指令輸出

後續root唯讀重核、合併保存與儀表板原始command JSON將放本目錄root/；每次保留實際stdout、stderr與exit code。作者及獨立原始資料不覆寫，研究首版與補件各列原適用範圍。

## 關機前最終狀態

作者名稱已獨立8組／48次可見觀察／60PNG通過；root在peer工作目錄唯讀核對exit0後，本機merge d234fc4f3b3297be1f4411e714a8c2eedeb59674。上表原「待驗／未合」為當時checkpoint，現已完成此兩項。原研究首版與補件分開保存；補件100yes／0no只驗文件證據，不批准全部現行規章。四題協助／生涯草稿仍未完成。

第一次整合exit128（長路徑及locale dirty）；Git回復覆寫4份原dirty，已從f7e62206a266093fe076a24ef66ef0f1e78e9cb7恢復4/4原SHA。v1方法／實際錯誤與恢復原檔全部保留；v2加core.longpaths=true及失敗復原守門，成功合併、fsck0。詳見root/integration-commands.json、integration-r2-commands.json、integration-result.json與dirty-recovery/。root第一次唯讀cwd錯誤收據保留；peer cwd重核才是有效exit0。

使用者要求暫停關機，所有後續研究已停止，不宣告整體目標完成。最新小颯首頁另見shutdown-20261023/REPORT.md。
