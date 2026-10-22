"""Read font cmap tables only; never generate or alter font/art files."""
import json, os, pathlib, hashlib, subprocess
from fontTools.ttLib import TTFont
ROOT=pathlib.Path(__file__).parent
run=ROOT/json.loads((ROOT/'latest.json').read_text(encoding='utf-8'))['run']
audit=json.loads((run/'audit.json').read_text(encoding='utf-8'))
samples={lang:sorted(set(text)) for lang,text in audit['samples'].items()}
families={}; errors=[]
for record in audit['files']:
    if not record['path'].endswith('.woff2'): continue
    p=ROOT/record['path']
    try:
        font=TTFont(p)
        name=font['name'].getDebugName(1)
        family=families.setdefault(name,{'family':name,'files':[],'cmap':set(),'variable_axes':[]})
        cmap=font.getBestCmap() or {}
        family['cmap'].update(cp for cp,glyph in cmap.items() if glyph!='.notdef')
        family['files'].append(record['path'])
        if 'fvar' in font: family['variable_axes']=[{'tag':a.axisTag,'min':a.minValue,'max':a.maxValue} for a in font['fvar'].axes]
    except Exception as e: errors.append({'file':record['path'],'error':str(e)})
cloud=subprocess.check_output(['powershell','-NoProfile','-File','C:/AIHome/claude/skills/cloud-asset-library/scripts/resolve-vault.ps1'],text=True,encoding='utf-8').strip()
candidate_rel=[
 '字型_合法免費_from魯哥/合法免費字型/手寫字型/ToneOZ-Tsuipita-TC_秋茄體無注音_解壓縮/ToneOZ-Tsuipita-TC.ttf',
 '字型_合法免費_from魯哥/_2026-09-03_新增_已查證/中文/BpmfGenSekiGothic-R.ttf',
 '字型_合法免費_from魯哥/_2026-09-03_新增_已查證/中文/BpmfGenYoMin-R.ttf']
candidates=[]
for rel in candidate_rel:
    p=pathlib.Path(cloud)/rel
    font=TTFont(p); cmap=font.getBestCmap() or {}
    candidates.append({'relative_source':rel,'family':font['name'].getDebugName(1),'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'glyph_codepoints':len(cmap),'missing_by_language':{l:[{'char':c,'codepoint':f'U+{ord(c):04X}'} for c in chars if not c.isspace() and (ord(c) not in cmap or cmap[ord(c)]=='.notdef')] for l,chars in samples.items()},'license':font['name'].getDebugName(13),'license_url':font['name'].getDebugName(14)})
result={'method':'fontTools TTFont getBestCmap, excluding .notdef; downloaded subsets prove only tested requested characters, not the complete upstream family','families':[{**{k:v for k,v in f.items() if k!='cmap'},'downloaded_union_codepoints':len(f['cmap']),'missing_sample':{l:[{'char':c,'codepoint':f'U+{ord(c):04X}'} for c in chars if not c.isspace() and ord(c) not in f['cmap']] for l,chars in samples.items()}} for f in families.values()],'errors':errors,'candidates':candidates}
(ROOT/'cmap.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
for f in result['families']: print(f['family'],f['downloaded_union_codepoints'],{l:''.join(c['char'] for c in m) for l,m in f['missing_sample'].items()})
for f in candidates: print('CANDIDATE',f['family'],f['glyph_codepoints'],{l:''.join(c['char'] for c in m) for l,m in f['missing_by_language'].items()})
print('ERRORS',len(errors))

