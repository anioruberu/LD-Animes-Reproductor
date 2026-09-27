'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Pause, Play, Repeat2, Volume2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { DRAGON_BALL_PLAYLISTS, getTrackTitle, type MusicTrack } from '@/lib/dragon-ball-music'

type Props = { initialPlaylist: 'dragon-ball' | 'dragon-ball-z'; accent: 'blue' | 'orange'; autoStart?: boolean; showControls?: boolean }

export function DragonBallMusicPlayer({ initialPlaylist, accent, autoStart = true, showControls = true }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playlistId, setPlaylistId] = useState(initialPlaylist)
  const [trackIndex, setTrackIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [repeat, setRepeat] = useState(false)
  const [notice, setNotice] = useState('')
  const playlist = useMemo(() => DRAGON_BALL_PLAYLISTS.find((item) => item.id === playlistId) ?? DRAGON_BALL_PLAYLISTS[0], [playlistId])
  const track = playlist.tracks[trackIndex] as MusicTrack
  const color = accent === 'orange' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'

  useEffect(() => { setTrackIndex(0); setPlaying(autoStart) }, [playlistId, autoStart])
  useEffect(() => {
    if (!playing) return
    void audioRef.current?.play().catch(() => setPlaying(false))
  }, [track.url, playing])
  useEffect(() => {
    if (!autoStart) return
    const audio = audioRef.current
    if (!audio) return
    audio.volume = 0.45

    const tryStart = () => {
      void audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
    }

    tryStart()
    window.addEventListener('pointerdown', tryStart, { once: true, passive: true })
    window.addEventListener('keydown', tryStart, { once: true })
    return () => {
      window.removeEventListener('pointerdown', tryStart)
      window.removeEventListener('keydown', tryStart)
    }
  }, [autoStart, track.url])
  useEffect(() => { if (!notice) return; const timer = window.setTimeout(() => setNotice(''), 3200); return () => window.clearTimeout(timer) }, [notice])
  const changeTrack = (next: number) => { setTrackIndex((current) => (current + next + playlist.tracks.length) % playlist.tracks.length); setPlaying(true); setNotice('Cambiando música') }
  const toggle = () => { const audio = audioRef.current; if (!audio) return; if (playing) { audio.pause(); setPlaying(false) } else { void audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false)) } }

  if (!showControls) {
    return <audio ref={audioRef} src={track.url} autoPlay={autoStart} loop={repeat} onEnded={() => { if (!repeat) changeTrack(1) }} preload="auto" aria-label="Música de fondo" />
  }

  return <div className="rounded-xl border border-border/70 bg-muted/40 p-3 shadow-sm">
    <div className="mb-3 flex items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Música de fondo</p><p className="mt-1 font-medium">{getTrackTitle(track)}</p></div><Volume2 className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" /></div>
    <Select value={playlistId} onValueChange={(value) => setPlaylistId(value as typeof playlistId)}><SelectTrigger aria-label="Seleccionar playlist"><SelectValue /></SelectTrigger><SelectContent>{DRAGON_BALL_PLAYLISTS.map((item) => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}</SelectContent></Select>
    <div className="mt-3 flex items-center justify-between gap-2"><div className="flex items-center gap-1"><Button size="icon" variant="ghost" onClick={() => changeTrack(-1)} aria-label="Canción anterior"><ChevronLeft /></Button><Button size="icon" className={color} onClick={toggle} aria-label={playing ? 'Pausar música' : 'Reproducir música'}>{playing ? <Pause /> : <Play />}</Button><Button size="icon" variant="ghost" onClick={() => changeTrack(1)} aria-label="Siguiente canción"><ChevronRight /></Button></div><label className="flex items-center gap-2 text-xs text-muted-foreground">Repetir <Switch checked={repeat} onCheckedChange={setRepeat} aria-label="Repetir canción" /></label></div>
    <audio ref={audioRef} src={track.url} loop={repeat} onEnded={() => { if (!repeat) changeTrack(1) }} preload="none" />
    {notice && <p className="mt-2 animate-in fade-in text-center text-xs text-muted-foreground">{notice}</p>}
  </div>
}
