"""Lossless screenshot format conversion only; preserve every original PNG."""
from pathlib import Path
from PIL import Image
import hashlib,json
root=Path(__file__).resolve().parent
rows=[]
for folder in ['main-r2','new-targets-r2']:
 for source in sorted((root/folder).glob('*.png')):
  target=source.with_suffix('.webp')
  with Image.open(source)as image:
   original=image.convert('RGBA');image.save(target,'WEBP',lossless=True,method=6)
   with Image.open(target)as decoded:equal=original.tobytes()==decoded.convert('RGBA').tobytes()
   if not equal:raise RuntimeError('lossless pixels differ: '+str(source))
   rows.append({'source':source.relative_to(root).as_posix(),'source_sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'webp':target.relative_to(root).as_posix(),'webp_sha256':hashlib.sha256(target.read_bytes()).hexdigest(),'width':image.width,'height':image.height,'decoded_pixels_equal':equal,'original_retained':source.exists()})
(root/'image-manifest.json').write_text(json.dumps(rows,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'images':len(rows),'lossless_pixel_equal':all(r['decoded_pixels_equal']for r in rows),'original_png_retained':all(r['original_retained']for r in rows)}))
