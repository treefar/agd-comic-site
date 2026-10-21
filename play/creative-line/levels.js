// 三關設定（2026-10-21 v2：改用六樓出口的實驗室實景漫畫圖；玩法依 creative-line-levels.md 設計規格）
// 碰撞資料在 masks.js（由實景圖的拍攝板／桌面／地板算出）。課名、實驗室、師資名稱一律從 data/*.json 讀。
window.LEVELS = [
  {
    id: "lab_d0637", img: "art/scene/lab_d0637.webp", twist: "step", starTime: 20,
    labSlug: "d0637",
    course: { name: "動畫概論", track: "anim", term: { zh: "一年級第二學期", en: "Year 1, Spring" } },
    intro: { zh: "第 1 關．偶動畫實驗室", en: "Stage 1 · Stop-motion Lab" },
    rule: { zh: "光點一格一格跳，就像停格動畫：12 格／秒", en: "The spark moves frame by frame, like stop-motion: 12 fps" },
    did: { zh: "你剛體驗了停格動畫的節奏：動作是一格一格拍出來的。", en: "You just felt the rhythm of stop-motion: movement is shot one frame at a time." },
    links: [
      { kind: "curriculum", hash: "#/curriculum/map", hashEn: "#/en/curriculum", label: { zh: "看這門課", en: "See this course" } },
      { kind: "lab", slug: "d0637", hash: "#/labs/d0637", hashEn: "#/en/labs", label: { zh: "這間教室", en: "This lab" } }
    ]
  },
  {
    id: "lab_d0604", img: "art/scene/lab_d0604.webp", twist: "ink", starTime: 40,
    labSlug: "d0604",
    course: { name: "繪畫表現技法", track: "art", term: { zh: "一年級第二學期", en: "Year 1, Spring" } },
    intro: { zh: "第 2 關．電繪實驗室", en: "Stage 2 · Digital Drawing Lab" },
    rule: { zh: "手要穩：急轉會掉墨，墨水用完就重來", en: "Steady hand: sharp wobbles spill ink. Run dry and you restart" },
    did: { zh: "你剛練了運筆：線條乾淨，靠的是手穩和節奏。", en: "You just practised line control: clean lines come from a steady hand and rhythm." },
    links: [
      { kind: "curriculum", hash: "#/curriculum/map", hashEn: "#/en/curriculum", label: { zh: "看這門課", en: "See this course" } },
      { kind: "lab", slug: "d0604", hash: "#/labs/d0604", hashEn: "#/en/labs", label: { zh: "這間教室", en: "This lab" } },
      { kind: "faculty", slug: "chiangyamei", hash: "#/faculty/chiangyamei", hashEn: "#/en/faculty", label: { zh: "相關師資", en: "Related faculty" } }
    ]
  },
  {
    id: "lab_d0633", img: "art/scene/lab_d0633.webp", twist: "spring", starTime: 50,
    labSlug: "d0633",
    course: { name: "沉浸式體驗設計", track: "game", term: { zh: "三年級第一學期", en: "Year 3, Fall" } },
    intro: { zh: "第 3 關．體感互動實驗室", en: "Stage 3 · Motion & VR Lab" },
    rule: { zh: "光點有慣性，像在 VR 裡移動：要提早轉彎", en: "The spark has momentum, like moving in VR: turn early" },
    did: { zh: "你剛感受到體感的慣性：身體動，世界才跟著動。", en: "You just felt motion and momentum: your body moves, then the world follows." },
    links: [
      { kind: "curriculum", hash: "#/curriculum/map", hashEn: "#/en/curriculum", label: { zh: "看這門課", en: "See this course" } },
      { kind: "lab", slug: "d0633", hash: "#/labs/d0633", hashEn: "#/en/labs", label: { zh: "這間教室", en: "This lab" } },
      { kind: "work", id: "stolen-recipe", hash: "#works", hashEn: "#/en/works", label: { zh: "看學長姐作品", en: "Student work" } }
    ]
  }
];
