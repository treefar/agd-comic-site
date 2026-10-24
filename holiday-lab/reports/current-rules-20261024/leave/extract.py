from pathlib import Path
import json
import pdfplumber
import pypdfium2 as pdfium
d=Path(__file__).parent
summary=[]
for name in ['rules-1141119','manual-1110817','official-proof','personal-proof']:
    p=d/'raw'/f'{name}.pdf'
    with pdfplumber.open(p) as pdf:
        pages=[{'page':i+1,'text':page.extract_text() or ''} for i,page in enumerate(pdf.pages)]
    (d/'raw'/f'{name}-text.json').write_text(json.dumps(pages,ensure_ascii=False,indent=2),encoding='utf-8')
    doc=pdfium.PdfDocument(str(p))
    for i in range(len(doc)):
        doc[i].render(scale=1.5).to_pil().save(d/'raw'/f'{name}-page-{i+1}.png')
    summary.append({'id':name,'pages':len(pages),'rendered':len(doc),'text_chars':sum(len(x['text']) for x in pages)})
(d/'pdf-summary.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(summary,ensure_ascii=False,indent=2))
