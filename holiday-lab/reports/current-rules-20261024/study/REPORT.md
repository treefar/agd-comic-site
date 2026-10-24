# 專題製作／繼續升學當期資料補查

查核日期：2026-10-24，台灣09:29至09:40。此批僅產出研究與提案，沒有修改產品、切換分支、commit或執行任何遊戲。本次未重新執行四項PROGRAM研究。

結論：本次取得新的「實讀時間」與原附件證據，但沒有取得足以解除五項待確認的新版規章。公開專題文件仍是舊版，二審／三審仍衝突；兩處現掛116A1的原PDF逐位元相同，書審100%／口試文字矛盾也仍存在。不得將以下檔案完整性驗證27 yes視為校規已核通過。

| 驗收問題 | yes／no | 本次證據與處理 |
| --- | --- | --- |
| 已取得可正式套用本屆的專題辦法？ | no | 官網常用表單連到公開專題夾，只有三份DOCX。辦法標題第十二屆，末次列108/12/30修訂。三份原檔均與10/23保存檔相同，沒有本屆適用公告。 |
| 換組二審／三審已有正式統一解釋？ | no | 變更單明寫二審前；分組單及辦法伍3、伍5寫三審前。保留兩者，不擇一改成正式期限。 |
| 已核本屆評分、補審與交件清單？ | no | 舊辦法陸有審查表、柒有補審最高60分等條文，但無本屆適用證據，不能把比例、日期或舊基金直接套給現屆。 |
| 116設創碩甄口試矛盾已有正式更正？ | no | 招生處與設創所現掛PDF同SHA，且與10/23實讀PDF同檔。實體第16頁／印刷第15頁仍有書審100%及規定事項1口試文字。所方9/30招生公告寫書審，但沒有明示更正或免口試。 |
| 此次實讀官方索引已列116碩士班入學考試A4？ | no | 主索引與實際lt=A4連結回傳的全類別表，均僅見115A4及114A4；116僅A1。不猜下載網址，也不據此宣稱全校絕無另行公告。 |
| 已保存本次公開附件、正文觀察及版本？ | yes | 三份DOCX、兩處116A1、兩份HTML索引、公開文章DOM摘要與來源鏈均已落地。正式適用性與技術完整性分開。 |

## 專題文件：版本與原檔

來源鏈：系網[常用表單](https://www.dgd.stu.edu.tw/常用表單/) → [系上檔案入口](https://sites.google.com/stu.edu.tw/agdfiles) → 學生事務 → [畢業專題公開夾](https://drive.google.com/drive/folders/1uf3wk07YaDIaPh_17k6EcAeLIjaxnKJU)。本次只讀取這個已觀察夾內三個已知公開檔案；沒有搜尋私人Drive、登入或聯絡校方。

| 實讀附件 | 附件可見版本／修改時間 | 本次原檔SHA-256 |
| --- | --- | --- |
| [實施辦法](https://drive.google.com/file/d/1lHHnqQbemUHO1nLFkomA4DpCMzlbrCPd/view) | 108/12/30修訂；Drive modified 2020-09-12T09:58:19.957Z | ae74a73c10ef065816666117bd0e758e4307231139cad5183f8070455862f9f6 |
| [分組申請單](https://drive.google.com/file/d/1MqBk9XK23qfkTdgmBIFpfs1Mxjrxw2al/view) | 未標適用屆別；Drive modified 2018-11-08T03:40:35.863Z | 2d2b3eb1a4085fd753a8246f79ca30731f8ac04595bafdb1a20342a47ccf5a37 |
| [分組變更申請單](https://drive.google.com/file/d/1Ie-hbKZsLXPOnBQSVj4kK2w5q0WGGWWz/view) | 未標適用屆別；Drive modified 2018-09-29T13:09:01.394Z | bd56ef2e273917f743ec9bd053fbb12e53151932abb4a87bbd504166ab1caeb3 |

讀取範圍含辦法壹至捌、陸審查表及兩張表單全文。全文保存在`raw/capstone-*-fetch.json`，原DOCX保存在同目錄；Drive修改時間與文件正式修訂日期分開記錄。舊辦法六次審查與補審條文僅作版本衝突證據，不當作本屆規定。仍缺：本屆適用文件、各次審查日程／評分表、補審公告、交件與展演／授權核對表。

## 升學文件：現掛附件仍未變更

本次重新下載[招生處116A1](https://info.stu.edu.tw/attachfile/upload/IRS/file/116A1.pdf)，以及所方原生Chrome公告實際指向的[設創所116A1附件](https://wpc.stu.edu.tw/wp-content/uploads/sites/155/2026/09/116A1%E7%A2%A9%E5%A3%AB%E7%8F%AD%E6%8B%9B%E7%94%9F%E7%B0%A1%E7%AB%A0.pdf)。兩者2950775 bytes，SHA皆為`abd281ac6eef570d8e0acfd4d62d5906992c5a68241f9e3c1963502d8557e942`，且與10/23已實讀、保存畫面的原PDF相同。本次重用既有全文擷取及畫面，不冒稱新做整份渲染。

同一設創所頁面仍顯示書面資料審查100%，規定事項1又要求研究計畫書及口試。設創所2026/9/30公告列的甄試項目是書面資料審查，三類資料與簡章一致，但未標「更正」或明說免口試。正文讀取與網址存於`native-observations.json`。該文章直接HTTP抓取為202、0 bytes，已保留失敗收據；成功正文證據是原生Chrome文章DOM，不以空HTML充當正文。

實讀[主簡章索引](https://info.stu.edu.tw/aca/newirs/qryIRSpdf/qryIRSCourse.asp)及其真實[碩士班考試選單href](https://info.stu.edu.tw/aca/newirs/qryIRSpdf/qryirsCourse.asp?lt=A4)。後者實際仍回傳全類別表，不能稱為已獨立篩出A4的頁面。兩份當前連結清單均無116A4，保留「本次未找到」，不把115A4當116用。

補充站內限定搜尋僅得到多筆舊115招生公告，沒有找到可解除矛盾的正式更正。搜尋陰性不是未公告的充分證明；範圍、查詢字與限制保存在`native-observations.json`。當屆非公開公告、校務系統與師生群組不在本次可讀範圍內。

## 可套用提案

`proposal.json`只有三個精確replace：`/cards/6/warning`、`/cards/6/faq/1/a`、`/cards/12/warning`。before逐筆對當時實際指南核對，after分別51、63、61字。保留原大流程與既有來源入口，只讓學生知道有何版本差異、何事須確認；不新增日期、評分比例或免口試結論。

若主控套用，需同步全部英日字典key引用；本代理未改產品與未譯寫新正式名稱。原baseline不重寫，後續其他卡片修正不影響三個精確before。

## 實際驗證

在`C:/agywork/agd-holiday-prototypes`執行：

```text
node holiday-lab/reports/current-rules-20261024/study/run.cjs
```

該腳本實際呼叫`verify.cjs`，stdout為逐條JSON，27 yes／0 no；stderr空字串；exit code 0。`command.json`保存完整指令、cwd、起訖時間、stdout、stderr與exit code，`verification.json`保存逐項結果。檢查含附件byte／SHA／簽章、與舊原檔相等、兩種期限文字、PDF同頁矛盾綁定、索引實際連結、提案精確before及長度；HTTP202空本文的yes僅代表收據與空檔一致，並不代表取得正文。

未執行Build、UI、三語或手機回歸：本次沒有程式或產品變更，且主控要求研究收斂。本次所有輸出均在指定study目錄；未操作節日遊戲、Unity、生成素材、main、push、刪檔或C節。
