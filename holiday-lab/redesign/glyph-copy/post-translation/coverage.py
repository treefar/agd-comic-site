"""Delta only: includes Latin, punctuation and CJK; reuses previous font receipts."""
import json,pathlib
from fontTools.ttLib import TTFont,TTCollection
root=pathlib.Path(__file__).parent
audit=json.loads((root/'audit.json').read_text(encoding='utf-8'))
prior=json.loads((root.parent/'coverage.json').read_text(encoding='utf-8'))
names={f['familyName'] for c in audit['cases'] for x in c['characters'] for f in x['platform']}
inventory={name:prior['font_inventory'].get(name,{}).get('files',[]) for name in names}
fonts={};errors=[]
for path in {p for files in inventory.values() for p in files}:
 try:
  p=pathlib.Path(path);group=TTCollection(p,lazy=True).fonts if p.suffix.lower()=='.ttc' else [TTFont(p,lazy=True)]
  for font in group:
   aliases={n.toUnicode() for n in font['name'].names if n.nameID in [1,4,6,16]}
   cmap={cp for cp,g in (font.getBestCmap() or {}).items() if g!='.notdef'}
   for name in aliases&names: fonts.setdefault(name,set()).update(cmap)
 except Exception as e: errors.append({'path':path,'error':str(e)})
results=[]
for c in audit['cases']:
 missing=[];unknown=[]
 for ch in c['characters']:
  actual={f['familyName'] for f in ch['platform']};covered=set().union(*(fonts.get(n,set()) for n in actual))
  if ord(ch['char']) not in covered:
   (unknown if actual-set(fonts) or not actual else missing).append({'char':ch['char'],'codepoint':ch['codepoint'],'actual':sorted(actual)})
 results.append({'issue':c['issue'],'lang':c['lang'],'active':c['visible'],'character_pairs':len(c['characters']),'missing':missing,'unknown':unknown,'pass':c['visible'] and not missing and not unknown})
out={'scope':'all non-whitespace characters in the 12 new translations, including Latin, punctuation, full-width symbols and CJK; per-character actual Chromium fonts and cmap','inventory':inventory,'font_parse_errors':errors,'cases':results,'pass':len(results)==12 and all(c['pass'] for c in results) and not errors}
(root/'coverage.json').write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding='utf-8')
for c in results: print(('YES' if c['pass'] else 'NO'),c['issue'],'ACTIVE',c['active'],'CHARACTERS',c['character_pairs'],'MISSING',len(c['missing']),'UNKNOWN',len(c['unknown']))
print('RESULT',sum(c['pass'] for c in results),'/12','ALL_NONSPACE_CHARACTER_PAIRS',sum(c['character_pairs'] for c in results),'PARSE_ERRORS',len(errors))
raise SystemExit(0 if out['pass'] else 1)
