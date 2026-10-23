# 真實背景分頁補驗：仍未知

source_agent: codex。2026-10-23。分支codex/real-tab-pause。沒有改遊戲產品、發佈、main、C節或勞動節。

以Chrome直接開8866年獸遊戲，跳過開場、開始創作後觀察角色呼吸。另開進度頁再讀遊戲，三次都回hidden=false、visibility=visible，不能由分頁看似切換推論隱藏。初次read-only查document.hasFocus()工具不支援，刪除該唯讀欄位後取得實際DOM；未改瀏覽器屬性。

因此再建一個只在127.0.0.1:8868運作的QA iframe觀察頁，原產品所有請求原封代理8866；每100ms讀parent/child可見性、角色inline style與暫停／進度。只監聽真visibilitychange，不覆寫hidden，不改角色／遊戲狀態。另開首頁後按「整理觀察紀錄」，35秒353樣本、246角色樣本、244不同style；真事件0、hidden樣本0。仍無可證明背景停止／返回繼續的區間。

結果為unknown，不是遊戲失敗，也不是通過。原release的12yes／1unknown保持。摘要observed-summary.json由工具實讀結果照錄；完整353樣本僅在工具輸出顯示，未保存完整raw，不拿摘要冒稱完整run。測試頁已關閉、僅本輪新QA server91455已Ctrl-C停止；原8866服務持續。

| 驗收 | yes／no | 實際結果 |
|---|---|---|
| 新觀察頁與原遊戲狀態分離 | yes | fixture只讀iframe DOM，server代理現有8866 |
| 捕捉到真hidden事件 | no | events=[]，hidden_samples=0 |
| 背景凍結與返回動畫有完整證據 | no | 缺真事件，不建立pass收據 |
| 未注入hidden／未改產品 | yes | fixture.html可讀，visibility_overridden=false、game_state_modified=false |
| 驗證器能拒絕假通過 | yes | 1個明標合成正例＋10負例，共11通過；不是11次瀏覽器試玩 |
| 全域UI／發布批准 | no | public_release/full_project_approved均false |

實際指令：

```text
node --test holiday-lab/reports/real-tab-visibility-20261023/verify.test.cjs
tests11; pass11; fail0; skipped0
exit0

node holiday-lab/reports/real-tab-visibility-20261023/serve.cjs
VISIBILITY_QA http://127.0.0.1:8868/__visibility_qa__.html -> unchanged 8866
（獨立session91455；觀察完成後Ctrl-C）
```

後續需能產生真正visibilitychange的前景瀏覽器操作及完整事件raw，不能靠合成事件或改document.hidden封閉這一項。這次新事件證據0，暫停此驗證途徑，不反覆重啟相同方法。
