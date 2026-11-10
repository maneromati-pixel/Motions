"""Recorta la cápsula y el disco de gel de assets/producto.png -> public/img/*.png"""
import numpy as np
from PIL import Image, ImageFilter
src=Image.open('assets/producto.png').convert('RGBA')
p=np.array(src).astype(int)
r,g,b,a=[p[:,:,i] for i in range(4)]
bright=(r+g+b)/3
sat=p[:,:,:3].max(2)-p[:,:,:3].min(2)

def rowspan_fill(m):
    out=np.zeros_like(m)
    for y in range(m.shape[0]):
        xs=np.where(m[y])[0]
        if len(xs)>3: out[y,xs.min():xs.max()+1]=True
    for x in range(m.shape[1]):  # y-pass too (convex)
        ys=np.where(out[:,x])[0]
        if len(ys)>3: out[ys.min():ys.max()+1,x]=True
    return out

def cut(box, objmask, name, erode=2):
    x0,y0,x1,y1=box
    m=objmask[y0:y1,x0:x1]
    # limpia ruido: abrir
    mi=Image.fromarray((m*255).astype('uint8'))
    mi=mi.filter(ImageFilter.MinFilter(5)).filter(ImageFilter.MaxFilter(5))
    m=np.array(mi)>127
    m=rowspan_fill(m)
    mi=Image.fromarray((m*255).astype('uint8')).filter(ImageFilter.MinFilter(2*erode+1))
    mi=mi.filter(ImageFilter.GaussianBlur(1.6))  # borde suave
    crop=src.crop(box)
    alpha=np.minimum(np.array(mi), np.array(crop)[:,:,3])
    obj=np.array(crop); obj[:,:,3]=alpha
    obj=Image.fromarray(obj)
    # sombra propia, suave, desplazada abajo-derecha
    pad=90
    W,H=obj.size
    canvas=Image.new('RGBA',(W+2*pad,H+2*pad),(0,0,0,0))
    sh=Image.new('L',canvas.size,0); sh.paste(Image.fromarray((alpha*0.55).astype('uint8')),(pad+14,pad+30))
    sh=sh.filter(ImageFilter.GaussianBlur(26))
    shadow=Image.new('RGBA',canvas.size,(40,6,10,0)); shadow.putalpha(sh)
    canvas.alpha_composite(shadow); canvas.alpha_composite(obj,(pad,pad))
    canvas.save(f'public/img/{name}.png'); obj.save(f'public/img/{name}_noshadow.png')
    print(name, canvas.size)

gelmask=(b-r>60)&(a>200)
cut((850,85,1235,495), gelmask, 'gel', erode=4)
# la tapa de aluminio es prácticamente circular: máscara circular ajustada
# a los bordes medidos (der 1187, inf 958, sup ~540) -> centro (978,749), r=207
yy,xx=np.mgrid[0:p.shape[0],0:p.shape[1]]
foil=((xx-978)**2+(yy-749)**2<=207**2)&(a>200)
cut((750,528,1205,975), foil, 'capsula', erode=1)
