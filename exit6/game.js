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
  function shuffle(list, rng) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function createGame(anomalies, rng = Math.random) {
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
      rng
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
      tour: "\u8A2D\u8A08\u5927\u6A13 D \u68DF\uFF0C\u6309\u4E0B 6 \u6A13\u3002\u52D5\u904A\u7CFB\u7684\u7CFB\u8FA6\u3001\u5F88\u591A\u9593\u5BE6\u9A57\u5BA4\u548C\u8001\u5E2B\u7814\u7A76\u5BA4\u90FD\u5728\u9019\u4E00\u5C64\u3002"
    },
    {
      id: "S1",
      name: "\u7CFB\u8FA6\u9580\u53E3",
      frames: ["frames/s1_a.webp", "frames/s1_b.webp"],
      still: "frames/s1.webp",
      src: "B 0:13\u20130:19",
      tour: "\u96FB\u68AF\u4E00\u51FA\u4F86\u7684\u6B63\u524D\u65B9\u5C31\u662F\u52D5\u904A\u7CFB\u7CFB\u8FA6\uFF0C\u65B0\u751F\u6709\u554F\u984C\u5148\u4F86\u9019\u88E1\u554F\u3002\u8A18\u4F4F\u9580\u53E3\u7684\u544A\u793A\u3001\u5169\u5074\u6D77\u5831\u548C\u5730\u4E0A\u7684\u5F69\u7E6A\u5730\u588A\u3002"
    },
    {
      id: "S2",
      name: "\u5929\u6A4B\u5730\u677F\u5F69\u7E6A",
      frames: ["frames/s2_a.webp", "frames/s2_b.webp"],
      still: "frames/s2.webp",
      src: "B 0:30\u20130:40",
      tour: "\u7A7F\u904E\u4F11\u606F\u5340\u5C31\u662F\u5929\u6A4B\uFF0C\u5730\u4E0A\u6709\u4E00\u5927\u7247\u5F69\u7E6A\u3002\u8A18\u4F4F\u5B83\u7684\u5716\u6848\u548C\u65B9\u5411\u3002"
    },
    {
      id: "S3",
      name: "\u4E2D\u5EAD\u724C\u6A13",
      frames: ["frames/s3_a.webp", "frames/s3_b.webp"],
      still: "frames/s3.webp",
      src: "B 3:30\u20133:39",
      tour: "\u73BB\u7483\u5929\u68DA\u4E0B\u7684\u6728\u9020\u724C\u6A13\uFF0C\u662F\u516D\u6A13\u6700\u597D\u8A8D\u7684\u5730\u6A19\u3002\u5728\u516D\u6A13\u8FF7\u8DEF\uFF0C\u5C31\u5148\u627E\u5B83\u3002"
    },
    {
      id: "S4",
      name: "D0604 \u96FB\u7E6A\u5BE6\u9A57\u5BA4",
      frames: ["frames/s4_a.webp", "frames/s4_b.webp"],
      still: "frames/s4.webp",
      src: "A 7:16\u20137:26",
      tour: "D0604 \u96FB\u7E6A\u5BE6\u9A57\u5BA4\uFF1A\u7E6A\u5716\u677F\u6559\u5BA4\uFF0C2D \u89D2\u8272\u3001\u5834\u666F\u3001UI \u90FD\u5728\u9019\u88E1\u7DF4\u3002\u9580\u865F D0604\uFF1DD \u68DF\u300106 \u6A13\u300104 \u865F\u623F\u3002\u65C1\u908A\u662F\u6D88\u9632\u6813\u3002"
    },
    {
      id: "S5",
      name: "\u4F5C\u54C1\u6D77\u5831\u6AE5\u7A97",
      frames: ["frames/s5_a.webp", "frames/s5_b.webp"],
      still: "frames/s5.webp",
      src: "A 7:30\u20137:41",
      tour: "\u8D70\u5ECA\u6AE5\u7A97\u8CBC\u6EFF\u4F5C\u54C1\u6D77\u5831\uFF0C\u8A18\u4F4F\u6BCF\u5F35\u7684\u4F4D\u7F6E\u548C\u65B9\u5411\u3002\uFF08\u5F85\u8001\u5E2B\u78BA\u8A8D\uFF1A\u6D77\u5831\u51FA\u8655\uFF09\u5149\u662F 2025 \u5E74\uFF0C\u7CFB\u4E0A\u5C31\u6709 8 \u4EF6\u4F5C\u54C1\u5165\u570D\u653E\u8996\u5927\u8CDE\u3002"
    },
    {
      id: "S6",
      name: "D0646 \u7814\u7A76\u5BA4",
      frames: ["frames/s6_a.webp", "frames/s6_b.webp"],
      still: "frames/s6.webp",
      src: "A 11:08\u201311:14",
      tour: "\u8001\u5E2B\u7814\u7A76\u5BA4\u9580\u53E3\u6709\u5728\u5BA4\u724C\uFF1AIN \u662F\u5728\u3001OUT \u662F\u4E0D\u5728\uFF0C\u627E\u8001\u5E2B\u524D\u5148\u770B\u4E00\u773C\u3002D0646 \u662F\u9673\u6176\u9D3B\u8001\u5E2B\uFF0C\u5C08\u9577\u96FB\u8166\u52D5\u756B\u8207\u52D5\u614B\u5F71\u50CF\u3002"
    },
    {
      id: "S7",
      name: "\u96FB\u68AF\u5EF3",
      frames: ["frames/s7_a.webp", "frames/s7_b.webp"],
      still: "frames/s7.webp",
      src: "B 5:58\u20136:10",
      tour: "\u7E5E\u4E00\u5708\u53C8\u56DE\u5230\u96FB\u68AF\u5EF3\u3002\u7246\u4E0A\u90A3\u500B\u300C6\u300D\u8A18\u4F4F\u5B83\u3002\u5C0E\u89BD\u5708\u7D50\u675F\u5F8C\uFF0C\u771F\u6B63\u7684\u5FAA\u74B0\u624D\u958B\u59CB\u3002"
    }
  ];
  var ANOMALIES = [
    {
      id: "A01",
      station: 1,
      still: "frames/s1_a01.webp",
      placeholder: { x: 50, y: 42, text: "\u544A\u793A\u8B8A\u6210\u300C\u8ACB\u56DE\u982D\u770B\u770B\u561B\u2661\u300D" },
      stage: "\u9580\u53E3 A4 \u544A\u793A\u63DB\u6210\u7B2C\u4E8C\u5F35",
      card: { title: "\u544A\u793A\u8B8A\u6EAB\u67D4\u4E86", text: "\u300C\u8ACB\u52FF\u56DE\u982D\u300D\u5176\u5BE6\u662F\u53CD\u8A71\uFF1A\u56DE\u982D\u5C31\u662F\u56DE\u5831\u7570\u5E38\u3002\u7CFB\u4E3B\u4EFB\u5F88\u5E0C\u671B\u4F60\u591A\u770B\u770B\u7CFB\u4E0A\u3002" }
    },
    {
      id: "A02",
      station: 1,
      still: "frames/s1_a02.webp",
      placeholder: { x: 50, y: 18, text: "\u9580\u53E3\u5169\u5074\u6D77\u5831\u5DE6\u53F3\u5C0D\u8ABF" },
      stage: "\u628A\u7CFB\u8FA6\u9580\u53E3\u5DE6\u53F3\u5169\u5F35\u6D77\u5831\u5C0D\u8ABF",
      card: { title: "\u6D77\u5831\u63DB\u908A\u4E86", text: "\u7CFB\u8FA6\u9580\u53E3\u7684\u6D77\u5831\u662F\u7CFB\u4E0A\u4F5C\u54C1\u3002\u7CFB\u8FA6\u5C31\u5728\u96FB\u68AF\u6B63\u524D\u65B9\uFF0C\u65B0\u751F\u6709\u554F\u984C\u5148\u4F86\u9019\u88E1\u554F\u3002" }
    },
    {
      id: "A03",
      station: 1,
      still: "frames/s1_a03.webp",
      placeholder: { x: 50, y: 85, text: "\u5730\u4E0A\u7684\u5F69\u7E6A\u5730\u588A\u65B9\u5411\u53CD\u4E86" },
      stage: "\u628A\u7CFB\u8FA6\u524D\u7684\u5F69\u7E6A\u5730\u588A\u7FFB\u9762",
      card: { title: "\u5730\u588A\u65B9\u5411\u53CD\u4E86", text: "\uFF08\u5F85\u8001\u5E2B\u88DC\u5145\uFF1A\u9019\u5F35\u5F69\u7E6A\u5730\u588A\u7684\u4F5C\u8005\u8207\u4F5C\u54C1\u4ECB\u7D39\uFF09" }
    },
    {
      id: "A04",
      station: 2,
      still: "frames/s2_a04.webp",
      placeholder: { x: 27, y: 62, text: "\u5F69\u7E6A\u4E2D\u592E\u591A\u4E86\u4E00\u96D9\u978B" },
      stage: "\u5728\u5929\u6A4B\u5F69\u7E6A\u4E2D\u592E\u653E\u4E00\u96D9\u978B",
      card: { title: "\u6709\u4EBA\u812B\u4E86\u978B", text: "\uFF08\u5F85\u8001\u5E2B\u88DC\u5145\uFF1A\u5929\u6A4B\u5730\u677F\u5F69\u7E6A\u7684\u7531\u4F86\uFF09" }
    },
    {
      id: "A05",
      station: 3,
      still: "frames/s3_a05.webp",
      placeholder: { x: 50, y: 70, text: "\u724C\u6A13\u6B63\u4E0B\u65B9\u591A\u4E86\u4E00\u5F35\u6905\u5B50" },
      stage: "\u642C\u4E00\u5F35\u8D70\u5ECA\u9577\u51F3\u5230\u724C\u6A13\u6B63\u4E0B\u65B9",
      card: { title: "\u724C\u6A13\u4E0B\u6709\u4EBA\u5750\u904E", text: "\uFF08\u5F85\u8001\u5E2B\u88DC\u5145\uFF1A\u4E2D\u5EAD\u724C\u6A13\u7684\u7531\u4F86\uFF09\u5728\u516D\u6A13\u8FF7\u8DEF\uFF0C\u5148\u627E\u724C\u6A13\u3002" }
    },
    {
      id: "A06",
      station: 4,
      still: "frames/s4_a06.webp",
      placeholder: { x: 46, y: 20, text: "\u9580\u865F\u8B8A\u6210 D0640" },
      stage: "\u9580\u865F\u4E0A\u8CBC A4\u300CD0640\u300D",
      card: { title: "\u9580\u865F\u8DD1\u6389\u4E86", text: "D0604\uFF1AD \u68DF\u300106 \u6A13\u300104 \u865F\u623F\u3002\u770B\u61C2\u9580\u865F\uFF0C\u5728\u5B78\u6821\u5C31\u4E0D\u6703\u8FF7\u8DEF\u3002" }
    },
    {
      id: "A07",
      station: 4,
      still: "frames/s4_a07.webp",
      placeholder: { x: 30, y: 50, text: "\u9580\u4E0A\u8CBC\u8457\u300C\u96FB\u7E6A\u98DF\u9A57\u5BA4\u300D" },
      stage: "\u9580\u4E0A\u8CBC A4\u300CD0604 \u96FB\u7E6A\u98DF\u9A57\u5BA4\u300D",
      card: { title: "\u96FB\u7E6A\u300C\u98DF\u300D\u9A57\u5BA4", text: "\u662F\u5BE6\u9A57\u5BA4\u4E0D\u662F\u98DF\u5802\u3002\u96FB\u7E6A\u5BE6\u9A57\u5BA4\u914D\u5099\u7E6A\u5716\u677F\uFF0C2D \u89D2\u8272\u3001\u5834\u666F\u3001UI \u90FD\u5728\u9019\u88E1\u7DF4\u3002" }
    },
    {
      id: "A08",
      station: 5,
      still: "frames/s5_a08.webp",
      placeholder: { x: 55, y: 45, text: "\u5176\u4E2D\u4E00\u5F35\u6D77\u5831\u4E0A\u4E0B\u985B\u5012" },
      stage: "\u8ACB\u7BA1\u7406\u6AE5\u7A97\u7684\u8001\u5E2B\u628A\u4E00\u5F35\u6D77\u5831\u5012\u904E\u4F86\u653E",
      card: { title: "\u6D77\u5831\u5012\u639B", text: "\uFF08\u5F85\u8001\u5E2B\u78BA\u8A8D\uFF1A\u6AE5\u7A97\u6D77\u5831\u7684\u51FA\u8655\u8207\u63DB\u5C55\u65B9\u5F0F\uFF092025 \u5E74\u7CFB\u4E0A\u6709 8 \u4EF6\u4F5C\u54C1\u5165\u570D\u653E\u8996\u5927\u8CDE\u3002" }
    },
    {
      id: "A09",
      station: 5,
      still: "frames/s5_a09.webp",
      placeholder: { x: 61, y: 45, text: "\u6AE5\u7A97\u88E1\u591A\u4E86\u4E00\u5F35\u7CFB\u4E3B\u4EFB\u7684\u81C9" },
      stage: "\u6AE5\u7A97\u5167\u653E\u4E00\u5F35 A4 \u7CFB\u4E3B\u4EFB\u7167\u7247",
      card: { title: "\u7CFB\u4E3B\u4EFB\u5728\u770B\u4F60", text: "\u6D77\u5831\u4E0A\u662F\u7CFB\u4E3B\u4EFB\u9127\u6A39\u9060\u672C\u4EBA\uFF08\u7167\u7CFB\u7DB2\u5B98\u65B9\u7167\u7247\u756B\u7684\uFF09\uFF0C\u5C08\u9577\u904A\u6232\u8A2D\u8A08\u3001\u5287\u672C\u5275\u4F5C\u8207\u6578\u4F4D\u526A\u8F2F\u3002\uFF08\u5F85\u8001\u5E2B\u88DC\u5145\uFF1A\u6AE5\u7A97\u6D77\u5831\u7684\u4F5C\u54C1\u4ECB\u7D39\uFF09" }
    },
    {
      id: "A10",
      station: 6,
      still: "frames/s6_a10.webp",
      placeholder: { x: 42, y: 86, text: "\u5728\u5BA4\u724C\u7684\u78C1\u9435\u5168\u90E8\u64E0\u5728 IN" },
      stage: "\uFF08\u5FB5\u5F97\u9673\u6176\u9D3B\u8001\u5E2B\u540C\u610F\uFF09\u628A\u5728\u5BA4\u724C\u78C1\u9435\u5168\u79FB\u5230 IN",
      card: { title: "\u5168\u90E8\u90FD\u5728\uFF1F", text: "\u5728\u5BA4\u724C IN \u662F\u5728\u3001OUT \u662F\u4E0D\u5728\u3002\u627E\u8001\u5E2B\u524D\u5148\u770B\u5728\u5BA4\u724C\uFF0C\u7701\u5F97\u767D\u8DD1\u4E00\u8D9F\u3002" }
    },
    {
      id: "A11",
      station: 6,
      still: "frames/s6_a11.webp",
      placeholder: { x: 49, y: 12, text: "\u9580\u724C\u540D\u5B57\u8B8A\u6210\u300C\u9127\u6A39\u9060\u300D" },
      stage: "\uFF08\u5FB5\u5F97\u540C\u610F\uFF09\u540D\u724C\u4E0A\u8CBC A4\u300C\u9127\u6A39\u9060\u300D",
      card: { title: "\u8D70\u932F\u7814\u7A76\u5BA4\u4E86", text: "D0646 \u662F\u9673\u6176\u9D3B\u8001\u5E2B\u7684\u7814\u7A76\u5BA4\uFF0C\u5C08\u9577\u96FB\u8166\u52D5\u756B\u8207\u52D5\u614B\u5F71\u50CF\uFF0C\u6559\u52D5\u614B\u5716\u50CF\u8A2D\u8A08\u3002" }
    },
    {
      id: "A12",
      station: 7,
      still: "frames/s7_a12.webp",
      placeholder: { x: 44, y: 8, text: "\u7246\u4E0A\u7684\u300C6\u300D\u8B8A\u6210\u300C8\u300D" },
      stage: "\u5728\u300C6\u300D\u4E0A\u8CBC\u4E00\u5F35 A4\u300C8\u300D",
      card: { title: "\u9019\u88E1\u4E0D\u662F\u516B\u865F\u51FA\u53E3", text: "\u9019\u88E1\u662F\u516D\u6A13\u3002\u81F4\u656C\u300A8 \u756A\u51FA\u53E3\u300B\uFF0C\u4F46\u6211\u5011\u7684\u51FA\u53E3\u8981\u9760\u8A8D\u8B58\u52D5\u904A\u7CFB\u624D\u627E\u5F97\u5230\u3002" }
    }
  ];
  var VOICE_TEXT = {
    vo_wrong_01: "\u6B38\u6B38\u6B38\u2014\u2014\u62DC\u8A17\u518D\u770B\u770B\u561B\uFF5E",
    vo_wrong_02: "\u540C\u5B78\uFF0C\u9019\u5708\u771F\u7684\u5F88\u6B63\u5E38\u5566\uFF0C\u4F60\u518D\u770B\u4E00\u6B21\u561B\u3002",
    vo_wrong_03: "\u597D\u5566\u597D\u5566\uFF0C\u6211\u966A\u4F60\u5F9E\u982D\u518D\u8D70\u4E00\u6B21\u3002",
    vo_first_correct: "\u6B38\uFF5E\u4F60\u5F88\u6703\u770B\u5594\uFF01\u5C31\u662F\u8981\u9019\u6A23\u3002",
    vo_half: "\u8D70\u4E00\u534A\u4E86\uFF0C\u516D\u6A13\u7684\u5730\u6A19\u4F60\u8A8D\u5F97\u5E7E\u500B\u5566\uFF1F",
    vo_ending: "\u606D\u559C\u4F60\u8D70\u51FA\u516D\u6A13\uFF01\u4E0D\u904E\u8AAA\u771F\u7684\uFF0C\u6B61\u8FCE\u4F60\u5E38\u5E38\u56DE\u4F86\u770B\u770B\u3002\u6211\u662F\u7CFB\u4E3B\u4EFB\u9127\u6A39\u9060\uFF0C\u52D5\u904A\u7CFB\u7B49\u4F60\u3002"
  };

  // exit6/main.mjs
  var q = new URLSearchParams(location.search);
  var seed = q.has("seed") ? Number(q.get("seed")) : Date.now() & 4294967295;
  var game = createGame(ANOMALIES, mulberry32(seed));
  var $ = (id) => document.getElementById(id);
  var stage = $("stage");
  var layers = [$("imgA"), $("imgB")];
  var front = 0;
  var busy = false;
  var audio = {};
  function preloadVoices() {
    for (const id of Object.keys(VOICE_TEXT)) {
      const a = new Audio(`audio/${id}.m4a`);
      a.preload = "auto";
      a.addEventListener("error", () => {
        audio[id] = null;
      });
      audio[id] = a;
    }
  }
  function say(id) {
    if (!id) return;
    const a = audio[id];
    if (a) a.play().catch(() => {
    });
    $("sub").innerHTML = `<b>\u7CFB\u4E3B\u4EFB</b>${VOICE_TEXT[id]}`;
    $("sub").classList.remove("hidden");
    clearTimeout(say.t);
    say.t = setTimeout(() => $("sub").classList.add("hidden"), 5e3);
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
      back.style.animation = push ? "push 700ms ease-out forwards" : "";
      back.classList.add("on");
      layers[front].classList.remove("on");
      front = 1 - front;
    };
    back.src = src;
  }
  var stopSrc = (st, an) => (an == null ? void 0 : an.still) || st.still;
  function setButtons() {
    const off = busy || game.phase === "ending";
    $("btnBack").disabled = off;
    $("btnFwd").disabled = off;
  }
  function renderStop() {
    var _a;
    const st = STATIONS[game.station];
    const an = game.phase === "loop" ? anomalyAt(game, ANOMALIES) : null;
    if (!layers[front].src.endsWith(stopSrc(st, an)) || showToken === 0) show(stopSrc(st, an), false);
    const ovs = [];
    if (an && !an.still) ovs.push(`<div class="ov ph" style="left:${an.placeholder.x}%;top:${an.placeholder.y}%">${an.placeholder.text}<small>\u7570\u5E38\u4F54\u4F4D\u30FB\u5F85\u751F\u5716</small></div>`);
    $("ovs").innerHTML = ovs.join("");
    $("floorNo").textContent = `${game.count}F`;
    $("where").textContent = game.phase === "tour" ? `\u5C0E\u89BD\u5708\u30FB${st.name}` : `\u7B2C ${game.lap} \u5708\u30FB${st.name}`;
    const tip = $("tip");
    if (game.phase === "tour") {
      tip.textContent = st.tour;
      tip.classList.remove("hidden");
    } else if (!tip.dataset.keep) tip.classList.add("hidden");
    delete tip.dataset.keep;
    if (q.has("debug")) {
      $("dbg").textContent = `seed ${seed}\uFF5C\u9019\u5708\u7570\u5E38\uFF1A${(_a = game.anomaly) != null ? _a : "\u7121"}`;
      $("dbg").classList.remove("hidden");
    }
    prefetch(game.station + 1);
  }
  var STEP_MS = 650;
  function walk() {
    const st = STATIONS[game.station];
    const an = game.phase === "loop" ? anomalyAt(game, ANOMALIES) : null;
    const seq = [...st.frames, stopSrc(st, an)];
    busy = true;
    setButtons();
    $("ovs").innerHTML = "";
    let i = 0, timer = null, ended = false;
    const done = () => {
      if (ended) return;
      ended = true;
      clearTimeout(timer);
      stage.onclick = null;
      busy = false;
      renderStop();
      setButtons();
    };
    const next = () => {
      if (i >= seq.length) return done();
      show(seq[i], i < seq.length - 1);
      i++;
      timer = setTimeout(next, STEP_MS);
    };
    stage.onclick = done;
    next();
  }
  function flash(red) {
    const f = document.createElement("div");
    f.className = "layer flash" + (red ? " red" : "");
    $("app").appendChild(f);
    setTimeout(() => f.remove(), 950);
  }
  function showCard(tag, anomalyId, onClose) {
    const a = ANOMALIES.find((x) => x.id === anomalyId);
    $("cardTag").textContent = tag;
    $("cardTitle").textContent = a.card.title;
    $("cardText").textContent = a.card.text;
    $("card").classList.remove("hidden");
    busy = true;
    setButtons();
    $("cardOk").onclick = () => {
      $("card").classList.add("hidden");
      busy = false;
      setButtons();
      onClose && onClose();
    };
    $("cardOk").focus();
  }
  function showEnding() {
    const got = new Set(game.seen);
    $("ending").innerHTML = `<h1>6F\u30FB\u51FA\u53E3</h1><p>\u4F60\u8D70\u51FA\u4E86\u516D\u6A13\u3002</p><p style="color:var(--dim)">\u5716\u9451 ${got.size} / ${ANOMALIES.length}</p>
    <div class="dex">${ANOMALIES.map((a) => got.has(a.id) ? `<div><b>${a.card.title}</b><br>${STATIONS[a.station].name}</div>` : `<div class="no">\uFF1F\uFF1F\uFF1F</div>`).join("")}</div>
    <button class="go" style="margin-top:12px" onclick="location.reload()">\u518D\u8D70\u4E00\u6B21</button>`;
    $("ending").classList.remove("hidden");
  }
  function act(action) {
    if (busy || game.phase === "ending" || !$("start").classList.contains("hidden")) return;
    const ev = step(game, action);
    if ("count" in ev) $("floorNo").textContent = `${ev.count}F`;
    switch (ev.type) {
      case "tour-hint":
        $("tip").textContent = "\u5C0E\u89BD\u5708\u5148\u5F80\u524D\u8D70\u5B8C\uFF0C\u628A\u6B63\u5E38\u7684\u6A23\u5B50\u8A18\u8D77\u4F86\u3002";
        $("tip").classList.remove("hidden");
        return;
      case "move":
        walk();
        return;
      case "tour-done":
        flash(false);
        $("tip").textContent = "\u5FAA\u74B0\u958B\u59CB\u3002\u8A18\u5F97\uFF1A\u89BA\u5F97\u4E0D\u5C0D\u52C1\u5C31\u56DE\u982D\u3002";
        $("tip").dataset.keep = "1";
        $("tip").classList.remove("hidden");
        walk();
        return;
      case "correct":
        flash(false);
        say(ev.voice);
        if (ev.anomaly) showCard("\u2714 \u7B54\u5C0D\uFF01\u5716\u9451\u6536\u9304", ev.anomaly, walk);
        else walk();
        return;
      case "wrong":
        flash(ev.reason === "missed");
        say(ev.voice);
        if (ev.reason === "missed") showCard("\u2718 \u4F60\u932F\u904E\u4E86\u9019\u500B\u7570\u5E38\uFF08\u8A08\u6578\u6B78\u96F6\uFF09", ev.anomaly, walk);
        else walk();
        return;
      case "ending":
        flash(false);
        say(ev.voice);
        if (ev.anomaly) showCard("\u2714 \u7B54\u5C0D\uFF01\u5716\u9451\u6536\u9304", ev.anomaly, showEnding);
        else showEnding();
        return;
    }
  }
  $("btnBack").onclick = () => act("back");
  $("btnFwd").onclick = () => act("forward");
  addEventListener("keydown", (e) => {
    if (["ArrowLeft", "ArrowDown"].includes(e.key)) act("back");
    if (["ArrowRight", "ArrowUp"].includes(e.key)) act("forward");
  });
  $("go").onclick = () => {
    preloadVoices();
    $("start").classList.add("hidden");
    walk();
  };
  renderStop();
  prefetch(0);
  if (q.has("debug") && q.has("go")) $("go").click();
})();
