"""Technical font metadata audit only. Does not render text or create UI artwork."""
from pathlib import Path
import hashlib, json, sys, importlib.metadata
from fontTools.ttLib import TTCollection
from fontTools.pens.boundsPen import BoundsPen

OUT=Path(__file__).resolve().parent
def digest(p):
    b=Path(p).read_bytes()
    return {"path":str(p),"bytes":len(b),"sha256":hashlib.sha256(b).hexdigest()}
def hits(value, names, route="", seen=None):
    if seen is None: seen=set()
    if isinstance(value,str): return [{"path":route,"glyph":value}] if value in names else []
    if isinstance(value,(int,float,bool,bytes,type(None))): return []
    if id(value) in seen: return []
    seen.add(id(value)); out=[]
    if isinstance(value,dict):
        for k,v in value.items():
            out+=hits(k,names,route+".<key>",seen)
            out+=hits(v,names,route+"["+str(k)+"]",seen)
    elif isinstance(value,(list,tuple)):
        for i,v in enumerate(value): out+=hits(v,names,route+"["+str(i)+"]",seen)
    elif hasattr(value,"__dict__"):
        for k,v in vars(value).items():
            if not k.startswith('_'): out+=hits(v,names,route+"."+k,seen)
    return out

fonts=[]
for filename in ["msjh.ttc","msjhbd.ttc"]:
    p=Path("C:/Windows/Fonts")/filename
    collection=TTCollection(str(p))
    for index,font in enumerate(collection.fonts):
        if font['name'].getDebugName(1)!="Microsoft JhengHei UI": continue
        cmap=font.getBestCmap(); glyphset=font.getGlyphSet(); digits=[]
        for char in "0123456789":
            name=cmap[ord(char)]; pen=BoundsPen(glyphset);glyphset[name].draw(pen)
            advance,lsb=font['hmtx'][name]
            digits.append({"digit":char,"glyph":name,"advance":advance,"lsb":lsb,"bounds":list(pen.bounds)})
        names={d['glyph'] for d in digits}
        kern=[]; unsupported=[]; all_kern_count=0
        if 'kern' in font:
            for i,sub in enumerate(font['kern'].kernTables):
                if not hasattr(sub,'kernTable'): unsupported.append({"subtable":i,"format":sub.format});continue
                all_kern_count+=len(sub.kernTable)
                for (left,right),value in sub.kernTable.items():
                    if left in names or right in names: kern.append({"subtable":i,"format":sub.format,"coverage":sub.coverage,"left":left,"right":right,"value":value})
        tables={}
        for tag in ['GSUB','GPOS']:
            table=font[tag].table if tag in font else None
            if table:
                lookups=[]
                for i,lookup in enumerate(table.LookupList.Lookup):
                    lookups.append({"index":i,"type":lookup.LookupType,"flag":lookup.LookupFlag,"digit_references":hits(lookup,names),"mark_glyphs":sorted({g for sub in lookup.SubTable for g in getattr(getattr(sub,'MarkCoverage',None),'glyphs',[])})})
                tables[tag]={"script_tags":[s.ScriptTag for s in table.ScriptList.ScriptRecord],"features":[{"tag":f.FeatureTag,"lookup_indices":f.Feature.LookupListIndex} for f in table.FeatureList.FeatureRecord],"lookups":lookups,"digit_references":hits(table,names)}
            else: tables[tag]=None
        xml=OUT/(filename+"-ui-tables.ttx")
        font.saveXML(str(xml),tables=[t for t in ['GSUB','GPOS','kern'] if t in font])
        fonts.append({"font":digest(p),"face_index":index,"family":font['name'].getDebugName(1),"subfamily":font['name'].getDebugName(2),"upem":font['head'].unitsPerEm,"digits":digits,"all_digits_equal_advance":len({d['advance'] for d in digits})==1,"digits_within_advance_slots":all(0<=d['bounds'][0]<=d['bounds'][2]<=d['advance'] for d in digits),"kern_total_pairs":all_kern_count,"digit_kern_pairs":kern,"unsupported_kern":unsupported,"font_tables":sorted(font.keys()),"other_shaping_tables_present":[t for t in ['morx','mort','kerx','Silf','Glat','Gloc','HVAR','fvar'] if t in font],"tables":tables,"table_xml":digest(xml)})
result={"type":"actual-font-digit-table-audit-v1","python":sys.executable,"fonttools_version":importlib.metadata.version('fonttools'),"script":digest(__file__),"fonts":fonts,"technical_probe_only":True,"native_shaping_certified":False,"full_project_approved":False}
(OUT/'font-audit.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({"fonts":[{"face":f['subfamily'],"advances":[d['advance'] for d in f['digits']],"bounds":[d['bounds'] for d in f['digits']],"slot":f['digits_within_advance_slots'],"kern_total":f['kern_total_pairs'],"digit_kern":len(f['digit_kern_pairs']),"GSUB_digit_refs":len(f['tables']['GSUB']['digit_references']),"GPOS_digit_refs":len(f['tables']['GPOS']['digit_references'])} for f in fonts]},ensure_ascii=False,indent=2))
