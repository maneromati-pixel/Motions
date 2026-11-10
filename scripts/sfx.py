"""Genera efectos de sonido sutiles para las transiciones (síntesis propia, sin licencias).
Salida: public/sfx/ola.wav, reflejo.wav, trazo_m.wav (44.1 kHz, estéreo, 16 bit)."""
import numpy as np, wave

SR = 44100
rng = np.random.default_rng(7)

def lowpass(x, cutoff):
    """Filtro pasabajos de un polo con corte variable (array o escalar, en Hz)."""
    cutoff = np.broadcast_to(cutoff, x.shape)
    y = np.zeros_like(x); acc = 0.0
    a = 1 - np.exp(-2 * np.pi * cutoff / SR)
    for i in range(len(x)):
        acc += a[i] * (x[i] - acc); y[i] = acc
    return y

def envelope(n, attack, release, peak_at=None):
    t = np.linspace(0, 1, n)
    p = peak_at if peak_at is not None else attack
    up = np.clip(t / p, 0, 1) ** 2
    down = np.clip((1 - t) / (1 - p), 0, 1) ** 1.6
    return np.minimum(up, down)

def save(name, left, right, gain):
    st = np.stack([left, right], 1)
    st = st / (np.max(np.abs(st)) + 1e-9) * gain
    # fundido de 10 ms en los extremos
    f = int(0.01 * SR); ramp = np.linspace(0, 1, f)[:, None]
    st[:f] *= ramp; st[-f:] *= ramp[::-1]
    data = (st * 32767).astype(np.int16)
    with wave.open(f"public/sfx/{name}.wav", "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(data.tobytes())
    print(name, len(left) / SR, "s")

# --- Ola: ruido filtrado que crece y se abre (whoosh de agua), paneo de abajo/izq a der
d = 1.3; n = int(d * SR); t = np.linspace(0, 1, n)
noise = rng.standard_normal(n)
cut = 300 + 2600 * np.sin(np.pi * np.clip(t * 1.1, 0, 1)) ** 2
body = lowpass(noise, cut) * envelope(n, 0.45, 0.55, peak_at=0.48)
# burbujeo leve: modulación lenta de amplitud
body *= 0.85 + 0.15 * np.sin(2 * np.pi * 9 * t * d)
pan = np.clip(t, 0, 1)
save("ola", body * (1 - 0.35 * pan), body * (0.65 + 0.35 * pan), 0.5)

# --- Reflejo: aire brillante + campanita muy suave en el pico
d = 1.2; n = int(d * SR); t = np.linspace(0, 1, n); ts = t * d
air = lowpass(rng.standard_normal(n), 5200) - lowpass(rng.standard_normal(n), 900) * 0.3
air *= envelope(n, 0.5, 0.5, peak_at=0.5) * 0.35
chime = np.zeros(n)
for f0, amp, at in [(1318.5, 0.5, 0.42), (1975.5, 0.35, 0.48), (2637.0, 0.2, 0.52)]:
    tt = np.clip(ts - at * d, 0, None)
    chime += amp * np.sin(2 * np.pi * f0 * tt) * np.exp(-tt * 5.5) * (ts >= at * d)
mix = air + chime * 0.55
pan = np.clip(t, 0, 1)
save("reflejo", mix * (1 - 0.4 * pan), mix * (0.6 + 0.4 * pan), 0.38)

# --- Trazo M: swoosh suave + nota cálida (acorde de quinta) al completarse el trazo
d = 1.4; n = int(d * SR); t = np.linspace(0, 1, n); ts = t * d
sw = lowpass(rng.standard_normal(n), 600 + 3000 * t ** 1.5) * envelope(n, 0.4, 0.6, peak_at=0.42) * 0.6
tone = np.zeros(n)
for f0, amp in [(523.25, 0.5), (783.99, 0.3), (1046.5, 0.15)]:
    tt = np.clip(ts - 0.55, 0, None)
    tone += amp * np.sin(2 * np.pi * f0 * tt) * (1 - np.exp(-tt * 40)) * np.exp(-tt * 2.6) * (ts >= 0.55)
mix = sw + tone * 0.5
pan = 1 - np.clip(t, 0, 1)  # el trazo cruza de derecha a izquierda
save("trazo_m", mix * (0.6 + 0.4 * (1 - pan)), mix * (0.6 + 0.4 * pan), 0.4)
