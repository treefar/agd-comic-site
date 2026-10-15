# 《六樓出口》物件輪廓：用 SAM 2.1（C:\AI\models\sam\sam2.1_b.pt，使用者 2026-10-15 同意下載）
# 以提示框找出物件邊緣 → 簡化成多邊形（畫面百分比）→ 寫成 exit6/outlines.mjs
# 只產生座標資料，不改任何圖片像素；畫面上的光暈與浮起是 CSS 用多邊形裁切同一張圖做的
# 用法：python art-src/exit6/outline_sam.py
import os, json
import cv2
import numpy as np
from ultralytics import SAM

HERE = os.path.dirname(os.path.abspath(__file__))
FRAMES = os.path.join(HERE, "..", "..", "exit6", "frames")
OUT = os.path.join(HERE, "..", "..", "exit6", "outlines.mjs")
model = SAM(r"C:\AI\models\sam\sam2.1_b.pt")

# key → (圖檔, [提示框 {x,y,w,h}（%）, …])；多個框＝多個物件合併成一組輪廓
B = lambda x, y, w, h: (x, y, w, h)
PROMPTS = {
    # 導覽調查點：S<站>:<序號>
    "S0:0": ("s0", [B(83, 3, 6, 26)]),
    "S1:0": ("s1", [B(4, 15, 23, 12), B(4, 27, 23, 8)]),   # 標誌＋英文、中文分兩框
    "S1:1": ("s1", [B(55, 26, 7, 19)]),
    "S1:2": ("s1", [B(29, 20, 8, 22)]),                       # 左側海報
    "S1:5": ("s1", [B(68, 18, 8, 22), B(77, 18, 8, 22)]),    # 右側海報
    "S1:3": ("s1", [B(0, 78, 100, 22)]),
    "S1:4": ("s1", [B(40, 19, 24, 52)]),
    "S2:0": ("s2", [B(3, 57, 36, 22)]),
    "S3:0": ("s3", [B(31, 0, 32, 80)]),
    "S4:0": ("s4", [B(44, 17, 9, 9)]),
    "S4:1": ("s4", [B(72, 30, 28, 70)]),
    "S5:0": ("s5", [B(17, 8, 23, 84), B(43, 8, 23, 84)]),
    "S6:0": ("s6", [B(30, 3, 29, 10)]),
    "S6:1": ("s6", [B(30, 82, 28, 14)]),
    "S7:0": ("s7", [B(43, 3, 6, 11)]),
    # 交付點：T:<id>
    "T:office1": ("s1", [B(40, 19, 24, 52)]),
    "T:lab": ("s4", [B(2, 3, 60, 95)]),
    "T:window": ("s5", [B(69, 8, 24, 84)]),
    "T:office": ("s6", [B(30, 2, 29, 96)]),
    # 線索物件：C:<id>
    "C:c2": ("s5", [B(0, 8, 12, 84)]),
    "C:c3": ("s6", [B(2, 46, 5, 11)]),
    "C:c4": ("s3", [B(2, 40, 7, 16)]),
    # 異常（在異常圖上切）：A<編號>
    "A01": ("s1_a01", [B(55, 26, 7, 19)]),
    "A02": ("s1_a02", [B(27, 18, 10, 26), B(66, 16, 20, 26)]),
    "A03": ("s1_a03", [B(0, 76, 100, 24)]),
    "A04": ("s2_a04", [B(14, 56, 14, 14)]),
    "A05": ("s3_a05", [B(36, 55, 26, 22)]),
    "A06": ("s4_a06", [B(43, 15, 11, 11)]),
    "A07": ("s4_a07", [B(12, 40, 18, 22)]),
    "A08": ("s5_a08", [B(17, 8, 23, 84)]),
    "A09": ("s5_a09", [B(43, 8, 23, 84)]),
    "A10": ("s6_a10", [B(30, 82, 28, 14)]),
    "A11": ("s6_a11", [B(30, 2, 29, 12)]),
    "A12": ("s7_a12", [B(42, 1, 9, 15)]),
}

result, report = {}, {}
for key, (img, boxes) in PROMPTS.items():
    path = os.path.join(FRAMES, f"{img}.webp")
    im = cv2.imread(path)
    H, W = im.shape[:2]
    polys = []
    for (x, y, w, h) in boxes:
        bb = [x * W / 100, y * H / 100, (x + w) * W / 100, (y + h) * H / 100]
        r = model(path, bboxes=[bb], verbose=False)[0]
        m = r.masks.data[0].cpu().numpy().astype(np.uint8)
        m = cv2.resize(m, (W, H), interpolation=cv2.INTER_NEAREST)
        m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))
        cs, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        if not cs: continue
        c = max(cs, key=cv2.contourArea)
        c = cv2.approxPolyDP(c, 0.004 * cv2.arcLength(c, True), True)
        pts = [[round(p[0][0] * 100 / W, 1), round(p[0][1] * 100 / H, 1)] for p in c]
        polys.append(pts)
        # 覆蓋率：輪廓佔提示框的比例，太小或太大都要人工看
        report.setdefault(key, []).append(round(float(m[int(bb[1]):int(bb[3]), int(bb[0]):int(bb[2])].mean()), 2))
    result[key] = polys
    print(f"[sam] {key:10s} {img:8s} 多邊形 {len(polys)} 組，點數 {[len(p) for p in polys]}，框內覆蓋 {report.get(key)}")

with open(OUT, "w", encoding="utf-8") as f:
    f.write("// 《六樓出口》物件輪廓（SAM 2.1 自動產生，art-src/exit6/outline_sam.py）：key → 多邊形陣列，座標為畫面百分比\n")
    f.write("// 不要手改；要調整就改 outline_sam.py 的提示框後重跑\n")
    f.write("export const OUTLINES = " + json.dumps(result, ensure_ascii=False) + ";\n")
print("[sam] 寫入", OUT)
