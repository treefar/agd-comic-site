"""Check only newly introduced codepoints against already acquired font files and CSS ranges."""
import json, hashlib
from pathlib import Path
from fontTools.ttLib import TTFont
HERE=Path(__file__).resolve().parent
BASE=HERE.parent/'followup-20261024'/'fonts'
delta=json.loads((HERE/'delta-verification.json').read_text(encoding='utf-8'))
coverage=json.loads((BASE/'coverage.json').read_text(encoding='utf-8'))
scan=json.loads((BASE/'scan.json').read_text(encoding='utf-8'))
import re
def contains(spec, cp):
    for part in spec.upper().replace('U+','').split(','):
        part=part.strip()
        if not part: continue
        if '?' in part: a,b=int(part.replace('?','0'),16),int(part.replace('?','F'),16)
        elif '-' in part: a,b=[int(x,16) for x in part.split('-')]
        else: a=b=int(part,16)
        if a<=cp<=b: return True
    return False
descriptors={}
for record in scan['font_css']:
    for block in re.findall(r'@font-face\s*\{([^}]+)\}',Path(record['file']).read_text(encoding='utf-8')):
        props=dict((a.strip(),b.strip())for a,b in re.findall(r'([\w-]+)\s*:\s*([^;]+)',block))
        for url in re.findall(r'url\([\'\"]?([^\)\'\"]+)',props.get('src','')):
            descriptors.setdefault(url,[]).append(props.get('unicode-range','U+0-10FFFF'))
rows=[]
for item in delta['new_codepoints']:
    cp=ord(item['character']); matches=[]
    for font in coverage['font_inventory']:
        p=Path(font['file'])
        if font['url'] and not any(contains(spec,cp)for spec in descriptors.get(font['url'],[])): continue
        if hashlib.sha256(p.read_bytes()).hexdigest()!=font['sha256']: raise AssertionError(str(p))
        f=TTFont(str(p),fontNumber=font['face'],lazy=True)
        if any(cp in table.cmap for table in f['cmap'].tables if table.isUnicode()):
            matches.append({'file':str(p),'face':font['face'],'families':font['names'],'sha256':font['sha256'],'css_range_checked':bool(font['url'])})
        f.close()
    rows.append({**item,'available':bool(matches),'matches':matches})
result={'scope':'new source-corpus codepoints only; not per-character rendered fallback proof','rows':rows,'missing':[r for r in rows if not r['available']],'downloaded_new_fonts':False,'product_font_changed':False}
(HERE/'font-delta.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'characters':len(rows),'available':sum(r['available']for r in rows),'missing':len(result['missing']),'new_fonts_downloaded':False},ensure_ascii=False))
raise SystemExit(1 if result['missing'] else 0)
