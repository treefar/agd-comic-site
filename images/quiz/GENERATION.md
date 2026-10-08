# 測驗結果分享圖生成紀錄

- 生成入口：Codex CLI（ImageGen），codex-image skill 的 run-codex-image.mjs
- 日期：2026-10-08
- 原圖：1536x1024 PNG（本機 _quiz-raw/，不進版控）
- 後製：只做裁切（上方位移 anim 109／game 60／art 100／cross 60 px，取 1536x806）與縮放到 1200x630、存 JPEG q86；沒有加字或局部修改
- 圖上文字由模型直接畫出，已逐張核對：YOU ARE／動畫派 ANIMATOR／遊戲派 GAME MAKER／美術派 ARTIST／跨域派 CREATOR
- 使用者審核：待確認

## 共用 Prompt

```
Wide landscape social-media share card (1536x1024), for a Taiwanese university Animation & Game Design department quiz result. Retro manga / pop-art comic style: warm beige paper background (#f4ecd8) with visible halftone dot texture, thick confident black ink outlines (#0f0d0a), bold comic panel border around the whole image, dramatic radiating speed lines, flat cel shading with halftone shadows. Limited palette: ink black, beige paper, sunshine yellow (#ffd60a), plus ONE theme color given below used for the big background burst. Energetic JoJo-style dynamic pose, youthful and cool, appeals to Taiwanese high-school students. Composition: one young Taiwanese college student character on the LEFT half (waist-up, dynamic angle); RIGHT half holds the title text in a yellow comic caption box with thick black outline and offset black drop shadow. Keep all important content inside the central horizontal band; the top 10% and bottom 10% may be cropped later. No logos, no watermarks, no extra words other than the exact text specified. Text must be spelled exactly, large, crisp and legible.
```

各派另加：主題色（anim #e63946、game #1d4ed8、art #ec4899、cross #16a34a）、角色動作（翻頁動畫書／握手把＋像素特效／繪圖筆＋顏料飛濺／VR 頭盔＋動捕點＋3D 列印公仔）、兩行標題文字。
