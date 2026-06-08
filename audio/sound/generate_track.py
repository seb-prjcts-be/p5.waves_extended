#!/usr/bin/env python3
"""Genereer een origineel, rechtenvrij loopje voor het p5.waves onderzoekscentrum.

Pure stdlib (geen numpy/ffmpeg). Output: sound/demo-loop.wav — 16s, naadloos
loopbaar. Bevat kick (bass), basline (low-mid) en een arpeggio (mid/treble) zodat
de FFT-banden in de demo's duidelijk uiteenlopen.

Run:  python sound/generate_track.py
"""
import wave, struct, math

SR   = 44100
BPM  = 120
BEAT = 60.0 / BPM          # 0.5 s
BARS = 8
BEATS_PER_BAR = 4
TOTAL_BEATS = BARS * BEATS_PER_BAR
DUR = TOTAL_BEATS * BEAT   # 16 s
N = int(DUR * SR)

buf = [0.0] * N

def add(t_start, samples):
    i0 = int(t_start * SR)
    for k, s in enumerate(samples):
        i = i0 + k
        if 0 <= i < N:
            buf[i] += s

def env(length, attack=0.005, release=0.05):
    """Eenvoudige attack/release-envelope, lengte in seconden."""
    n = int(length * SR)
    a = max(1, int(attack * SR))
    r = max(1, int(release * SR))
    out = []
    for i in range(n):
        if i < a:            e = i / a
        elif i > n - r:      e = (n - i) / r
        else:                e = 1.0
        out.append(e)
    return out

def kick(t):
    """Punchy kick: pitch sweep 120->45 Hz, snelle decay."""
    length = 0.32
    n = int(length * SR)
    e = env(length, 0.001, 0.12)
    out = []
    phase = 0.0
    for i in range(n):
        f = 45 + (120 - 45) * math.exp(-i / (SR * 0.03))
        phase += 2 * math.pi * f / SR
        out.append(math.sin(phase) * e[i] * 0.9)
    add(t, out)

def tone(t, freq, length, amp, kind='sine'):
    n = int(length * SR)
    e = env(length, 0.008, 0.08)
    out = []
    for i in range(n):
        ph = 2 * math.pi * freq * i / SR
        if kind == 'sine':
            s = math.sin(ph)
        elif kind == 'tri':                      # driehoek = oneven harmonischen
            s = (2/math.pi) * math.asin(math.sin(ph))
        elif kind == 'saw':
            s = 2 * (freq*i/SR % 1.0) - 1
        else:
            s = math.sin(ph)
        out.append(s * e[i] * amp)
    add(t, out)

# Noten (Hz) — A mineur pentatonisch
A1, C2, D2, E2, G2 = 55.00, 65.41, 73.42, 82.41, 98.00
A3, C4, D4, E4, G4, A4 = 220.0, 261.6, 293.7, 329.6, 392.0, 440.0

# Bas-rootnoten per bar
bass_roots = [A1, A1, G2, E2, C2, C2, D2, E2]

for bar in range(BARS):
    bar_t = bar * BEATS_PER_BAR * BEAT
    root = bass_roots[bar]

    # kick op elke beat (four-on-the-floor)
    for b in range(BEATS_PER_BAR):
        kick(bar_t + b * BEAT)

    # basline: achtste noten op de root, octaaf-spel
    for e8 in range(BEATS_PER_BAR * 2):
        t = bar_t + e8 * (BEAT / 2)
        f = root * (2 if e8 % 4 == 3 else 1)
        tone(t, f, BEAT * 0.45, 0.32, 'saw')

    # arpeggio: pentatonische zestienden, mid/treble
    arp = [A3, C4, E4, G4, A4, G4, E4, D4]
    for s16 in range(BEATS_PER_BAR * 4):
        t = bar_t + s16 * (BEAT / 4)
        f = arp[s16 % len(arp)]
        if bar % 2 == 1:                 # variatie in de tweede helft van elke 2 bars
            f *= 1.5
        tone(t, f, BEAT * 0.22, 0.14, 'tri')

# Normaliseer + zachte soft-clip tegen clipping
peak = max(1e-9, max(abs(x) for x in buf))
g = 0.85 / peak
def softclip(x):
    return math.tanh(x * g * 1.1)

with wave.open('sound/demo-loop.wav', 'w') as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    frames = bytearray()
    for x in buf:
        v = int(max(-1.0, min(1.0, softclip(x))) * 32767)
        frames += struct.pack('<h', v)
    w.writeframes(bytes(frames))

print(f'demo-loop.wav geschreven: {DUR:.0f}s, {N} samples, {SR}Hz mono')
