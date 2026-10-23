"""Independent read-only finite glyph/lookup audit; outputs only beside this script."""
import hashlib,json
from pathlib import Path
from fontTools.ttLib import TTCollection
from fontTools.pens.boundsPen import ControlBoundsPen
root=Path(__file__).parent
author=root.parent
cert=json.loads((author/'font-bound.json').read_text(encoding='utf8'))
fontpath=Path(cert['font_file']); data=fontpath.read_bytes()
assert hashlib.sha256(data).hexdigest()==cert['sha256']
font=TTCollection(fontpath).fonts[1]
assert font['name'].getDebugName(6)==cert['postscript_name']
cmap=font.getBestCmap(); glyphset=font.getGlyphSet(); order=font.getGlyphOrder()
alphabet=list(cert['allowed_cmap'])
assert {c:cmap[ord(c)] for c in alphabet}==cert['allowed_cmap']
witness={cmap[ord(c)]:c for c in alphabet}
lookups=font['GSUB'].table.LookupList.Lookup
trace=[]
changed=True
while changed:
    changed=False
    for li,lookup in enumerate(lookups):
        assert lookup.LookupType in [1,4]
        for si,table in enumerate(lookup.SubTable):
            rules=([(src,[],dst) for src,dst in table.mapping.items()] if lookup.LookupType==1 else [(src,rule.Component,rule.LigGlyph) for src,rules in table.ligatures.items() for rule in rules])
            for src,components,dst in rules:
                if src in witness and all(c in witness for c in components) and dst not in witness:
                    witness[dst]=''.join(witness[g] for g in [src]+components)
                    trace.append({'lookup':li,'type':lookup.LookupType,'inputs':[src]+components,'output':dst,'witness':witness[dst]})
                    changed=True
metrics=font['hmtx'].metrics
allrows=[]; recomputed_mismatch=[]
for name in order:
    glyph=font['glyf'][name]
    if glyph.numberOfContours==0: continue
    stored=[glyph.xMin,glyph.yMin,glyph.xMax,glyph.yMax]
    pen=ControlBoundsPen(glyphset);glyphset[name].draw(pen)
    recomputed=list(pen.bounds)
    if stored!=recomputed:recomputed_mismatch.append({'glyph':name,'stored':stored,'recomputed':recomputed})
    allrows.append({'glyph':name,'bounds':stored,'advance':metrics[name][0]})
full=[min(x['bounds'][0] for x in allrows),min(x['bounds'][1] for x in allrows),max(x['bounds'][2] for x in allrows),max(x['bounds'][3] for x in allrows)]
assert full==cert['whole_face_outline_font_units']
reachable=[x for x in allrows if x['glyph'] in witness]
reachbound=[min(x['bounds'][0] for x in reachable),min(x['bounds'][1] for x in reachable),max(x['bounds'][2] for x in reachable),max(x['bounds'][3] for x in reachable)]
gpos=font['GPOS'].table.LookupList.Lookup
marks=set()
for lookup in gpos:
    assert lookup.LookupType==4
    for table in lookup.SubTable: marks.update(table.MarkCoverage.glyphs)
assert not (set(witness)&marks)
kern=[]; applicable=[]
for table in font['kern'].kernTables:
    assert table.coverage==1
    for (a,b),v in table.kernTable.items():
        kern.append(metrics[a][0]+v)
        if a in witness and b in witness:applicable.append({'a':a,'b':b,'kern':v,'advance_plus_kern':metrics[a][0]+v,'witness':witness[a]+witness[b]})
assert min(kern)>=0
assert all(v[0]>=0 for v in metrics.values())
scale=16/font['head'].unitsPerEm
out={'fontSHA':hashlib.sha256(data).hexdigest(),'fontFace':font['name'].getDebugName(6),'unitsPerEm':font['head'].unitsPerEm,'glyphOrderCount':len(order),'nonemptyGlyphCount':len(allrows),'wholeBounds':full,'storedControlBoundsMismatches':recomputed_mismatch,'wholeBoundsCSS':[x*scale for x in full],'allowedCharacters':alphabet,'reachableGlyphCount':len(witness),'reachableOutlineBounds':reachbound,'reachableOutlineBoundsCSS':[x*scale for x in reachbound],'reachableGlyphs':[dict(glyph=g,witness=witness[g],advance=metrics[g][0],bounds=next((r['bounds'] for r in reachable if r['glyph']==g),None)) for g in sorted(witness)],'GSUBReachabilityTrace':trace,'GSUBTypes':[l.LookupType for l in lookups],'GPOSTypes':[l.LookupType for l in gpos],'reachableMarks':list(set(witness)&marks),'allAdvancesNonnegative':True,'allAdvancePlusKernNonnegative':True,'minAdvancePlusKern':min(kern),'applicableKernPairs':applicable,'hinting':{'fpgm':'fpgm' in font,'prep':'prep' in font,'cvt':'cvt ' in font,'reachableGlyphsWithInstructions':[g for g in witness if hasattr(font['glyf'][g],'program') and font['glyf'][g].program.getBytecode()]},'onePixelGuardUniversalTheoremProven':False}
(root/'font-audit.json').write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps({k:out[k] for k in ['glyphOrderCount','nonemptyGlyphCount','wholeBoundsCSS','reachableGlyphCount','reachableOutlineBoundsCSS','GSUBReachabilityTrace','applicableKernPairs','onePixelGuardUniversalTheoremProven']},ensure_ascii=False))

