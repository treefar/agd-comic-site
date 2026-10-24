"""Read-only bounded glyph evidence. No game files, no font generation or edits."""
import json,re,hashlib,collections,unicodedata
from pathlib import Path
from fontTools.ttLib import TTFont,TTCollection
OUT=Path(__file__).resolve().parent
ROOT=OUT.parents[3]
scan=json.loads((OUT/'scan.json').read_text(encoding='utf-8'))
assert len(scan['pages'])==6 and scan.get('finished') and scan['source_stable']
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def ranges(s):
 result=set()
 for term in s.upper().split(','):
  t=term.strip().replace('U+','')
  if not t:continue
  if '?' in t:a,b=int(t.replace('?','0'),16),int(t.replace('?','F'),16)
  elif '-' in t:a,b=(int(v,16) for v in t.split('-'))
  else:a=b=int(t,16)
  result.update(range(a,b+1))
 return result
cssfaces=[]
for record in scan['font_css']:
 for block in re.findall(r'@font-face\s*\{([^}]+)\}',Path(record['file']).read_text(encoding='utf-8')):
  props=dict((a.strip(),b.strip())for a,b in re.findall(r'([\w-]+)\s*:\s*([^;]+)',block))
  urls=re.findall(r'url\([\'\"]?([^\)\'\"]+)',props.get('src',''))
  for url in urls:cssfaces.append({'url':url,'family':props.get('font-family','').strip('\'"'),'weight':props.get('font-weight'),'style':props.get('font-style'),'unicode_range':props.get('unicode-range','U+0-10FFFF'),'_range':ranges(props.get('unicode-range','U+0-10FFFF'))})
descriptors=collections.defaultdict(list)
for f in cssfaces:descriptors[f['url']].append(f)
fonts={};inventory=[];errors=[]
def ingest(p,url=None):
 try:
  group=TTCollection(p,lazy=True).fonts if p.suffix.lower()=='.ttc' else [TTFont(p,lazy=True)]
  for index,font in enumerate(group):
   names=set()
   for n in font['name'].names:
    if n.nameID in [1,4,6,16]:
     try:names.add(n.toUnicode())
     except Exception:pass
   cmap={cp for cp,glyph in(font.getBestCmap()or{}).items()if glyph!='.notdef'}
   desc=descriptors.get(url,[])
   # Respect this downloaded file's CSS Unicode eligibility, not the upstream family union.
   eligible=cmap.intersection(set().union(*(d['_range']for d in desc)))if desc else cmap
   row={'file':str(p),'face':index,'sha256':sha(p),'names':sorted(names),'raw_cmap':len(cmap),'css_eligible_cmap':len(eligible),'url':url,'css_descriptor_count':len(desc)}
   inventory.append(row)
   for name in names:
    f=fonts.setdefault(name,{'characters':set(),'files':set()});f['characters'].update(eligible);f['files'].add(str(p))
  for font in group:font.close()
 except Exception as e:errors.append({'file':str(p),'error':str(e)})
seen=set()
for record in scan['fonts']:
 p=Path(record['file']);assert sha(p)==record['sha256'];ingest(p,record['url']);seen.add(str(p))
system=set()
for pattern in ['msjh*','YuGoth*','segoe*','segui*','arial*','ariblk*','cambria*','consola*','times*','meiryo*','mingliu*','msgothic*','msmincho*']:
 system.update(Path('C:/Windows/Fonts').glob(pattern))
for p in sorted(system):
 if p.suffix.lower()in['.ttf','.ttc','.otf']:ingest(p)
