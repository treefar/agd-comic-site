# 第二個有界先導：AST原文擷取，未批准全集

範圍：原120數值tuple×六context，最多720候選；另用原10真例作校準，不新增訊息全集。舊37.059秒與5.786小時估計、CORS失敗證據均保留。

擷取單位為Babel AST statement的原始start/end source slice，存原範圍、原文、SHA。保留原字型／grapheme Range／baseline所有拒收與fallback／sx sy／stroke／Canvas ink／clip／safe mapping／cleanup，禁止改寫公式或閾值。新函式僅省去跨候選不變的素材重新HTTP下載雜湊，以及沒有控制項／圖片的技術probe中不相關paint/blocker掃描；不稱完整UIgate。

素材收據必須來自同源clone上的完整frozen sampler，批前後重新執行完整函式、比對來源／原skin與tiled SHA；每候選仍核對CSS背景URL／九宮格參數、computed字型／間距／換行／transform／padding／border與寬、無控制項或圖片、純文字node及可達字元集合。每候選的高度、Range、baseline、clip及safe隨字串重新算。HTML/CSS源、系統字型原檔與全允許字元CDP在批前後重核，不能只假設不變。

逐候選對比上一批完整函式的相對Range、baseline、ink、safe、行數、computed字型；10例另對真DOM結果及CDP實際字型。任何不一致、空safe、NaN、原拒收條件遺漏或字型漂移即停止NO，不跑下一context或全集。第一批720沒有逐筆CDP存檔，因此不能回填舊CDP；新批逐筆CDP並與原10例和全字元批次字型對照，此限制須揭露。

profiling使用browser performance.now量核心函式、Node wall-clock量含RPC總耗時，以及完整frozen呼叫的Resource Timing；不預設HTTP或RAF是主要瓶頸。最差餘裕witness在每context再用完整frozen重驗。若快到推估數十分鐘，可交主控分批、checkpoint與獨立重跑方案；仍不自啟全集。
