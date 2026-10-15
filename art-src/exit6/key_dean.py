# 《六樓出口》系主任立繪去背：純綠 #00FF00 背景 → 透明，去邊緣綠色反光，裁到內容範圍，輸出 WebP（含透明）
# 只做去背、透明度、裁切與尺寸（核准管線輸出的後製），不繪製任何新像素內容
# 用法：python art-src/exit6/key_dean.py
import os, glob
import cv2
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "..", "..", "exit6", "frames")

for f in sorted(glob.glob(os.path.join(HERE, "gen", "dean_*.png"))):
    img = cv2.imread(f).astype(np.float32)
    b, g, r = img[..., 0], img[..., 1], img[..., 2]
    green = g - np.maximum(r, b)                       # 越綠越大
    alpha = np.clip(1.0 - (green - 40) / 80.0, 0, 1)   # 綠度 < 40 全保留、> 120 全透明，中間漸層（柔邊）
    alpha = cv2.GaussianBlur(alpha, (3, 3), 0)
    g2 = np.minimum(g, np.maximum(r, b) + 10)          # 去綠色反光：綠不得高出紅藍太多
    img[..., 1] = np.where(alpha < 1, g2, g)
    rgba = np.dstack([img, alpha * 255]).clip(0, 255).astype(np.uint8)
    ys, xs = np.where(alpha > 0.05)
    pad = 8
    y0, y1 = max(ys.min() - pad, 0), min(ys.max() + pad, rgba.shape[0])
    x0, x1 = max(xs.min() - pad, 0), min(xs.max() + pad, rgba.shape[1])
    crop = rgba[y0:y1, x0:x1]
    h = 900
    crop = cv2.resize(crop, (round(crop.shape[1] * h / crop.shape[0]), h), interpolation=cv2.INTER_AREA)
    name = os.path.basename(f).replace(".png", ".webp")
    cv2.imwrite(os.path.join(OUT, name), crop, [cv2.IMWRITE_WEBP_QUALITY, 85])
    print(f"[key] {name} {crop.shape[1]}x{crop.shape[0]} 透明比例 {float((alpha < 0.05).mean()):.0%}")
