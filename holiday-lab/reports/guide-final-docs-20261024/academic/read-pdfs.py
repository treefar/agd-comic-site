import json,hashlib
from pathlib import Path
import pdfplumber,pypdfium2 as pdfium
d=Path(__file__).resolve().parent
rows=[]
for p in sorted((d/'raw').glob('*.pdf')):
 with pdfplumber.open(p)as pdf: pages=[{'page':i+1,'text':page.extract_text()or''}for i,page in enumerate(pdf.pages)]
 doc=pdfium.PdfDocument(p)
 for i in range(len(doc)):doc[i].render(scale=1.4).to_pil().save(d/'raw'/(p.stem+'-p'+str(i+1)+'.png'))
 (d/'raw'/(p.stem+'-pages.json')).write_text(json.dumps(pages,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
 rows.append({'file':'raw/'+p.name,'pages':len(pages),'text_pages':sum(bool(p['text'].strip())for p in pages),'rendered_pages':len(doc),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
(d/'pdf-inventory.json').write_text(json.dumps(rows,indent=2)+'\n',encoding='utf-8')
print(json.dumps(rows))
