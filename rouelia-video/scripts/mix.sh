#!/bin/sh
# Mixe la voix off, la musique (baissée sous la voix) et les bruitages.
# La voix est remontée : accroche à vitesse naturelle avec deux pauses, puis le reste accéléré de 7 %.
# La fin vient d'une seconde prise (voice-end.mp3), à vitesse naturelle.
# Entrée : public/audio/voice-raw.mp3 et voice-end.mp3 (voix Higgsfield), music.wav et sfx.wav (npm run audio).
# Sortie : public/audio/mix.wav, lue par la vidéo.
set -e
cd "$(dirname "$0")/.."
ffmpeg -loglevel error -y -i public/audio/voice-raw.mp3 -i public/audio/voice-end.mp3 -filter_complex "
anullsrc=r=48000:cl=stereo,atrim=0:0.25[s0];
[0:a]aresample=48000,aformat=channel_layouts=stereo,asplit=3[a][b][c];
[a]atrim=2.10:3.60,asetpts=PTS-STARTPTS[p1];
anullsrc=r=48000:cl=stereo,atrim=0:0.65[s1];
[b]atrim=4.05:5.66,asetpts=PTS-STARTPTS[p2];
anullsrc=r=48000:cl=stereo,atrim=0:0.4567[s2];
[c]atrim=5.80:36.17,asetpts=PTS-STARTPTS,atempo=1.07[p3];
anullsrc=r=48000:cl=stereo,atrim=0:0.4[s3];
[1:a]aresample=48000,aformat=channel_layouts=stereo[p4];
[s0][p1][s1][p2][s2][p3][s3][p4]concat=n=8:v=0:a=1[v]" -map "[v]" -ar 48000 public/audio/voice.wav
ffmpeg -loglevel error -y -i public/audio/music.wav -i public/audio/sfx.wav -i public/audio/voice.wav -filter_complex "
[2:a]highpass=f=70,acompressor=threshold=0.12:ratio=3:attack=5:release=120:makeup=1.4,apad=whole_dur=60,asplit=2[v][key];
[0:a]volume=0.42[m];
[m][key]sidechaincompress=threshold=0.03:ratio=8:attack=15:release=350[md];
[1:a]volume=1.0[s];
[md][s][v]amix=inputs=3:normalize=0:duration=first,loudnorm=I=-14:TP=-1.5:LRA=11[out]" -map "[out]" -ar 48000 public/audio/mix.wav
echo "Mix écrit : public/audio/mix.wav"
