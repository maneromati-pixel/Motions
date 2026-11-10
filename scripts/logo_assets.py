"""Logo: variante para fondo oscuro + vectorización (potrace) del trazo azul de la M."""
import numpy as np
from PIL import Image, ImageFilter
import potrace  # potracer (port Python de potrace)

logo=Image.open('assets/logo.png').convert('RGBA')
l=np.array(logo).astype(int)
r,g,b,a=[l[:,:,i] for i in range(4)]
Image.fromarray(l.astype('uint8')).save('public/img/logo_color.png')

# --- variante oscura: negro -> blanco, se mantienen azul y rojo
sat=l[:,:,:3].max(2)-l[:,:,:3].min(2)
lum=l[:,:,:3].mean(2)
dark=(sat<60)  # neutros (negro del texto/contornos/banda, blanco del texto de la banda)
inv=l.copy()
inv[dark,0]=255-l[dark,0]; inv[dark,1]=255-l[dark,1]; inv[dark,2]=255-l[dark,2]
# crema en vez de blanco puro
inv[dark,0]=np.minimum(inv[dark,0],250); inv[dark,1]=np.minimum(inv[dark,1],244); inv[dark,2]=np.minimum(inv[dark,2],235)
Image.fromarray(inv.astype('uint8')).save('public/img/logo_dark.png')

# --- trazo azul de la M
blue=(b-r>90)&(a>150)
red=(r-b>90)&(a>150)
m=blue|red   # los puntos rojos tapan parte del trazo: se incluyen para cerrar la forma
mi=Image.fromarray((m*255).astype('uint8')).filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.MinFilter(3))
mask=np.array(mi)>127
# quitar los discos rojos que sobresalen: solo nos quedamos con azul + rojo que toca azul
ys,xs=np.where(mask); x0,x1,y0,y1=xs.min(),xs.max(),ys.min(),ys.max()
mask=mask[y0:y1+1,x0:x1+1]
print('M bbox',x0,y0,x1,y1)
# centros de los puntos rojos (coords del recorte)
ry,rx=np.where(red[y0:y1+1,x0:x1+1]); left=rx<(x1-x0)/2
for sel in (left,~left): print('dot', rx[sel].mean().round(1), ry[sel].mean().round(1), ((rx[sel].max()-rx[sel].min())/2).round(1))
# rellenar las muescas que deja la letra "i" negra delante del trazo
for (bx0,bx1,by0,by1) in [(625,700,195,285),(20,70,205,250)]:
    for y in range(by0,by1):
        xs=np.where(mask[y,bx0:bx1])[0]
        if len(xs)>=2 and xs.max()-xs.min()>4: mask[y,bx0+xs.min():bx0+xs.max()+1]=True
bm=potrace.Bitmap(~mask)  # potracer traza los píxeles False
plist=bm.trace(turdsize=50, alphamax=1.0, opticurve=True, opttolerance=0.4)
parts=[]
for curve in plist:
    s=curve.start_point; d=[f"M{s.x:.1f},{s.y:.1f}"]
    for seg in curve.segments:
        if seg.is_corner:
            d.append(f"L{seg.c.x:.1f},{seg.c.y:.1f}L{seg.end_point.x:.1f},{seg.end_point.y:.1f}")
        else:
            d.append(f"C{seg.c1.x:.1f},{seg.c1.y:.1f} {seg.c2.x:.1f},{seg.c2.y:.1f} {seg.end_point.x:.1f},{seg.end_point.y:.1f}")
    d.append('Z'); parts.append(''.join(d))
print('curves',len(parts),[len(p) for p in parts])
W,H=mask.shape[1],mask.shape[0]
svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}"><path fill="#0088DD" fill-rule="evenodd" d="{" ".join(parts)}"/></svg>'
open('public/img/m_trazo.svg','w').write(svg)
open('src/mPath.ts','w').write(f"// Generado por scripts/logo_assets.py (potrace sobre el azul de assets/logo.png)\nexport const M_VIEWBOX = {{w: {W}, h: {H}}};\nexport const M_PATHS: string[] = {parts!r};\n".replace("['","[\n  '").replace("', '","',\n  '"))
