import json,hashlib
from pathlib import Path
import pdfplumber,pypdfium2 as pdfium
root=Path(__file__).resolve().parent
rows=[]
for p in sorted(root.glob('BG00-*.pdf')):
 with pdfplumber.open(p)as pdf:pages=[{'page':i+1,'text':page.extract_text()or''}for i,page in enumerate(pdf.pages)]
 doc=pdfium.PdfDocument(p)
 for i in range(len(doc)):doc[i].render(scale=1.5).to_pil().save(root/(p.stem+'-p'+str(i+1)+'.png'))
 (root/(p.stem+'-pages.json')).write_text(json.dumps(pages,ensure_ascii=False,indent=2)+'\n',encoding='utf-8');rows.append({'file':p.name,'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'pages':len(pages),'rendered':len(doc)})
(root/'form-inventory.json').write_text(json.dumps(rows,indent=2)+'\n',encoding='utf-8');print(json.dumps(rows))
