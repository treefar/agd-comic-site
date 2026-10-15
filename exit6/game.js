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
      rng: rng2
    };
  }
  function drawAnomaly(s) {
    if (s.deck.length === 0) s.deck = shuffle(s.ids, s.rng);
    return s.deck.pop();
  }
  function startLap(s) {
    s.lap += 1;
    s.station = 0;
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
      name: "\u96FB\u68AF\u5167",
      frames: ["frames/s0_a.webp", "frames/s0_b.webp"],
      still: "frames/s0.webp",
      src: "B 0:09\u20130:13",
      tour: "\u8A2D\u8A08\u5927\u6A13 D \u68DF\uFF0C\u6309\u4E0B 6 \u6A13\u3002\u9EDE\u4E00\u4E0B\u767C\u4EAE\u7684\u5730\u65B9\u8ABF\u67E5\u3002",
      spots: [{ x: 82, y: 3, w: 9, h: 27, label: "\u6A13\u5C64\u986F\u793A", text: "\u986F\u793A 6\uFF1A\u9019\u88E1\u662F\u8A2D\u8A08\u5927\u6A13 D \u68DF\u516D\u6A13\u3002\u52D5\u904A\u7CFB\u7684\u7CFB\u8FA6\u3001\u5F88\u591A\u9593\u5BE6\u9A57\u5BA4\u548C\u8001\u5E2B\u7814\u7A76\u5BA4\u90FD\u5728\u9019\u4E00\u5C64\u3002" }]
    },
    {
      id: "S1",
      name: "\u7CFB\u8FA6\u9580\u53E3",
      frames: ["frames/s1_a.webp", "frames/s1_b.webp"],
      still: "frames/s1.webp",
      src: "B 0:13\u20130:19",
      tour: "\u96FB\u68AF\u4E00\u51FA\u4F86\u7684\u6B63\u524D\u65B9\u5C31\u662F\u7CFB\u8FA6\u3002\u628A\u544A\u793A\u3001\u6D77\u5831\u3001\u5730\u588A\u90FD\u9EDE\u4E00\u904D\u8A18\u8D77\u4F86\u3002",
      spots: [
        { x: 3, y: 13, w: 24, h: 22, label: "\u7CFB\u540D\u7246", text: "\u52D5\u756B\u8207\u904A\u6232\u8A2D\u8A08\u7CFB\uFF08Department of Animation and Game Design, STU\uFF09\u3002\u7CFB\u8FA6\u5C31\u5728\u96FB\u68AF\u6B63\u524D\u65B9\uFF0C\u65B0\u751F\u6709\u554F\u984C\u5148\u4F86\u9019\u88E1\u554F\u3002" },
        { x: 54, y: 24, w: 9, h: 23, label: "\u9580\u4E0A\u544A\u793A", text: "\u300C\u8ACB\u52FF\u56DE\u982D\u300D\u3002\u8A18\u4F4F\u5B83\u5BEB\u4EC0\u9EBC\u3002" },
        { x: 27, y: 16, w: 60, h: 28, label: "\u5169\u5074\u6D77\u5831", text: "\u9580\u5DE6\u908A\u4E00\u5F35\u85CD\u8272\u6D77\u5831\uFF0C\u53F3\u908A\u5169\u5F35\u5F69\u8272\u6D77\u5831\u3002\u8A18\u4F4F\u54EA\u908A\u662F\u54EA\u5F35\u3002" },
        { x: 0, y: 76, w: 100, h: 24, label: "\u5F69\u7E6A\u5730\u588A", text: "\u9580\u524D\u7684\u5F69\u7E6A\u5730\u588A\uFF0C\u8A18\u4F4F\u4EBA\u7269\u6392\u5217\u7684\u65B9\u5411\u3002\uFF08\u5F85\u8001\u5E2B\u88DC\u5145\uFF1A\u5730\u588A\u4F5C\u8005\uFF09" }
      ]
    },
    {
      id: "S2",
      name: "\u5929\u6A4B\u5730\u677F\u5F69\u7E6A",
      frames: ["frames/s2_a.webp", "frames/s2_b.webp"],
      still: "frames/s2.webp",
      src: "B 0:30\u20130:40",
      tour: "\u7A7F\u904E\u4F11\u606F\u5340\u5C31\u662F\u5929\u6A4B\u3002",
      spots: [{ x: 3, y: 56, w: 36, h: 24, label: "\u5730\u677F\u5F69\u7E6A", text: "\u5929\u6A4B\u4E0A\u7684\u4E00\u5927\u7247\u5730\u677F\u5F69\u7E6A\uFF0C\u4E0A\u9762\u4EC0\u9EBC\u90FD\u6C92\u653E\u3002\uFF08\u5F85\u8001\u5E2B\u88DC\u5145\uFF1A\u5F69\u7E6A\u7531\u4F86\uFF09" }]
    },
    {
      id: "S3",
      name: "\u4E2D\u5EAD\u724C\u6A13",
      frames: ["frames/s3_a.webp", "frames/s3_b.webp"],
      still: "frames/s3.webp",
      src: "B 3:30\u20133:39",
      tour: "\u73BB\u7483\u5929\u68DA\u4E0B\u7684\u6728\u9020\u724C\u6A13\u3002",
      spots: [{ x: 31, y: 0, w: 32, h: 80, label: "\u6728\u9020\u724C\u6A13", text: "\u516D\u6A13\u6700\u597D\u8A8D\u7684\u5730\u6A19\uFF0C\u724C\u6A13\u4E0B\u9762\u662F\u7A7A\u7684\u901A\u9053\u3002\u5728\u516D\u6A13\u8FF7\u8DEF\uFF0C\u5C31\u5148\u627E\u5B83\u3002\uFF08\u5F85\u8001\u5E2B\u88DC\u5145\uFF1A\u724C\u6A13\u7531\u4F86\uFF09" }]
    },
    {
      id: "S4",
      name: "D0604 \u96FB\u7E6A\u5BE6\u9A57\u5BA4",
      frames: ["frames/s4_a.webp", "frames/s4_b.webp"],
      still: "frames/s4.webp",
      src: "A 7:16\u20137:26",
      tour: "\u8D70\u5ECA\u4E0A\u7684\u5BE6\u9A57\u5BA4\u9580\u53E3\u3002",
      spots: [
        { x: 42, y: 15, w: 12, h: 12, label: "\u9580\u865F", text: "D0604\uFF1DD \u68DF\u300106 \u6A13\u300104 \u865F\u623F\u3002\u9019\u9593\u662F\u96FB\u7E6A\u5BE6\u9A57\u5BA4\uFF1A\u7E6A\u5716\u677F\u6559\u5BA4\uFF0C2D \u89D2\u8272\u3001\u5834\u666F\u3001UI \u90FD\u5728\u9019\u88E1\u7DF4\u3002" },
        { x: 72, y: 30, w: 28, h: 70, label: "\u6D88\u9632\u6813", text: "\u9580\u65C1\u908A\u662F\u6D88\u9632\u6813\u3002\u9580\u4E0A\u9664\u4E86\u9580\u865F\u4EC0\u9EBC\u90FD\u6C92\u8CBC\u3002" }
      ]
    },
    {
      id: "S5",
      name: "\u4F5C\u54C1\u6D77\u5831\u6AE5\u7A97",
      frames: ["frames/s5_a.webp", "frames/s5_b.webp"],
      still: "frames/s5.webp",
      src: "A 7:30\u20137:41",
      tour: "\u8D70\u5ECA\u6AE5\u7A97\u8CBC\u6EFF\u4F5C\u54C1\u6D77\u5831\u3002",
      spots: [{ x: 16, y: 8, w: 78, h: 84, label: "\u6D77\u5831\u6AE5\u7A97", text: "\u4E09\u5F35\u5B8C\u6574\u7684\u6D77\u5831\uFF0C\u5F9E\u5DE6\u5230\u53F3\uFF1A\u5B87\u5B99\u96FB\u53F0\u3001\u7C89\u7D05\u982D\u9AEE\u5973\u5B69\u3001GO PLAYING DIMENSION\u3002\u8A18\u4F4F\u9806\u5E8F\u548C\u65B9\u5411\u30022025 \u5E74\u7CFB\u4E0A\u6709 8 \u4EF6\u4F5C\u54C1\u5165\u570D\u653E\u8996\u5927\u8CDE\u3002\uFF08\u5F85\u8001\u5E2B\u78BA\u8A8D\uFF1A\u6D77\u5831\u51FA\u8655\uFF09" }]
    },
    {
      id: "S6",
      name: "D0646 \u7814\u7A76\u5BA4",
      frames: ["frames/s6_a.webp", "frames/s6_b.webp"],
      still: "frames/s6.webp",
      src: "A 11:08\u201311:14",
      tour: "\u8001\u5E2B\u7814\u7A76\u5BA4\u7684\u9580\u53E3\u3002",
      spots: [
        { x: 29, y: 2, w: 30, h: 12, label: "\u540D\u724C", text: "D0646 \u9673\u6176\u9D3B\u8001\u5E2B\uFF0C\u5C08\u9577\u96FB\u8166\u52D5\u756B\u8207\u52D5\u614B\u5F71\u50CF\uFF0C\u6559\u52D5\u614B\u5716\u50CF\u8A2D\u8A08\u3002" },
        { x: 29, y: 80, w: 30, h: 17, label: "\u5728\u5BA4\u724C", text: "IN \u662F\u5728\u3001OUT \u662F\u4E0D\u5728\uFF0C\u627E\u8001\u5E2B\u524D\u5148\u770B\u4E00\u773C\u3002\u73FE\u5728\u4E09\u9846\u78C1\u9435\u5728\u5DE6\u908A\uFF0C\u7D05\u8272\u90A3\u9846\u5728\u53F3\u4E0A\u3002" }
      ]
    },
    {
      id: "S7",
      name: "\u96FB\u68AF\u5EF3",
      frames: ["frames/s7_a.webp", "frames/s7_b.webp"],
      still: "frames/s7.webp",
      src: "B 5:58\u20136:10",
      tour: "\u7E5E\u4E00\u5708\u53C8\u56DE\u5230\u96FB\u68AF\u5EF3\u3002",
      spots: [{ x: 40, y: 1, w: 12, h: 15, label: "\u6A13\u5C64\u6578\u5B57", text: "\u7246\u4E0A\u7684\u300C6\u300D\u3002\u5C0E\u89BD\u5708\u7D50\u675F\u5F8C\uFF0C\u771F\u6B63\u7684\u5FAA\u74B0\u624D\u958B\u59CB\uFF1A\u770B\u5230\u4E0D\u5C0D\u52C1\u5C31\u56DE\u982D\uFF0C\u6216\u76F4\u63A5\u9EDE\u51FA\u7570\u5E38\u7684\u4F4D\u7F6E\u3002" }]
    }
  ];
  var ANOMALIES = [
    {
      id: "A01",
      station: 1,
      still: "frames/s1_a01.webp",
      hits: [{ x: 53, y: 22, w: 11, h: 27 }],
      card: { title: "\u544A\u793A\u8B8A\u6EAB\u67D4\u4E86", text: "\u300C\u8ACB\u52FF\u56DE\u982D\u300D\u5176\u5BE6\u662F\u53CD\u8A71\uFF1A\u56DE\u982D\u5C31\u662F\u56DE\u5831\u7570\u5E38\u3002\u7CFB\u4E3B\u4EFB\u5F88\u5E0C\u671B\u4F60\u591A\u770B\u770B\u7CFB\u4E0A\u3002" }
    },
    {
      id: "A02",
      station: 1,
      still: "frames/s1_a02.webp",
      hits: [{ x: 27, y: 16, w: 12, h: 30 }, { x: 66, y: 14, w: 21, h: 30 }],
      card: { title: "\u6D77\u5831\u63DB\u908A\u4E86", text: "\u7CFB\u8FA6\u9580\u53E3\u7684\u6D77\u5831\u662F\u7CFB\u4E0A\u4F5C\u54C1\u3002\u7CFB\u8FA6\u5C31\u5728\u96FB\u68AF\u6B63\u524D\u65B9\uFF0C\u65B0\u751F\u6709\u554F\u984C\u5148\u4F86\u9019\u88E1\u554F\u3002" }
    },
    {
      id: "A03",
      station: 1,
      still: "frames/s1_a03.webp",
      hits: [{ x: 0, y: 74, w: 100, h: 26 }],
      card: { title: "\u5730\u588A\u65B9\u5411\u53CD\u4E86", text: "\uFF08\u5F85\u8001\u5E2B\u88DC\u5145\uFF1A\u9019\u5F35\u5F69\u7E6A\u5730\u588A\u7684\u4F5C\u8005\u8207\u4F5C\u54C1\u4ECB\u7D39\uFF09" }
    },
    {
      id: "A04",
      station: 2,
      still: "frames/s2_a04.webp",
      hits: [{ x: 10, y: 56, w: 22, h: 20 }],
      card: { title: "\u6709\u4EBA\u812B\u4E86\u978B", text: "\uFF08\u5F85\u8001\u5E2B\u88DC\u5145\uFF1A\u5929\u6A4B\u5730\u677F\u5F69\u7E6A\u7684\u7531\u4F86\uFF09" }
    },
    {
      id: "A05",
      station: 3,
      still: "frames/s3_a05.webp",
      hits: [{ x: 34, y: 52, w: 29, h: 28 }],
      card: { title: "\u724C\u6A13\u4E0B\u6709\u4EBA\u5750\u904E", text: "\uFF08\u5F85\u8001\u5E2B\u88DC\u5145\uFF1A\u4E2D\u5EAD\u724C\u6A13\u7684\u7531\u4F86\uFF09\u5728\u516D\u6A13\u8FF7\u8DEF\uFF0C\u5148\u627E\u724C\u6A13\u3002" }
    },
    {
      id: "A06",
      station: 4,
      still: "frames/s4_a06.webp",
      hits: [{ x: 41, y: 13, w: 14, h: 15 }],
      card: { title: "\u9580\u865F\u8DD1\u6389\u4E86", text: "D0604\uFF1AD \u68DF\u300106 \u6A13\u300104 \u865F\u623F\u3002\u770B\u61C2\u9580\u865F\uFF0C\u5728\u5B78\u6821\u5C31\u4E0D\u6703\u8FF7\u8DEF\u3002" }
    },
    {
      id: "A07",
      station: 4,
      still: "frames/s4_a07.webp",
      hits: [{ x: 10, y: 37, w: 22, h: 27 }],
      card: { title: "\u96FB\u7E6A\u300C\u98DF\u300D\u9A57\u5BA4", text: "\u662F\u5BE6\u9A57\u5BA4\u4E0D\u662F\u98DF\u5802\u3002\u96FB\u7E6A\u5BE6\u9A57\u5BA4\u914D\u5099\u7E6A\u5716\u677F\uFF0C2D \u89D2\u8272\u3001\u5834\u666F\u3001UI \u90FD\u5728\u9019\u88E1\u7DF4\u3002" }
    },
    {
      id: "A08",
      station: 5,
      still: "frames/s5_a08.webp",
      hits: [{ x: 15, y: 6, w: 27, h: 88 }],
      card: { title: "\u6D77\u5831\u5012\u639B", text: "\uFF08\u5F85\u8001\u5E2B\u78BA\u8A8D\uFF1A\u6AE5\u7A97\u6D77\u5831\u7684\u51FA\u8655\u8207\u63DB\u5C55\u65B9\u5F0F\uFF092025 \u5E74\u7CFB\u4E0A\u6709 8 \u4EF6\u4F5C\u54C1\u5165\u570D\u653E\u8996\u5927\u8CDE\u3002" }
    },
    {
      id: "A09",
      station: 5,
      still: "frames/s5_a09.webp",
      hits: [{ x: 41, y: 6, w: 27, h: 88 }],
      card: { title: "\u7CFB\u4E3B\u4EFB\u5728\u770B\u4F60", text: "\u6D77\u5831\u4E0A\u662F\u7CFB\u4E3B\u4EFB\u9127\u6A39\u9060\u672C\u4EBA\uFF08\u7167\u7CFB\u7DB2\u5B98\u65B9\u7167\u7247\u756B\u7684\uFF09\uFF0C\u5C08\u9577\u904A\u6232\u8A2D\u8A08\u3001\u5287\u672C\u5275\u4F5C\u8207\u6578\u4F4D\u526A\u8F2F\u3002" }
    },
    {
      id: "A10",
      station: 6,
      still: "frames/s6_a10.webp",
      hits: [{ x: 28, y: 78, w: 32, h: 20 }],
      card: { title: "\u5168\u90E8\u90FD\u5728\uFF1F", text: "\u5728\u5BA4\u724C IN \u662F\u5728\u3001OUT \u662F\u4E0D\u5728\u3002\u627E\u8001\u5E2B\u524D\u5148\u770B\u5728\u5BA4\u724C\uFF0C\u7701\u5F97\u767D\u8DD1\u4E00\u8D9F\u3002" }
    },
    {
      id: "A11",
      station: 6,
      still: "frames/s6_a11.webp",
      hits: [{ x: 28, y: 1, w: 32, h: 14 }],
      card: { title: "\u8D70\u932F\u7814\u7A76\u5BA4\u4E86", text: "D0646 \u662F\u9673\u6176\u9D3B\u8001\u5E2B\u7684\u7814\u7A76\u5BA4\uFF0C\u5C08\u9577\u96FB\u8166\u52D5\u756B\u8207\u52D5\u614B\u5F71\u50CF\uFF0C\u6559\u52D5\u614B\u5716\u50CF\u8A2D\u8A08\u3002" }
    },
    {
      id: "A12",
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
    vo_secret: "12 \u500B\u7570\u5E38\u5168\u88AB\u4F60\u627E\u5230\u4E86\u2026\u2026\u5176\u5BE6\u6211\u4E00\u76F4\u8DDF\u5728\u4F60\u5F8C\u9762\u5594\u3002\u6B61\u8FCE\u52A0\u5165\u52D5\u904A\u7CFB\uFF01"
  };

  // exit6/main.mjs
  var q = new URLSearchParams(location.search);
  var seed = q.has("seed") ? Number(q.get("seed")) : Date.now() & 4294967295;
  var rng = mulberry32(seed ^ 2654435769);
  var game = createGame(ANOMALIES, mulberry32(seed));
  var $ = (id) => document.getElementById(id);
  var stage = $("stage");
  var layers = [$("imgA"), $("imgB")];
  var sleep = (ms) => new Promise((r) => setTimeout(r, ms));
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
  var save = Object.assign({ dex: [], bestMs: null, bestMiss: null, clears: 0 }, loadSave());
  var run = { t0: 0, mistakes: 0, precise: 0, misTaps: 0, toured: /* @__PURE__ */ new Set() };
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
  var voices = {};
  function loadVoices() {
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
  function say(id, ms = 4500) {
    const v = voices[id];
    if (v) v.play().catch(() => {
    });
    $("sub").innerHTML = `<b>\u7CFB\u4E3B\u4EFB</b>${VOICE_TEXT[id]}`;
    $("sub").classList.remove("hidden");
    clearTimeout(say.t);
    say.t = setTimeout(() => $("sub").classList.add("hidden"), ms);
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
    const c = game.phase === "loop" ? game.count : 0;
    stage.style.setProperty("--grade", c ? `brightness(${1 - c * 0.05}) saturate(${1 - c * 0.08}) sepia(${c * 0.04}) hue-rotate(${c * 6}deg) contrast(${1 + c * 0.03})` : "none");
    stage.style.setProperty("--vig", String(0.5 + c * 0.07));
  }
  function toast(text) {
    const t = $("toast");
    t.textContent = text;
    t.classList.remove("hidden");
    clearTimeout(toast.t);
    toast.t = setTimeout(() => t.classList.add("hidden"), 1400);
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
  var tourLeft = () => STATIONS[game.station].spots.filter((_, i) => !run.toured.has(`${game.station}:${i}`)).length;
  function setButtons() {
    const off = busy || game.phase === "ending";
    $("btnBack").disabled = off;
    $("btnFwd").disabled = off || game.phase === "tour" && tourLeft() > 0;
  }
  function renderSpots() {
    const box = $("spots");
    box.innerHTML = "";
    if (game.phase !== "tour") return;
    STATIONS[game.station].spots.forEach((s, i) => {
      const b = document.createElement("button");
      b.className = "spot" + (run.toured.has(`${game.station}:${i}`) ? " done" : "");
      Object.assign(b.style, { left: s.x + "%", top: s.y + "%", width: s.w + "%", height: s.h + "%" });
      b.innerHTML = `<span>${s.label}</span>`;
      b.setAttribute("aria-label", `\u8ABF\u67E5\uFF1A${s.label}`);
      b.onclick = (e) => {
        e.stopPropagation();
        if (busy) return;
        run.toured.add(`${game.station}:${i}`);
        play("click");
        b.classList.add("done");
        $("tip").innerHTML = `<b>${s.label}</b>\u3000${s.text}`;
        setButtons();
        if (tourLeft() === 0) toast("\u9019\u7AD9\u770B\u5B8C\u4E86\uFF0C\u53EF\u4EE5\u5F80\u524D\u8D70");
      };
      box.appendChild(b);
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
      tip.textContent = `${st.tour}\uFF08\u9084\u6709 ${tourLeft()} \u500B\u5730\u65B9\u6C92\u770B\uFF09`;
      tip.classList.remove("hidden");
    } else if (!tip.dataset.keep) tip.classList.add("hidden");
    delete tip.dataset.keep;
    renderSpots();
    grade();
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
    $("spots").innerHTML = "";
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
    $("cardText").textContent = a.card.text;
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
  async function react(ev, precise) {
    if ("count" in ev) $("floorNo").textContent = `${ev.count}F`;
    remember(ev.anomaly);
    if (ev.type === "correct" || ev.type === "ending") {
      busy = true;
      setButtons();
      if (ev.anomaly) {
        if (precise) {
          run.precise++;
          flash();
          await sleep(reduced ? 0 : 110);
          shake(false);
          burst("\u78B0\uFF01\u6293\u5230\u4E86");
          play("found");
        } else {
          flash("black");
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
      await sleep(ev.anomaly ? 650 : 250);
      if (ev.anomaly) showCard(precise ? "\u2714 \u7CBE\u6E96\u6307\u8A8D\uFF01\u5716\u9451\u6536\u9304" : "\u2714 \u7B54\u5C0D\uFF01\u5716\u9451\u6536\u9304", ev.anomaly, walk);
      else walk();
      return;
    }
    run.mistakes++;
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
    run.misTaps++;
    play("click", 0.5);
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
        <span>\u5716\u9451\u7D2F\u8A08</span><b>${new Set(save.dex).size} / ${ANOMALIES.length}</b><span>\u6700\u4F73\u6642\u9593</span><b>${save.bestMs != null ? fmt(save.bestMs) : "\u2014"}</b></div></div>
    <p style="color:var(--dim);font-size:13px">\u622A\u5716\u9019\u5F35\u6210\u7E3E\u5361\uFF0C\u5206\u4EAB\u7D66\u540C\u5B78\u3002</p>
    <div class="row"><button class="go" id="again2">\u518D\u8D70\u4E00\u6B21</button></div>`;
    $("again2").onclick = () => location.reload();
  }
  $("btnBack").onclick = () => act("back");
  $("btnFwd").onclick = () => act("forward");
  stage.addEventListener("click", pointAt);
  addEventListener("keydown", (e) => {
    if (["ArrowLeft", "ArrowDown"].includes(e.key)) act("back");
    if (["ArrowRight", "ArrowUp"].includes(e.key)) act("forward");
  });
  $("go").onclick = () => {
    loadSfx();
    loadVoices();
    play("hum");
    $("start").classList.add("hidden");
    walk();
  };
  if (save.bestMs != null) $("best").textContent = `\u4F60\u7684\u6700\u4F73\u6642\u9593 ${fmt(save.bestMs)}\u30FB\u5716\u9451 ${new Set(save.dex).size}/${ANOMALIES.length}\u30FB\u901A\u95DC ${save.clears} \u6B21`;
  for (const p of ["plead", "cheer", "welcome", "peek"]) new Image().src = `frames/dean_${p}.webp`;
  renderStop();
  prefetch(0);
  if (q.has("debug") && q.has("go")) $("go").click();
})();
