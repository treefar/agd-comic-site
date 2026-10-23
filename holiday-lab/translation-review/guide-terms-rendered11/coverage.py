"""Cross-check actual per-character CDP fonts against cached font cmap; no site changes."""
import argparse, hashlib, json, pathlib
from fontTools.ttLib import TTFont, TTCollection

parser=argparse.ArgumentParser()
parser.add_argument('--audit',required=True)
args=parser.parse_args()
audit_path=pathlib.Path(args.audit).resolve()
audit=json.loads(audit_path.read_text(encoding='utf-8'))
root=pathlib.Path(__file__).resolve().parent
repo=root.parents[2]
prior=json.loads((repo/'holiday-lab/redesign/glyph-copy/coverage.json').read_text(encoding='utf-8'))
actual_names={f['familyName'] for c in audit['cases'] for ch in c['characters'] for f in ch['platform']}
files={pathlib.Path(p) for name in actual_names for p in prior['font_inventory'].get(name,{}).get('files',[])}
files.update(pathlib.Path(f['path']) for f in audit.get('fontResponses',[]) if pathlib.Path(f['path']).suffix.lower() in ['.woff2','.woff','.ttf','.ttc','.otf'])
family_index={}
ps_index={}
font_receipts=[]
errors=[]
for p in sorted(files):
    try:
        data=p.read_bytes()
        fonts=TTCollection(p,lazy=True).fonts if p.suffix.lower()=='.ttc' else [TTFont(p,lazy=True)]
        names_used=set()
        for font in fonts:
            family={n.toUnicode() for n in font['name'].names if n.nameID in [1,4,16]}
            ps={n.toUnicode() for n in font['name'].names if n.nameID==6}
            cmap={cp for cp,g in (font.getBestCmap() or {}).items() if g!='.notdef'}
            for name in family:
                family_index.setdefault(name,set()).update(cmap)
            for name in ps:
                ps_index.setdefault(name,set()).update(cmap)
            names_used.update(family|ps)
        font_receipts.append({'path':str(p),'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest(),'aliases':sorted(names_used)})
    except Exception as e:
        errors.append({'path':str(p),'error':str(e)})

cases=[]
for c in audit['cases']:
    missing=[]
    unknown=[]
    mappings=[]
    for ch in c['characters']:
        candidates=set()
        unknown_fonts=[]
        modes=[]
        for f in ch['platform']:
            ps=f.get('postScriptName','')
            name=f['familyName']
            if ps and ps in ps_index:
                candidates.update(ps_index[ps]);modes.append({'family':name,'postScriptName':ps,'mode':'exact cached PostScript alias'})
            elif name in family_index:
                candidates.update(family_index[name]);modes.append({'family':name,'postScriptName':ps,'mode':'exact cached family alias; union of its font subsets/styles; Chromium may report a synthesized variable-font PostScript name'})
            else:
                unknown_fonts.append(f)
        entry={'char':ch['char'],'codepoint':ch['codepoint'],'actual':ch['platform'],'cmap_mappings':modes}
        if ord(ch['char']) not in candidates:
            (unknown if unknown_fonts or not ch['platform'] else missing).append(entry)
        mappings.append({'char':ch['char'],'codepoint':ch['codepoint'],'covered':ord(ch['char']) in candidates,'mappings':modes})
    cases.append({'id':c['id'],'lang':c['lang'],'width':c['width'],'visible':c['visible'],'character_pairs':len(c['characters']),'missing':missing,'unknown':unknown,'mappings':mappings,'pass':c['visible'] and bool(c['characters']) and not missing and not unknown})

out={'scope':'Only the delta sentences in actual product DOM. Isolated probes copy the actual target font/style; they establish per-character font availability, not contextual shaping or pixel-level border clearance. Family fallback is disclosed, never mislabeled an exact PostScript face match.','audit_sha256':hashlib.sha256(audit_path.read_bytes()).hexdigest(),'font_receipts':font_receipts,'font_parse_errors':errors,'cases':cases,'character_pairs':sum(c['character_pairs'] for c in cases),'missing_total':sum(len(c['missing']) for c in cases),'unknown_total':sum(len(c['unknown']) for c in cases),'pass':len(cases)==audit['expectedCases'] and all(c['pass'] for c in cases) and not errors}
(audit_path.parent/'coverage.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('CASES',sum(c['pass'] for c in cases),'/',audit['expectedCases'],'CHARACTER_PAIRS',out['character_pairs'],'MISSING',out['missing_total'],'UNKNOWN',out['unknown_total'],'FONT_PARSE_ERRORS',len(errors))
for c in cases:
    if c['missing'] or c['unknown']: print(c['id'],c['width'],'MISSING',c['missing'],'UNKNOWN',c['unknown'])
raise SystemExit(0 if out['pass'] else 1)
