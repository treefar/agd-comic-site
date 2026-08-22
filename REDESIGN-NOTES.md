# 漫畫再強化改版紀錄（2026-08-21 ～ 2026-08-22）

版本字串：`?v=20260822d`（基於原版 `20260804f`）。本紀錄對應分支 `redesign-comic2`，**尚未 push 上線**。
提案 canvas（診斷＋前後對比）：https://claude.ai/code/artifact/29535f47-f9ad-44a6-bb8e-e20a193582f6

## 一、實裝清單（30 項）

### 美術軌 A
| 編號 | 內容 |
|---|---|
| A1 | 中文字型演技：主標／章節標吃 Reggae One 筆刷體；旁白 Noto Serif TC 900；心聲 LXGW WenKai TC（styles.css 字型 import 擴充） |
| A2 | 擬聲字過渡版：SFX 元件逐字手排變形（固定變形表）；新元件 SFXBurst 爆炸框（hero「碰！」）。正式手繪字圖仍待生圖管線 |
| A3 | 色彩紀律：2006 區整面黃改紙白、影片牆與師資卡黃底退場、labs 黃卡退場、join 黃卡只留「甄選入學」、hero 標語條與徽章讓出黃色 |
| A4 | 手繪質感：集中線雙層＋feTurbulence 抖動（#hand-wobble）；hero 集中線中心留白；CMYK 疊角網點角帶；h-jojo 字內網點暈刪除 |
| A5 | 照片漫畫化：`manga` 模式＝**彩色漫畫渲染**（#manga-color 5 階色階壓縮＋提飽和＋細網點），hover 還原實照。用於老師照、新聞頭條照 |
| A6 | 老師照片 13 張收進 `images/faculty/`（600px q82，共 510KB），根治 404 黑格閃現；師資卡升級 RPG 人物卡（斜帶編號、CLASS 條、必殺技 chips） |
| A7 | 無圖得獎卡改「獎盃版型」（紅底集中線＋獎盃線圖＋獎名大字） |

### 效果軌 E
| 編號 | 內容 |
|---|---|
| E1 | 捲動蓋章進場：CSS scroll-driven（`animation-timeline: view()`），tier 與章節標題入視窗蓋章；桌機＋未要求減少動態才啟用 |
| E2 | Hover 擬聲字：clickable panel 滑過彈小字（data-hover-sfx）；CTA hover 爆速度線（.cta-burst） |
| E3 | 章節翻頁：ChapterNext 掀頁角（hover 放大）＋翻頁音 |
| E4 | PRESS START 點擊白閃＋LET'S GO!! 特效 |
| E5 | 音效層：AGDSound 總開關（localStorage `agd-sound`，預設開）＋TopNav SOUND ON/OFF 鈕；新增 playPopSound／playPageTurnSound |
| E6 | CMYK 套版錯位瞬效：`.cmyk-hover` hover 0.32 秒紅青錯位（hero 主標） |

### 文字軌 T
| 編號 | 內容 |
|---|---|
| T1 | 三聲道排印：第 3 話介紹文拆旁白黑框（明體）＋心聲虛線框（楷體）＋台詞泡泡（原有） |
| T2 | 大小格分層：94% 就業比升紅底主打格；影片牆第一支升 FEATURED 大格（2×2） |
| T3 | 下回預告：七處 ChapterNext 加 teaser 句；footer 加「NEXT ISSUE 下期預告」框 |
| T4 | 微文案統一遊戲漫畫語彙（隨各處改動一併調整） |

### 附帶 X
| 編號 | 內容 |
|---|---|
| X1 | 預編譯：新增 `build.mjs`（esbuild 合併 6 個 jsx → `bundle.js` 196KB）；index.html 改 React production UMD＋單一 bundle，Babel standalone 退場 |
| X2 | detail 頁沿用全域 CSS／元件改動 |

