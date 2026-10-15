# 《六樓出口》生成圖歪斜驗收：只量測、不改圖。垂直線平均偏離垂直 > 0.6 度就列 FAIL，要重生
# 用法：python art-src/exit6/qa_tilt.py [檔名萬用字元，預設 gen/*.png]
import sys, os, glob, json
import cv2

HERE = os.path.dirname(os.path.abspath(__file__))
src = open(os.path.join(HERE, "level_refs.py"), encoding="utf-8").read().split("dry = ")[0]
ns = {"__file__": os.path.join(HERE, "level_refs.py")}
exec(src, ns)                       # 共用 level_refs.py 的 tilt_deg，量法一致
LIMIT = 0.6
HLIMIT = 0.3       # 正對牆面時水平線歪 0.3 度就看得出來（v1 系辦門口 -0.38° 被使用者指出歪）
import re
FRONTAL = re.compile(r"^s[1467]_(stop|a\d\d)\b")   # 正對牆面的停站圖與異常圖才查水平；中間格是斜看，水平線本來就會斜

def horiz_deg(img):
    import math, numpy as np
    g = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    e = cv2.Canny(cv2.GaussianBlur(g, (3, 3), 0), 40, 120)
    L = cv2.HoughLinesP(e, 1, np.pi / 1440, 60, minLineLength=img.shape[1] // 10, maxLineGap=8)
    a, w = [], []
    for x1, y1, x2, y2 in ([] if L is None else L[:, 0]):
        if x2 == x1: continue
        d = math.degrees(math.atan2(y2 - y1, x2 - x1))
        d = d - 180 if d > 90 else d + 180 if d < -90 else d
        if abs(d) <= 5: a.append(d); w.append(math.hypot(x2 - x1, y2 - y1))
    if len(a) < 6: return None, len(a)
    o = np.argsort(a); A = np.array(a)[o]; W = np.array(w)[o]
    return float(A[np.searchsorted(np.cumsum(W), W.sum() / 2)]), len(a)

pat = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, "gen", "*.png")
rows, bad = [], 0
for f in sorted(glob.glob(pat)):
    img = cv2.resize(cv2.imread(f), (1280, 720))
    d, n = ns["tilt_deg"](img)
    ok = d is None or abs(d) <= LIMIT
    hd, hn = horiz_deg(img) if FRONTAL.match(os.path.basename(f)) else (None, 0)
    if hd is not None and abs(hd) > HLIMIT: ok = False
    bad += not ok
    rows.append({"file": os.path.basename(f), "tilt": None if d is None else round(d, 2), "horiz": None if hd is None else round(hd, 2), "ok": ok})
    hs = "" if hd is None else f" 水平 {hd:+.2f}°({hn})"
    print(f"{os.path.basename(f):22s} 垂直 {('—' if d is None else f'{d:+.2f}°'):>8s}({n}){hs} {'OK' if ok else 'FAIL'}")
print(f"[qa_tilt] {len(rows)} 張，{bad} 張超過 {LIMIT}°")
sys.exit(1 if bad else 0)
