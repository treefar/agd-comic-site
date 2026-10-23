import pathlib,json,pymupdf
b=pathlib.Path(r"C:/agywork/agd-holiday-prototypes/holiday-lab/reports/guide-support-career-research-20261023")
for name in ["school-regulations","degree-leaving"]:
 d=pymupdf.open(b/"raw"/(name+".pdf")); ps=[]
 for i,p in enumerate(d):
  text=p.get_text();ps.append({"pdf_page":i+1,"text":text})
  if name=="degree-leaving" or any(k in text for k in ["第三十八條","第三十七條","第十條","第十一條","第十二條"]):
   (b/"pages").mkdir(exist_ok=True);p.get_pixmap(matrix=pymupdf.Matrix(1.4,1.4)).save(b/"pages"/(name+"-p"+str(i+1)+".png"))
   print(name,i+1,'TEXT_CHARS',len(text))
 (b/"raw"/(name+"-pages.json")).write_text(json.dumps(ps,ensure_ascii=False,indent=2),encoding="utf8")
 print(name,"PAGES",len(d))

