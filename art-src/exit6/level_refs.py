# 《六樓出口》參考照片轉正：量出畫面歪幾度（手持拍攝的左右傾斜），整張旋轉校正後放大裁掉黑邊
# 這是對「實拍參考圖」做幾何校正，不畫任何新像素內容；生圖仍由 Codex 依校正後的參考圖重繪
# 用法：python art-src/exit6/level_refs.py [--dry]   原圖保留在 ref_raw/，校正結果寫回 ref/
import sys, os, glob, json, math, shutil
import cv2
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
REF, RAW = os.path.join(HERE, "ref"), os.path.join(HERE, "ref_raw")
MAX_FIX = 6.0      # 超過 6 度多半是量錯（例如拍到斜面），不自動轉，列出來人工看
MIN_FIX = 0.3      # 小於 0.3 度看不出來，不轉
MIN_LINES = 15     # 垂直線少於 15 條量不準，不自動轉；要轉就寫進 level_override.json（目測決定的角度）

def tilt_deg(img):
    """接近垂直的直線，以長度加權取中位數，回傳要逆時針轉幾度才會正"""
    g = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(cv2.GaussianBlur(g, (3, 3), 0), 40, 120)
    h = img.shape[0]
    lines = cv2.HoughLinesP(edges, 1, np.pi / 1440, 50, minLineLength=h // 8, maxLineGap=8)
    if lines is None: return None, 0
    angs, wts = [], []
    for x1, y1, x2, y2 in lines[:, 0]:
        dx, dy = x2 - x1, y2 - y1
        if dy == 0: continue
        a = math.degrees(math.atan2(dx, dy))          # 與垂直線的夾角
        if a > 90: a -= 180
        if a < -90: a += 180
        if abs(a) <= 12:
            angs.append(a); wts.append(math.hypot(dx, dy))
    if len(angs) < 8: return None, len(angs)   # 線太少量不準，交給人工
    order = np.argsort(angs); a = np.array(angs)[order]; w = np.array(wts)[order]
    mid = np.searchsorted(np.cumsum(w), w.sum() / 2)
    return float(a[mid]), len(angs)

def level(img, deg):
    h, w = img.shape[:2]
    t = math.radians(abs(deg))
    k = math.cos(t) + (w / h) * math.sin(t)            # 放大到旋轉後沒有黑邊
    M = cv2.getRotationMatrix2D((w / 2, h / 2), -deg, k)
    return cv2.warpAffine(img, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE), k

dry = "--dry" in sys.argv
ovf = os.path.join(HERE, "level_override.json")
override = json.load(open(ovf, encoding="utf-8")) if os.path.exists(ovf) else {}
os.makedirs(RAW, exist_ok=True)
report = []
for f in sorted(glob.glob(os.path.join(REF, "*.jpg"))):
    name = os.path.basename(f)
    raw = os.path.join(RAW, name)
    if not os.path.exists(raw): shutil.copy2(f, raw)   # 永遠從原圖量與轉，可重跑
    img = cv2.imread(raw)
    deg, n = tilt_deg(img)
    key = name[:-4]
    if key in override: deg, n = float(override[key]), "manual"
    elif deg is not None and n < MIN_LINES: deg = None
    act = "skip"
    if deg is not None and MIN_FIX <= abs(deg) <= MAX_FIX:
        act = "fix"
        if not dry:
            out, k = level(img, deg)
            cv2.imwrite(f, out, [cv2.IMWRITE_JPEG_QUALITY, 95])
    elif not dry:
        shutil.copy2(raw, f)
    report.append({"file": name, "tilt": None if deg is None else round(deg, 2), "lines": n, "action": act})
    print(f"{name:14s} tilt={'—' if deg is None else f'{deg:+.2f}°':>8s} lines={str(n):>6s} {act}")
with open(os.path.join(HERE, "level_report.json"), "w", encoding="utf-8") as fp:
    json.dump(report, fp, ensure_ascii=False, indent=1)
