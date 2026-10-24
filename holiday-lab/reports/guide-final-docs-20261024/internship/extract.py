from pathlib import Path
import json, zipfile, xml.etree.ElementTree as ET
import pymupdf
d=Path(__file__).parent
result=[]
for p in (d/'raw').glob('*'):
    if p.suffix=='.pdf':
        doc=pymupdf.open(p)
        pages=[{'page':i+1,'text':page.get_text()} for i,page in enumerate(doc)]
        (d/'raw'/f'{p.stem}-text.json').write_text(json.dumps(pages,ensure_ascii=False,indent=2),encoding='utf8')
        # All rule pages, guide pages only those with routes/status/printing.
        visual=list(range(len(doc))) if p.stem!='student-system-guide' else [i for i,x in enumerate(pages) if any(w in x['text'] for w in ['學務資訊','核准','列印','申請流程'])]
        if not visual and len(doc): visual=[0]
        for i in visual:
            doc[i].get_pixmap(matrix=pymupdf.Matrix(1.2,1.2)).save(d/'raw'/f'{p.stem}-page-{i+1}.png')
        result.append({'file':p.name,'pages':len(pages),'text_chars':sum(len(x['text'])for x in pages),'rendered_pages':[i+1 for i in visual]})
    elif p.suffix=='.odt':
        with zipfile.ZipFile(p) as z:
            xml=z.read('content.xml'); root=ET.fromstring(xml)
            ns='{urn:oasis:names:tc:opendocument:xmlns:text:1.0}'
            text='\n'.join(''.join(el.itertext()) for el in root.iter() if el.tag in [ns+'p',ns+'h'])
            (d/'raw'/f'{p.stem}-text.txt').write_text(text,encoding='utf8')
            result.append({'file':p.name,'text_chars':len(text),'reading':'full content.xml text; no Word/ODT visual layout claim'})
(d/'extraction.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps(result,ensure_ascii=False,indent=2))
