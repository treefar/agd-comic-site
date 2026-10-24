import json,hashlib
from pathlib import Path
import pdfplumber,pypdfium2 as pdfium
root=Path(__file__).resolve().parent
rows=[]
for name in ['english-rule-20251224','language-course-20240625','language-course-20201209']:
 p=root/(name+'.pdf');pages=[]
 with pdfplumber.open(p)as pdf:
  for i,page in enumerate(pdf.pages):pages.append({'page':i+1,'text':page.extract_text()or''})
 doc=pdfium.PdfDocument(p)
 for i in range(len(doc)):
  image=doc[i].render(scale=1.5).to_pil();image.save(root/(name+'-p'+str(i+1)+'.png'))
 (root/(name+'-pages.json')).write_text(json.dumps(pages,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
 rows.append({'file':p.name,'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'pages':len(pages),'nonempty_text_pages':sum(bool(p['text'].strip())for p in pages),'rendered_pages':len(doc)})
(root/'pdf-inventory.json').write_text(json.dumps(rows,indent=2)+'\n',encoding='utf-8');print(json.dumps(rows))
