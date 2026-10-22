"""Read-only cmap cross-check of fonts reported by Chromium for visible text parents."""
import json, pathlib, re, glob, collections
from fontTools.ttLib import TTFont, TTCollection
root=pathlib.Path(__file__).parent
run=root/json.loads((root/'latest.json').read_text(encoding='utf-8'))['run']
scan=json.loads((run/'scan.json').read_text(encoding='utf-8'))
prior_root=root.parent/'font-audit'
prior=json.loads((prior_root/json.loads((prior_root/'latest.json').read_text(encoding='utf-8'))['run']/'audit.json').read_text(encoding='utf-8'))
fonts={}; errors=[]
def ingest(p):
 try:
  group=TTCollection(p,lazy=True).fonts if p.suffix.lower()=='.ttc' else [TTFont(p,lazy=True)]
  for font in group:
   chars={cp for cp,g in (font.getBestCmap() or {}).items() if g!='.notdef'}
   names={n.toUnicode() for n in font['name'].names if n.nameID in [1,4,6,16]}
   for name in names:
    item=fonts.setdefault(name,{'characters':set(),'files':set()});item['characters'].update(chars);item['files'].add(str(p))
 except Exception as e: errors.append({'file':str(p),'error':str(e)})
for f in prior['files']:
 if f['path'].endswith('.woff2'): ingest(prior_root/f['path'])
for f in scan['newFonts']: ingest(run/f['path'])
if (root/'nav-latest.json').exists():
 nav_run=root/json.loads((root/'nav-latest.json').read_text(encoding='utf-8'))['run']
 nav=json.loads((nav_run/'scan.json').read_text(encoding='utf-8'))
 assert nav['sourceHashes']==scan['sourceHashes'],'navigation and main corpus must use identical served sources'
 for f in nav['newFonts']: ingest(nav_run/f['path'])
 scan['pages'].extend(nav['pages'])
paths=set()
for pattern in ['msjh*','YuGoth*','segoeui*','seguiemj*','arial*','times*','meiryo*','mingliu*','msgothic*','msmincho*']:
 paths.update(pathlib.Path('C:/Windows/Fonts').glob(pattern))
for p in sorted(paths):
 if p.suffix.lower() in ['.ttf','.ttc','.otf']: ingest(p)
def target(c):
 cp=ord(c)
 return 0x3040<=cp<=0x30ff or 0x3400<=cp<=0x9fff or 0xf900<=cp<=0xfaff or 0x20000<=cp<=0x323af
unknown=[]; missing=[]; counts=collections.Counter(); by_page=[]
for page in scan['pages']:
 seen=set(); unmatched=[]
 for node in page['texts']:
  chars={c for c in node['text'] if target(c)};seen.update(chars)
  actual=[f['familyName'] for f in node['platform']]
  covered=set().union(*(fonts[f]['characters'] for f in actual if f in fonts))
  unverified=[f for f in actual if f not in fonts]
  for c in sorted(chars):
   counts['positions']+=1
   if ord(c) in covered: counts['cmap_verified']+=1
   else:
    entry={'page':page['label'],'url':page['url'],'text':node['text'],'char':c,'codepoint':f'U+{ord(c):04X}','requested':node['family'],'actual':actual,'unknown_fonts':unverified}
    (unknown if unverified or not actual else missing).append(entry);unmatched.append(c)
 by_page.append({'label':page['label'],'unique_cjk_chars':len(seen),'text_nodes':len(page['texts']),'unverified_or_missing':len(unmatched)})
counts['unique_cjk_characters']=len({c for p in scan['pages'] for n in p['texts'] for c in n['text'] if target(c)})
counts['text_nodes']=sum(len(p['texts']) for p in scan['pages'])
result={'method':'actual CDP platform font runs per visible text parent, cross-checked against union of those actual fonts cmap; parents can contain mixed runs, so this establishes availability, not a per-character assignment or visual clipping acceptance. positions counts distinct character/text-node pairs, not glyph occurrences.','counts':dict(counts),'pages':by_page,'unknown':unknown,'missing_candidates':missing,'font_parse_errors':errors,'font_inventory':{name:{'codepoints':len(v['characters']),'files':sorted(v['files'])} for name,v in fonts.items()}}
(root/'coverage.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
print('PAGES',len(by_page),'CJK_POSITIONS',counts['positions'],'CMAP_VERIFIED',counts['cmap_verified'],'UNKNOWN',len(unknown),'MISSING_CANDIDATES',len(missing),'FONT_PARSE_ERRORS',len(errors))
for x in (missing+unknown)[:30]: print(x['page'],x['codepoint'],x['char'],x['actual'],x['text'][:65])
