from pathlib import Path
from PIL import Image
import json,hashlib
root=Path(__file__).resolve().parent
rows=json.loads((root/'image-manifest.json').read_text(encoding='utf-8'))
for source in sorted((root/'work-image-diagnostic').glob('*.png')):
 target=source.with_suffix('.webp')
 with Image.open(source)as image:
  original=image.convert('RGBA');image.save(target,'WEBP',lossless=True,method=6)
  with Image.open(target)as decoded:equal=original.tobytes()==decoded.convert('RGBA').tobytes()
  assert equal
  rows.append({'source':source.relative_to(root).as_posix(),'source_sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'webp':target.relative_to(root).as_posix(),'webp_sha256':hashlib.sha256(target.read_bytes()).hexdigest(),'width':image.width,'height':image.height,'decoded_pixels_equal':equal,'original_retained':source.exists()})
(root/'image-manifest-before-diagnostic.json').write_text((root/'image-manifest.json').read_text(encoding='utf-8'),encoding='utf-8')
(root/'image-manifest.json').write_text(json.dumps(rows,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'total_images':len(rows),'diagnostic_images':2,'lossless_pixel_equal':all(r['decoded_pixels_equal']for r in rows)}))
