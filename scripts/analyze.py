import numpy as np
from PIL import Image
p=np.array(Image.open('assets/producto.png').convert('RGBA')).astype(int)
r,g,b,a=[p[:,:,i] for i in range(4)]
# gel: saturated cyan-blue, top-right
blue=(b-r>60)&(a>200)
ys,xs=np.where(blue[:520,780:]); print('gel bbox',xs.min()+780,xs.max()+780,ys.min(),ys.max())
gel=p[:520,780:][blue[:520,780:]]; print('gel median',np.median(gel[:,:3],0))
# capsule foil: bottom right region, non-white (bright<228 or blue)
reg=(slice(520,1024),slice(740,1250))
bright=(r+g+b)/3
nonwhite=((bright<232)|(b-r>40))&(a>200)
ys,xs=np.where(nonwhite[reg]); 
# column/row histograms
col=nonwhite[reg].sum(0); row=nonwhite[reg].sum(1)
xs_=np.where(col>40)[0]; ys_=np.where(row>40)[0]
print('cap bbox',xs_.min()+740,xs_.max()+740,ys_.min()+520,ys_.max()+520)
capb=p[600:900,950:1150]; m=(capb[:,:,2]-capb[:,:,0]>80); print('cap blue median',np.median(capb[m][:,:3],0))
f=np.array(Image.open('assets/fondo.jpg').convert('RGB')).astype(int)
fl=f.reshape(-1,3); L=fl.sum(1)
for q in [5,25,50,75,95,99.5]:
    t=np.percentile(L,q); sel=fl[np.abs(L-t)<6]; print('fondo p',q,np.median(sel,0))
l=np.array(Image.open('assets/logo.png').convert('RGBA')).astype(int)
lr,lg,lb,la=[l[:,:,i] for i in range(4)]
m=(lb-lr>100)&(la>200); print('logo blue',np.median(l[m][:,:3],0))
m=(lr-lb>100)&(la>200); print('logo red',np.median(l[m][:,:3],0))
