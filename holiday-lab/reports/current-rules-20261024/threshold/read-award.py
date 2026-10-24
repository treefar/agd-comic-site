from pathlib import Path
import json,hashlib
import pdfplumber,pypdfium2 as pdfium
root=Path(__file__).resolve().parent;p=root/'certificate-award-1131009.pdf'
with pdfplumber.open(p)as pdf:pages=[{'page':i+1,'text':page.extract_text()or''}for i,page in enumerate(pdf.pages)]
doc=pdfium.PdfDocument(p)
for i in range(len(doc)):doc[i].render(scale=1.5).to_pil().save(root/('certificate-award-1131009-p'+str(i+1)+'.png'))
(root/'certificate-award-1131009-pages.json').write_text(json.dumps(pages,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'file':p.name,'pages':len(pages),'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'rendered':len(doc)}))
