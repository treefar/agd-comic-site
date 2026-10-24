import json, pathlib, zipfile, xml.etree.ElementTree as ET
import pdfplumber, pypdfium2

root=pathlib.Path(__file__).parent
(root/'pages').mkdir(exist_ok=True)
records=json.loads((root/'raw/download-results.json').read_text(encoding='utf-8'))
results=[]
for record in records:
    if not record['valid']: continue
    p=root/record['file']
    if p.suffix=='.pdf':
        with pdfplumber.open(p) as doc:
            pages=[{'page':i+1,'text':page.extract_text() or ''} for i,page in enumerate(doc.pages)]
        (root/'raw'/f"{record['id']}-pages.json").write_text(json.dumps(pages,ensure_ascii=False,indent=2),encoding='utf-8')
        doc=pypdfium2.PdfDocument(str(p))
        for i in range(len(doc)):
            doc[i].render(scale=1.25).to_pil().save(root/'pages'/f"{record['id']}-p{i+1}.webp",'WEBP',quality=85)
        results.append({'id':record['id'],'pages':len(pages),'characters':sum(len(x['text']) for x in pages)})
    elif p.suffix in ['.docx','.odt']:
        with zipfile.ZipFile(p) as z:
            content=z.read('word/document.xml' if p.suffix=='.docx' else 'content.xml')
            tree=ET.fromstring(content)
            text='\n'.join(''.join(e.itertext()) for e in tree.iter() if e.tag.endswith('}p'))
        (root/'raw'/f"{record['id']}-text.txt").write_text(text,encoding='utf-8')
        results.append({'id':record['id'],'characters':len(text),'format':p.suffix})
(root/'raw/extraction-results.json').write_text(json.dumps(results,indent=2),encoding='utf-8')
print(json.dumps(results,indent=2))
