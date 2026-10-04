#!/bin/sh
# Mixe la voix off (accélérée de 7 %), la musique (baissée sous la voix) et les bruitages.
# Entrée : public/audio/voice-raw.mp3 (voix Higgsfield), music.wav et sfx.wav (npm run audio).
# Sortie : public/audio/mix.wav, lue par la vidéo.
set -e
cd "$(dirname "$0")/.."
OFFSET=$(node -e 'console.log(require("./src/timing.json").voiceOffset)')
ffmpeg -loglevel error -y -i public/audio/voice-raw.mp3 -af "atempo=1.07" -ar 48000 -ac 2 public/audio/voice.wav
ffmpeg -loglevel error -y -i public/audio/music.wav -i public/audio/sfx.wav -i public/audio/voice.wav -filter_complex "
[2:a]atrim=start=$OFFSET,asetpts=PTS-STARTPTS,highpass=f=70,acompressor=threshold=0.12:ratio=3:attack=5:release=120:makeup=1.4,apad=whole_dur=60,asplit=2[v][key];
[0:a]volume=0.5[m];
[m][key]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=400[md];
[1:a]volume=0.55[s];
[md][s][v]amix=inputs=3:normalize=0:duration=first,loudnorm=I=-14:TP=-1.5:LRA=11[out]" -map "[out]" -ar 48000 public/audio/mix.wav
echo "Mix écrit : public/audio/mix.wav"
