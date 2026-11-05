"""
Transcripción con tiempos por palabra (faster-whisper) → public/voz.words.json
  python scripts/transcribe.py <carpeta_modelo_ctranslate2> public/voz.mp3 public/voz.words.json
Luego `npm run analyze-voice` alinea el guion con esas palabras.
"""
import json
import subprocess
import sys

import numpy as np
from faster_whisper import WhisperModel

model_dir, audio_path, out_path = sys.argv[1:4]
m = WhisperModel(model_dir, device='cpu', compute_type='int8')
pcm = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', audio_path, '-f', 's16le', '-ac', '1', '-ar', '16000', '-'], capture_output=True).stdout
audio = np.frombuffer(pcm, np.int16).astype(np.float32) / 32768
segs, _ = m.transcribe(audio, language='es', word_timestamps=True, beam_size=5)
words = [[w.word.strip(), round(w.start, 3), round(w.end, 3)] for s in segs for w in s.words]
json.dump(words, open(out_path, 'w'), ensure_ascii=False)
print(' '.join(w for w, _, _ in words))
