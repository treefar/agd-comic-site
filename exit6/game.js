(() => {
  // exit6/game-core.mjs
  var GOAL = 6;
  var LAST_STATION = 7;
  var ANOMALY_RATE = 0.5;
  function mulberry32(seed2) {
    let a = seed2 >>> 0;
    return function() {
      a = a + 1831565813 >>> 0;
      let t = a;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function shuffle(list, rng2) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rng2() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function createGame(anomalies, rng2 = Math.random) {
    return {
      phase: "tour",
      // tour 導覽圈 → loop 循環 → ending 結局
      count: 0,
      // 目前連續答對圈數（顯示成 0F～6F）
      lap: 0,
      // 第幾圈（含導覽圈 0）
      station: 0,
      anomaly: null,
      // 這圈的異常 id，null = 正常圈
      deck: [],
      // 尚未出過的異常（出完才重洗，不重複）
      seen: [],
      // 已收進圖鑑的異常 id
      falseAlarms: 0,
      // 沒異常卻回頭的次數（決定系主任台詞）
      firstCorrectBack: false,
      halfPlayed: false,
      ids: anomalies.map((x) => x.id),
      tiers: Object.fromEntries(anomalies.map((x) => {
        var _a;
        return [x.id, (_a = x.tier) != null ? _a : 3];
      })),
      rng: rng2
    };
  }
  var maxTierFor = (lap) => lap <= 1 ? 1 : lap <= 3 ? 2 : 3;
  function drawAnomaly(s) {
    if (s.deck.length === 0) s.deck = shuffle(s.ids, s.rng);
    const max = maxTierFor(s.lap);
    for (let i = s.deck.length - 1; i >= 0; i--) {
      if (s.tiers[s.deck[i]] <= max) return s.deck.splice(i, 1)[0];
    }
    return s.deck.pop();
  }
  function startLap(s) {
    s.lap += 1;
    s.station = 0;
    if (s.lap === 2) {
      s.anomaly = null;
      return s;
    }
    const forced = s.lap === 1;
    s.anomaly = forced || s.rng() < ANOMALY_RATE ? drawAnomaly(s) : null;
    return s;
  }
  function judge(s, claimedAnomaly) {
    const hadAnomaly = s.anomaly !== null;
    const ok = claimedAnomaly === hadAnomaly;
    const ev = { type: ok ? "correct" : "wrong", anomaly: s.anomaly, voice: null };
    if (ok) {
      s.count += 1;
      if (hadAnomaly && !s.seen.includes(s.anomaly)) s.seen.push(s.anomaly);
      if (claimedAnomaly && !s.firstCorrectBack) {
        s.firstCorrectBack = true;
        ev.voice = "vo_first_correct";
      }
      if (s.count === 3 && !s.halfPlayed && !ev.voice) {
        s.halfPlayed = true;
        ev.voice = "vo_half";
      }
      if (s.count >= GOAL) {
        s.phase = "ending";
        ev.type = "ending";
        ev.voice = "vo_ending";
      }
    } else {
      s.count = 0;
      ev.reason = hadAnomaly ? "missed" : "false-alarm";
      if (!hadAnomaly) {
        s.falseAlarms += 1;
        ev.voice = ["vo_wrong_01", "vo_wrong_02", "vo_wrong_03"][Math.min(s.falseAlarms, 3) - 1];
      }
      if (hadAnomaly && !s.seen.includes(s.anomaly)) s.seen.push(s.anomaly);
    }
    ev.count = s.count;
    if (s.phase !== "ending") startLap(s);
    return ev;
  }
  function step(s, action) {
    if (s.phase === "ending") return { type: "noop" };
    if (s.phase === "tour") {
      if (action === "back") return { type: "tour-hint" };
      if (s.station < LAST_STATION) {
        s.station += 1;
        return { type: "move" };
      }
      s.phase = "loop";
      startLap(s);
      return { type: "tour-done", count: s.count };
    }
    if (action === "back") return judge(s, true);
    if (s.station < LAST_STATION) {
      s.station += 1;
      return { type: "move" };
    }
    return judge(s, false);
  }
  function anomalyAt(s, anomalies) {
    if (!s.anomaly) return null;
    const a = anomalies.find((x) => x.id === s.anomaly);
    return a && a.station === s.station ? a : null;
  }

  // exit6/data.mjs
  var STATIONS = [
    {
      id: "S0",
      narr: { tour: "\u958B\u5B78\u7B2C\u4E00\u5929\uFF0C\u6211\u6309\u4E0B 6 \u6A13\u3002\u807D\u8AAA\u52D5\u904A\u7CFB\u7684\u5927\u5BB6\u90FD\u5728\u9019\u4E00\u5C64\u3002", loop: "\u2026\u2026\u53C8\u662F\u96FB\u68AF\u3002\u6211\u662F\u4E0D\u662F\u4E00\u76F4\u5728\u7E5E\u5708\uFF1F" },
      name: "\u96FB\u68AF\u5167",
      frames: ["frames/s0_a.webp", "frames/s0_b.webp"],
      still: "frames/s0.webp",
      src: "B 0:09\u20130:13",
      tour: "\u8A2D\u8A08\u5927\u6A13 D \u68DF\uFF0C\u6309\u4E0B 6 \u6A13\u3002\u9EDE\u4E00\u4E0B\u767C\u4EAE\u7684\u5730\u65B9\u8ABF\u67E5\u3002",
      spots: [{ x: 82, y: 3, w: 9, h: 27, label: "\u6A13\u5C64\u986F\u793A", must: true, say: "6 \u6A13\uFF0C\u5230\u4E86\u3002\u7CFB\u8FA6\u5C31\u5728\u9019\u4E00\u5C64\u3002", text: "\u986F\u793A 6\uFF1A\u9019\u88E1\u662F\u8A2D\u8A08\u5927\u6A13 D \u68DF\u516D\u6A13\u3002\u52D5\u904A\u7CFB\u7684\u7CFB\u8FA6\u3001\u5F88\u591A\u9593\u5BE6\u9A57\u5BA4\u548C\u8001\u5E2B\u7814\u7A76\u5BA4\u90FD\u5728\u9019\u4E00\u5C64\u3002" }]
    },
    {
      id: "S1",
      narr: { tour: "\u96FB\u68AF\u9580\u4E00\u958B\uFF0C\u6B63\u5C0D\u9762\u5C31\u662F\u7CFB\u8FA6\u3002\u9580\u4E0A\u8CBC\u8457\u544A\u793A\uFF0C\u5169\u908A\u6709\u6D77\u5831\uFF0C\u5730\u4E0A\u92EA\u8457\u5F69\u7E6A\u5730\u588A\u3002", loop: "\u7CFB\u8FA6\u9580\u53E3\u3002\u544A\u793A\u3001\u6D77\u5831\u3001\u5730\u588A\u2026\u2026\u8DDF\u525B\u525B\u4E00\u6A23\u55CE\uFF1F" },
      name: "\u7CFB\u8FA6\u9580\u53E3",
      frames: ["frames/s1_a.webp", "frames/s1_b.webp"],
      still: "frames/s1.webp",
      src: "B 0:13\u20130:19",
      tour: "\u96FB\u68AF\u4E00\u51FA\u4F86\u7684\u6B63\u524D\u65B9\u5C31\u662F\u7CFB\u8FA6\u3002\u628A\u544A\u793A\u3001\u6D77\u5831\u3001\u5730\u588A\u90FD\u9EDE\u4E00\u904D\u8A18\u8D77\u4F86\u3002",
      spots: [
        { x: 3, y: 13, w: 24, h: 22, label: "\u7CFB\u540D\u7246", say: "\u52D5\u756B\u8207\u904A\u6232\u8A2D\u8A08\u7CFB\u2026\u2026\u4EE5\u5F8C\u56DB\u5E74\u5C31\u662F\u9019\u88E1\u4E86\u3002", text: "\u52D5\u756B\u8207\u904A\u6232\u8A2D\u8A08\u7CFB\uFF08Department of Animation and Game Design, STU\uFF09\u3002\u7CFB\u8FA6\u5C31\u5728\u96FB\u68AF\u6B63\u524D\u65B9\uFF0C\u65B0\u751F\u6709\u554F\u984C\u5148\u4F86\u9019\u88E1\u554F\u3002" },
        { x: 54, y: 24, w: 9, h: 23, label: "\u9580\u4E0A\u544A\u793A", say: "\u300C\u8ACB\u52FF\u56DE\u982D\u300D\uFF1F\u8CBC\u5728\u7CFB\u8FA6\u9580\u4E0A\u6709\u9EDE\u795E\u7955\u3002", text: "\u300C\u8ACB\u52FF\u56DE\u982D\u300D\u3002\u8A18\u4F4F\u5B83\u5BEB\u4EC0\u9EBC\u3002" },
        { x: 27, y: 16, w: 12, h: 30, label: "\u5DE6\u5074\u6D77\u5831", say: "\u5DE6\u908A\u9019\u5F35\u85CD\u8272\u6D77\u5831\uFF0C\u69CB\u5716\u597D\u6709\u6C23\u52E2\u3002", text: "\u9580\u5DE6\u908A\u662F\u4E00\u5F35\u85CD\u8272\u6D77\u5831\u3002\u8A18\u4F4F\u5B83\u5728\u5DE6\u908A\u3002" },
        { x: 0, y: 76, w: 100, h: 24, label: "\u5F69\u7E6A\u5730\u588A", say: "\u597D\u53EF\u611B\u7684\u7E6A\u5716\uFF0C\u9023\u5730\u588A\u90FD\u662F\u4F5C\u54C1\u3002", text: "\u9580\u524D\u7684\u5F69\u7E6A\u5730\u588A\uFF0C\u8A18\u4F4F\u4EBA\u7269\u6392\u5217\u7684\u65B9\u5411\u3002\uFF08\u5F85\u8001\u5E2B\u88DC\u5145\uFF1A\u5730\u588A\u4F5C\u8005\uFF09" },
        { x: 53, y: 52, w: 10, h: 16, label: "\u7CFB\u8FA6\u59D4\u8A17", must: true, say: "\u7CFB\u8FA6\u585E\u7D66\u6211\u4E09\u6A23\u6771\u897F\uFF0C\u5E6B\u5FD9\u9001\u4E00\u4E0B\u597D\u4E86\u3002", action: "takeItems", text: "\u7CFB\u8FA6\u62DC\u8A17\u4F60\u9001 3 \u4EF6\u6771\u897F\uFF0C\u5DF2\u7D93\u653E\u9032\u624B\u5E33\u3002\u6BCF\u4EF6\u53EA\u5BEB\u4E86\u7528\u9014\uFF0C\u8981\u81EA\u5DF1\u60F3\u60F3\u8A72\u9001\u5230\u516D\u6A13\u54EA\u88E1\u3002" },
        { x: 66, y: 14, w: 21, h: 30, label: "\u53F3\u5074\u6D77\u5831", say: "\u53F3\u908A\u5169\u5F35\u5F69\u8272\u6D77\u5831\uFF0C\u662F\u5B78\u9577\u59D0\u756B\u7684\u5427\uFF1F", text: "\u9580\u53F3\u908A\u662F\u5169\u5F35\u5F69\u8272\u6D77\u5831\u3002\u8A18\u4F4F\u5B83\u5011\u5728\u53F3\u908A\u3002" }
      ]
    },
    {
      id: "S2",
      narr: { tour: "\u7A7F\u904E\u4F11\u606F\u5340\uFF0C\u662F\u4E00\u689D\u5730\u677F\u756B\u6EFF\u5F69\u7E6A\u7684\u5929\u6A4B\u3002", loop: "\u5929\u6A4B\u5230\u4E86\u3002\u5730\u677F\u4E0A\u7684\u756B\uFF0C\u6709\u4EC0\u9EBC\u4E0D\u4E00\u6A23\u55CE\uFF1F" },
      name: "\u5929\u6A4B\u5730\u677F\u5F69\u7E6A",
      frames: ["frames/s2_a.webp", "frames/s2_b.webp"],
      still: "frames/s2.webp",
      src: "B 0:30\u20130:40",
      tour: "\u7A7F\u904E\u4F11\u606F\u5340\u5C31\u662F\u5929\u6A4B\u3002",
      spots: [{ x: 3, y: 56, w: 36, h: 24, label: "\u5730\u677F\u5F69\u7E6A", must: true, say: "\u6574\u7247\u5730\u677F\u90FD\u662F\u756B\uFF0C\u8E29\u4E0A\u53BB\u6709\u9EDE\u6368\u4E0D\u5F97\u3002", text: "\u5929\u6A4B\u4E0A\u7684\u4E00\u5927\u7247\u5730\u677F\u5F69\u7E6A\uFF0C\u4E0A\u9762\u4EC0\u9EBC\u90FD\u6C92\u653E\u3002\uFF08\u5F85\u8001\u5E2B\u88DC\u5145\uFF1A\u5F69\u7E6A\u7531\u4F86\uFF09" }]
    },
    {
      id: "S3",
      narr: { tour: "\u73BB\u7483\u5929\u68DA\u4E0B\u9762\uFF0C\u7ACB\u8457\u4E00\u5EA7\u6728\u982D\u724C\u6A13\uFF0C\u4E0B\u9762\u662F\u7A7A\u7684\u901A\u9053\u3002", loop: "\u724C\u6A13\u9084\u5728\u3002\u4E0B\u9762\u7684\u901A\u9053\u9084\u662F\u7A7A\u7684\u55CE\uFF1F" },
      name: "\u4E2D\u5EAD\u724C\u6A13",
      frames: ["frames/s3_a.webp", "frames/s3_b.webp"],
      still: "frames/s3.webp",
      src: "B 3:30\u20133:39",
      tour: "\u73BB\u7483\u5929\u68DA\u4E0B\u7684\u6728\u9020\u724C\u6A13\u3002",
      spots: [{ x: 31, y: 0, w: 32, h: 80, label: "\u6728\u9020\u724C\u6A13", must: true, say: "\u9019\u5EA7\u6728\u724C\u6A13\u597D\u9192\u76EE\uFF0C\u8FF7\u8DEF\u5C31\u627E\u5B83\u3002", text: "\u516D\u6A13\u6700\u597D\u8A8D\u7684\u5730\u6A19\uFF0C\u724C\u6A13\u4E0B\u9762\u662F\u7A7A\u7684\u901A\u9053\u3002\u5728\u516D\u6A13\u8FF7\u8DEF\uFF0C\u5C31\u5148\u627E\u5B83\u3002\uFF08\u5F85\u8001\u5E2B\u88DC\u5145\uFF1A\u724C\u6A13\u7531\u4F86\uFF09" }]
    },
    {
      id: "S4",
      narr: { tour: "\u8D70\u5ECA\u4E0A\u7684\u5BE6\u9A57\u5BA4\uFF0C\u9580\u724C\u5BEB\u8457 D0604\uFF0C\u65C1\u908A\u662F\u6D88\u9632\u6813\u3002", loop: "\u5BE6\u9A57\u5BA4\u9580\u53E3\u3002\u9580\u724C\u548C\u9580\u4E0A\uFF0C\u6709\u6C92\u6709\u591A\u4E86\u4EC0\u9EBC\uFF1F" },
      name: "D0604 \u96FB\u7E6A\u5BE6\u9A57\u5BA4",
      frames: ["frames/s4_a.webp", "frames/s4_b.webp"],
      still: "frames/s4.webp",
      src: "A 7:16\u20137:26",
      tour: "\u8D70\u5ECA\u4E0A\u7684\u5BE6\u9A57\u5BA4\u9580\u53E3\u3002",
      spots: [
        { x: 42, y: 15, w: 12, h: 12, label: "\u9580\u865F", must: true, say: "D0604\u2026\u2026\u539F\u4F86\u9580\u724C\u662F\u9019\u6A23\u770B\u7684\u3002", text: "D0604\uFF1DD \u68DF\u300106 \u6A13\u300104 \u865F\u623F\u3002\u9019\u9593\u662F\u96FB\u7E6A\u5BE6\u9A57\u5BA4\uFF1A\u7E6A\u5716\u677F\u6559\u5BA4\uFF0C2D \u89D2\u8272\u3001\u5834\u666F\u3001UI \u90FD\u5728\u9019\u88E1\u7DF4\u3002" },
        { x: 72, y: 30, w: 28, h: 70, label: "\u6D88\u9632\u6813", say: "\u6D88\u9632\u6813\u3002\u55EF\uFF0C\u5F88\u6B63\u5E38\u7684\u6D88\u9632\u6813\u3002", text: "\u9580\u65C1\u908A\u662F\u6D88\u9632\u6813\u3002\u9580\u4E0A\u9664\u4E86\u9580\u865F\u4EC0\u9EBC\u90FD\u6C92\u8CBC\u3002" }
      ]
    },
    {
      id: "S5",
      narr: { tour: "\u7246\u4E0A\u7684\u6AE5\u7A97\u8CBC\u6EFF\u4F5C\u54C1\u6D77\u5831\uFF0C\u4E09\u5F35\u6392\u6210\u4E00\u6392\u3002", loop: "\u6D77\u5831\u6AE5\u7A97\u3002\u4E09\u5F35\u6D77\u5831\u7684\u9806\u5E8F\u548C\u65B9\u5411\u2026\u2026" },
      name: "\u4F5C\u54C1\u6D77\u5831\u6AE5\u7A97",
      frames: ["frames/s5_a.webp", "frames/s5_b.webp"],
      still: "frames/s5.webp",
      src: "A 7:30\u20137:41",
      tour: "\u8D70\u5ECA\u6AE5\u7A97\u8CBC\u6EFF\u4F5C\u54C1\u6D77\u5831\u3002",
      spots: [{ x: 16, y: 8, w: 52, h: 84, label: "\u6D77\u5831\u6AE5\u7A97", must: true, say: "\u6BCF\u5F35\u6D77\u5831\u90FD\u597D\u6709\u8CEA\u611F\uFF0C\u597D\u60F3\u505C\u4E0B\u4F86\u770B\u3002", text: "\u4E09\u5F35\u5B8C\u6574\u7684\u6D77\u5831\uFF0C\u5F9E\u5DE6\u5230\u53F3\uFF1A\u5B87\u5B99\u96FB\u53F0\u3001\u7C89\u7D05\u982D\u9AEE\u5973\u5B69\u3001GO PLAYING DIMENSION\u3002\u8A18\u4F4F\u9806\u5E8F\u548C\u65B9\u5411\u30022025 \u5E74\u7CFB\u4E0A\u6709 8 \u4EF6\u4F5C\u54C1\u5165\u570D\u653E\u8996\u5927\u8CDE\u3002\uFF08\u5F85\u8001\u5E2B\u78BA\u8A8D\uFF1A\u6D77\u5831\u51FA\u8655\uFF09" }]
    },
    {
      id: "S6",
      narr: { tour: "\u8001\u5E2B\u7814\u7A76\u5BA4\u7684\u9580\u53E3\uFF0C\u4E0A\u9762\u6709\u540D\u724C\uFF0C\u4E0B\u9762\u639B\u8457\u5728\u5BA4\u724C\u3002", loop: "\u7814\u7A76\u5BA4\u9580\u53E3\u3002\u540D\u724C\u548C\u5728\u5BA4\u724C\uFF0C\u90FD\u9084\u662F\u539F\u6A23\u55CE\uFF1F" },
      name: "D0646 \u7814\u7A76\u5BA4",
      frames: ["frames/s6_a.webp", "frames/s6_b.webp"],
      still: "frames/s6.webp",
      src: "A 11:08\u201311:14",
      tour: "\u8001\u5E2B\u7814\u7A76\u5BA4\u7684\u9580\u53E3\u3002",
      spots: [
        { x: 29, y: 2, w: 30, h: 12, label: "\u540D\u724C", must: true, say: "D0646\uFF0C\u662F\u8001\u5E2B\u7684\u7814\u7A76\u5BA4\u3002", text: "D0646 \u9673\u6176\u9D3B\u8001\u5E2B\uFF0C\u5C08\u9577\u96FB\u8166\u52D5\u756B\u8207\u52D5\u614B\u5F71\u50CF\uFF0C\u6559\u52D5\u614B\u5716\u50CF\u8A2D\u8A08\u3002" },
        { x: 29, y: 80, w: 30, h: 17, label: "\u5728\u5BA4\u724C", say: "IN \u662F\u5728\u3001OUT \u662F\u4E0D\u5728\uFF0C\u5148\u770B\u4E00\u773C\u518D\u6572\u9580\u3002", text: "IN \u662F\u5728\u3001OUT \u662F\u4E0D\u5728\uFF0C\u627E\u8001\u5E2B\u524D\u5148\u770B\u4E00\u773C\u3002\u73FE\u5728\u4E09\u9846\u78C1\u9435\u5728\u5DE6\u908A\uFF0C\u7D05\u8272\u90A3\u9846\u5728\u53F3\u4E0A\u3002" }
      ]
    },
    {
      id: "S7",
      narr: { tour: "\u7E5E\u4E86\u4E00\u5708\uFF0C\u53C8\u56DE\u5230\u96FB\u68AF\u5EF3\u2026\u2026\u7B49\u7B49\uFF0C\u597D\u50CF\u9084\u6C92\u7D50\u675F\u3002", loop: "\u96FB\u68AF\u5EF3\u3002\u9019\u4E00\u5708\uFF0C\u6211\u6709\u770B\u6F0F\u4EC0\u9EBC\u55CE\uFF1F" },
      name: "\u96FB\u68AF\u5EF3",
      frames: ["frames/s7_a.webp", "frames/s7_b.webp"],
      still: "frames/s7.webp",
      src: "B 5:58\u20136:10",
      tour: "\u7E5E\u4E00\u5708\u53C8\u56DE\u5230\u96FB\u68AF\u5EF3\u3002\u5149\u7DDA\u548C\u6642\u9593\u7684\u8B8A\u5316\u4E0D\u662F\u7570\u5E38\uFF0C\u53EA\u770B\u6771\u897F\u6709\u6C92\u6709\u8B8A\u3002",
      spots: [{ x: 40, y: 1, w: 12, h: 15, label: "\u6A13\u5C64\u6578\u5B57", must: true, say: "\u53C8\u56DE\u5230\u96FB\u68AF\u5EF3\u4E86\uFF0C\u7246\u4E0A\u7684 6 \u597D\u5927\u3002", text: "\u7246\u4E0A\u7684\u300C6\u300D\u3002\u5C0E\u89BD\u5708\u7D50\u675F\u5F8C\uFF0C\u771F\u6B63\u7684\u5FAA\u74B0\u624D\u958B\u59CB\uFF1A\u770B\u5230\u4E0D\u5C0D\u52C1\u5C31\u56DE\u982D\uFF0C\u6216\u76F4\u63A5\u9EDE\u51FA\u7570\u5E38\u7684\u4F4D\u7F6E\u3002" }]
    }
  ];
  var ANOMALIES = [
    {
      id: "A01",
      tier: 3,
      station: 1,
      still: "frames/s1_a01.webp",
      hits: [{ x: 53, y: 22, w: 11, h: 27 }],
      card: { title: "\u544A\u793A\u8B8A\u6EAB\u67D4\u4E86", text: "\u300C\u8ACB\u52FF\u56DE\u982D\u300D\u5176\u5BE6\u662F\u53CD\u8A71\uFF1A\u56DE\u982D\u5C31\u662F\u56DE\u5831\u7570\u5E38\u3002\u7CFB\u4E3B\u4EFB\u5F88\u5E0C\u671B\u4F60\u591A\u770B\u770B\u7CFB\u4E0A\u3002" }
    },
    {
      id: "A02",
      tier: 2,
      station: 1,
      still: "frames/s1_a02.webp",
      hits: [{ x: 27, y: 16, w: 12, h: 30 }, { x: 66, y: 14, w: 21, h: 30 }],
      card: { title: "\u6D77\u5831\u63DB\u908A\u4E86", text: "\u7CFB\u8FA6\u9580\u53E3\u7684\u6D77\u5831\u662F\u7CFB\u4E0A\u4F5C\u54C1\u3002\u7CFB\u8FA6\u5C31\u5728\u96FB\u68AF\u6B63\u524D\u65B9\uFF0C\u65B0\u751F\u6709\u554F\u984C\u5148\u4F86\u9019\u88E1\u554F\u3002" }
    },
    {
      id: "A03",
      tier: 2,
      station: 1,
      still: "frames/s1_a03.webp",
      hits: [{ x: 0, y: 74, w: 100, h: 26 }],
      card: { title: "\u5730\u588A\u65B9\u5411\u53CD\u4E86", text: "\uFF08\u5F85\u8001\u5E2B\u88DC\u5145\uFF1A\u9019\u5F35\u5F69\u7E6A\u5730\u588A\u7684\u4F5C\u8005\u8207\u4F5C\u54C1\u4ECB\u7D39\uFF09" }
    },
    {
      id: "A04",
      tier: 1,
      station: 2,
      still: "frames/s2_a04.webp",
      hits: [{ x: 10, y: 56, w: 22, h: 20 }],
      card: { title: "\u6709\u4EBA\u812B\u4E86\u978B", text: "\u5929\u6A4B\u7684\u5730\u677F\u5F69\u7E6A\u4E0A\u672C\u4F86\u4EC0\u9EBC\u90FD\u6C92\u653E\u3002\uFF08\u5F85\u8001\u5E2B\u88DC\u5145\uFF1A\u5929\u6A4B\u5730\u677F\u5F69\u7E6A\u7684\u7531\u4F86\uFF09" }
    },
    {
      id: "A05",
      tier: 3,
      station: 3,
      still: "frames/s3_a05.webp",
      hits: [{ x: 34, y: 52, w: 29, h: 28 }],
      card: { title: "\u724C\u6A13\u4E0B\u6709\u4EBA\u5750\u904E", text: "\uFF08\u5F85\u8001\u5E2B\u88DC\u5145\uFF1A\u4E2D\u5EAD\u724C\u6A13\u7684\u7531\u4F86\uFF09\u5728\u516D\u6A13\u8FF7\u8DEF\uFF0C\u5148\u627E\u724C\u6A13\u3002" }
    },
    {
      id: "A06",
      tier: 3,
      station: 4,
      still: "frames/s4_a06.webp",
      hits: [{ x: 41, y: 13, w: 14, h: 15 }],
      card: { title: "\u9580\u865F\u8DD1\u6389\u4E86", text: "D0604\uFF1AD \u68DF\u300106 \u6A13\u300104 \u865F\u623F\u3002\u770B\u61C2\u9580\u865F\uFF0C\u5728\u5B78\u6821\u5C31\u4E0D\u6703\u8FF7\u8DEF\u3002" }
    },
    {
      id: "A07",
      tier: 2,
      station: 4,
      still: "frames/s4_a07.webp",
      hits: [{ x: 10, y: 37, w: 22, h: 27 }],
      card: { title: "\u96FB\u7E6A\u300C\u98DF\u300D\u9A57\u5BA4", text: "\u662F\u5BE6\u9A57\u5BA4\u4E0D\u662F\u98DF\u5802\u3002\u96FB\u7E6A\u5BE6\u9A57\u5BA4\u914D\u5099\u7E6A\u5716\u677F\uFF0C2D \u89D2\u8272\u3001\u5834\u666F\u3001UI \u90FD\u5728\u9019\u88E1\u7DF4\u3002" }
    },
    {
      id: "A08",
      tier: 1,
      station: 5,
      still: "frames/s5_a08.webp",
      hits: [{ x: 15, y: 6, w: 27, h: 88 }],
      card: { title: "\u6D77\u5831\u5012\u639B", text: "\uFF08\u5F85\u8001\u5E2B\u78BA\u8A8D\uFF1A\u6AE5\u7A97\u6D77\u5831\u7684\u51FA\u8655\u8207\u63DB\u5C55\u65B9\u5F0F\uFF092025 \u5E74\u7CFB\u4E0A\u6709 8 \u4EF6\u4F5C\u54C1\u5165\u570D\u653E\u8996\u5927\u8CDE\u3002" }
    },
    {
      id: "A09",
      tier: 1,
      station: 5,
      still: "frames/s5_a09.webp",
      hits: [{ x: 41, y: 6, w: 27, h: 88 }],
      card: { title: "\u7CFB\u4E3B\u4EFB\u5728\u770B\u4F60", text: "\u6D77\u5831\u4E0A\u662F\u7CFB\u4E3B\u4EFB\u9127\u6A39\u9060\u672C\u4EBA\uFF08\u7167\u7CFB\u7DB2\u5B98\u65B9\u7167\u7247\u756B\u7684\uFF09\uFF0C\u5C08\u9577\u904A\u6232\u8A2D\u8A08\u3001\u5287\u672C\u5275\u4F5C\u8207\u6578\u4F4D\u526A\u8F2F\u3002" }
    },
    {
      id: "A10",
      tier: 3,
      station: 6,
      still: "frames/s6_a10.webp",
      hits: [{ x: 28, y: 78, w: 32, h: 20 }],
      card: { title: "\u5168\u90E8\u90FD\u5728\uFF1F", text: "\u5728\u5BA4\u724C IN \u662F\u5728\u3001OUT \u662F\u4E0D\u5728\u3002\u627E\u8001\u5E2B\u524D\u5148\u770B\u5728\u5BA4\u724C\uFF0C\u7701\u5F97\u767D\u8DD1\u4E00\u8D9F\u3002" }
    },
    {
      id: "A11",
      tier: 3,
      station: 6,
      still: "frames/s6_a11.webp",
      hits: [{ x: 28, y: 1, w: 32, h: 14 }],
      card: { title: "\u8D70\u932F\u7814\u7A76\u5BA4\u4E86", text: "D0646 \u662F\u9673\u6176\u9D3B\u8001\u5E2B\u7684\u7814\u7A76\u5BA4\uFF0C\u5C08\u9577\u96FB\u8166\u52D5\u756B\u8207\u52D5\u614B\u5F71\u50CF\uFF0C\u6559\u52D5\u614B\u5716\u50CF\u8A2D\u8A08\u3002" }
    },
    {
      id: "A12",
      tier: 2,
      station: 7,
      still: "frames/s7_a12.webp",
      hits: [{ x: 39, y: 0, w: 14, h: 17 }],
      card: { title: "\u9019\u88E1\u4E0D\u662F\u516B\u865F\u51FA\u53E3", text: "\u9019\u88E1\u662F\u516D\u6A13\u3002\u81F4\u656C\u300A8 \u756A\u51FA\u53E3\u300B\uFF0C\u4F46\u6211\u5011\u7684\u51FA\u53E3\u8981\u9760\u8A8D\u8B58\u52D5\u904A\u7CFB\u624D\u627E\u5F97\u5230\u3002" }
    }
  ];
  var QUIZ = [
    { q: "\u52D5\u904A\u7CFB\u7CFB\u8FA6\u5728\u516D\u6A13\u7684\u54EA\u88E1\uFF1F", options: ["\u96FB\u68AF\u4E00\u51FA\u4F86\u7684\u6B63\u524D\u65B9", "\u8D70\u5ECA\u6700\u5C3E\u7AEF", "\u4E2D\u5EAD\u724C\u6A13\u65C1\u908A", "\u4E00\u6A13\u5927\u5EF3"], a: 0, why: "\u96FB\u68AF\u4E00\u51FA\u4F86\u7684\u6B63\u524D\u65B9\u5C31\u662F\u7CFB\u8FA6\u3002" },
    { q: "D0604 \u662F\u54EA\u4E00\u9593\uFF1F", options: ["\u96FB\u7E6A\u5BE6\u9A57\u5BA4", "\u7CFB\u8FA6", "3D \u5217\u5370\u5DE5\u4F5C\u574A", "\u6703\u8B70\u5BA4"], a: 0, why: "D0604 \u96FB\u7E6A\u5BE6\u9A57\u5BA4\uFF0C\u7E6A\u5716\u677F\u6559\u5BA4\u3002" },
    { q: "\u9580\u865F D0604 \u7684\u300C06\u300D\u4EE3\u8868\u4EC0\u9EBC\uFF1F", options: ["6 \u6A13", "\u7B2C 6 \u9593", "6 \u865F\u9580", "6 \u500B\u5EA7\u4F4D"], a: 0, why: "D \u68DF\u300106 \u6A13\u300104 \u865F\u623F\u3002" },
    { q: "\u7814\u7A76\u5BA4\u5728\u5BA4\u724C\u7684\u300CIN\u300D\u4EE3\u8868\uFF1F", options: ["\u8001\u5E2B\u5728\u7814\u7A76\u5BA4", "\u8001\u5E2B\u5728\u4E0A\u8AB2", "\u8ACB\u9032", "\u8ACB\u52FF\u6253\u64FE"], a: 0, why: "IN \u662F\u5728\u3001OUT \u662F\u4E0D\u5728\u3002" },
    { q: "2025 \u5E74\u7CFB\u4E0A\u6709\u5E7E\u4EF6\u4F5C\u54C1\u5165\u570D\u653E\u8996\u5927\u8CDE\uFF1F", options: ["8 \u4EF6", "2 \u4EF6", "15 \u4EF6", "30 \u4EF6"], a: 0, why: "2025 \u5E74\u653E\u8996\u5927\u8CDE 8 \u4EF6\u5165\u570D\u3002" },
    { q: "\u5728\u516D\u6A13\u8FF7\u8DEF\uFF0C\u6700\u597D\u8A8D\u7684\u5730\u6A19\u662F\uFF1F", options: ["\u4E2D\u5EAD\u6728\u9020\u724C\u6A13", "\u56DE\u6536\u6876", "\u6D88\u9632\u6813", "\u96FB\u68AF\u6309\u9215"], a: 0, why: "\u73BB\u7483\u5929\u68DA\u4E0B\u7684\u6728\u9020\u724C\u6A13\u3002" },
    { q: "\u9673\u6176\u9D3B\u8001\u5E2B\u7684\u5C08\u9577\u662F\uFF1F", options: ["\u96FB\u8166\u52D5\u756B\u8207\u52D5\u614B\u5F71\u50CF", "\u904A\u6232\u7A0B\u5F0F", "\u96FB\u7AF6\u8CFD\u4E8B", "3D \u5217\u5370"], a: 0, why: "D0646 \u9673\u6176\u9D3B\u8001\u5E2B\uFF0C\u5C08\u9577\u96FB\u8166\u52D5\u756B\u8207\u52D5\u614B\u5F71\u50CF\u3002" },
    { q: "\u7CFB\u4E3B\u4EFB\u9127\u6A39\u9060\u7684\u5C08\u9577\u662F\uFF1F", options: ["\u904A\u6232\u8A2D\u8A08\u3001\u5287\u672C\u5275\u4F5C", "\u5EFA\u7BC9\u8A2D\u8A08", "\u6703\u8A08", "\u6A5F\u68B0\u5DE5\u7A0B"], a: 0, why: "\u7CFB\u4E3B\u4EFB\u5C08\u9577\u904A\u6232\u8A2D\u8A08\u3001\u5287\u672C\u5275\u4F5C\u8207\u6578\u4F4D\u526A\u8F2F\u3002" },
    { q: "\u9019\u500B\u904A\u6232\u88E1\uFF0C\u300C\u8ACB\u52FF\u56DE\u982D\u300D\u5176\u5BE6\u662F\u4EC0\u9EBC\u610F\u601D\uFF1F", options: ["\u56DE\u982D\u5C31\u662F\u56DE\u5831\u7570\u5E38", "\u771F\u7684\u4E0D\u80FD\u56DE\u982D", "\u7CFB\u8FA6\u4E0D\u958B\u653E", "\u524D\u9762\u6709\u5371\u96AA"], a: 0, why: "\u56DE\u982D\u662F\u56DE\u5831\u7570\u5E38\u7684\u65B9\u6CD5\uFF0C\u544A\u793A\u662F\u53CD\u8A71\u3002" }
  ];
  var VOICE_TEXT = {
    vo_wrong_01: "\u6B38\u6B38\u6B38\u2014\u2014\u62DC\u8A17\u518D\u770B\u770B\u561B\uFF5E",
    vo_wrong_02: "\u540C\u5B78\uFF0C\u9019\u5708\u771F\u7684\u5F88\u6B63\u5E38\u5566\uFF0C\u4F60\u518D\u770B\u4E00\u6B21\u561B\u3002",
    vo_wrong_03: "\u597D\u5566\u597D\u5566\uFF0C\u6211\u966A\u4F60\u5F9E\u982D\u518D\u8D70\u4E00\u6B21\u3002",
    vo_first_correct: "\u6B38\uFF5E\u4F60\u5F88\u6703\u770B\u5594\uFF01\u5C31\u662F\u8981\u9019\u6A23\u3002",
    vo_half: "\u8D70\u4E00\u534A\u4E86\uFF0C\u516D\u6A13\u7684\u5730\u6A19\u4F60\u8A8D\u5F97\u5E7E\u500B\u5566\uFF1F",
    vo_ending: "\u606D\u559C\u4F60\u8D70\u51FA\u516D\u6A13\uFF01\u4E0D\u904E\u8AAA\u771F\u7684\uFF0C\u6B61\u8FCE\u4F60\u5E38\u5E38\u56DE\u4F86\u770B\u770B\u3002\u6211\u662F\u7CFB\u4E3B\u4EFB\u9127\u6A39\u9060\uFF0C\u52D5\u904A\u7CFB\u7B49\u4F60\u3002",
    vo_night: "\u9019\u9EBC\u665A\u9084\u4F86\u516D\u6A13\u63A2\u96AA\uFF1F\u5F88\u6709\u52D5\u904A\u7CFB\u7684\u7CBE\u795E\u5594\u2026\u2026\u4E0D\u904E\u9084\u662F\u8981\u65E9\u9EDE\u4F11\u606F\uFF01",
    vo_secret: "12 \u500B\u7570\u5E38\u5168\u88AB\u4F60\u627E\u5230\u4E86\u2026\u2026\u5176\u5BE6\u6211\u4E00\u76F4\u8DDF\u5728\u4F60\u5F8C\u9762\u5594\u3002\u6B61\u8FCE\u52A0\u5165\u52D5\u904A\u7CFB\uFF01"
  };

  // exit6/time.mjs
  var NIGHT_BY_LAP = 4;
  var BRIGHT_FLOOR = 0.72;
  function periodOf(hour) {
    const h = (hour % 24 + 24) % 24;
    if (h >= 19 || h < 6) return "night";
    if (h >= 17) return "dusk";
    return "day";
  }
  function stepFor(start) {
    const h = (start % 24 + 24) % 24;
    if (h < 6) return 0;
    if (h >= 19) return 1;
    return Math.ceil((19 - h) / NIGHT_BY_LAP);
  }
  function hourAt(start, lap) {
    return ((start + stepFor(start) * lap) % 24 + 24) % 24;
  }
  var PERIOD_LABEL = { day: "\u767D\u5929", dusk: "\u9EC3\u660F", night: "\u665A\u4E0A" };
  var hourLabel = (h) => (h % 24 + 24) % 24 < 6 ? "\u6DF1\u591C" : PERIOD_LABEL[periodOf(h)];
  var TINT = { day: null, dusk: { rgb: [255, 196, 140], a: 0.28 }, night: { rgb: [96, 128, 210], a: 0.34 } };
  var lum = ([r, g, b]) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  function gradeFor(hour, count = 0) {
    const p = periodOf(hour);
    const t = TINT[p];
    const tintFactor = t ? 1 - t.a * (1 - lum(t.rgb)) : 1;
    const base = { day: 1, dusk: 0.98, night: 0.95 }[p];
    const b = Math.max(BRIGHT_FLOOR / tintFactor, base - count * 0.025);
    const s = Math.max(0.6, { day: 1, dusk: 1.05, night: 0.85 }[p] - count * 0.05);
    const parts2 = [`brightness(${b.toFixed(3)})`, `saturate(${s.toFixed(3)})`];
    if (count) parts2.push(`contrast(${(1 + count * 0.025).toFixed(3)})`);
    const vig = Math.min(0.85, (p === "night" ? 0.6 : 0.5) + count * 0.04);
    const tint = t ? `rgba(${t.rgb.join(",")},${t.a})` : "transparent";
    return { period: p, filter: parts2.join(" "), tint, vig, brightness: b * tintFactor };
  }
  var fmtHour = (h) => `${String(h).padStart(2, "0")}:00`;

  // exit6/quests.mjs
  var ITEMS = [
    { id: "tablet", name: "\u7E6A\u5716\u677F\u6559\u5B78\u8B1B\u7FA9", hint: "\u8981\u9001\u5230\u300C\u80FD\u7DF4 2D \u89D2\u8272\u3001\u5834\u666F\u548C UI \u7684\u6559\u5BA4\u300D\u3002", to: "lab" },
    { id: "motion", name: "\u52D5\u614B\u5716\u50CF\u8A2D\u8A08\u4F5C\u696D", hint: "\u8981\u4EA4\u7D66\u300C\u6559\u52D5\u614B\u5716\u50CF\u8A2D\u8A08\u7684\u8001\u5E2B\u300D\u3002", to: "office" },
    { id: "poster", name: "\u4F5C\u54C1\u6D77\u5831", hint: "\u8981\u8CBC\u5230\u300C\u5C55\u793A\u7CFB\u4E0A\u4F5C\u54C1\u7684\u5730\u65B9\u300D\u3002", to: "window" }
  ];
  var TARGETS = [
    {
      id: "office1",
      station: 1,
      box: { x: 41, y: 50, w: 11, h: 20 },
      label: "\u7CFB\u8FA6",
      wrong: "\u9019\u88E1\u662F\u7CFB\u8FA6\uFF1A\u9078\u8AB2\u3001\u5404\u7A2E\u7533\u8ACB\u3001\u627E\u4EBA\u554F\u4E8B\u60C5\u90FD\u5148\u4F86\u9019\u88E1\u3002\u4E0D\u904E\u9019\u4EF6\u6771\u897F\u4E0D\u662F\u8981\u4EA4\u7D66\u7CFB\u8FA6\u7684\u3002"
    },
    {
      id: "lab",
      station: 4,
      box: { x: 36, y: 44, w: 20, h: 22 },
      label: "D0604",
      wrong: "\u9019\u88E1\u662F D0604 \u96FB\u7E6A\u5BE6\u9A57\u5BA4\uFF0C\u662F\u7E6A\u5716\u677F\u6559\u5BA4\u3002\u9019\u4EF6\u6771\u897F\u4E0D\u662F\u8981\u9001\u4F86\u9019\u88E1\u7684\u3002"
    },
    {
      id: "window",
      station: 5,
      box: { x: 70, y: 12, w: 22, h: 40 },
      label: "\u6AE5\u7A97",
      wrong: "\u9019\u88E1\u662F\u4F5C\u54C1\u6D77\u5831\u6AE5\u7A97\uFF0C\u5C55\u793A\u7CFB\u4E0A\u4F5C\u54C1\u3002\u9019\u4EF6\u6771\u897F\u4E0D\u662F\u8981\u8CBC\u5728\u9019\u88E1\u7684\u3002"
    },
    {
      id: "office",
      station: 6,
      box: { x: 33, y: 18, w: 24, h: 30 },
      label: "D0646",
      wrong: "\u9019\u88E1\u662F D0646 \u9673\u6176\u9D3B\u8001\u5E2B\u7814\u7A76\u5BA4\uFF0C\u4ED6\u6559\u52D5\u614B\u5716\u50CF\u8A2D\u8A08\u3002\u9019\u4EF6\u6771\u897F\u4E0D\u662F\u8981\u4EA4\u7D66\u4ED6\u7684\u3002"
    }
  ];
  var STAMP_POSTMAN = { id: "postman", name: "\u516D\u6A13\u90F5\u5DEE", text: "3 \u4EF6\u59D4\u8A17\u90FD\u9001\u5C0D\u4E86\u3002\u7CFB\u8FA6\u3001\u5BE6\u9A57\u5BA4\u3001\u6AE5\u7A97\u3001\u7814\u7A76\u5BA4\uFF0C\u4F60\u90FD\u77E5\u9053\u5728\u54EA\u3002" };
  function createQuests() {
    return { taken: false, delivered: [], stamps: [] };
  }
  function takeItems(qs) {
    qs.taken = true;
    return ITEMS.map((i) => i.id);
  }
  var pending = (qs) => qs.taken ? ITEMS.filter((i) => !qs.delivered.includes(i.id)) : [];
  function deliver(qs, itemId, targetId) {
    const item = ITEMS.find((i) => i.id === itemId);
    const target = TARGETS.find((t) => t.id === targetId);
    if (!item || !target) return { ok: false, text: "\u627E\u4E0D\u5230\u9019\u4EF6\u6771\u897F\u6216\u9019\u500B\u5730\u65B9\u3002" };
    if (!qs.taken || qs.delivered.includes(itemId)) return { ok: false, text: "\u9019\u4EF6\u6771\u897F\u4E0D\u5728\u4F60\u8EAB\u4E0A\u3002" };
    if (item.to !== targetId) return { ok: false, text: target.wrong };
    qs.delivered.push(itemId);
    const res = { ok: true, text: `\u300C${item.name}\u300D\u9001\u5230\u4E86\uFF01` };
    if (qs.delivered.length === ITEMS.length && !qs.stamps.includes(STAMP_POSTMAN.id)) {
      qs.stamps.push(STAMP_POSTMAN.id);
      res.stamp = STAMP_POSTMAN;
    }
    return res;
  }
  var targetsAt = (station) => TARGETS.filter((t) => t.station === station);

  // exit6/outlines.mjs
  var OUTLINES = { "S0:0": [[[90.4, 3.2], [84.5, 3.9], [83.8, 4.4], [83.8, 29.9], [84.1, 32.1], [84.9, 33.8], [85.7, 34.4], [88.1, 34.4], [89.1, 33.6], [88.2, 33.3], [87.7, 32.2], [89.1, 31], [89.5, 31], [89.6, 31.7], [90.1, 30.8], [89.7, 30.4], [89.7, 29.7], [90.5, 28.8], [90.6, 4.2]]], "S1:0": [[[4.1, 19.7], [4.6, 20.4], [4.5, 26], [4.7, 27.1], [23.2, 27.6], [23.9, 27.1], [26.3, 27.2], [27, 26], [26.7, 23.8], [23, 24], [22.7, 22.9], [23.3, 21.8], [14.6, 21.7], [14.1, 20.7], [14.4, 17.6], [13.4, 16.2], [8.7, 16.2], [7.8, 17.1], [5.9, 16.4]], [[27, 31], [26.7, 28.8], [26.4, 28.3], [24.3, 28.9], [23.3, 27.8], [21.6, 28.3], [15.8, 28.1], [15.5, 28.5], [11, 28.3], [10.2, 28.8], [8, 28.3], [7.6, 28.9], [5.6, 28.3], [4.7, 28.8], [4.5, 32.4], [4.8, 33.8], [26.5, 33.6]]], "S1:1": [[[60.5, 28.1], [55.6, 28.2], [55.6, 44.7], [60.3, 44.7], [60.7, 44.4], [60.7, 28.8]]], "S1:2": [[[37.3, 21.2], [29.3, 21.5], [29.1, 27.4], [29.5, 42.1], [37.3, 41.9], [37.5, 41]]], "S1:5": [[[76, 21.1], [75.2, 21.4], [74.5, 20.8], [69.3, 21], [69.3, 38.9], [69.7, 41.9], [70.1, 41.5], [73.4, 40.8], [74.3, 40], [74.8, 40.1], [75.3, 39], [76, 38.8], [76.3, 38.1], [76.1, 35.8]], [[79.1, 23.2], [79.1, 23.9], [78.4, 24.4], [78.4, 39.3], [78.7, 39.6], [84.2, 39.4], [84.4, 38.9], [84.4, 25.3], [84.1, 24], [79.7, 24.2], [79.3, 23.9]]], "S1:3": [[[99.9, 86.7], [94.8, 84.3], [81.4, 85.3], [63, 79.7], [54.5, 82.6], [42.3, 80.1], [35, 84.7], [27.7, 82.6], [15.9, 86.4], [12.8, 92.2], [0, 92.9], [0, 99.9], [99.9, 99.9]]], "S1:4": [[[41.6, 21.9], [41.6, 69], [64.1, 69], [64.1, 22.1]]], "S2:0": [[[36.2, 60.4], [34.2, 58.9], [29.5, 58.3], [28.8, 56.7], [27.3, 58.9], [18, 60], [17, 58.3], [15.9, 58.5], [15.5, 60.4], [12.2, 61.4], [11.2, 63.1], [7.9, 66], [3.6, 67.6], [3.6, 68.3], [8.5, 68.5], [9.1, 70], [8.3, 71.2], [11.2, 71.7], [11.6, 72.6], [12.9, 71.4], [30.5, 66.2], [31.2, 64.6], [35.7, 62.2]]], "S3:0": [[[62.7, 12.9], [60.5, 14.6], [58, 9.6], [52.6, 8.2], [48, 0.7], [43.7, 8.1], [38, 9.9], [35.8, 15.1], [33.2, 14.6], [32.3, 78.1], [36.3, 77.4], [35.5, 37.4], [38.4, 34.7], [39.6, 69], [41.2, 68.3], [40.7, 40.4], [53.4, 37.5], [58, 40.6], [57.7, 68.3], [59.8, 68.5], [59.3, 37.6], [60.7, 36.2], [60.4, 77.4], [64.3, 77.4], [64.2, 16.2]]], "S4:0": [[[45.4, 17.8], [45.3, 22.2], [44.7, 22.6], [44.9, 22.9], [44.9, 23.3], [45.3, 23.5], [45.5, 24.2], [45.6, 23.9], [51.7, 24], [51.9, 23.5], [52.3, 23.5], [52.5, 24.2], [52.5, 22.5], [52.2, 22.5], [52, 22.2], [52, 19.2], [51.9, 17.8]]], "S4:1": [[[99.9, 30.6], [72.8, 30.8], [72.6, 99.9], [99.9, 99.9]]], "S5:0": [[[17.3, 8.3], [17.3, 82.5], [40, 82.9], [40.4, 8.8]], [[43.9, 7.6], [43.8, 82.8], [66.6, 83.9], [66.7, 7.9]]], "S6:0": [[[58.4, 3.8], [58, 1.5], [56.2, 1.7], [56.1, 3.3], [53.4, 3.3], [52.9, 2.2], [50.8, 2.9], [44.9, 2.2], [44.5, 3.2], [43.6, 2.1], [30.1, 2.4], [37.7, 3.2], [37, 4.2], [32, 4.4], [31.5, 5.4], [31.8, 12.9], [38.9, 12.5], [39.9, 14.2], [41.6, 13.2], [44.9, 14.2], [56.8, 13.2], [57.6, 12.2], [57, 11.1], [57.7, 10.7], [57.7, 9.3], [56, 8.3], [56, 6.5], [58, 6.4]]], "S6:1": [[[58.1, 94.7], [56.8, 90.3], [54.5, 90], [55.1, 88.9], [56, 88.8], [56.5, 87.4], [57.7, 87.5], [56.8, 82.2], [56.2, 83.8], [31.7, 83.5], [30.3, 86.9], [30.5, 89.4], [31.7, 91.5], [54.1, 91.8], [54.8, 92.4], [54.8, 94.7], [56, 96.9], [57, 96.8]]], "S7:0": [[[46.6, 2.4], [45.4, 2.4], [44.8, 3.1], [44.7, 3.1], [44.6, 3.5], [44.3, 3.9], [43.9, 5.7], [43.9, 7.2], [44.1, 7.6], [44.2, 8.8], [44.8, 9.7], [45.7, 10.4], [46.6, 10.1], [47.2, 9.4], [47.4, 8.9], [47.6, 8.1], [47.6, 6.5], [47.4, 6.1], [47.4, 5.8], [47.3, 5.6], [47.3, 4.7], [47.4, 4.4], [47.4, 3.6], [47, 2.8], [46.7, 2.6]]], "T:office1": [[[41.6, 21.9], [41.6, 69], [64.1, 69], [64.1, 22.1]]], "T:lab": [[[6.4, 0], [6, 38.9], [3.1, 38.8], [3.4, 30.8], [1.9, 28.6], [1.8, 99.9], [63.1, 99.9], [63.2, 2.8], [7.3, 2.2]]], "T:window": [[[94, 8.3], [70.1, 8.6], [70.4, 82.9], [93.8, 82.4], [94.6, 46.8]]], "T:office": [[[58.4, 1.5], [29.8, 2.4], [30, 99.9], [45.2, 99.9], [45.4, 96.1], [47.1, 99.9], [58.4, 99.9]]], "C:c2": [[[13.4, 7.5], [0, 7.4], [0, 84.3], [1.9, 84.3], [2.1, 86], [3, 83.5], [10.7, 83.9], [13.4, 82.8], [13.4, 68.1], [12.7, 66], [13.4, 63.9], [13.4, 61.2], [12.7, 60.7], [13.5, 49.7]]], "C:c3": [[[5.9, 46], [5.3, 45.7], [4.1, 45.7], [3.8, 46.4], [3.4, 46.4], [3.3, 46.1], [3, 50.3], [2.7, 50.8], [2.7, 51.2], [2.3, 51.9], [2.1, 51.9], [1.6, 53.1], [1.6, 54], [1.4, 54.4], [1.6, 55.1], [2, 55.6], [2.9, 55.6], [3.2, 54.6], [3.5, 54.6], [3.7, 55.4], [4.6, 54.7], [4.9, 54.7], [5.2, 55.4], [6, 55], [6.2, 54.6], [6.3, 52.8], [6.5, 52.5], [7.2, 52.5], [7.2, 52.1], [6.6, 51.9], [6.6, 51.2], [6.9, 51], [6.3, 50.7], [6.2, 47.4]]], "C:c4": [[[6.8, 40.8], [5.9, 40.8], [4.6, 41.7], [4, 42.6], [3, 45.8], [3, 46.4], [4, 49.2], [4.6, 51.9], [5.2, 52.5], [5.2, 53.3], [4.1, 55.8], [4.3, 56.5], [8, 56.4], [8.4, 56], [8, 54.7], [7.3, 53.3], [7.3, 52.5], [7.8, 52.1], [8.3, 51], [9.7, 46], [8.8, 42.8], [8, 41.7]]], "A01": [[[55.7, 28.2], [55.5, 28.6], [55.5, 44], [55.6, 44.7], [56, 45], [56.4, 44.7], [60.7, 44.6], [60.7, 28.6], [60.4, 28.1]]], "A02": [[[28.6, 21], [28.4, 25.3], [28.6, 41.9], [29, 42.2], [34.8, 41.9], [35.2, 39.3], [35.3, 31.5], [35, 21.1], [34.5, 20.8]], [[69, 21], [68.8, 38.1], [68.5, 38.9], [66.6, 38.9], [66.5, 41.9], [76.8, 41.7], [77, 38.5], [77, 27.9], [77.1, 27.4], [77.6, 27.4], [77.6, 26.7], [77, 26.4], [77, 25.1], [77.7, 23.9], [77, 23.5], [76.9, 21.1]]], "A03": [[[99.9, 86.8], [95.5, 84.4], [82.1, 85.1], [63.7, 80], [55.5, 82.5], [43, 80.1], [34.6, 84.7], [27.8, 82.4], [14.2, 88.3], [13, 92.2], [0.9, 92.4], [0, 99.9], [15.5, 98.1], [20.3, 99.9], [87.4, 99.9], [90.4, 97.2], [90.2, 93.3], [99.9, 93.1]]], "A04": [[[28.2, 64.2], [27.2, 63.3], [26.4, 63.5], [26.3, 60.4], [27.1, 59.3], [23.9, 59.2], [22.3, 60], [22.6, 60.7], [24.1, 60.8], [23.6, 62.1], [24.2, 62.8], [24.3, 64.2], [23.3, 65.1], [22.3, 65.3], [21.6, 64], [20.7, 63.9], [19.4, 65.6], [17.5, 65.6], [17.2, 62.4], [18, 62.2], [18, 61], [18.5, 61.2], [19.3, 60.4], [14.9, 60.7], [14.4, 62.6], [13.7, 62.8], [14.3, 63.2], [13.8, 65.6], [14.2, 66.8], [14.1, 68.3], [14.5, 68.8], [14.4, 70.6], [27.3, 66.9], [28, 66.2]]], "A05": [[[38.4, 66.7], [38.8, 69.2], [38.8, 73.5], [39.7, 73.2], [39.8, 71.7], [40.5, 71.1], [40.5, 69.4], [41.6, 67.9], [56.8, 67.9], [57.2, 68.6], [57.2, 71.1], [57.7, 71.4], [58, 73.3], [58.8, 73.6], [59.1, 73.2], [59.1, 69.3], [59.9, 68.3], [59.5, 64.9], [59.4, 65.8], [58.1, 64.9], [57.7, 59.6], [56.1, 59.2], [40.2, 59.2], [39.8, 61], [39.7, 64.2]]], "A06": [[[44.6, 22.5], [44.7, 24.6], [45.2, 24.6], [45.2, 24.2], [45.5, 24], [51.7, 24], [52, 23.3], [52.3, 23.3], [52.5, 22.6], [52.9, 22.6], [52.9, 22.4], [52.3, 22.4], [52.1, 21.9], [52, 18.2], [51.6, 17.5], [45.4, 17.6], [45.2, 18.2], [45.2, 21.8], [45.1, 22.2]]], "A07": [[[14, 44.4], [14.1, 46.5], [15.7, 47.5], [15.7, 48.2], [15, 48.8], [14.5, 50.1], [15.1, 52.9], [14.9, 62.8], [15.4, 64], [26.6, 63.9], [27.8, 61.4], [27.7, 51.8], [28, 50.1], [26.8, 47.4], [28.3, 46.8], [28.3, 44.2], [25.2, 44], [24.7, 43.5], [24.8, 42.4], [24.5, 41.8], [23.2, 42.2], [20.5, 41.7], [19.6, 42.4], [18.9, 41.7], [18.5, 43.6]]], "A08": [[[17.3, 8.3], [17.3, 82.6], [40.2, 82.1], [40.4, 8.9]]], "A09": [[[66.6, 7.8], [43.8, 7.8], [44, 83.2], [66.6, 83.6]]], "A10": [[[58, 95], [57.4, 91.2], [55.3, 90], [55.4, 89.3], [57.8, 88.6], [58, 86.4], [57.3, 85.8], [57, 82.2], [56.4, 82.2], [56, 84], [31.7, 83.5], [30.3, 86.9], [30.5, 89.7], [31.7, 91.5], [54.1, 91.8], [54.8, 92.4], [54.8, 94.7], [56, 96.9], [57, 96.8]]], "A11": [[[58.4, 2.1], [53.3, 1.5], [30.2, 2.2], [30.2, 8.9], [31, 9.2], [31.8, 14.9], [55.3, 14.7], [57.2, 13.9], [58, 14.4]]], "A12": [[[38.8, 12.1], [39.2, 13.1], [39.8, 12.5], [40.3, 13.5], [47.8, 13.9], [52, 13.6], [52, 12.5], [53, 12.2], [53.2, 13.2], [52.8, 13.5], [53.3, 13.5], [53.7, 12.1], [46.9, 11.7], [47, 10.7], [47.5, 10.7], [47.3, 9.6], [48.2, 10.8], [49.1, 10.7], [48.7, 9.7], [49.2, 9.6], [49.8, 10.8], [49.8, 8.3], [51.3, 8.2], [51.4, 6.2], [50.2, 5.7], [49.6, 6.2], [49.9, 7.5], [49.5, 8.2], [48.5, 8.2], [48.3, 6.4], [47.7, 6.7], [47.5, 5.8], [47.8, 4.4], [46.4, 2.1], [45.1, 2.4], [43.8, 4.6], [43.7, 7.9], [45.5, 11], [45.4, 11.7]]] };

  // exit6/clues.mjs
  var CODE = "6068";
  var CLUES = [
    {
      id: "c1",
      station: 1,
      box: { x: 3, y: 13, w: 24, h: 22 },
      outline: "S1:0",
      digit: "6",
      night: false,
      label: "\u7CFB\u540D\u7246\u7684\u516C\u544A",
      text: "\u7CFB\u8FA6\u8CBC\u4E86\u5F35\u516C\u544A\uFF1A\u300C\u627E\u90B1\u58EB\u5C55\u8001\u5E2B\u7684\u540C\u5B78\u8ACB\u6CE8\u610F\uFF0C\u7814\u7A76\u5BA4\u5BC6\u78BC\u7B2C 1 \u78BC\uFF1D\u96FB\u68AF\u5EF3\u7246\u4E0A\u90A3\u500B\u5927\u6578\u5B57\u3002\u300D"
    },
    {
      id: "c2",
      station: 5,
      box: { x: 0, y: 8, w: 13, h: 84 },
      outline: "C:c2",
      digit: "0",
      night: false,
      label: "\u6AE5\u7A97\u908A\u7684\u5C55\u89BD\u8AAA\u660E",
      text: "\u5C55\u89BD\u8AAA\u660E\u7684\u89D2\u843D\u6709\u4EBA\u7528\u925B\u7B46\u5BEB\u8457\uFF1A\u300C\u7B2C 2 \u78BC\uFF1D\u6AE5\u7A97\u88E1\u6700\u65B0\u90A3\u5F35\u6D77\u5831\u5E74\u4EFD\u7684\u6700\u5F8C\u4E00\u4F4D\u3002\u300D"
    },
    {
      id: "c3",
      station: 6,
      box: { x: 0, y: 40, w: 12, h: 22 },
      outline: "C:c3",
      digit: "6",
      night: false,
      label: "\u958B\u95DC\u65C1\u7684\u4FBF\u689D",
      text: "\u96FB\u71C8\u958B\u95DC\u65C1\u8CBC\u8457\u4FBF\u689D\uFF1A\u300C\u7B2C 3 \u78BC\uFF1D\u9694\u58C1\u9019\u4F4D\u9673\u6176\u9D3B\u8001\u5E2B\u9580\u724C\u865F\u78BC\u7684\u6700\u5F8C\u4E00\u4F4D\u3002\u300D"
    },
    {
      id: "c4",
      station: 3,
      box: { x: 2, y: 38, w: 10, h: 20 },
      outline: "C:c4",
      digit: "8",
      night: true,
      label: "\u724C\u6A13\u65C1\u7684\u8DEF\u71C8",
      text: "\u665A\u4E0A\u8DEF\u71C8\u4EAE\u4E86\uFF0C\u71C8\u5EA7\u4E0A\u6D6E\u51FA\u4E00\u884C\u5B57\uFF1A\u300C\u7B2C 4 \u78BC\uFF1D\u516D\u6A13\u7E5E\u4E00\u5708\u7E3D\u5171\u6709\u5E7E\u7AD9\u3002\u300D"
    }
  ];
  function createClues() {
    return { found: [], opened: false };
  }
  var visibleClues = (station, hour, phase) => phase === "loop" ? CLUES.filter((c) => c.station === station && (!c.night || periodOf(hour) === "night")) : [];
  function collect(st, id) {
    if (!CLUES.some((c) => c.id === id) || st.found.includes(id)) return false;
    st.found.push(id);
    return true;
  }
  var allFound = (st) => CLUES.every((c) => st.found.includes(c.id));
  function tryCode(st, input2) {
    const code = String(input2).replace(/\D/g, "");
    if (!allFound(st)) return { ok: false, text: "\u7DDA\u7D22\u9084\u6C92\u96C6\u9F4A\uFF0C\u518D\u5230\u516D\u6A13\u5404\u8655\u627E\u627E\u3002" };
    if (code.length !== CODE.length) return { ok: false, text: `\u5BC6\u78BC\u662F ${CODE.length} \u500B\u6578\u5B57\u3002` };
    if (code !== CODE) {
      const right = [...code].filter((d, i) => d === CODE[i]).length;
      return { ok: false, text: `\u9580\u9396\u55F6\u4E86\u4E00\u8072\u2026\u2026${right ? `\u6709 ${right} \u78BC\u7684\u4F4D\u7F6E\u662F\u5C0D\u7684\u3002` : "\u4E00\u78BC\u90FD\u4E0D\u5C0D\uFF0C\u518D\u770B\u770B\u624B\u5E33\u88E1\u7684\u7DDA\u7D22\u3002"}` };
    }
    st.opened = true;
    return { ok: true, text: "\u5580\u5693\u2014\u2014D0647 \u7684\u9580\u958B\u4E86\u3002" };
  }

  // exit6/fight.mjs
  var GAP_MS = 500;
  var WINDOW_MS = 1600;
  var MOVES = {
    pan: { name: "\u6416\u93E1\u9583\u8EAB", cmd: ["L", "A"], cam: { key: "pan", term: "\u6416\u93E1 Pan", def: "\u651D\u5F71\u6A5F\u539F\u5730\u5DE6\u53F3\u8F49\u52D5\uFF0C\u5E36\u51FA\u7A7A\u9593\u8207\u89D2\u8272\u52D5\u7DDA\u3002" } },
    low: { name: "\u4EF0\u89D2\u8DF3\u8E22", cmd: ["U", "A"], cam: { key: "low", term: "\u4EF0\u89D2 Low Angle", def: "\u5F9E\u4E0B\u5F80\u4E0A\u62CD\uFF0C\u8B93\u89D2\u8272\u770B\u8D77\u4F86\u66F4\u5F37\u5927\u3001\u66F4\u6709\u58D3\u8FEB\u611F\u3002" } },
    dolly: { name: "\u63A8\u8ECC\u9023\u6BB5", cmd: ["D", "DR", "R", "A"], cam: { key: "dolly", term: "\u63A8\u8ECC Dolly In", def: "\u651D\u5F71\u6A5F\u5BE6\u969B\u5F80\u524D\u79FB\u52D5\u9760\u8FD1\u4E3B\u89D2\uFF0C\u8B93\u60C5\u7DD2\u8207\u5F35\u529B\u4E00\u8DEF\u5347\u9AD8\u3002" } },
    dutch: { name: "\u8377\u862D\u89D2\u8FF4\u65CB", cmd: ["R", "D", "DR", "A"], cam: { key: "dutch", term: "\u8377\u862D\u89D2 Dutch Angle", def: "\u628A\u756B\u9762\u6545\u610F\u62CD\u659C\uFF0C\u88FD\u9020\u4E0D\u5B89\u6216\u5931\u8861\u7684\u611F\u89BA\u3002" } }
  };
  var ATTACKS = [
    { id: "jab", name: "\u5834\u8A18\u677F\u76F4\u62F3", tele: "\u4ED6\u8209\u8D77\u5834\u8A18\u677F\u5F80\u524D\u885D\uFF01", counter: "pan" },
    { id: "kick", name: "\u9577\u93E1\u982D\u6383\u817F", tele: "\u4ED6\u58D3\u4F4E\u91CD\u5FC3\uFF0C\u6E96\u5099\u4E00\u8A18\u9577\u9577\u7684\u6383\u817F\uFF01", counter: "low" },
    { id: "take", name: "\u4E00\u93E1\u5230\u5E95", tele: "\u4ED6\u5927\u558A\uFF1A\u300C\u9019\u9846\u93E1\u982D\u4E0D\u51C6 NG\uFF01\u300D\u6574\u500B\u4EBA\u885D\u904E\u4F86\uFF01", counter: "dolly" }
  ];
  var FINISHER = { id: "last", name: "\u6700\u5F8C\u4E00\u9846\u93E1\u982D", tele: "\u4ED6\u6416\u6416\u6643\u6643\u2014\u2014\u628A\u756B\u9762\u62CD\u659C\uFF0C\u7D66\u4ED6\u6700\u5F8C\u4E00\u64CA\uFF01", counter: "dutch" };
  var QIU_HP = 5;
  var PLAYER_HP = 3;
  var parts = { UL: ["U", "L"], UR: ["U", "R"], DL: ["D", "L"], DR: ["D", "R"] };
  function matches(buffer, cmd, now = buffer.length ? buffer[buffer.length - 1].t : 0, gap = GAP_MS, win = WINDOW_MS) {
    if (!buffer.length) return false;
    const last = buffer[buffer.length - 1];
    if (last.k !== cmd[cmd.length - 1] || now - last.t > gap) return false;
    let bi = buffer.length - 2, prevT = last.t, startT = last.t;
    for (let ci = cmd.length - 2; ci >= 0; ci--) {
      const want = cmd[ci];
      let found = -1;
      for (let j = bi; j >= 0 && prevT - buffer[j].t <= gap; j--) {
        if (buffer[j].k === want) {
          found = j;
          break;
        }
        if (buffer[j].k === "A") break;
      }
      if (found < 0) {
        if (parts[want] && cmd[ci - 1] === parts[want][0] && (cmd[ci + 1] === parts[want][1] || cmd[ci + 1] === "A")) continue;
        return false;
      }
      prevT = buffer[found].t;
      startT = prevT;
      bi = found - 1;
    }
    return last.t - startT <= win;
  }
  function createFight(rng2 = Math.random) {
    return { qiu: QIU_HP, me: PLAYER_HP, round: 0, attack: null, deadline: 0, buffer: [], over: null, rng: rng2 };
  }
  var windowFor = (round) => Math.max(1500, Math.round(2600 * Math.pow(0.9, round)));
  function nextRound(f, now) {
    f.round += 1;
    const pool = ATTACKS.filter((a) => a.id !== f.prev);
    f.attack = f.qiu === 1 ? FINISHER : pool[Math.floor(f.rng() * pool.length)];
    f.prev = f.attack.id;
    f.deadline = now + windowFor(f.round);
    f.buffer = [];
    return f.attack;
  }
  function input(f, k, now) {
    if (f.over || !f.attack) return { type: "pending" };
    f.buffer.push({ k, t: now });
    if (f.buffer.length > 12) f.buffer.shift();
    const move = MOVES[f.attack.counter];
    if (matches(f.buffer, move.cmd, now)) {
      f.qiu -= 1;
      f.attack = null;
      if (f.qiu <= 0) f.over = "win";
      return { type: "hit", move, over: f.over };
    }
    if (k === "A") {
      const slow = matches(f.buffer, move.cmd, now, 6e4, 6e4);
      return { ...hurt(f), reason: slow ? "slow" : "wrong" };
    }
    return { type: "pending" };
  }
  function timeout(f, now) {
    if (f.over || !f.attack || now < f.deadline) return null;
    return hurt(f);
  }
  function hurt(f) {
    f.me -= 1;
    f.attack = null;
    if (f.me <= 0) f.over = "lose";
    return { type: "miss", over: f.over };
  }

  // exit6/coach.mjs
  function cueFor(lap, failStreak = 0) {
    const base = lap <= 1 ? 2 : lap <= 3 ? 1 : 0;
    return failStreak >= 2 ? Math.max(base, 1) : base;
  }
  function hintStage(seconds, misTaps, hintOn) {
    if (!hintOn) return 0;
    if (seconds >= 26) return 3;
    if (seconds >= 16 || misTaps >= 4) return 2;
    if (seconds >= 8 || misTaps >= 2) return 1;
    return 0;
  }
  function areaOf(box) {
    const cx = box.x + box.w / 2, cy = box.y + box.h / 2;
    if (cy >= 65) return "\u756B\u9762\u4E0B\u65B9";
    if (cy <= 25) return "\u756B\u9762\u4E0A\u65B9";
    if (cx < 35) return "\u756B\u9762\u5DE6\u908A";
    if (cx > 65) return "\u756B\u9762\u53F3\u908A";
    return "\u756B\u9762\u4E2D\u9593";
  }
  var HINT_TEXT = {
    1: "\u62DC\u8A17\u518D\u770B\u770B\u561B\u2026\u2026\u9019\u4E00\u7AD9\u8DDF\u5C0E\u89BD\u6642\u597D\u50CF\u6709\u4E00\u9EDE\u9EDE\u4E0D\u4E00\u6A23\u5594\u3002",
    2: "\u7D66\u4F60\u4E00\u500B\u63D0\u793A\u5C31\u597D\uFF1A\u76EF\u8457{area}\u770B\u770B\uFF01",
    3: "\u597D\u5566\u597D\u5566\uFF0C\u6211\u5E6B\u4F60\u5708\u8D77\u4F86\u4E86\uFF0C\u9EDE\u90A3\u500B\u767C\u5149\u7684\u5730\u65B9\uFF01"
  };
  var COACH = {
    fwd: "\u6309\u300C\u5F80\u524D\u300D\u8D70\u51FA\u96FB\u68AF",
    spot: "\u9EDE\u9EDE\u770B\u767C\u4EAE\u7684\u5730\u65B9",
    done: "\u9019\u7AD9\u770B\u5B8C\u4E86\uFF0C\u6309\u300C\u5F80\u524D\u300D",
    loop1: "\u54A6\uFF1F\u9019\u88E1\u8DDF\u525B\u525B\u597D\u50CF\u4E0D\u4E00\u6A23\u2026\u2026\u89BA\u5F97\u602A\u5C31\u76F4\u63A5\u9EDE\u5B83\uFF01",
    lap2: "\u9019\u5708\u770B\u8D77\u4F86\u90FD\u5F88\u6B63\u5E38\uFF1F\u90A3\u5C31\u4E00\u8DEF\u300C\u5F80\u524D\u300D\u8D70\u5230\u5E95\uFF01"
  };
  var HELP_COOLDOWN_MS = 1e4;
  var HELP_CLEAR = "\u9019\u4E00\u7AD9\u6211\u770B\u662F\u6C92\u554F\u984C\u5566\uFF0C\u5F80\u524D\u8D70\u8D70\u770B\uFF01";
  function helpReply(anomalyHere, stageNow) {
    return anomalyHere ? { kind: "hint", stage: Math.min(3, stageNow + 1) } : { kind: "clear" };
  }

  // exit6/teachers.mjs
  var THREE_URL = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
  var TEACHERS = [
    {
      id: "book",
      mg: "mg-book",
      station: 4,
      title: "\u7E6A\u672C\u8001\u5E2B",
      name: null,
      skill: "\u7E6A\u672C\u8207\u89D2\u8272\u9020\u578B",
      invite: "\u96FB\u7E6A\u5BE6\u9A57\u5BA4\u88E1\u6709\u4EBA\u5728\u756B\u89D2\u8272\u2026\u2026\u300C\u8981\u4E0D\u8981\u5E6B\u6211\u7684\u89D2\u8272\u627E\u914D\u4EF6\uFF1F\u300D",
      quote: "\u526A\u5F71\u4E00\u773C\u8A8D\u5F97\u51FA\u4F86\uFF0C\u89D2\u8272\u5C31\u6210\u529F\u4E00\u534A\u4E86\u3002",
      mark: "\u7E6A\u672C",
      card: null
    },
    {
      id: "type",
      mg: "mg-type",
      station: 5,
      title: "\u8996\u50B3\u8001\u5E2B",
      name: null,
      skill: "\u8996\u89BA\u50B3\u9054\u8A2D\u8A08",
      invite: "\u6D77\u5831\u6AE5\u7A97\u524D\u6709\u4EBA\u5728\u6311\u5B57\u578B\u2026\u2026\u300C\u4F60\u89BA\u5F97\u54EA\u7A2E\u5B57\u6700\u6709\u500B\u6027\uFF1F\u300D",
      quote: "\u5B57\u9AD4\u4E5F\u6709\u500B\u6027\uFF0C\u6311\u5C0D\u5B57\uFF0C\u8A0A\u606F\u81EA\u5DF1\u6703\u8AAA\u8A71\u3002",
      mark: "\u8996\u50B3",
      card: null
    },
    {
      id: "anim",
      mg: "mg-anim",
      station: 6,
      title: "\u52D5\u756B\u8001\u5E2B",
      name: null,
      skill: "\u96FB\u8166\u52D5\u756B",
      invite: "D0646 \u7684\u9580\u958B\u4E86\u4E00\u689D\u7E2B\u2026\u2026\u300C\u4F86\u8A66\u8A66\u6642\u9593\u66F2\u7DDA\uFF0C\u52D5\u756B\u7684\u5FEB\u6162\u90FD\u5728\u9019\u88E1\u3002\u300D",
      quote: "\u7DE9\u5165\u7DE9\u51FA\uFF0C\u52D5\u4F5C\u5C31\u6709\u4E86\u91CD\u91CF\u3002",
      mark: "\u52D5\u756B",
      card: null
    },
    {
      id: "3d",
      mg: "mg-3d",
      station: 3,
      title: "3D \u8001\u5E2B",
      name: null,
      skill: "3D \u89D2\u8272\u8207 3D \u5217\u5370",
      invite: "\u724C\u6A13\u4E0B\u64FA\u8457\u4E00\u53F0 3D \u5370\u8868\u6A5F\u2026\u2026\u300C\u96F6\u4EF6\u65B9\u5411\u64FA\u5C0D\uFF0C\u624D\u5370\u5F97\u51FA\u4F86\u5594\u3002\u300D",
      quote: "\u5148\u60F3\u6E05\u695A\u8EF8\u5411\uFF0C3D \u4E16\u754C\u5C31\u4E0D\u6703\u8DDF\u4F60\u4F5C\u5C0D\u3002",
      mark: "3D",
      card: null
    },
    {
      id: "code",
      mg: "mg-code",
      station: 7,
      title: "\u7A0B\u5F0F\u8001\u5E2B",
      name: null,
      skill: "Unity\uFF0F\u7A0B\u5F0F",
      invite: "\u96FB\u68AF\u5EF3\u7684\u7B46\u96FB\u9084\u958B\u8457\u2026\u2026\u300C\u5E6B\u6211\u628A\u8CC7\u6599\u6D41\u63A5\u5230 Goal \u597D\u55CE\uFF1F\u300D",
      quote: "\u5148\u60F3\u597D\u6D41\u7A0B\u518D\u52D5\u624B\uFF0C\u6BD4\u4E8B\u5F8C\u6293\u87F2\u7701\u6642\u9593\u3002",
      mark: "\u7A0B\u5F0F",
      card: null
    }
  ];
  var displayName = (t) => t.name || t.title;
  var scriptsFor = (t) => [...t.mg === "mg-3d" ? [THREE_URL] : [], `minigames/${t.mg}/rules.js`, `minigames/${t.mg}/game.js`];
  var teacherAt = (station, phase) => phase === "loop" ? TEACHERS.find((t) => t.station === station) || null : null;
  function createCards(saved) {
    const ok = Array.isArray(saved) ? saved.filter((c) => c && TEACHERS.some((t) => t.id === c.id)) : [];
    return { cards: ok.map((c) => ({ id: c.id, best: Number(c.best) || 0 })) };
  }
  var allCollected = (st) => TEACHERS.every((t) => st.cards.some((c) => c.id === t.id));
  function award(st, id, result) {
    const t = TEACHERS.find((x) => x.id === id);
    if (!t || !result || !result.win) return { got: false, first: false, completed: false };
    const before = allCollected(st);
    const score = Number(result.score) || 0;
    const have = st.cards.find((c) => c.id === id);
    if (have) {
      have.best = Math.max(have.best, score);
      return { got: true, first: false, completed: false };
    }
    st.cards.push({ id, best: score });
    return { got: true, first: true, completed: !before && allCollected(st) };
  }

  // exit6/story.mjs
  var mustIndex = (station) => STATIONS[station].spots.findIndex((p) => p.must);
  function narrFor(station, phase) {
    const n = STATIONS[station] && STATIONS[station].narr;
    if (!n) return null;
    if (phase === "tour") return n.tour;
    if (phase === "loop") return n.loop;
    return null;
  }
  function spotAt(station, x, y) {
    const spots = STATIONS[station].spots;
    const k = spots.findIndex((p) => x >= p.x && x <= p.x + p.w && y >= p.y && y <= p.y + p.h);
    return k < 0 ? null : k;
  }

  // exit6/labs.mjs
  var LABS = [
    {
      id: "d0633",
      code: "D0633",
      name: "\u9AD4\u611F\u4E92\u52D5\u5BE6\u9A57\u5BA4",
      station: 2,
      mg: "lab-d0633",
      bg: "frames/lab_d0633.webp",
      button: "left",
      intro: "\u5929\u6A4B\u53E6\u4E00\u982D\u662F\u9AD4\u611F\u4E92\u52D5\u5BE6\u9A57\u5BA4\uFF0CVR \u8DD1\u6B65\u6A5F\u548C\u9AD4\u611F\u5E73\u53F0\u64FA\u6210\u4E00\u6392\u3002",
      say: "\u6234\u4E0A\u982D\u76D4\uFF0C\u8173\u4E0B\u7684\u8DD1\u6B65\u6A5F\u5C31\u662F\u4E00\u6574\u5EA7\u57CE\u5E02\u3002"
    },
    {
      id: "d0628",
      code: "D0628",
      name: "3D \u5217\u5370\u5DE5\u4F5C\u574A",
      station: 3,
      mg: "lab-d0628",
      bg: "frames/lab_d0628.webp",
      button: "left",
      intro: "\u724C\u6A13\u65C1\u908A\u7684 3D \u5217\u5370\u5DE5\u4F5C\u574A\uFF0C\u5370\u8868\u6A5F\u6B63\u55E1\u55E1\u5730\u4E00\u5C64\u4E00\u5C64\u5F80\u4E0A\u758A\u3002",
      say: "\u539F\u4F86\u6A21\u578B\u662F\u9019\u6A23\u4E00\u5C64\u4E00\u5C64\u9577\u51FA\u4F86\u7684\u3002"
    },
    {
      id: "d0604",
      code: "D0604",
      name: "\u96FB\u7E6A\u5BE6\u9A57\u5BA4",
      station: 4,
      mg: "lab-d0604",
      bg: "frames/lab_d0604.webp",
      button: "left",
      intro: "\u96FB\u7E6A\u5BE6\u9A57\u5BA4\u88E1\u4E00\u6574\u6392\u7E6A\u5716\u87A2\u5E55\uFF0C\u7B46\u4E00\u78B0\u4E0A\u53BB\u7DDA\u5C31\u51FA\u4F86\u4E86\u3002",
      say: "\u5728\u7E6A\u5716\u677F\u4E0A\u756B\u7DDA\uFF0C\u624B\u611F\u8DDF\u7D19\u5B8C\u5168\u4E0D\u4E00\u6A23\u3002"
    },
    {
      id: "d0637",
      code: "D0637",
      name: "\u5076\u52D5\u756B\u5BE6\u9A57\u5BA4",
      station: 5,
      mg: "lab-d0637",
      bg: "frames/lab_d0637.webp",
      button: "left",
      intro: "\u5076\u52D5\u756B\u5BE6\u9A57\u5BA4\u88E1\uFF0C\u624B\u6A5F\u67B6\u5728\u652F\u67B6\u4E0A\uFF0C\u5C0D\u8457\u684C\u4E0A\u7684\u5C0F\u6050\u9F8D\u4E00\u683C\u4E00\u683C\u62CD\u3002",
      say: "\u6BCF\u62CD\u4E00\u5F35\u5C31\u628A\u6050\u9F8D\u632A\u4E00\u9EDE\u9EDE\uFF0C\u96E3\u602A\u8981\u90A3\u9EBC\u6709\u8010\u5FC3\u3002"
    },
    {
      id: "d0631",
      code: "D0631",
      name: "\u52D5\u4F5C\u6355\u6349\u5BE6\u9A57\u5BA4",
      station: 7,
      mg: "lab-d0631",
      bg: "frames/lab_d0631.webp",
      button: "left",
      intro: "\u52D5\u4F5C\u6355\u6349\u5BE6\u9A57\u5BA4\u5176\u5BE6\u662F\u865B\u64EC\u88FD\u7247\u68DA\uFF0C\u6574\u7247\u7DA0\u5E55\u548C\u4E00\u6392\u651D\u5F71\u6A5F\u3002",
      say: "\u6F14\u54E1\u5728\u7DA0\u5E55\u524D\u6F14\uFF0C\u87A2\u5E55\u4E0A\u99AC\u4E0A\u5C31\u662F\u53E6\u4E00\u500B\u4E16\u754C\u3002"
    }
  ];
  var MAX_STARS = LABS.length * 3;
  var labAt = (station, phase) => phase === "loop" ? LABS.find((l) => l.station === station) || null : null;
  function starsFor(result, stars) {
    if (!result || !result.win) return 0;
    let n = 1;
    if (stars && Number.isFinite(stars.score2) && Number(result.score) >= stars.score2) n++;
    if (result.flawless === true) n++;
    return n;
  }
  var TITLES = [
    { at: 1, name: "\u5BE6\u9A57\u5BA4\u8A2A\u5BA2" },
    { at: 5, name: "\u516D\u6A13\u5BE6\u7FD2\u751F" },
    { at: 10, name: "\u5BE6\u9A57\u5BA4\u5E38\u5BA2" },
    { at: 15, name: "\u516D\u6A13\u901A" }
  ];
  var REWARDS = [
    { id: "works", at: 6, name: "\u89E3\u9396\uFF1A\u5B78\u9577\u59D0\u4F5C\u54C1\u5C55\u793A" },
    { id: "share", at: 12, name: "\u89E3\u9396\uFF1A\u62DB\u751F\u5206\u4EAB\u5361" }
  ];
  var titleFor = (total) => [...TITLES].reverse().find((t) => total >= t.at) || null;
  var unlocked = (total) => REWARDS.filter((r) => total >= r.at);
  function createAchv(saved) {
    const labs = {};
    const src = saved && typeof saved === "object" && saved.labs && typeof saved.labs === "object" ? saved.labs : {};
    for (const l of LABS) {
      const v = src[l.id];
      if (v && typeof v === "object") labs[l.id] = { stars: Math.max(0, Math.min(3, Number(v.stars) || 0)), best: Number(v.best) || 0 };
    }
    return { labs };
  }
  var totalStars = (st) => Object.values(st.labs).reduce((s, v) => s + v.stars, 0);
  function record(st, id, stars, score) {
    if (!LABS.some((l) => l.id === id)) return { improved: false, newTitles: [], newRewards: [] };
    const before = totalStars(st);
    const cur = st.labs[id] || { stars: 0, best: 0 };
    const improved = stars > cur.stars;
    st.labs[id] = { stars: Math.max(cur.stars, Math.min(3, stars)), best: Math.max(cur.best, Number(score) || 0) };
    const after = totalStars(st);
    return {
      improved,
      newTitles: TITLES.filter((t) => before < t.at && after >= t.at),
      newRewards: REWARDS.filter((r) => before < r.at && after >= r.at)
    };
  }

  // exit6/main.mjs
  var q = new URLSearchParams(location.search);
  var seed = q.has("seed") ? Number(q.get("seed")) : Date.now() & 4294967295;
  var rng = mulberry32(seed ^ 2654435769);
  var game = createGame(ANOMALIES, mulberry32(seed));
  var $ = (id) => document.getElementById(id);
  var stage = $("stage");
  var layers = [$("imgA"), $("imgB")];
  var sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  var pub = (s) => String(s).replace(/（待老師[^）]*）/g, "").trim();
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var front = 0;
  var busy = false;
  var walking = null;
  var SAVE_KEY = "exit6-save-v1";
  function loadSave() {
    try {
      return JSON.parse(localStorage.getItem(SAVE_KEY)) || {};
    } catch {
      return {};
    }
  }
  function writeSave(s) {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(s));
    } catch {
    }
  }
  var save = Object.assign({ dex: [], bestMs: null, bestMiss: null, clears: 0, cards: [] }, loadSave());
  var cardBook = createCards(save.cards);
  var achv = createAchv(save.achv);
  var run = { t0: 0, mistakes: 0, precise: 0, misTaps: 0, toured: /* @__PURE__ */ new Set(), failStreak: 0, seen: /* @__PURE__ */ new Set() };
  var hint = { t0: 0, mis: 0, stage: 0, on: false, timer: null };
  var quests = createQuests();
  var clues = createClues();
  var STAMP_QIU = { id: "qiu", name: "\u627E\u5230\u90B1\u8001\u5E2B", text: "\u89E3\u958B 4 \u689D\u7DDA\u7D22\u3001\u6253\u958B D0647\uFF0C\u898B\u5230\u52D5\u756B\u5C0E\u6F14\u90B1\u58EB\u5C55\u8001\u5E2B\u3002" };
  var stamps = () => [...quests.stamps.length ? [STAMP_POSTMAN] : [], ...clues.opened ? [STAMP_QIU] : [], ...fightWon ? [STAMP_FIGHT] : []];
  var realHour = (/* @__PURE__ */ new Date()).getHours();
  var startHour = q.has("hour") ? (Number(q.get("hour")) % 24 + 24) % 24 : realHour;
  var nowHour = () => hourAt(startHour, game.phase === "tour" ? 0 : game.lap);
  var SFX = ["footstep", "hum", "sting", "found", "wrong", "dean", "correct", "clear", "click"];
  var sfx = {};
  function loadSfx() {
    for (const n of SFX) {
      const a = new Audio(`audio/sfx_${n}.mp3`);
      a.preload = "auto";
      a.onerror = () => {
        sfx[n] = null;
      };
      sfx[n] = a;
    }
    sfx.hum.loop = true;
    sfx.hum.volume = 0.25;
  }
  function play(n, vol = 1, maxMs = 0) {
    const a = sfx[n];
    if (!a) return;
    if (n === "hum") {
      a.play().catch(() => {
      });
      return;
    }
    const c = a.cloneNode();
    c.volume = vol;
    c.play().catch(() => {
    });
    if (maxMs) setTimeout(() => c.pause(), maxMs);
  }
  var VOICE_READY = false;
  var voices = {};
  function loadVoices() {
    if (!VOICE_READY) return;
    for (const id of Object.keys(VOICE_TEXT)) {
      const a = new Audio(`audio/${id}.m4a`);
      a.preload = "auto";
      a.onerror = () => {
        voices[id] = null;
      };
      voices[id] = a;
    }
  }
  var deanImg = $("dean");
  var deanTimer = null;
  function dean(pose, voiceId, ms = 3200) {
    clearTimeout(deanTimer);
    deanImg.src = `frames/dean_${pose}.webp`;
    deanImg.style.right = pose === "peek" ? "0" : "-2%";
    deanImg.classList.remove("out");
    void deanImg.offsetWidth;
    deanImg.classList.add("in");
    play("dean");
    if (voiceId) say(voiceId, ms);
    deanTimer = setTimeout(() => {
      deanImg.classList.remove("in");
      deanImg.classList.add("out");
    }, ms);
  }
  function sayText(text, ms = 4500) {
    $("sub").innerHTML = `<b>\u7CFB\u4E3B\u4EFB</b>${text}`;
    $("sub").classList.remove("hidden");
    clearTimeout(say.t);
    say.t = setTimeout(() => $("sub").classList.add("hidden"), ms);
  }
  function deanSays(text, ms = 4200) {
    dean("peek", null, ms);
    sayText(text, ms);
  }
  function say(id, ms = 4500) {
    const v = voices[id];
    if (v) v.play().catch(() => {
    });
    $("sub").innerHTML = `<b>\u7CFB\u4E3B\u4EFB</b>${VOICE_TEXT[id]}`;
    $("sub").classList.remove("hidden");
    clearTimeout(say.t);
    say.t = setTimeout(() => $("sub").classList.add("hidden"), ms);
  }
  function narrate(text, ms = 5200) {
    const n = $("narr");
    if (!text) return;
    n.textContent = text;
    n.classList.remove("off", "in");
    void n.offsetWidth;
    n.classList.add("in");
    clearTimeout(narrate.t);
    narrate.t = setTimeout(() => n.classList.add("off"), ms);
  }
  function sayAbout(k, src) {
    const sp = STATIONS[game.station].spots[k];
    run.seen.add(`${game.station}:${k}`);
    narrate(sp.say, 3600);
    const c = cutout(`S${game.station}:${k}`, src, "c-egg");
    if (c) {
      requestAnimationFrame(() => c.classList.add("lift"));
      setTimeout(() => c.remove(), 1300);
    }
  }
  function shake(big) {
    if (reduced) return;
    stage.classList.remove("shake-s", "shake-l");
    void stage.offsetWidth;
    stage.classList.add(big ? "shake-l" : "shake-s");
  }
  function flash(kind) {
    const f = document.createElement("div");
    f.className = "flash" + (kind ? " " + kind : "");
    stage.appendChild(f);
    setTimeout(() => f.remove(), 1e3);
  }
  function burst(text, small) {
    const b = $("burst");
    b.textContent = text;
    b.className = "burst" + (small ? " small" : "");
    void b.offsetWidth;
    b.classList.add("go");
  }
  function floorFx(kind) {
    const el = $("floorNo");
    el.classList.remove("pop", "reset");
    void el.offsetWidth;
    el.classList.add(kind);
  }
  function glitch() {
    if (reduced) return;
    stage.classList.remove("glitch");
    void stage.offsetWidth;
    stage.classList.add("glitch");
  }
  function grade() {
    const h = nowHour();
    const g = gradeFor(h, game.phase === "loop" ? game.count : 0);
    stage.style.setProperty("--grade", g.filter);
    stage.style.setProperty("--tint", g.tint);
    stage.style.setProperty("--vig", String(g.vig));
    $("clock").textContent = `${fmtHour(h)} ${hourLabel(h)}`;
  }
  function toast(text) {
    const t = $("toast");
    t.textContent = text;
    t.classList.remove("hidden");
    clearTimeout(toast.t);
    toast.t = setTimeout(() => t.classList.add("hidden"), Math.max(1400, text.length * 110));
  }
  function ripple(x, y) {
    const r = document.createElement("div");
    r.className = "ripple";
    r.style.left = x + "px";
    r.style.top = y + "px";
    stage.appendChild(r);
    setTimeout(() => r.remove(), 600);
  }
  var loaded = /* @__PURE__ */ new Set();
  function prefetch(i) {
    const st = STATIONS[i % STATIONS.length];
    for (const u of [...st.frames, st.still]) if (!loaded.has(u)) {
      loaded.add(u);
      new Image().src = u;
    }
  }
  var showToken = 0;
  function show(src, push) {
    const back = layers[1 - front], token = ++showToken;
    back.onload = () => {
      if (token !== showToken) return;
      back.style.animation = "none";
      void back.offsetWidth;
      back.style.animation = push && !reduced ? "push 650ms ease-out forwards" : "";
      back.classList.add("on");
      layers[front].classList.remove("on");
      front = 1 - front;
    };
    back.src = src;
  }
  var stopSrc = (st, an) => (an == null ? void 0 : an.still) || st.still;
  var tourLeft = () => run.toured.has(`${game.station}:${mustIndex(game.station)}`) ? 0 : 1;
  function setButtons() {
    const off = busy || game.phase === "ending";
    $("btnBack").disabled = off;
    $("btnFwd").disabled = off || game.phase === "tour" && tourLeft() > 0;
  }
  function placeBtn(b, s) {
    Object.assign(b.style, { left: s.x + "%", top: s.y + "%", width: s.w + "%", height: s.h + "%" });
    if (s.y < 16) b.classList.add("lbl-below");
  }
  function cutout(key, src, kind) {
    const polys = OUTLINES[key];
    if (!polys || !polys.length) return null;
    const wrap = document.createElement("div");
    wrap.className = "cut " + kind;
    let x0 = 100, y0 = 100, x1 = 0, y1 = 0;
    for (const p of polys) {
      const d = document.createElement("div");
      d.className = "cut-in";
      d.style.backgroundImage = `url("${src}")`;
      d.style.clipPath = `polygon(${p.map(([x, y]) => `${x}% ${y}%`).join(",")})`;
      wrap.appendChild(d);
      for (const [x, y] of p) {
        x0 = Math.min(x0, x);
        y0 = Math.min(y0, y);
        x1 = Math.max(x1, x);
        y1 = Math.max(y1, y);
      }
    }
    wrap.style.transformOrigin = `${(x0 + x1) / 2}% ${(y0 + y1) / 2}%`;
    $("cuts").appendChild(wrap);
    return wrap;
  }
  function linkLift(btn, cut) {
    if (!cut) return;
    btn.classList.add("has-cut");
    const on = () => cut.classList.add("lift"), off = () => cut.classList.remove("lift");
    btn.addEventListener("pointerenter", on);
    btn.addEventListener("pointerleave", off);
    btn.addEventListener("pointerdown", on);
    btn.addEventListener("pointerup", off);
  }
  function liftFound(anomalyId) {
    const a = ANOMALIES.find((x) => x.id === anomalyId);
    if (!a) return;
    const c = cutout(a.id, a.still, "c-found");
    if (!c) return;
    requestAnimationFrame(() => c.classList.add("lift"));
  }
  function renderSpots() {
    const box = $("spots");
    box.innerHTML = "";
    $("cuts").innerHTML = "";
    const curSrc = stopSrc(STATIONS[game.station], game.phase === "loop" ? anomalyAt(game, ANOMALIES) : null);
    if (game.phase === "tour") {
      STATIONS[game.station].spots.forEach((s, i) => {
        if (i !== mustIndex(game.station)) return;
        const b = document.createElement("button");
        const seen = run.toured.has(`${game.station}:${i}`);
        b.className = "spot" + (seen ? " done" : "");
        placeBtn(b, s);
        b.innerHTML = `<span>${s.label}</span>`;
        b.setAttribute("aria-label", `\u8ABF\u67E5\uFF1A${s.label}`);
        const cut = cutout(`S${game.station}:${i}`, curSrc, seen ? "c-spot c-done" : "c-spot");
        linkLift(b, cut);
        b.onclick = (e) => {
          e.stopPropagation();
          if (busy) return;
          run.toured.add(`${game.station}:${i}`);
          play("click");
          b.classList.add("done");
          cut == null ? void 0 : cut.classList.add("c-done");
          run.seen.add(`${game.station}:${i}`);
          narrate(s.say, 4200);
          $("tip").textContent = "\u770B\u5B8C\u4E86\uFF0C\u6309\u300C\u5F80\u524D\u300D\u7E7C\u7E8C\u8D70\u3002";
          if (s.action === "takeItems" && !quests.taken) {
            takeItems(quests);
            nbPulse();
            burst("\u6536\u5230\u59D4\u8A17", true);
            renderSpots();
          }
          setButtons();
          updateCoach();
          if (tourLeft() === 0) toast("\u9019\u7AD9\u770B\u5B8C\u4E86\uFF0C\u53EF\u4EE5\u5F80\u524D\u8D70");
        };
        box.appendChild(b);
      });
    }
    if (pending(quests).length) {
      for (const t of targetsAt(game.station)) {
        const b = document.createElement("button");
        b.className = "spot deliver";
        placeBtn(b, t.box);
        b.innerHTML = `<span>\u9001\u30FB${t.label}</span>`;
        linkLift(b, cutout(`T:${t.id}`, curSrc, "c-deliver"));
        b.setAttribute("aria-label", `\u4EA4\u4ED8\u5230 ${t.label}`);
        b.onclick = (e) => {
          e.stopPropagation();
          if (!busy) openDeliver(t);
        };
        box.appendChild(b);
      }
    }
    for (const c of visibleClues(game.station, nowHour(), game.phase)) {
      const got = clues.found.includes(c.id);
      const b = document.createElement("button");
      b.className = "spot clue" + (got ? " done" : "");
      placeBtn(b, c.box);
      b.innerHTML = `<span>\u7DDA\u7D22\u30FB${c.label}</span>`;
      b.setAttribute("aria-label", `\u7DDA\u7D22\uFF1A${c.label}`);
      const cut = cutout(c.outline, curSrc, got ? "c-clue c-done" : "c-clue");
      linkLift(b, cut);
      b.onclick = (e) => {
        e.stopPropagation();
        if (busy) return;
        if (collect(clues, c.id)) {
          play("found", 0.8);
          burst("\u7DDA\u7D22\uFF01", true);
          nbPulse();
          b.classList.add("done");
          cut == null ? void 0 : cut.classList.add("c-done");
        } else play("click");
        toast(c.text);
        if (allFound(clues) && !clues.opened) setTimeout(() => toast("4 \u689D\u7DDA\u7D22\u90FD\u5230\u624B\u4E86\uFF01D0646 \u90A3\u908A\u7684\u8D70\u5ECA\u6DF1\u8655\u597D\u50CF\u6709\u8DEF\u2026\u2026"), Math.max(1800, c.text.length * 110 + 300));
        renderBranch();
      };
      box.appendChild(b);
    }
    renderBranch();
  }
  function renderInvite() {
    const t = teacherAt(game.station, game.phase);
    const b = $("invite");
    b.classList.toggle("hidden", !t);
    if (t) b.innerHTML = `${cardBook.cards.some((c) => c.id === t.id) ? "\u2714 " : ""}${displayName(t)}\u7684\u9080\u8ACB`;
  }
  function renderLab() {
    const l = labAt(game.station, game.phase), b = $("labBtn");
    b.classList.toggle("hidden", !l);
    if (l) {
      const v = achv.labs[l.id];
      b.textContent = `\u9032\u5165 ${l.code} ${l.name}${v && v.stars ? "\u3000" + starRow(v.stars) : ""} \u2192`;
    }
  }
  function renderBranch() {
    renderInvite();
    renderLab();
    $("branch").classList.toggle("hidden", !(game.phase === "loop" && game.station === 6 && allFound(clues)));
    $("branch").textContent = clues.opened ? "\u9032\u5165 D0647 \u2192" : "\u5F80\u8D70\u5ECA\u6DF1\u8655 \u2192";
  }
  function nbPulse() {
    const n = $("nbBtn");
    n.classList.remove("pulse");
    void n.offsetWidth;
    n.classList.add("pulse");
  }
  function openSheet(html, cls = "") {
    const s = $("sheet");
    s.innerHTML = html;
    s.className = "sheet " + cls;
    s.classList.remove("hidden");
    busy = true;
    setButtons();
    coachAt(null);
    s.querySelectorAll("[data-close]").forEach((b) => b.onclick = closeSheet);
  }
  function closeSheet() {
    $("sheet").classList.add("hidden");
    busy = false;
    setButtons();
    updateCoach();
  }
  var cardFace = (t, cls = "") => t.card ? `<img class="${cls}" src="${t.card}" alt="">` : `<span class="cardface ${cls}" aria-hidden="true">${t.mark}</span>`;
  function seenList() {
    if (!run.seen.size) return `<li>\u9084\u6C92\u6709\u3002\u9EDE\u9EDE\u770B\u756B\u9762\u4E0A\u7684\u6771\u897F\u3002</li>`;
    return [...run.seen].map((key) => {
      const [st, k] = key.split(":").map(Number);
      const sp = STATIONS[st].spots[k];
      return `<li class="ok"><b>${sp.label}</b><br>${pub(sp.text)}</li>`;
    }).join("");
  }
  function cardGrid() {
    return TEACHERS.map((t) => {
      const c = cardBook.cards.find((x) => x.id === t.id);
      return c ? `<figure class="mini">${cardFace(t)}<figcaption><b>${displayName(t)}</b>${c.best} \u5206</figcaption></figure>` : `<figure class="mini lock"><span>\uFF1F</span><figcaption><b>${t.skill}</b>\u672A\u53D6\u5F97</figcaption></figure>`;
    }).join("");
  }
  function openNotebook() {
    var _a, _b;
    if (!$("start").classList.contains("hidden") || walking) return;
    play("click");
    const items = quests.taken ? ITEMS.map((i) => `<li class="${quests.delivered.includes(i.id) ? "ok" : ""}"><b>${i.name}</b><br>${quests.delivered.includes(i.id) ? "\u5DF2\u9001\u9054" : i.hint}</li>`).join("") : `<li>\u9084\u6C92\u6709\u59D4\u8A17\u3002\u5C0E\u89BD\u5708\u7D93\u904E\u7CFB\u8FA6\u9580\u53E3\u6642\u770B\u770B\u3002</li>`;
    const st = stamps();
    const stampList = st.length ? st.map((s) => `<li class="ok"><b>${s.name}</b><br>${s.text}</li>`).join("") : `<li>\u9084\u6C92\u6709\u7D00\u5FF5\u7AE0\u3002</li>`;
    const clueList = clues.found.length ? CLUES.filter((c) => clues.found.includes(c.id)).map((c) => `<li class="ok"><b>${c.label}</b><br>${c.text}</li>`).join("") : `<li>\u9084\u6C92\u6709\u7DDA\u7D22\u3002\u5FAA\u74B0\u958B\u59CB\u5F8C\uFF0C\u7559\u610F\u756B\u9762\u4E0A\u767C\u4EAE\u7684\u300C\u7DDA\u7D22\u300D\u3002</li>`;
    const slots = CLUES.map((c, i) => clues.found.includes(c.id) ? "\uFF1F" : "\uFF3F").join(" ");
    openSheet(`<button class="x" data-close aria-label="\u95DC\u9589\u624B\u5E33">\xD7</button><h3>\u624B\u5E33</h3><p class="clock">\u73FE\u5728 ${fmtHour(nowHour())}\uFF08${hourLabel(nowHour())}\uFF09</p>
    <h4>\u7CFB\u8FA6\u59D4\u8A17</h4><ul>${items}</ul>
    <h4>\u90B1\u8001\u5E2B\u7814\u7A76\u5BA4\u7684\u5BC6\u78BC\u3000${slots}\uFF08${clues.found.length}/${CLUES.length}\uFF09</h4><ul>${clueList}</ul>
    <h4>\u770B\u904E\u7684\u6771\u897F\uFF08${run.seen.size}\uFF09</h4><ul>${seenList()}</ul>
    ${labWall()}
    <h4>\u8001\u5E2B\u7C3D\u540D\u5361\uFF08${cardBook.cards.length}/${TEACHERS.length}\uFF09</h4><div class="cardgrid">${cardGrid()}</div>
    ${allCollected(cardBook) ? `<button class="ghost" data-ending>\u91CD\u770B\u96B1\u85CF\u7D50\u5C40</button>` : `<p class="dim">\u5FAA\u74B0\u5708\u7D93\u904E\u6709\u8001\u5E2B\u7684\u7AD9\uFF0C\u6309\u53F3\u4E0B\u89D2\u300C\u9080\u8ACB\u300D\u6311\u6230\u5C0F\u904A\u6232\u3002</p>`}
    <h4>\u7D00\u5FF5\u7AE0</h4><ul>${stampList}</ul><button class="go" data-close>\u95DC\u9589</button>`);
    (_a = $("sheet").querySelector("[data-ending]")) == null ? void 0 : _a.addEventListener("click", () => {
      closeSheet();
      hiddenEnding();
    });
    (_b = $("sheet").querySelector("[data-share]")) == null ? void 0 : _b.addEventListener("click", () => {
      closeSheet();
      openShare();
    });
  }
  function openDeliver(target) {
    play("click");
    const list = pending(quests);
    openSheet(`<h3>\u9001\u5230 ${target.label}\uFF1F</h3><p>\u9078\u4E00\u4EF6\u8981\u4EA4\u51FA\u53BB\u7684\u6771\u897F\uFF1A</p>
    <div class="choices">${list.map((i) => `<button data-item="${i.id}"><b>${i.name}</b><small>${i.hint}</small></button>`).join("")}</div>
    <button class="ghost" data-close>\u5148\u4E0D\u8981</button>`);
    $("sheet").querySelectorAll("[data-item]").forEach((b) => {
      b.onclick = () => {
        const r = deliver(quests, b.dataset.item, target.id);
        closeSheet();
        if (r.ok) {
          play("correct");
          burst(r.stamp ? "\u84CB\u7AE0\uFF01" : "\u9001\u9054\uFF01", !r.stamp);
          shake(false);
          toast(r.text);
          if (r.stamp) {
            play("clear");
            setTimeout(() => dean("cheer", null, 2200), 500);
            toast(`\u7D00\u5FF5\u7AE0\u300C${r.stamp.name}\u300D\uFF1A${r.stamp.text}`);
          }
          renderSpots();
        } else {
          play("wrong", 0.5);
          toast(r.text);
        }
      };
    });
  }
  function renderStop() {
    var _a;
    const st = STATIONS[game.station];
    const an = game.phase === "loop" ? anomalyAt(game, ANOMALIES) : null;
    if (!layers[front].src.endsWith(stopSrc(st, an)) || showToken === 0) show(stopSrc(st, an), false);
    $("floorNo").textContent = `${game.count}F`;
    $("where").textContent = game.phase === "tour" ? `\u5C0E\u89BD\u5708\u30FB${st.name}` : `\u7B2C ${game.lap} \u5708\u30FB${st.name}`;
    const tip = $("tip");
    if (game.phase === "tour") {
      tip.textContent = tourLeft() ? "\u9EDE\u4E00\u4E0B\u767C\u4EAE\u7684\u5730\u65B9\u770B\u770B\u3002" : "\u770B\u5B8C\u4E86\uFF0C\u6309\u300C\u5F80\u524D\u300D\u7E7C\u7E8C\u8D70\u3002";
      tip.classList.remove("hidden");
    } else if (!tip.dataset.keep) tip.classList.add("hidden");
    delete tip.dataset.keep;
    renderSpots();
    grade();
    updateCoach();
    const anHere = game.phase === "loop" ? anomalyAt(game, ANOMALIES) : null;
    if (anHere) startHint(anHere);
    if (game.phase === "loop" && game.lap === 2 && game.station === 0) setTimeout(() => deanSays(COACH.lap2, 4e3), 500);
    if (q.has("debug")) {
      $("dbg").textContent = `seed ${seed}\uFF5C\u9019\u5708\u7570\u5E38\uFF1A${(_a = game.anomaly) != null ? _a : "\u7121"}`;
      $("dbg").classList.remove("hidden");
    }
    prefetch(game.station + 1);
  }
  var STEP_MS = 620;
  function walk() {
    const st = STATIONS[game.station];
    const an = game.phase === "loop" ? anomalyAt(game, ANOMALIES) : null;
    const seq = [...st.frames, stopSrc(st, an)];
    busy = true;
    setButtons();
    stopHint();
    coachAt(null);
    narrate(narrFor(game.station, game.phase), 5200);
    $("spots").innerHTML = "";
    $("cuts").innerHTML = "";
    let i = 0, timer = null, ended = false;
    const done = () => {
      if (ended) return;
      ended = true;
      clearTimeout(timer);
      walking = null;
      busy = false;
      renderStop();
      setButtons();
    };
    const next = () => {
      if (i >= seq.length) return done();
      if (i < seq.length - 1) play("footstep", 1, STEP_MS - 20);
      show(seq[i], i < seq.length - 1);
      i++;
      timer = setTimeout(next, STEP_MS);
    };
    walking = done;
    next();
  }
  function showCard(tag, anomalyId, onClose) {
    const a = ANOMALIES.find((x) => x.id === anomalyId);
    $("cardTag").textContent = tag;
    $("cardTitle").textContent = a.card.title;
    $("cardText").textContent = pub(a.card.text);
    const card = $("card");
    card.classList.add("hidden");
    void card.offsetWidth;
    card.classList.remove("hidden");
    busy = true;
    setButtons();
    $("cardOk").onclick = () => {
      card.classList.add("hidden");
      busy = false;
      setButtons();
      onClose && onClose();
    };
    $("cardOk").focus();
  }
  function remember(id) {
    if (id && !save.dex.includes(id)) {
      save.dex.push(id);
      writeSave(save);
    }
  }
  function openKeypad() {
    if (clues.opened) {
      enterD0647();
      return;
    }
    play("click");
    let code = "";
    openSheet(`<h3>D0647 \u9580\u9396</h3><p>\u8F38\u5165 4 \u4F4D\u6578\u5BC6\u78BC\uFF08\u7DDA\u7D22\u5728\u624B\u5E33\u88E1\uFF09\u3002</p>
    <div class="code" id="codeShow">\uFF3F \uFF3F \uFF3F \uFF3F</div>
    <div class="keypad">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `<button data-n="${n}">${n}</button>`).join("")}
      <button data-n="clr">\u6E05\u9664</button><button data-n="0">0</button><button data-n="ok" class="ok">\u958B\u9396</button></div>
    <p class="why" id="codeMsg"></p><button class="ghost" data-close>\u5148\u4E0D\u8981</button>`);
    const showCode = () => {
      $("codeShow").textContent = [...code.padEnd(CODE.length, "\uFF3F")].join(" ");
    };
    $("sheet").querySelectorAll("[data-n]").forEach((b) => {
      b.onclick = () => {
        const n = b.dataset.n;
        if (n === "clr") code = "";
        else if (n === "ok") {
          const r = tryCode(clues, code);
          $("codeMsg").textContent = r.text;
          if (r.ok) {
            play("clear");
            setTimeout(() => {
              closeSheet();
              enterD0647(true);
            }, 700);
          } else {
            play("wrong", 0.6);
            shake(false);
            code = "";
          }
        } else if (code.length < CODE.length) {
          code += n;
          play("click", 0.6);
          $("codeMsg").textContent = "";
        }
        showCode();
      };
    });
  }
  function actor(src, ms) {
    clearTimeout(deanTimer);
    deanImg.src = src;
    deanImg.style.right = "-2%";
    deanImg.classList.remove("out");
    void deanImg.offsetWidth;
    deanImg.classList.add("in");
    if (ms) deanTimer = setTimeout(() => {
      deanImg.classList.remove("in");
      deanImg.classList.add("out");
    }, ms);
  }
  function speak(name, text, ms = 5e3) {
    $("sub").innerHTML = `<b>${name}</b>${text}`;
    $("sub").classList.remove("hidden");
    clearTimeout(say.t);
    say.t = setTimeout(() => $("sub").classList.add("hidden"), ms);
  }
  async function enterD0647(first) {
    busy = true;
    setButtons();
    $("spots").innerHTML = "";
    $("cuts").innerHTML = "";
    $("branch").classList.add("hidden");
    $("where").textContent = "\u652F\u7DDA\u30FBD0647 \u7814\u7A76\u5BA4";
    play("footstep", 1, 560);
    show("frames/s8_a.webp", true);
    await sleep(650);
    play("footstep", 1, 560);
    show("frames/s8.webp", false);
    await sleep(600);
    actor("frames/qiu_greet.webp", 0);
    play("dean");
    if (first) {
      burst("\u84CB\u7AE0\uFF01\u627E\u5230\u90B1\u8001\u5E2B");
      nbPulse();
    }
    speak("\u90B1\u58EB\u5C55\u8001\u5E2B", "\u54E6\uFF1F\u5C45\u7136\u627E\u5F97\u5230 D0647\uFF01\u6211\u662F\u90B1\u58EB\u5C55\uFF0C\u6559 3D \u89D2\u8272\u52D5\u756B\u548C\u52D5\u756B\u5287\u672C\u5275\u4F5C\uFF0C\u5C08\u9577\u662F\u52D5\u756B\u5C0E\u6F14\u8DDF\u93E1\u982D\u8A9E\u8A00\u3002", 6e3);
    await sleep(first ? 1200 : 300);
    openSheet(`<h3>D0647\u30FB\u90B1\u58EB\u5C55\u8001\u5E2B</h3>
    <ul><li><b>\u5C08\u9577</b><br>\u96FB\u8166\u52D5\u756B\u3001\u52D5\u756B\u5C0E\u6F14\u3001\u6578\u4F4D\u7279\u6548\u3001\u93E1\u982D\u8A9E\u8A00</li>
    <li><b>\u8AB2\u7A0B</b><br>3D \u89D2\u8272\u52D5\u756B\u30013D \u904A\u6232\u5F15\u64CE\u61C9\u7528\u3001\u52D5\u756B\u5287\u672C\u5275\u4F5C\u30013D \u5217\u5370\u61C9\u7528\u5BE6\u52D9</li>
    <li><b>2026</b><br>\u6307\u5C0E\u7684\u52D5\u756B\u4F5C\u54C1\u5165\u570D\u653E\u8996\u5927\u8CDE\u52D5\u756B\u985E</li></ul>
    <p class="why">\u300C\u807D\u8AAA\u4F60\u4E5F\u611B\u5C0D\u6230\uFF1F\u4F86\u4E00\u5834\u7247\u5834\u5C0D\u6C7A\u5427\uFF0C\u7528\u93E1\u982D\u8A9E\u8A00\u6253\u6557\u6211\uFF01\u300D</p>
    <button class="go" data-fight>\u63A5\u53D7\u7247\u5834\u5C0D\u6C7A</button><button class="ghost" data-close>\u56DE\u5230\u8D70\u5ECA</button>`, "left");
    $("sheet").querySelector("[data-fight]").onclick = startFight;
    $("sheet").querySelector("[data-close]").onclick = () => {
      closeSheet();
      deanImg.classList.remove("in");
      deanImg.classList.add("out");
      $("sub").classList.add("hidden");
      show(stopSrc(STATIONS[game.station], anomalyAt(game, ANOMALIES)), false);
      renderStop();
    };
  }
  var ARROW = { U: "\u2191", D: "\u2193", L: "\u2190", R: "\u2192", UL: "\u2196", UR: "\u2197", DL: "\u2199", DR: "\u2198", A: "A" };
  var STAMP_FIGHT = { id: "fight", name: "\u7247\u5834\u6BBA\u9752", text: "\u5728 D0647 \u7247\u5834\u5C0D\u6C7A\u8D0F\u4E86\u90B1\u58EB\u5C55\u8001\u5E2B\uFF0C\u5B78\u6703\u6416\u93E1\u3001\u4EF0\u89D2\u3001\u63A8\u8ECC\u3001\u8377\u862D\u89D2\u3002" };
  var fight = null;
  var fightRaf = 0;
  var fightWon = false;
  var lastAttack = null;
  var fightOn = () => !$("fight").classList.contains("hidden");
  function hpDraw() {
    $("hpQ").textContent = "\u25A0".repeat(fight.qiu) + "\u25A1".repeat(QIU_HP - fight.qiu);
    $("hpM").textContent = "\u2665".repeat(fight.me) + "\u2661".repeat(PLAYER_HP - fight.me);
  }
  function startFight() {
    closeSheet();
    deanImg.classList.remove("in");
    deanImg.classList.add("out");
    $("sub").classList.add("hidden");
    fight = createFight(rng);
    $("fbg").style.filter = `blur(2px) brightness(.75) ${stage.style.getPropertyValue("--grade")}`;
    $("movelist").innerHTML = Object.entries(MOVES).map(([id, m]) => `<div data-m="${id}"><span>${m.name}</span><code>${m.cmd.map((k) => ARROW[k]).join(" ")}</code></div>`).join("");
    $("fight").classList.remove("hidden");
    busy = true;
    setButtons();
    $("fqiu").src = "frames/qiu_ready.webp";
    hpDraw();
    $("tbar").style.transform = "scaleX(1)";
    $("tele").innerHTML = `\u300CAction\uFF01\u300D<small>\u770B\u4ED6\u7684\u9810\u544A\uFF0C\u7167\u5206\u93E1\u8868\u8F38\u5165\u53CD\u64CA\uFF08\u659C\u65B9\u5411\u53EF\u7701\u7565\uFF09\u3002\u96FB\u8166\u53EF\u7528\u65B9\u5411\u9375\uFF0BZ\u3002</small>`;
    play("dean");
    play("sting", 0.5);
    setTimeout(nextFightRound, 2600);
  }
  function nextFightRound() {
    if (!fight || fight.over) return;
    const atk = lastAttack = nextRound(fight, performance.now());
    $("fqiu").src = "frames/qiu_attack.webp";
    const hint2 = fight.round <= 3;
    $("tele").innerHTML = `${atk.tele}<small>${atk.name}${hint2 ? `\u3000\u2192 \u7528\u300C${MOVES[atk.counter].name}\u300D` : ""}</small>`;
    document.querySelectorAll("#movelist div").forEach((d) => d.classList.toggle("want", hint2 && d.dataset.m === atk.counter));
    const total = fight.deadline - performance.now();
    cancelAnimationFrame(fightRaf);
    const tick = () => {
      if (!fight || !fight.attack) return;
      $("tbar").style.transform = `scaleX(${Math.max(0, (fight.deadline - performance.now()) / total)})`;
      const r = timeout(fight, performance.now());
      if (r) {
        fightResult(r);
        return;
      }
      fightRaf = requestAnimationFrame(tick);
    };
    fightRaf = requestAnimationFrame(tick);
  }
  function fightKey(k) {
    if (!fight || fight.over || !fight.attack) return;
    play("click", 0.35);
    const r = input(fight, k, performance.now());
    if (r.type !== "pending") fightResult(r);
  }
  function fightResult(r) {
    var _a, _b, _c, _d, _e;
    cancelAnimationFrame(fightRaf);
    hpDraw();
    document.querySelectorAll("#movelist div").forEach((d) => d.classList.remove("want"));
    const cam = $("fcam"), q2 = $("fqiu");
    if (r.type === "hit") {
      play("found");
      cam.className = "fcam";
      void cam.offsetWidth;
      cam.classList.add("cam-" + r.move.cam.key);
      q2.classList.remove("hit");
      void q2.offsetWidth;
      q2.classList.add("hit");
      $("tele").innerHTML = `\u547D\u4E2D\uFF01${r.move.name}<small>${r.move.cam.term}</small>`;
      const term = $("term");
      term.innerHTML = `<b>${r.move.cam.term}</b>${r.move.cam.def}`;
      term.classList.add("hidden");
      void term.offsetWidth;
      term.classList.remove("hidden");
      clearTimeout(fightResult.t);
      fightResult.t = setTimeout(() => term.classList.add("hidden"), 2200);
    } else {
      play("wrong");
      const box = $("fbox");
      box.classList.remove("shake-l");
      void box.offsetWidth;
      box.classList.add("shake-l");
      $("tele").innerHTML = r.reason === "slow" ? `\u592A\u6162\u4E86\uFF01\u65B9\u5411\u5C0D\u4E86\uFF0C\u4F46\u76F8\u9130\u6309\u9375\u8981\u5728 0.5 \u79D2\u5167\u6309\u5B8C<small>\u300C${(_b = (_a = MOVES[lastAttack == null ? void 0 : lastAttack.counter]) == null ? void 0 : _a.name) != null ? _b : ""}\u300D\u518D\u5FEB\u4E00\u9EDE</small>` : `NG\uFF01\u88AB\u300C${(_c = lastAttack == null ? void 0 : lastAttack.name) != null ? _c : "\u62DB\u5F0F"}\u300D\u6253\u4E2D\u4E86<small>\u6B63\u89E3\u662F\u300C${(_e = (_d = MOVES[lastAttack == null ? void 0 : lastAttack.counter]) == null ? void 0 : _d.name) != null ? _e : ""}\u300D</small>`;
    }
    if (r.over === "win") return fightWin();
    if (r.over === "lose") return fightLose();
    setTimeout(() => {
      q2.src = "frames/qiu_ready.webp";
    }, 500);
    setTimeout(nextFightRound, 1500);
  }
  function fightEndButtons(html) {
    var _a;
    $("tele").innerHTML = html;
    (_a = $("tele").querySelector("[data-retry]")) == null ? void 0 : _a.addEventListener("click", startFight);
    $("tele").querySelector("[data-leave]").addEventListener("click", leaveFight);
  }
  function fightWin() {
    fightWon = true;
    play("clear");
    setTimeout(() => {
      $("fqiu").src = "frames/qiu_ko.webp";
      fightEndButtons(`\u300C\u6BBA\u9752\uFF01\u300D<small>\u4F60\u7684\u904B\u93E1\u611F\u5F88\u597D\uFF0C\u4F86\u52D5\u904A\u7CFB\u4E00\u8D77\u62CD\u7247\u5427\uFF01\u7D00\u5FF5\u7AE0\u300C${STAMP_FIGHT.name}\u300D</small>
      <div class="row" style="margin-top:6px"><button class="go" data-leave>\u56DE\u5230\u8D70\u5ECA</button></div>`);
      nbPulse();
    }, 700);
  }
  function fightLose() {
    setTimeout(() => {
      $("fqiu").src = "frames/qiu_greet.webp";
      fightEndButtons(`\u300CNG\uFF01\u9019\u9846\u93E1\u982D\u91CD\u4F86\uFF01\u300D<small>\u770B\u9810\u544A\u3001\u5C0D\u5206\u93E1\u8868\uFF0C\u659C\u65B9\u5411\u53EF\u4EE5\u7701\u7565\u3002</small>
      <div class="row" style="margin-top:6px"><button class="go" data-retry>\u518D\u62CD\u4E00\u6B21</button><button class="ghost" data-leave>\u56DE\u5230\u8D70\u5ECA</button></div>`);
    }, 700);
  }
  function leaveFight() {
    cancelAnimationFrame(fightRaf);
    fight = null;
    $("fight").classList.add("hidden");
    busy = false;
    show(stopSrc(STATIONS[game.station], anomalyAt(game, ANOMALIES)), false);
    renderStop();
    setButtons();
  }
  var held = /* @__PURE__ */ new Set();
  var dirOf = () => {
    const v = (held.has("ArrowUp") ? "U" : held.has("ArrowDown") ? "D" : "") + (held.has("ArrowLeft") ? "L" : held.has("ArrowRight") ? "R" : "");
    return v || null;
  };
  addEventListener("keyup", (e) => held.delete(e.key));
  document.querySelectorAll("#fight [data-k]").forEach((b) => {
    b.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      b.classList.add("on");
      fightKey(b.dataset.k);
    });
    for (const ev of ["pointerup", "pointerleave", "pointercancel"]) b.addEventListener(ev, () => b.classList.remove("on"));
  });
  function coachAt(el, text) {
    const c = $("coach");
    if (!el) {
      c.classList.add("hidden");
      return;
    }
    const a = $("app").getBoundingClientRect(), r = el.getBoundingClientRect();
    Object.assign(c.style, { left: r.left - a.left - 6 + "px", top: r.top - a.top - 6 + "px", width: r.width + 12 + "px", height: r.height + 12 + "px" });
    const sp = c.querySelector("span");
    sp.textContent = text;
    sp.style.marginLeft = "0px";
    c.classList.toggle("up", r.top - a.top > a.height * 0.55);
    c.classList.remove("hidden");
    const t = sp.getBoundingClientRect();
    const shift = Math.min(0, a.right - 8 - t.right) || Math.max(0, a.left + 8 - t.left);
    sp.style.marginLeft = shift + "px";
  }
  function updateCoach() {
    if (busy || game.phase !== "tour" || game.station > 1) return coachAt(null);
    const next = [...$("spots").querySelectorAll(".spot:not(.done):not(.deliver):not(.clue)")][0];
    coachAt(next || $("btnFwd"), next ? COACH.spot : game.station === 0 ? COACH.fwd : COACH.done);
  }
  addEventListener("resize", () => updateCoach());
  function stopHint() {
    var _a;
    clearInterval(hint.timer);
    hint.timer = null;
    (_a = $("spots").querySelector(".hintbox")) == null ? void 0 : _a.remove();
  }
  function startHint(an) {
    stopHint();
    Object.assign(hint, { t0: performance.now(), mis: 0, stage: 0, on: game.lap <= 3 || run.failStreak >= 2 });
    const cue = cueFor(game.lap, run.failStreak);
    if (cue >= 1) setTimeout(glitch, 250);
    if (cue === 2) setTimeout(() => deanSays(COACH.loop1, 4200), 700);
    if (hint.on) hint.timer = setInterval(() => checkHint(an), 1e3);
  }
  function checkHint(an) {
    if (busy || anomalyAt(game, ANOMALIES) !== an) return;
    const st = hintStage((performance.now() - hint.t0) / 1e3, hint.mis, hint.on);
    if (st > hint.stage) showHint(an, st);
  }
  function showHint(an, st) {
    hint.stage = st;
    deanSays(HINT_TEXT[st].replace("{area}", areaOf(an.hits[0])), 4600);
    if (st === 3 && !$("spots").querySelector(".hintbox")) {
      for (const h of an.hits) {
        const b = document.createElement("div");
        b.className = "hintbox";
        placeBtn(b, h);
        $("spots").appendChild(b);
      }
      clearInterval(hint.timer);
    }
  }
  var mgScripts = {};
  function loadScript(src) {
    if (!mgScripts[src]) mgScripts[src] = new Promise((ok, ng) => {
      const el = document.createElement("script");
      el.src = src;
      el.onload = ok;
      el.onerror = () => {
        delete mgScripts[src];
        ng(new Error(src));
      };
      document.head.appendChild(el);
    });
    return mgScripts[src];
  }
  var mgHandle = null;
  var mgCurrent = null;
  function openInvite() {
    const t = teacherAt(game.station, game.phase);
    if (!t || busy) return;
    play("click");
    stopHint();
    const have = cardBook.cards.find((c) => c.id === t.id);
    openSheet(`<button class="x" data-close aria-label="\u95DC\u9589">\xD7</button><h3>${displayName(t)}\u7684\u9080\u8ACB</h3>
    <p>${t.invite}</p><p class="mgskill">\u5C08\u9577\uFF1A${t.skill}\u30FB60 \u79D2\u5C0F\u904A\u6232</p>
    ${have ? `<p class="mgbest">\u5DF2\u62FF\u5230\u7C3D\u540D\u5361\uFF0C\u6700\u9AD8\u5206 ${have.best}\u3002\u518D\u73A9\u53EF\u4EE5\u5237\u65B0\u7D00\u9304\u3002</p>` : `<p class="mgbest">\u8D0F\u4E86\u53EF\u4EE5\u62FF\u5230\u300C${displayName(t)}\u300D\u7684\u7C3D\u540D\u5361\uFF0C\u96C6\u6EFF ${TEACHERS.length} \u5F35\u6709\u9A5A\u559C\u3002</p>`}
    <div class="row"><button class="go" data-mg>\u63A5\u53D7\u6311\u6230</button><button class="ghost" data-close>\u5148\u4E0D\u8981</button></div>`);
    $("sheet").querySelector("[data-mg]").onclick = () => startMinigame(t);
  }
  async function runMinigame(e) {
    closeSheet();
    deanImg.classList.remove("in");
    deanImg.classList.add("out");
    $("sub").classList.add("hidden");
    busy = true;
    setButtons();
    mgCurrent = e;
    $("mgTitle").textContent = e.header;
    $("mgResult").classList.add("hidden");
    $("mgRoot").innerHTML = `<p class="mgload">\u8F09\u5165\u4E2D\u2026\u2026</p>`;
    $("mg").classList.remove("hidden");
    play("sting", 0.4);
    try {
      for (const src of e.scripts) await loadScript(src);
    } catch {
      $("mgRoot").innerHTML = `<p class="mgload">\u9019\u500B\u5C0F\u904A\u6232\u8F09\u5165\u5931\u6557\uFF083D \u95DC\u5361\u9700\u8981\u9023\u7DB2\uFF09\u3002\u6309\u53F3\u4E0A\u89D2 \xD7 \u56DE\u8D70\u5ECA\u3002</p>`;
      return;
    }
    if (mgCurrent !== e) return;
    if (!window.EXIT6_MG || !window.EXIT6_MG[e.mg]) {
      $("mgRoot").innerHTML = `<p class="mgload">\u9019\u500B\u5C0F\u904A\u6232\u9084\u5728\u88FD\u4F5C\u4E2D\u3002\u6309\u53F3\u4E0A\u89D2 \xD7 \u56DE\u8D70\u5ECA\u3002</p>`;
      return;
    }
    $("mgRoot").innerHTML = `<div class="mgstage"></div>`;
    let ended = false;
    mgHandle = window.EXIT6_MG[e.mg].mount($("mgRoot").firstChild, { rng, onEnd: (r) => {
      if (!ended) {
        ended = true;
        setTimeout(() => {
          if (mgCurrent === e) e.end(r);
        }, 2600);
      }
    } });
  }
  function retryMinigame(again) {
    try {
      mgHandle == null ? void 0 : mgHandle.destroy();
    } catch {
    }
    mgHandle = null;
    again();
  }
  function startMinigame(t) {
    runMinigame({ mg: t.mg, header: `${displayName(t)}\u30FB${t.skill}`, scripts: scriptsFor(t), end: (r) => teacherEnd(t, r) });
  }
  function teacherEnd(t, r) {
    var _a;
    const res = award(cardBook, t.id, r);
    if (res.got) {
      save.cards = cardBook.cards;
      writeSave(save);
      nbPulse();
    }
    const best = (_a = cardBook.cards.find((c) => c.id === t.id)) == null ? void 0 : _a.best;
    const box = $("mgResult");
    box.innerHTML = r && r.win ? `<div class="sigcard">${cardFace(t, "big")}<div><small>${res.first ? "\u7372\u5F97\u7C3D\u540D\u5361\uFF01" : "\u518D\u6B21\u6311\u6230\u6210\u529F"}</small><b>${displayName(t)}</b><span>${t.skill}</span><q>${t.quote}</q><em>\u672C\u6B21 ${r.score} \u5206\u30FB\u6700\u9AD8 ${best}</em></div></div>
       <div class="row"><button class="go" data-back>${res.completed ? "\u96C6\u6EFF\u4E86\uFF01\u56DE\u8D70\u5ECA\u770B\u770B" : "\u6536\u9032\u624B\u5E33\uFF0C\u56DE\u8D70\u5ECA"}</button></div>` : `<h3>\u5DEE\u4E00\u9EDE\uFF01</h3><p>${t.skill}\u5C31\u662F\u8981\u591A\u7DF4\u5E7E\u6B21\u3002\u672C\u6B21 ${r ? r.score : 0} \u5206\u3002</p>
       <div class="row"><button class="go" data-retry>\u518D\u8A66\u4E00\u6B21</button><button class="ghost" data-back>\u56DE\u5230\u8D70\u5ECA</button></div>`;
    box.classList.remove("hidden");
    if (r && r.win) {
      play(res.first ? "clear" : "correct");
      burst(res.first ? "\u7C3D\u540D\u5361 GET\uFF01" : "\u5237\u65B0\u7D00\u9304", true);
    }
    box.querySelector("[data-back]").onclick = () => leaveMinigame(res.completed);
    const rt = box.querySelector("[data-retry]");
    if (rt) rt.onclick = () => retryMinigame(() => startMinigame(t));
  }
  var labScripts = (l) => [`minigames/${l.mg}/rules.js`, `minigames/${l.mg}/game.js`];
  var starRow = (n) => "\u2605".repeat(n) + "\u2606".repeat(3 - n);
  function openLab() {
    const l = labAt(game.station, game.phase);
    if (!l || busy) return;
    play("click");
    stopHint();
    closeSheet();
    deanImg.classList.remove("in");
    deanImg.classList.add("out");
    $("sub").classList.add("hidden");
    busy = true;
    setButtons();
    mgCurrent = { lab: l };
    const rec = achv.labs[l.id];
    $("mgTitle").textContent = `${l.code} ${l.name}`;
    $("mgResult").classList.add("hidden");
    $("mgRoot").innerHTML = `<div class="labintro${l.bg ? "" : " nobg"}"${l.bg ? ` style="background-image:url('${l.bg}')"` : ""}>
      ${l.bg ? "" : `<span class="labcode">${l.code}</span>`}
      <div class="labcap"><p>${l.intro}</p><p class="labsay">\u300C${l.say}\u300D</p>
        <p class="labrec">${rec ? `\u6700\u9AD8 ${starRow(rec.stars)}\u30FB${rec.best} \u5206` : "\u9084\u6C92\u6311\u6230\u904E"}</p>
        <div class="row"><button class="go" data-labgo>\u958B\u59CB\u6311\u6230</button><button class="ghost" data-labback>\u56DE\u8D70\u5ECA</button></div></div></div>`;
    $("mg").classList.remove("hidden");
    play("sting", 0.3);
    $("mgRoot").querySelector("[data-labgo]").onclick = () => startLabGame(l);
    $("mgRoot").querySelector("[data-labback]").onclick = () => leaveMinigame(false);
  }
  function startLabGame(l) {
    runMinigame({ mg: l.mg, header: `${l.code} ${l.name}`, scripts: labScripts(l), end: (r) => labEnd(l, r) });
  }
  function labEnd(l, r) {
    const def = window.EXIT6_MG[l.mg] && window.EXIT6_MG[l.mg].stars || {};
    const n = starsFor(r, def);
    const res = record(achv, l.id, n, r ? r.score : 0);
    save.achv = achv;
    writeSave(save);
    if (res.improved) nbPulse();
    const won = !!(r && r.win), byScore = won && Number.isFinite(def.score2) && r.score >= def.score2, clean = won && r.flawless === true;
    const box = $("mgResult");
    box.innerHTML = `<div class="labstars" aria-label="${n} \u9846\u661F">${starRow(n)}</div>
    <ul class="labconds"><li class="${won ? "ok" : ""}">\u904E\u95DC</li><li class="${byScore ? "ok" : ""}">\u5206\u6578 ${Number.isFinite(def.score2) ? def.score2 : "\u2014"} \u4EE5\u4E0A\uFF08\u672C\u6B21 ${r ? r.score : 0}\uFF09</li><li class="${clean ? "ok" : ""}">${def.flawless || "\u5B8C\u7F8E\u904E\u95DC"}</li></ul>
    ${res.improved ? `<p class="mgbest">\u5237\u65B0\u7D00\u9304\uFF01\u5BE6\u9A57\u5BA4\u7E3D\u661F\u6578 ${totalStars(achv)} / ${MAX_STARS}</p>` : ""}
    ${res.newTitles.map((t) => `<p class="labnew">\u7372\u5F97\u7A31\u865F\u300C${t.name}\u300D</p>`).join("")}
    ${res.newRewards.map((w) => `<p class="labnew">${w.name}\uFF08\u624B\u5E33\u88E1\u770B\uFF09</p>`).join("")}
    <div class="row"><button class="go" data-retry>\u518D\u6311\u6230\u4E00\u6B21</button><button class="ghost" data-back>\u56DE\u5230\u8D70\u5ECA</button></div>`;
    box.classList.remove("hidden");
    if (n) {
      play(n === 3 ? "clear" : "correct");
      burst(starRow(n), true);
    } else play("wrong", 0.5);
    box.querySelector("[data-back]").onclick = () => leaveMinigame(false);
    box.querySelector("[data-retry]").onclick = () => retryMinigame(() => startLabGame(l));
  }
  function shareText() {
    const total = totalStars(achv), t = titleFor(total);
    return `\u6211\u5728\u300A\u516D\u6A13\u51FA\u53E3\u300B\u7684\u5BE6\u9A57\u5BA4\u62FF\u5230 ${total} \u9846\u661F${t ? `\uFF0C\u7A31\u865F\u300C${t.name}\u300D` : ""}\uFF01\u6A39\u5FB7\u79D1\u5927\u52D5\u756B\u8207\u904A\u6232\u8A2D\u8A08\u7CFB\u7684\u516D\u6A13\uFF0C\u7B49\u4F60\u4F86\u73A9\uFF1Ahttps://www.dgd.stu.edu.tw/`;
  }
  function openShare() {
    openSheet(`<button class="x" data-close aria-label="\u95DC\u9589">\xD7</button><h3>\u62DB\u751F\u5206\u4EAB\u5361</h3>
    <div class="sharecard"><b>\u516D\u6A13\u51FA\u53E3</b><span>${shareText()}</span></div>
    <div class="row"><button class="go" data-copy>\u8907\u88FD\u6587\u5B57</button><a class="ghost linkbtn" href="../#/admission" target="_blank" rel="noopener">\u62DB\u751F\u8CC7\u8A0A</a></div>`);
    $("sheet").querySelector("[data-copy]").onclick = async (ev) => {
      try {
        await navigator.clipboard.writeText(shareText());
        ev.target.textContent = "\u5DF2\u8907\u88FD";
      } catch {
        const r = document.createRange();
        r.selectNodeContents($("sheet").querySelector(".sharecard span"));
        getSelection().removeAllRanges();
        getSelection().addRange(r);
        ev.target.textContent = "\u5DF2\u9078\u53D6\uFF0C\u8ACB\u6309\u8907\u88FD";
      }
    };
  }
  function labWall() {
    const total = totalStars(achv), t = titleFor(total), got = unlocked(total);
    const rows = LABS.map((l) => {
      const v = achv.labs[l.id];
      return `<li class="${v && v.stars ? "ok" : ""}"><b>${l.code} ${l.name}</b>\u3000${starRow(v ? v.stars : 0)}${v ? `\u3000\u6700\u9AD8 ${v.best} \u5206` : ""}</li>`;
    }).join("");
    const rw = REWARDS.map((w) => got.includes(w) ? w.id === "works" ? `<a class="ghost linkbtn" href="../#/works" target="_blank" rel="noopener">\u5B78\u9577\u59D0\u4F5C\u54C1\u5C55\u793A</a>` : `<button class="ghost" data-share>\u62DB\u751F\u5206\u4EAB\u5361</button>` : `<span class="lockrw">${w.at} \u661F\u89E3\u9396\uFF1A${w.name.replace("\u89E3\u9396\uFF1A", "")}</span>`).join("");
    return `<h4>\u5BE6\u9A57\u5BA4\u6210\u5C31\uFF08${total}/${MAX_STARS} \u661F\uFF09${t ? `\u3000\u7A31\u865F\u300C${t.name}\u300D` : ""}</h4><ul>${rows}</ul><div class="row rwrow">${rw}</div>`;
  }
  function leaveMinigame(completed) {
    try {
      mgHandle == null ? void 0 : mgHandle.destroy();
    } catch {
    }
    mgHandle = null;
    mgCurrent = null;
    $("mg").classList.add("hidden");
    $("mgRoot").innerHTML = "";
    busy = false;
    show(stopSrc(STATIONS[game.station], anomalyAt(game, ANOMALIES)), false);
    renderStop();
    setButtons();
    if (completed) setTimeout(hiddenEnding, 500);
  }
  function hiddenEnding() {
    dean("welcome", null, 6e3);
    sayText("\u4E94\u4F4D\u8001\u5E2B\u7684\u7C3D\u540D\u90FD\u5230\u624B\u4E86\uFF01\u4F60\u5DF2\u7D93\u628A\u52D5\u904A\u7CFB\u901B\u900F\u900F\u5566\u3002", 6e3);
    save.allCardsSeen = true;
    writeSave(save);
    openSheet(`<button class="x" data-close aria-label="\u95DC\u9589">\xD7</button><h3>\u96B1\u85CF\u7D50\u5C40\uFF1A\u516D\u6A13\u7684\u901A\u884C\u8B49</h3>
    <p>\u8D70\u5ECA\u76E1\u982D\u7684\u71C8\u4E00\u76DE\u76DE\u4EAE\u8D77\u4F86\u3002\u4E94\u4F4D\u8001\u5E2B\u7684\u7C3D\u540D\u5728\u624B\u5E33\u88E1\u6392\u6210\u4E00\u6392\u2014\u2014\u52D5\u756B\u3001\u7E6A\u672C\u3001\u7A0B\u5F0F\u30013D\u3001\u8996\u89BA\u50B3\u9054\uFF0C\u9019\u4E9B\u4F60\u525B\u525B\u90FD\u89AA\u624B\u73A9\u904E\u4E86\u3002</p>
    <p>\u516D\u6A13\u4E0D\u662F\u8FF7\u5BAE\uFF0C\u662F\u6211\u5011\u6BCF\u5929\u4E0A\u8AB2\u7684\u5730\u65B9\u3002\u4E0B\u6B21\uFF0C\u7528\u5B78\u751F\u8B49\u8D70\u9032\u4F86\u5427\u3002</p>
    <div class="row"><a class="go linkbtn" href="../#/works" target="_blank" rel="noopener">\u770B\u5B78\u9577\u59D0\u4F5C\u54C1</a><a class="go linkbtn" href="../#/admission" target="_blank" rel="noopener">\u62DB\u751F\u8CC7\u8A0A</a></div>
    <div class="row"><a class="ghost linkbtn" href="../#/labs" target="_blank" rel="noopener">\u7279\u8272\u5BE6\u9A57\u5BA4</a><button class="ghost" data-close>\u56DE\u5230\u8D70\u5ECA</button></div>`);
  }
  var helpAt = -Infinity;
  function askHelp() {
    if (busy || game.phase !== "loop") {
      toast("\u5148\u8D70\u9032\u5FAA\u74B0\u518D\u6C42\u6551\u5594");
      return;
    }
    const left = HELP_COOLDOWN_MS - (performance.now() - helpAt);
    if (left > 0) {
      toast(`\u7CFB\u4E3B\u4EFB\u5598\u53E3\u6C23\u4E2D\u2026\u2026${Math.ceil(left / 1e3)} \u79D2\u5F8C\u518D\u53EB\u6211`);
      return;
    }
    helpAt = performance.now();
    const an = anomalyAt(game, ANOMALIES);
    const r = helpReply(!!an, hint.stage);
    if (r.kind === "hint") showHint(an, r.stage);
    else deanSays(HELP_CLEAR, 3200);
  }
  async function react(ev, precise) {
    if ("count" in ev) $("floorNo").textContent = `${ev.count}F`;
    remember(ev.anomaly);
    stopHint();
    if (ev.type === "correct" || ev.type === "ending") {
      run.failStreak = 0;
      busy = true;
      setButtons();
      if (ev.anomaly) {
        $("spots").innerHTML = "";
        $("cuts").innerHTML = "";
        if (precise) {
          run.precise++;
          flash();
          await sleep(reduced ? 0 : 110);
          shake(false);
          liftFound(ev.anomaly);
          burst("\u78B0\uFF01\u6293\u5230\u4E86");
          play("found");
        } else {
          liftFound(ev.anomaly);
          burst("\u56DE\u982D\u6210\u529F", true);
          play("correct");
        }
      } else {
        burst("\u2714 \u6B63\u5E38", true);
        play("correct", 0.7);
      }
      floorFx("pop");
      if (ev.voice === "vo_first_correct") dean("cheer", ev.voice);
      else if (ev.voice === "vo_half") dean("peek", ev.voice, 2600);
      if (ev.type === "ending") {
        await sleep(500);
        return finish();
      }
      await sleep(ev.anomaly ? 950 : 250);
      if (ev.anomaly) showCard(precise ? "\u2714 \u7CBE\u6E96\u6307\u8A8D\uFF01\u5716\u9451\u6536\u9304" : "\u2714 \u7B54\u5C0D\uFF01\u5716\u9451\u6536\u9304", ev.anomaly, walk);
      else walk();
      return;
    }
    run.mistakes++;
    run.failStreak++;
    floorFx("reset");
    if (ev.reason === "missed") {
      busy = true;
      setButtons();
      flash("red");
      shake(true);
      glitch();
      play("sting");
      await sleep(700);
      showCard("\u2718 \u4F60\u932F\u904E\u4E86\u9019\u500B\u7570\u5E38\uFF08\u8A08\u6578\u6B78\u96F6\uFF09", ev.anomaly, walk);
    } else {
      play("wrong");
      shake(false);
      dean("plead", ev.voice, 3400);
      walk();
    }
  }
  function act(action) {
    if (busy || game.phase === "ending" || !$("start").classList.contains("hidden")) return;
    if (game.phase === "tour" && action === "forward" && tourLeft() > 0) {
      toast(`\u9084\u6709 ${tourLeft()} \u500B\u5730\u65B9\u6C92\u770B`);
      return;
    }
    const ev = step(game, action);
    if (ev.type === "tour-hint") {
      toast("\u5C0E\u89BD\u5708\u5148\u5F80\u524D\u8D70\u5B8C\uFF0C\u628A\u6B63\u5E38\u7684\u6A23\u5B50\u8A18\u8D77\u4F86");
      return;
    }
    if (ev.type === "move") {
      walk();
      return;
    }
    if (ev.type === "tour-done") {
      run.t0 = performance.now();
      tickTimer();
      flash("black");
      burst("\u5FAA\u74B0\u958B\u59CB", true);
      play("sting", 0.6);
      const sp = stepFor(startHour);
      if (sp > 1) setTimeout(() => toast(`\u516D\u6A13\u7684\u6642\u9593\u904E\u5F97\u7279\u5225\u5FEB\u2026\u2026\u6BCF\u8D70\u4E00\u5708\u904E ${sp} \u5C0F\u6642`), 900);
      if (sp === 0) setTimeout(() => toast("\u516D\u6A13\u7684\u6642\u9593\u597D\u50CF\u505C\u4F4F\u4E86\u2026\u2026"), 900);
      $("tip").textContent = "\u770B\u5230\u4E0D\u5C0D\u52C1\uFF1A\u76F4\u63A5\u9EDE\u90A3\u500B\u5730\u65B9\uFF0C\u6216\u6309\u56DE\u982D\u3002";
      $("tip").dataset.keep = "1";
      $("tip").classList.remove("hidden");
      walk();
      return;
    }
    react(ev, false);
  }
  function pointAt(e) {
    if (walking) {
      walking();
      return;
    }
    if (busy || game.phase !== "loop" || !$("start").classList.contains("hidden")) return;
    const r = stage.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width * 100, py = (e.clientY - r.top) / r.height * 100;
    ripple(e.clientX - r.left, e.clientY - r.top);
    const an = anomalyAt(game, ANOMALIES);
    const hit = an && an.hits.some((h) => px >= h.x && px <= h.x + h.w && py >= h.y && py <= h.y + h.h);
    if (hit) {
      react(step(game, "back"), true);
      return;
    }
    const k = spotAt(game.station, px, py);
    if (k !== null) {
      sayAbout(k, stopSrc(STATIONS[game.station], an));
      return;
    }
    run.misTaps++;
    hint.mis++;
    play("click", 0.5);
    if (an && hint.on) checkHint(an);
    toast(["\u9019\u88E1\u770B\u8D77\u4F86\u5F88\u6B63\u5E38\u2026\u2026", "\u55EF\uFF1F\u597D\u50CF\u6C92\u4EC0\u9EBC", "\u518D\u4ED4\u7D30\u770B\u770B"][run.misTaps % 3]);
  }
  var fmt = (ms) => {
    const s = Math.floor(ms / 1e3);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  };
  function tickTimer() {
    if (game.phase !== "loop") return;
    $("timer").textContent = fmt(performance.now() - run.t0);
    requestAnimationFrame(tickTimer);
  }
  async function finish() {
    busy = true;
    setButtons();
    const ms = performance.now() - run.t0;
    play("clear");
    dean("welcome", "vo_ending", 4200);
    await sleep(2600);
    const secret = new Set(save.dex).size >= ANOMALIES.length && !save.secretSeen;
    save.clears++;
    const newBest = save.bestMs == null || ms < save.bestMs;
    if (newBest) save.bestMs = ms;
    if (save.bestMiss == null || run.mistakes < save.bestMiss) save.bestMiss = run.mistakes;
    if (secret) save.secretSeen = true;
    writeSave(save);
    if (secret) {
      dean("peek", "vo_secret", 5200);
      await sleep(4200);
    }
    const got = new Set(save.dex);
    const el = $("ending");
    el.innerHTML = `<h1>6F\u30FB\u51FA\u53E3</h1><p>\u4F60\u8D70\u51FA\u4E86\u516D\u6A13\u3002</p>
    <div class="stats">
      <div><b>${fmt(ms)}</b><small>\u901A\u95DC\u6642\u9593${newBest ? "\uFF08\u65B0\u7D00\u9304\uFF01\uFF09" : ""}</small></div>
      <div><b>${run.mistakes}</b><small>\u5931\u8AA4\u6B21\u6578</small></div>
      <div><b>${run.precise}</b><small>\u7CBE\u6E96\u6307\u8A8D</small></div>
      <div><b>${got.size}/${ANOMALIES.length}</b><small>\u5716\u9451\uFF08\u7D2F\u8A08\uFF09</small></div>
      <div><b>${quests.delivered.length}/${ITEMS.length}</b><small>\u59D4\u8A17\u9001\u9054${quests.stamps.length ? "\u30FB\u516D\u6A13\u90F5\u5DEE" : ""}</small></div>
      <div><b>${clues.found.length}/${CLUES.length}</b><small>\u7DDA\u7D22${clues.opened ? "\u30FB\u627E\u5230\u90B1\u8001\u5E2B" : ""}</small></div>
    </div>
    <div class="dex">${ANOMALIES.map((a) => got.has(a.id) ? `<div><b>${a.card.title}</b><br>${STATIONS[a.station].name}</div>` : `<div class="no">\uFF1F\uFF1F\uFF1F</div>`).join("")}</div>
    ${got.size < ANOMALIES.length ? `<p style="color:var(--dim);font-size:13px">\u96C6\u6EFF ${ANOMALIES.length} \u500B\u7570\u5E38\uFF0C\u6703\u89E3\u9396\u96B1\u85CF\u7D50\u5C40\u3002</p>` : ""}
    <div class="row"><button class="go" id="toQuiz">\u63A5\u53D7\u65B0\u751F\u5C0F\u6E2C\u9A57</button><button class="ghost" id="again1">\u518D\u8D70\u4E00\u6B21</button></div>`;
    el.classList.remove("hidden");
    $("toQuiz").onclick = () => quiz(ms);
    $("again1").onclick = () => location.reload();
  }
  function shuffle2(a) {
    const b = a.slice();
    for (let i = b.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [b[i], b[j]] = [b[j], b[i]];
    }
    return b;
  }
  function quiz(ms) {
    const qs = shuffle2(QUIZ).slice(0, 5);
    let i = 0, score = 0;
    const el = $("ending");
    const ask = () => {
      const item = qs[i];
      const order = shuffle2(item.options.map((t, k) => ({ t, ok: k === item.a })));
      el.innerHTML = `<div class="quiz"><small>\u65B0\u751F\u5C0F\u6E2C\u9A57 ${i + 1} / ${qs.length}</small><h2>${item.q}</h2>
      <div class="opts">${order.map((o, k) => `<button data-k="${k}">${o.t}</button>`).join("")}</div><p class="why" id="why"></p></div>`;
      el.querySelectorAll(".opts button").forEach((b) => {
        b.onclick = () => {
          const o = order[+b.dataset.k];
          el.querySelectorAll(".opts button").forEach((x, k) => {
            x.disabled = true;
            if (order[k].ok) x.classList.add("right");
          });
          if (o.ok) {
            score++;
            play("correct");
          } else {
            b.classList.add("bad");
            play("wrong", 0.6);
          }
          $("why").textContent = (o.ok ? "\u7B54\u5C0D\uFF01" : "\u7B54\u932F\u4E86\u3002") + item.why;
          setTimeout(() => {
            i++;
            i < qs.length ? ask() : resultCard(ms, score, qs.length);
          }, 1500);
        };
      });
    };
    ask();
  }
  function resultCard(ms, score, total) {
    const title = score === total ? "\u516D\u6A13\u6D3B\u5730\u5716" : score >= total - 2 ? "\u5408\u683C\u65B0\u751F" : "\u8FF7\u8DEF\u65B0\u751F";
    const line = score === total ? "\u7CFB\u8FA6\u3001\u5BE6\u9A57\u5BA4\u3001\u7814\u7A76\u5BA4\u90FD\u96E3\u4E0D\u5012\u4F60\u3002" : score >= total - 2 ? "\u518D\u901B\u4E00\u6B21\u516D\u6A13\u5C31\u5168\u61C2\u4E86\u3002" : "\u6C92\u95DC\u4FC2\uFF0C\u518D\u8D70\u4E00\u6B21\u516D\u6A13\u5427\uFF01";
    play(score === total ? "clear" : "correct");
    $("ending").innerHTML = `<div class="result"><small>\u6A39\u5FB7\u79D1\u5927 \u52D5\u756B\u8207\u904A\u6232\u8A2D\u8A08\u7CFB\u30FB\u516D\u6A13\u51FA\u53E3</small>
      <div class="title">${title}</div><p>${line}</p>
      <div class="meta"><span>\u901A\u95DC\u6642\u9593</span><b>${fmt(ms)}</b><span>\u5931\u8AA4\u6B21\u6578</span><b>${run.mistakes}</b>
        <span>\u7CBE\u6E96\u6307\u8A8D</span><b>${run.precise}</b><span>\u5C0F\u6E2C\u9A57</span><b>${score} / ${total}</b>
        <span>\u5716\u9451\u7D2F\u8A08</span><b>${new Set(save.dex).size} / ${ANOMALIES.length}</b><span>\u59D4\u8A17\u9001\u9054</span><b>${quests.delivered.length} / ${ITEMS.length}</b>
        <span>\u7D00\u5FF5\u7AE0</span><b>${stamps().map((s) => s.name).join("\u3001") || "\u2014"}</b><span>\u6700\u4F73\u6642\u9593</span><b>${save.bestMs != null ? fmt(save.bestMs) : "\u2014"}</b></div></div>
    <p style="color:var(--dim);font-size:13px">\u622A\u5716\u9019\u5F35\u6210\u7E3E\u5361\uFF0C\u5206\u4EAB\u7D66\u540C\u5B78\u3002</p>
    <div class="row"><button class="go" id="again2">\u518D\u8D70\u4E00\u6B21</button></div>`;
    $("again2").onclick = () => location.reload();
  }
  $("btnBack").onclick = () => act("back");
  $("btnFwd").onclick = () => act("forward");
  stage.addEventListener("click", pointAt);
  addEventListener("keydown", (e) => {
    if (fightOn()) {
      if (e.key.startsWith("Arrow")) {
        e.preventDefault();
        if (e.repeat) return;
        held.add(e.key);
        const d = dirOf();
        if (d) fightKey(d);
      } else if (["z", "Z", " ", "Enter"].includes(e.key)) {
        e.preventDefault();
        if (!e.repeat) fightKey("A");
      }
      return;
    }
    if (mgCurrent) return;
    if (["ArrowLeft", "ArrowDown"].includes(e.key)) act("back");
    if (["ArrowRight", "ArrowUp"].includes(e.key)) act("forward");
  });
  addEventListener("keyup", (e) => {
    if (fightOn() && e.key.startsWith("Arrow")) {
      const d = dirOf();
      if (d) fightKey(d);
    }
  });
  $("go").onclick = () => {
    loadSfx();
    loadVoices();
    play("hum");
    $("start").classList.add("hidden");
    walk();
    if (periodOf(realHour) === "night") setTimeout(() => dean("cheer", "vo_night", 3600), 1600);
  };
  $("nbBtn").onclick = (e) => {
    e.stopPropagation();
    openNotebook();
  };
  $("helpBtn").onclick = (e) => {
    e.stopPropagation();
    askHelp();
  };
  $("invite").onclick = (e) => {
    e.stopPropagation();
    openInvite();
  };
  $("labBtn").onclick = (e) => {
    e.stopPropagation();
    openLab();
  };
  $("mgClose").onclick = () => leaveMinigame(false);
  $("branch").onclick = (e) => {
    e.stopPropagation();
    if (!busy) openKeypad();
  };
  if (save.bestMs != null) $("best").textContent = `\u4F60\u7684\u6700\u4F73\u6642\u9593 ${fmt(save.bestMs)}\u30FB\u5716\u9451 ${new Set(save.dex).size}/${ANOMALIES.length}\u30FB\u901A\u95DC ${save.clears} \u6B21`;
  for (const p of ["plead", "cheer", "welcome", "peek"]) new Image().src = `frames/dean_${p}.webp`;
  for (const f of ["s8_a", "s8", "qiu_greet"]) new Image().src = `frames/${f}.webp`;
  renderStop();
  prefetch(0);
  if (q.has("debug") && q.has("go")) $("go").click();
  if (q.has("debug") && q.has("fight")) {
    $("start").classList.add("hidden");
    startFight();
  }
})();
