import fitz,pathlib
b=pathlib.Path(r"C:/agywork/agd-holiday-prototypes/holiday-lab/reports/guide-capstone-study-research-20261023")
d=fitz.open(b/"raw/graduate116A1.pdf")
for n in range(8,15):
 p=d[n-1]; p.get_pixmap(matrix=fitz.Matrix(1.1,1.1)).save(b/"pages"/("graduate116A1-p%d.png"%n))
print("PROGRAM_PAGES_RENDERED 7")
