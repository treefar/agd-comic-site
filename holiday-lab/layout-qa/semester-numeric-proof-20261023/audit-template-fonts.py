"""Checks font coverage per original language template; no shaping/rasterization claim."""
from pathlib import Path
import json,hashlib
from fontTools.ttLib import TTCollection
OUT=Path(__file__).resolve().parent
def ref(p):
    b=Path(p).read_bytes();return {'path':str(p),'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest()}
data=json.loads((OUT/'templates.json').read_text(encoding='utf-8'))
audit=json.loads((OUT/'font-audit.json').read_text(encoding='utf-8'))
rows=[]
for f in audit['fonts']:
    assert ref(f['font']['path'])['sha256']==f['font']['sha256']
    font=TTCollection(f['font']['path']).fonts[f['face_index']];cmap=font.getBestCmap()
    for t in data['templates']:
        chars=set(t['text'].replace('{{STEPS}}','0123456789'))
        missing=[{'char':c,'codepoint':ord(c)} for c in sorted(chars) if ord(c) not in cmap]
        rows.append({'font':f['subfamily'],'lang':t['lang'],'x':t['x'],'y':t['y'],'unique_characters':len(chars),'missing':missing})
result={'type':'per-template-cmap-coverage-v1','templates':ref(OUT/'templates.json'),'font_audit':ref(OUT/'font-audit.json'),'script':ref(__file__),'rows':rows,'all_covered':all(not r['missing'] for r in rows),'actual_browser_font_selection_proven':False,'native_equivalence':False,'global_approved':False}
(OUT/'template-font-audit.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'template_face_pairs':len(rows),'all_covered':result['all_covered'],'actual_browser_font_selection_proven':False}))
