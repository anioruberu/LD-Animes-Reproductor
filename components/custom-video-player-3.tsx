"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Loader2, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
type VideoSource = { name: string; url: string }

function getDomainName(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return "Servidor"
  }
}

type Player3Props = {
  sources: VideoSource[]
  title?: string
}

function isDirectVideo(url: string) {
  return /\.(mp4|mkv|webm|ogg|mov|m3u8)(\?.*)?$/i.test(url) || url.includes("pixeldrain.com/api/file/")
}

function formatAdTime(time: number) {
  if (!Number.isFinite(time) || time < 0) return "0:00"
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

export function CustomVideoPlayer3({ sources, title = "GokuPlay" }: Player3Props) {
  const validSources = useMemo(() => sources.filter((source) => source.url.trim()), [sources])
  const [activeIndex, setActiveIndex] = useState(0)
  const [hasSelectedSource, setHasSelectedSource] = useState(false)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [isAdLoading, setIsAdLoading] = useState(false)
  const [isAdPlaying, setIsAdPlaying] = useState(false)
  const [adMediaUrl, setAdMediaUrl] = useState<string | null>(null)
  const [adCurrentTime, setAdCurrentTime] = useState(0)
  const [adDuration, setAdDuration] = useState(0)
  const adVideoRef = useRef<HTMLVideoElement>(null)
  const adPlayedRef = useRef(false)

  useEffect(() => {
    setActiveIndex(0)
    setHasSelectedSource(false)
    setIsUnlocked(false)
    setIsAdPlaying(false)
    setAdMediaUrl(null)
    setAdCurrentTime(0)
    setAdDuration(0)
    adPlayedRef.current = false
  }, [sources])

  const activeSource = validSources[activeIndex]

  const startPlayback = async () => {
    if (adPlayedRef.current) {
      setIsUnlocked(true)
      return
    }

    adPlayedRef.current = true
    setIsAdLoading(true)
    try {
      const response = await fetch("/api/vast-ad", { cache: "no-store" })
      const data = await response.json().catch(() => null)
      if (response.ok && data?.mediaUrl) {
        setAdMediaUrl(data.mediaUrl)
        setIsAdPlaying(true)
        return
      }
    } catch {
      // El reproductor continúa aunque la publicidad no esté disponible.
    } finally {
      setIsAdLoading(false)
    }

    setIsUnlocked(true)
  }

  const finishAd = () => {
    setIsAdPlaying(false)
    setIsUnlocked(true)
  }

  if (!activeSource) {
    return <div className="flex min-h-screen items-center justify-center bg-black text-sm text-muted-foreground">No hay enlaces de video disponibles.</div>
  }

  return (
    <main className="flex min-h-screen flex-col bg-[#17100b] text-white">
      {!hasSelectedSource ? (
        <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 p-4 sm:p-6">
          <div className="rounded-xl bg-orange-600 px-4 py-3 text-center text-lg font-bold">GokuPlay Reproductor</div>
          <div className="rounded-2xl border border-orange-400/30 bg-[#3a1d0d] p-3 shadow-xl">
            <h1 className="mb-3 text-center text-sm font-semibold text-orange-100">Selecciona un servidor</h1>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {validSources.map((source, index) => (
                <button
                  key={`${source.url}-${index}`}
                  type="button"
                  onClick={() => { setActiveIndex(index); setHasSelectedSource(true); setIsUnlocked(false); setIsAdPlaying(false); setAdMediaUrl(null); adPlayedRef.current = false }}
                  className="group flex min-h-28 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-orange-500 bg-[#160d08] p-3 text-center transition hover:bg-orange-950/60"
                >
                  <span className="text-xs font-bold text-orange-300">{index + 1}</span>
                  <span className="text-sm font-bold uppercase leading-tight tracking-wide">Servidor {index + 1}</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="flex min-h-screen w-full flex-1 items-center justify-center bg-black">
          <div className="relative aspect-video w-full overflow-hidden bg-black">
            {!isUnlocked && !isAdPlaying ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <Button
                  onClick={startPlayback}
                  disabled={isAdLoading}
                  aria-label={isAdLoading ? "Cargando anuncio" : "Reproducir video"}
                  className="rounded-full bg-orange-600 p-4 text-white shadow-lg transition-all hover:scale-110 hover:bg-orange-700"
                >
                  {isAdLoading ? <Loader2 className="size-8 animate-spin" /> : <Play className="ml-1 size-8" />}
                </Button>
              </div>
            ) : (
              <>
                {isAdPlaying && (
                  <div className="absolute inset-0 z-20 bg-black">
                    <video
                      ref={adVideoRef}
                      src={adMediaUrl ?? undefined}
                      className="h-full w-full object-contain"
                      autoPlay
                      playsInline
                      controls={false}
                      onLoadedMetadata={(event) => setAdDuration(event.currentTarget.duration)}
                      onTimeUpdate={(event) => setAdCurrentTime(event.currentTarget.currentTime)}
                      onEnded={finishAd}
                      onError={finishAd}
                    />
                    <span className="absolute left-3 top-3 rounded bg-black/70 px-2 py-1 text-xs text-white">Publicidad</span>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent px-3 pb-3 pt-10">
                      <div className="flex items-center justify-between text-xs font-medium text-white">
                        <span>{formatAdTime(adCurrentTime)}</span>
                        <span>{formatAdTime(adDuration)}</span>
                      </div>
                    </div>
                  </div>
                )}
                {isDirectVideo(activeSource.url) ? (
                  <video key={activeSource.url} className="h-full w-full" controls autoPlay={isUnlocked && !isAdPlaying} playsInline src={activeSource.url} />
                ) : (
                  <iframe key={activeSource.url} className="h-full w-full" src={activeSource.url} title="Reproductor de video" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
                )}
              </>
            )}
          </div>
        </section>
      )}
    </main>
  )
}

export type { VideoSource }
