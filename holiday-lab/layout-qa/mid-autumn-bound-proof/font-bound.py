"""Read-only whole-face outline certificate. No font or product mutations."""
import json, hashlib
from pathlib import Path
from fontTools.ttLib import TTCollection
root=Path(__file__).parent
fontpath=Path('C:/Windows/Fonts/msjh.ttc')
font=TTCollection(fontpath).fonts[1]
assert font['name'].getDebugName(6)=='MicrosoftJhengHeiUIRegular'
raw=json.loads((root/'latest.json').read_text())
report=json.loads((root/raw['run']/'report.json').read_text())
alphabet=set('0123456789.'+''.join(''.join(v) for v in report['templates'].values()))
cmap=font.getBestCmap()
assert all(ord(c) in cmap for c in alphabet)
allowed={cmap[ord(c)] for c in alphabet}
# GSUB outputs are bounded by the whole font's glyph outlines, including all composites.
gpos=font['GPOS'].table.LookupList.Lookup
assert all(x.LookupType==4 for x in gpos)
mark_glyphs=set(g for x in gpos for s in x.SubTable for g in s.MarkCoverage.glyphs)
# No permitted input glyph or any substitution result is a mark in this face.
sub_outputs=set()
for lookup in font['GSUB'].table.LookupList.Lookup:
    assert lookup.LookupType in [1,4]
    for table in lookup.SubTable:
        if lookup.LookupType==1: sub_outputs.update(table.mapping.values())
        else:
            for rules in table.ligatures.values():
                sub_outputs.update(rule.LigGlyph for rule in rules)
assert not ((allowed|sub_outputs)&mark_glyphs)
adv=font['hmtx'].metrics
assert all(v[0]>=0 for v in adv.values())
kern=[]
for table in font['kern'].kernTables:
    assert table.coverage==1  # horizontal, non-cross-stream, non-minimum
    kern.extend((a,b,v,adv[a][0]+v) for (a,b),v in table.kernTable.items())
assert min(x[3] for x in kern)>=0
head=font['head']; bounds=[]
for name in font.getGlyphOrder():
    g=font['glyf'][name]
    if g.numberOfContours==0: continue
    bounds.append((name,g.xMin,g.yMin,g.xMax,g.yMax))
outline=[min(x[1] for x in bounds),min(x[2] for x in bounds),max(x[3] for x in bounds),max(x[4] for x in bounds)]
assert outline==[head.xMin,head.yMin,head.xMax,head.yMax]
scale=16/head.unitsPerEm
out={'font_file':str(fontpath),'sha256':hashlib.sha256(fontpath.read_bytes()).hexdigest(),'face_index':1,'postscript_name':font['name'].getDebugName(6),'units_per_em':head.unitsPerEm,'font_size_css_px':16,'whole_face_outline_font_units':outline,'whole_face_outline_css_px':[v*scale for v in outline],'glyphs_checked':len(bounds),'allowed_unicode_count':len(alphabet),'allowed_cmap':{c:cmap[ord(c)] for c in sorted(alphabet)},'all_cmap_present':True,'gpos_types':[x.LookupType for x in gpos],'permitted_or_substituted_glyphs_in_mark_coverage':[],'gsub_types':[x.LookupType for x in font['GSUB'].table.LookupList.Lookup],'all_substitution_output_count':len(sub_outputs),'kern_pairs':len(kern),'minimum_advance_after_kern':min(x[3] for x in kern),'all_hmtx_advances_nonnegative':True,'raster_guard_css_px':1,'notes':['Whole-font outline bounds include every GSUB output, regardless of which finite literal or numeric token triggered it.','Horizontal kern does not offset glyph outlines independently; all advance+kern values are nonnegative. No cross-stream kern.','Only GPOS mark attachment exists, and no allowed cmap glyph or possible GSUB output is in MarkCoverage.','No font-feature override or letter spacing is applied to the true hint; the certificate requires actual native font and line-strut checks.']}
out['maximum_advance_css_px']=max(v[0] for v in adv.values())*scale
permitted=[font['glyf'][n] for n in allowed|sub_outputs if font['glyf'][n].numberOfContours!=0]
out['permitted_plus_all_gsub_output_outline_css_px']=[min(g.xMin for g in permitted)*scale,min(g.yMin for g in permitted)*scale,max(g.xMax for g in permitted)*scale,max(g.yMax for g in permitted)*scale]
out['permitted_plus_all_gsub_output_count']=len(allowed|sub_outputs)
(root/'font-bound.json').write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({k:out[k] for k in ['postscript_name','glyphs_checked','whole_face_outline_css_px','minimum_advance_after_kern','all_cmap_present']}))
