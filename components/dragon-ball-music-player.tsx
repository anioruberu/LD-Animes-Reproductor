'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Pause, Play, Repeat2, Volume2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { DRAGON_BALL_PLAYLISTS, getTrackTitle, type MusicTrack } from '@/lib/dragon-ball-music'

type Props = { initialPlaylist: 'dragon-ball' | 'dragon-ball-z'; accent: 'blue' | 'orange'; autoStart?: boolean; showControls?: boolean }

type MusicEvent = { playing: boolean; trackUrl: string }
const MUSIC_EVENT = 'dragon-ball-music-state'
let sharedAudio: HTMLAudioElement | null = null

function getSharedAudio() {
  if (typeof window === 'undefined') return null
  if (!sharedAudio) {
    sharedAudio = document.createElement('audio')
    sharedAudio.preload = 'auto'
    sharedAudio.volume = 0.45
    sharedAudio.setAttribute('aria-label', 'Música de fondo')
    document.body.appendChild(sharedAudio)
  }
  return sharedAudio
}

function broadcast(audio: HTMLAudioElement) {
  window.dispatchEvent(new CustomEvent<MusicEvent>(MUSIC_EVENT, { detail: { playing: !audio.paused, trackUrl: audio.src } }))
}

export function DragonBallMusicPlayer({ initialPlaylist, accent, autoStart = true, showControls = true }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playlistId, setPlaylistId] = useState(initialPlaylist)
  const [trackIndex, setTrackIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [repeat, setRepeat] = useState(false)
  const [notice, setNotice] = useState('')
  const playlist = useMemo(() => DRAGON_BALL_PLAYLISTS.find((item) => item.id === playlistId) ?? DRAGON_BALL_PLAYLISTS[0], [playlistId])
  const track = playlist.tracks[trackIndex] as MusicTrack
  const color = accent === 'orange' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'

  useEffect(() => {
    const audio = getSharedAudio()
    audioRef.current = audio
    if (!audio) return
    const sync = (event: Event) => {
      const detail = (event as CustomEvent<MusicEvent>).detail
      if (detail.trackUrl === audio.src || detail.trackUrl === track.url) setPlaying(detail.playing)
    }
    const onPlay = () => { setPlaying(true); broadcast(audio) }
    const onPause = () => { setPlaying(false); broadcast(audio) }
    window.addEventListener(MUSIC_EVENT, sync)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    setPlaying(!audio.paused && audio.src === track.url)
    return () => {
      window.removeEventListener(MUSIC_EVENT, sync)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
    }
  }, [track.url])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.src !== track.url) {
      audio.src = track.url
      audio.load()
    }
    audio.loop = repeat
    if (!autoStart) return
    const tryStart = () => void audio.play().then(() => broadcast(audio)).catch(() => setPlaying(false))
    tryStart()
    window.addEventListener('pointerdown', tryStart, { once: true, passive: true })
    window.addEventListener('keydown', tryStart, { once: true })
    return () => {
      window.removeEventListener('pointerdown', tryStart)
      window.removeEventListener('keydown', tryStart)
    }
  }, [autoStart, repeat, track.url])
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const handleEnded = () => { if (!repeat) changeTrack(1) }
    audio.addEventListener('ended', handleEnded)
    return () => audio.removeEventListener('ended', handleEnded)
  }, [repeat, playlist.tracks.length])
  useEffect(() => { if (!notice) return; const timer = window.setTimeout(() => setNotice(''), 3200); return () => window.clearTimeout(timer) }, [notice])
  const changeTrack = (next: number) => { setTrackIndex((current) => (current + next + playlist.tracks.length) % playlist.tracks.length); setPlaying(true); setNotice('Cambiando música') }
  const toggle = () => { const audio = audioRef.current; if (!audio) return; if (playing) { audio.pause(); setPlaying(false) } else { void audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false)) } }

  if (!showControls) return null

  return <div className="rounded-xl border border-border/70 bg-muted/40 p-3 shadow-sm">
    <div className="mb-3 flex items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Música de fondo</p><p className="mt-1 font-medium">{getTrackTitle(track)}</p></div><Volume2 className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" /></div>
    <Select value={playlistId} onValueChange={(value) => setPlaylistId(value as typeof playlistId)}><SelectTrigger aria-label="Seleccionar playlist"><SelectValue /></SelectTrigger><SelectContent>{DRAGON_BALL_PLAYLISTS.map((item) => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}</SelectContent></Select>
    <div className="mt-3 flex items-center justify-between gap-2"><div className="flex items-center gap-1"><Button size="icon" variant="ghost" onClick={() => changeTrack(-1)} aria-label="Canción anterior"><ChevronLeft /></Button><Button size="icon" className={color} onClick={toggle} aria-label={playing ? 'Pausar música' : 'Reproducir música'}>{playing ? <Pause /> : <Play />}</Button><Button size="icon" variant="ghost" onClick={() => changeTrack(1)} aria-label="Siguiente canción"><ChevronRight /></Button></div><label className="flex items-center gap-2 text-xs text-muted-foreground">Repetir <Switch checked={repeat} onCheckedChange={setRepeat} aria-label="Repetir canción" /></label></div>
    <audio ref={audioRef} src={track.url} loop={repeat} onEnded={() => { if (!repeat) changeTrack(1) }} preload="none" />
    {notice && <p className="mt-2 animate-in fade-in text-center text-xs text-muted-foreground">{notice}</p>}
  </div>
}
