"""Recorta el logo GB del fondo cuadriculado (brand/logo-original.png -> public/logo-gb.png con transparencia).

El contorno magenta (#E30364, canal G muy bajo) encierra todo el logo, así que se rellena
desde los bordes de la imagen todo lo que es "claro" (G >= 150) y eso es el fondo.
Uso: python3 -I scripts/extract-logo.py
"""
import numpy as np
from PIL import Image
from pathlib import Path

root = Path(__file__).resolve().parent.parent
im = np.asarray(Image.open(root / 'brand' / 'logo-original.png').convert('RGB')).astype(np.float32)
G = im[..., 1]
cand = G >= 150

seed = np.zeros_like(cand)
seed[0, :] = seed[-1, :] = seed[:, 0] = seed[:, -1] = True
seed &= cand
while True:
    d = seed.copy()
    d[1:] |= seed[:-1]; d[:-1] |= seed[1:]; d[:, 1:] |= seed[:, :-1]; d[:, :-1] |= seed[:, 1:]
    d &= cand
    if d.sum() == seed.sum():
        break
    seed = d
bg = seed

# borde antialias: los píxeles de fondo que tocan el logo reciben alfa parcial según su "oscuridad"
near = np.zeros_like(bg)
logo = ~bg
for _ in range(3):
    n = logo.copy()
    n[1:] |= logo[:-1]; n[:-1] |= logo[1:]; n[:, 1:] |= logo[:, :-1]; n[:, :-1] |= logo[:, 1:]
    logo = n
near = logo & bg
alpha = np.where(bg, 0.0, 1.0)
partial = np.clip((235.0 - G) / (235.0 - 3.0), 0, 1)
alpha = np.where(near, partial, alpha)

rgb = im.copy()
outline = np.array([0xE3, 0x03, 0x64], dtype=np.float32)
rgb[near] = outline
out = np.dstack([rgb, alpha * 255]).astype(np.uint8)
img = Image.fromarray(out, 'RGBA')
img = img.crop(img.getbbox())
img.save(root / 'public' / 'logo-gb.png')
print('logo-gb.png', img.size)