def cp(c):return{'character':c,'codepoint':'U+%04X'%ord(c)}
def ignorable(c):return c.isspace()or ord(c)==0x200D or 0xFE00<=ord(c)<=0xFE0F or 0xE0100<=ord(c)<=0xE01EF
missing=[];unknown=[];pagecounts=[];total=0;verified=0;actualfamilies=set();unique=set();styles={}
for page in scan['pages']:
 count=0
 for row in page['texts']:
  chars={c for c in row['text']if not ignorable(c)};unique.update(chars)
  names=[f['familyName']for f in row['platform']if f.get('glyphCount',0)>0];actualfamilies.update(names)
  cover=set().union(*(fonts[n]['characters']for n in names if n in fonts))
  unknownnames=[n for n in names if n not in fonts]
  key=(page['lang'],row['family'],row['weight'],row['style']);s=styles.setdefault(key,set());s.update(chars)
  for c in sorted(chars):
   total+=1;count+=1
   if ord(c)in cover:verified+=1
   else:
    entry={'lang':page['lang'],'kind':page['kind'],'url':page['url'],'selector':row['selector'],'text':row['text'],'char':cp(c),'requested':row['family'],'actual':names,'unknown_fonts':unknownnames}
    (unknown if unknownnames or not names else missing).append(entry)
 pagecounts.append({'lang':page['lang'],'kind':page['kind'],'rows':len(page['texts']),'distinct_character_node_pairs':count})
downloaded={r['url']for r in scan['fonts']};unacquired=[{k:v for k,v in f.items()if k!='_range'}for f in cssfaces if f['url']not in downloaded]
# Static guide data is a separate candidate corpus: hidden strings are not promoted to observed DOM.
guide=json.loads((ROOT/'data/students/guide.json').read_text(encoding='utf-8'));guidechars=set()
def walk(x):
 if isinstance(x,dict):
  for k,v in x.items():
   if k in['title','summary','detail','q','a','label','warning','flow_note','primary','secondary','readability']and isinstance(v,str):guidechars.update(c for c in v if not ignorable(c))
   elif isinstance(v,(list,dict)):walk(v)
 elif isinstance(x,list):
  for v in x:walk(v)
walk(guide)
allknown=set().union(*(f['characters']for f in fonts.values()))
source_corpus=json.loads((OUT/'source-corpus.json').read_text(encoding='utf-8'))
static_chars=set();static_unavailable=[]
for row in source_corpus['rows']:
 chars={c for c in row['text']if not ignorable(c)};static_chars.update(chars)
 absent=[cp(c)for c in sorted(chars)if ord(c)not in allknown]
 if absent:static_unavailable.append({'file':row['file'],'pointer':row['pointer'],'text':row['text'],'missing_from_known_union':absent,'actual_rendering_unverified':True})
result={'method':'CDP actual platform-family runs per visible text parent, intersecting downloaded webfont cmap with that response CSS unicode-range. Parent union proves availability, not exact per-character selection. System aliases come from actual name tables.','pages':pagecounts,'rows':sum(p['rows']for p in pagecounts),'unique_nonspace_characters':len(unique),'character_node_pairs':total,'cmap_available_pairs':verified,'missing_candidates':missing,'unknown':unknown,'parse_errors':errors,'actual_families':sorted(actualfamilies),'font_inventory':inventory,'css_font_faces':len(cssfaces),'unacquired_css_faces':unacquired,'guide_static_candidate':{'characters':len(guidechars),'not_in_observed_dom_characters':[cp(c)for c in sorted(guidechars-unique)],'not_in_any_known_font':[cp(c)for c in sorted(guidechars)if ord(c)not in allknown],'actual_fallback_proven':False},'style_combinations':[{'lang':k[0],'family':k[1],'weight':k[2],'style':k[3],'characters':len(v)}for k,v in styles.items()],'excluded':'No games. Unicode variation selectors and ZWJ are shaping controls, not standalone missing-glyph assertions. No shaping/clip/raster acceptance.','complete_upstream_fonts_available':len(unacquired)==0,'actual_per_character_fallback_proven':False,'full_project_approved':False}
result['main_data_candidate']={'files':len(source_corpus['inputs']),'strings':len(source_corpus['rows']),'unique_characters':len(static_chars),'unavailable':static_unavailable,'actual_rendering_of_all_candidates_proven':False}
(OUT/'coverage.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({k:result[k]for k in['rows','unique_nonspace_characters','character_node_pairs','cmap_available_pairs','css_font_faces','actual_families']},ensure_ascii=True))
print(json.dumps({'missing':len(missing),'unknown':len(unknown),'parse_errors':len(errors),'unacquired_css_faces':len(unacquired),'static_guide_unavailable':len(result['guide_static_candidate']['not_in_any_known_font'])}))
raise SystemExit(1 if errors or missing or unknown else 0)
