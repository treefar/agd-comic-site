// 三段路線設定。碰撞資料來自 masks.js（由路線圖的米色路面算出，與畫面完全對位）。
// course 的名稱、實驗室、師資、作品一律從 data/*.json 讀，不手打；links 的 kind/slug/id 是查表鍵。
window.ROUTES = [
  {
    id: "route1", art: "art/web/route1.png",
    course: {
      name: "手繪動畫", track: "anim", term: { zh: "一年級第一學期", en: "Year 1, Fall" },
      did: { zh: "你剛做的是動畫的「動作連續性」：每一格都要接得上前一格。", en: "You just practised motion continuity in animation: every frame has to connect to the one before it." },
      links: [
        { kind: "curriculum", hash: "#/curriculum/map", hashEn: "#/en/curriculum", label: { zh: "這門課學什麼", en: "What this course covers" } },
        { kind: "lab", slug: "d0637", hash: "#/labs/d0637", hashEn: "#/en/labs", label: { zh: "去哪裡做", en: "Where it happens" } },
        { kind: "faculty", slug: "chiangyamei", hash: "#/faculty/chiangyamei", hashEn: "#/en/faculty", label: { zh: "相關師資", en: "Related faculty" } }
      ],
      cardArt: "art/web/card_anim.png"
    }
  },
  {
    id: "route2", art: "art/web/route2.png",
    course: {
      name: "基礎程式設計", track: "game", term: { zh: "一年級第一學期", en: "Year 1, Fall" },
      did: { zh: "你剛做的是程式的「輸入與回饋」：手一動，畫面立刻回應。", en: "You just felt input and feedback in programming: move your hand and the screen answers at once." },
      links: [
        { kind: "curriculum", hash: "#/curriculum/map", hashEn: "#/en/curriculum", label: { zh: "這門課學什麼", en: "What this course covers" } },
        { kind: "lab", slug: "multimedia-classroom", hash: "#/labs/multimedia-classroom", hashEn: "#/en/labs", label: { zh: "去哪裡做", en: "Where it happens" } }
      ],
      cardArt: "art/web/card_code.png"
    }
  },
  {
    id: "route3", art: "art/web/route3.png",
    // 移動閘門：在走廊中央左右來回；離開走廊的那一段就是通過的時機
    gate: { y: 520, cx: 300, amp: 170, speed: 120, w: 100 },
    course: {
      name: "遊戲機制與關卡設計", track: "game", term: { zh: "三年級第一學期", en: "Year 3, Fall" },
      did: { zh: "你剛做的是「關卡設計」：移動的閘門先預告、再讓你抓時機通過。", en: "You just met level design: a moving gate gives a warning, then rewards good timing." },
      links: [
        { kind: "curriculum", hash: "#/curriculum/map", hashEn: "#/en/curriculum", label: { zh: "這門課學什麼", en: "What this course covers" } },
        { kind: "work", id: "stolen-recipe", hash: "#works", hashEn: "#/en/works", label: { zh: "看學長姐做什麼", en: "See student work" } }
      ],
      cardArt: null
    }
  }
];