### COMIC WEB 2.0（Z／W）
| 編號 | 內容 |
|---|---|
| Z1 | 每話一色：`.chapter { --ch }`，01 紅／02 藍／03 綠／04 金／05 紫／06 青／07 紅；章標陰影、標題、翻頁章跟色 |
| Z2 | 讀者集章卡（左下 fixed）：IntersectionObserver 讀到哪蓋到哪，七章集滿顯示「全卷讀破！」導向報名 |
| Z3 | 直排引言箋：第 3 話旁白區並排，`maxHeight: 172` 自動折雙列 |
| Z4 | 手寫註記層：`.voice-note`（hero「↑按下去有驚喜」、join「時程別錯過！」） |
| Z5 | `::selection` 黃色螢光筆 |
| Z6 | ←→ 鍵盤翻章（useChapterKeys；detail 頁與輸入框不攔截） |
| Z7 | 章節書籤 rail（右緣 fixed 菱形點，目前話亮章節色；≤1100px 隱藏） |
| Z8 | ~~Loading 原稿格蓋印~~（已撤，見回饋修正 R1） |
| Z9 | 主標「畫出來，動起來。」逐字彈出進場（HeroTitleChars＋charPop） |
| W1 | 出血格：hero 紅橫幅「這一話，由你來畫」與第 7 話主 CTA 滿寬（`.tier-bleed`＋`html { overflow-x: clip }`） |
| W4 | 畫筆游標：桌機精準指標全站鉛筆 cursor（SVG data URI），可點物維持系統手勢 |
| W2/W3/W5 | 評估後不做：斜線分割（需專門構圖防切字）、深色版（inline 色不反轉會破圖）、拖曳掀頁（投報比低） |

## 二、回饋修正紀錄（2026-08-22 老師實機檢視）

| 編號 | 回饋 | 處置 |
|---|---|---|
| R1 | Loading 的原稿格「看起來像亂碼」 | 整組撤除，回到 LOADING 大字＋三色點 |
| R2 | 照片黑白網點有遺照聯想 | 黑白版全撤，改「彩色漫畫渲染」（#manga-color 色階壓縮＋saturate 1.45＋細網點），hover 還原實照 |
| R3 | 主標「畫」「動」筆畫糊 | 描邊 4px→2px（三版對比後定案筆刷體細描邊；明體列備選未採用） |
| R4 | 主標加特效後仍不夠清楚 | 再減法：紅陰影 7px→5px 留單層、外圈黑暈 drop-shadow 移除、斜切 -6°→-2°、集中線中央留白加大 |
| R5 | 「碰！」不清楚 | 紅字改黑字（黃底黑字最高對比）、描邊移除、只留白色 3px 陰影、字級 0.34→0.31、逐字變形收斂 |
| R6 | 第 3 話大片留白「原本就有嗎」 | 非原有——直排箋單列 13 字撐高整區所致；限高 172px 自動折雙列後解除 |

## 三、檔案異動

| 檔案 | 異動 |
|---|---|
| `styles.css` | 字型 import＋「2026-08 改版新增區」（四聲道、manga-photo、出血格、游標、章節色、rail、集章卡、scroll 進場、hover sfx、cmyk 等）＋ .sfx／.h-jojo／.bg-speedlines 修改 |
| `index.html` | SVG defs 加 #hand-wobble×2、#manga-color；script 區改 production React＋bundle.js；?v=20260822d |
| `comic-components.jsx` | SFX 逐字化、SFXBurst、PH manga 模式、AGDSound＋兩個新音效、SoundToggle、ChapterNext teaser／掀角／翻頁音、Panel hover-sfx、ChapterRailAndStamps、useChapterKeys |
| `chapters-1.jsx` | hero 全面改造（逐字大字、爆炸框、集中線 focus、CMYK 角帶、標語與徽章改色、PRESS START 特效）、2006 區改色＋94% 主打格、news 頭條照 manga、about 三聲道＋直排箋、teaser×3 |
| `chapters-2.jsx` | 師資 RPG 人物卡、labs 黃退場、影片牆 FEATURED、得獎卡獎盃版型、join 改色＋出血、footer 下期預告、teaser×4 |
| `app.jsx` | 掛 ChapterRailAndStamps＋useChapterKeys |
| `build.mjs`（新增） | 打包腳本 |
| `bundle.js`（新增） | 打包產物（**改任何 .jsx 後必須重跑 `node build.mjs` 並 bump index.html 的 ?v=**，否則改動不生效） |
| `images/faculty/`（新增） | 13 張老師照片 |

## 四、維護須知

1. 改 `.jsx` → `node build.mjs` → bump `index.html` 兩處 `?v=` → 測試。只改 `styles.css` 也要 bump ?v=。
2. 老師照片來源為學校 CDN（faculty.json 的 photoFallback 仍保留為備援）。
3. 音效總開關存 localStorage `agd-sound`；集章卡狀態不落地（每次進站重新集）。
4. 驗證備忘：headless 加 `--virtual-time-budget` 會凍結 CSS 動畫造成元素「消失」假象，判讀截圖前先 `--dump-dom` 查 DOM。

## 五、待辦

- [ ] 老師確認後 push 上線（目前僅本地分支 `redesign-comic2`）
- [ ] A2 正式版：擬聲字手繪字圖（核准生圖管線＋逐張人工檢視）
- [ ] A6 第三級：老師台詞（老師自供）／Q 版頭像
- [ ] 手機版逐屏檢查（本輪桌機為主，RWD 僅維持不壞）
