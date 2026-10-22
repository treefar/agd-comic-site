"""Record image-derived candidate writable rectangles; reads original Codex images, never draws art."""
import pathlib,hashlib,json
from PIL import Image
root=pathlib.Path(__file__).resolve().parents[2]
regions={'normal.png':[31,34,248,101],'hover.png':[31,34,250,101],'pressed.png':[31,34,249,103],'disabled.png':[31,34,248,103],'panel.png':[29,29,251,184],'header.png':[34,33,246,95],'hud.png':[30,33,251,109],'bubble.png':[47,38,222,141]}
assets={}
for name,(left,top,right,bottom) in regions.items():
 p=root/'holiday-lab/assets/ui'/name;im=Image.open(p)
 assets[name]={'source':'holiday-lab/assets/ui/'+name,'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'image_width':im.width,'image_height':im.height,'paper_rect':{'x':left,'y':top,'width':right-left,'height':bottom-top},'method':'fixed interior rectangle chosen after viewing actual source PNG; stays inside paper, excludes ink frame and rounded corners; not fitted to current text','status':'agent-measured candidate, user visual acceptance pending'}
stage_papers={}
for name,coords in {'prop1.png':[18,18,267,82],'prop2.png':[20,20,263,80]}.items():
 p=root/'holiday-lab/assets/constitution'/name;im=Image.open(p);left,top,right,bottom=coords
 stage_papers['constitution/'+name]={'source':'holiday-lab/assets/constitution/'+name,'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'image_width':im.width,'image_height':im.height,'paper_rect':{'x':left,'y':top,'width':right-left,'height':bottom-top},'own_text_selectors':['#caption-stage-words','.replay-text'],'method':'actual prop PNG viewed in full; fixed inset excludes black frame/light rim; object-fit contain and actual rendered letterboxing must be mapped','status':'agent-measured candidate, user visual acceptance pending'}
out={'schema_version':1,'coordinate_space':'source image pixels','nine_slice':{'panel.png':{'slice':48,'css_border_width':18}},'assets':assets,'stage_papers':stage_papers,'unmapped_asset_policy':'fail closed; no viewport or full-sprite fallback','note':'Transforms/skins must be mapped from real rendered geometry; these candidates do not constitute user art approval.'}
(root/'holiday-lab/layout-qa/asset-safe-regions.json').write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding='utf-8')
print('IMAGE_INSETS',len(assets),'UI PNGs;',len(stage_papers),'constitution prop PNGs; no product image modified')
