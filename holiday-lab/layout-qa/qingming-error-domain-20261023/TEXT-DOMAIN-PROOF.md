# 清明來源綁定文字投影

此文件延續 `recovered-domain.json` 的1115原證據，不覆寫其當時 `all_legal_joint_states_proven=false`。新的範圍是來源因果導出的有限文字投影；物理軌跡與結果 JSON 仍無上限。

## source 閉包

`text-projection.cjs` 對 game/runner/catalog/lab.css 四份原bytes逐SHA比對；game再經AST稽核全部UI文字寫入。任何新write、別名write、動態字串、改callback、改CSS selector都因來源漂移拒絕，不能默默沿用本證明。

遊戲內 status 初始一次、setText三次，四種都是三語literal W。hint寫入兩次，都是literal。draw只更新sprite transform及 `setProgress(s.phase,3)`。時間、ticks、resets、path、captures、x/y/vy沒有進入任何遊戲內文字。result-artifact是不同頁面的無上限owner，未納入本投影。

runner工廠每個slider output以input.value回填；input listener只更新output及呼叫 `draft[k]=v`；stepper先以Number加減step、min/max夾限，寫回range input後再取input.value。angle/length/tension各自source-bound min/max/step為[-30,30,1]、[50,150,1]、[0,1,.02]，候選61/101/51；不能把valid(c)接受的連續API輸入當成實際使用者range格點。

因此使用者格點數是61×101×51=314211。瀏覽器對浮點加減的range正規化尚未實測；pilot逐213直接輸出與420真stepper輸出核對，未通過前不宣稱原生輸出字串全集已證。

## error status的精確聯合模式

當missed-window被寫入，frame已設running=false，phase仍為0、1或2。以後保持該status的操作如下：

| phase | 合法hint | pause |
| --- | --- | --- |
| 0 | blurb、retry、paused | 只有paused=true |
| 1 | next、blurb、retry、paused | 只有paused=true |
| 2 | next、blurb、retry、paused | 只有paused=true |

共11模式。每個模式都有合法建構路徑：phase0先自然miss得到blurb；phase1/2正常成功換段留下next，再自然miss；miss後按retry保留error status但hint=retry；miss後pause再resume令hint=blurb；最後pause令hint=paused。phase0無法有next，paused hint無法與pause=false並存。這兩種不合法組合已列拒絕測試。

miss後可用真range或stepper任意設定三個值，因running=false，不觸發物理advance；只變draft與各自output，不改status/hint/progress。paused模式要先設定三軸再pause。音訊開關只變toolbar字串與muted，可獨立切兩態。因此error文字聯合模式可分解為11×314211×2=6912642/context。此為來源閉包與合法UI操作序列的文字域，不是物理狀態數。

一般遊戲內status則phase0允許初始/放飛/miss，phase1/2允許換段/放飛/miss；乘相應hint模式得33文字模式。只有放飛status可處於running=true；這不增加字串。`all-game-domain.cjs`由上述模式逐筆產出，不手填33。

## 由文字域到排版極值的剩餘義務

CSS固定grid track、每個slider自己的nowrap flex row、output min-width44/tabular-nums，沒有依物理變數或其他output內容改樣式的selector。sprite在固定aspect-ratio stage內absolute，不改控制列flow。hint與toolbar可能改整個layout的y位置；不能把不同位置當成不同字形墨跡，也不能因此略過真viewport可見性。

source因果只證明字串分解；native pilot還必須驗213個output值的固定row geometry與computed font。若一個值令row geometry改變，拒絕分解方案，保留失敗，重新分析影響。pilot不計canonical credit。

pilot通過後，完整正常UI計畫由每軸全部值、其他軸固定基線產211個不重複組合，加其餘21個hint/phase/audio模式的基線，共232/context、1392配置。每次必存full sample nodes/blockers/flags，針對目標owner取得真viewport PNG、CDP font、Range全文、安全區與unclipped ink；按實際墨跡面積擇極值。不能用字數或213候選表直接選error-longest。

目前僅有pilot工具，禁止full。完整1392配置的執行器與root-facing原生結果verifier，要在pilot結果證明字串及row分解成立後才可實作並由主控再審。
