"""Technical format conversion only; source PNGs remain untouched."""
import pathlib,json,hashlib
from PIL import Image
root=pathlib.Path(__file__).parent
main=root/json.loads((root/'latest.json').read_text(encoding='utf-8'))['run']
nav=root/json.loads((root/'nav-latest.json').read_text(encoding='utf-8'))['run']
out=root/'evidence';out.mkdir(exist_ok=True)
sources=[main/'zh-home.png',main/'ja-home.png',main/'zh-guide.png',main/'ja-guide.png',nav/'zh-390-nav-open.png',nav/'ja-390-nav-open.png']
records=[]
for source in sources:
 im=Image.open(source).convert('RGB');original=im.size
 # Long guide snapshots exceed WebP's maximum dimension. Keep a labelled opening excerpt.
 crop=(0,0,im.width,min(im.height,2400)) if 'guide' in source.name else (0,0,im.width,im.height)
 image=im.crop(crop);target=out/(source.stem+'.webp');image.save(target,'WEBP',quality=86,method=6)
 records.append({'source_local_path':str(source.resolve()),'source_sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'original_dimensions':original,'crop_box':crop,'output':target.name,'output_sha256':hashlib.sha256(target.read_bytes()).hexdigest(),'output_bytes':target.stat().st_size,'operation':'RGB format conversion to WebP q86; guide opening crop to first 2400px; no drawing/text changes'})
(out/'manifest.json').write_text(json.dumps(records,ensure_ascii=False,indent=2),encoding='utf-8')
print('WEBP',len(records),'BYTES',sum(r['output_bytes'] for r in records))
