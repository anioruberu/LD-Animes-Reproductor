"use client"

import { useEffect, useMemo, useState } from "react"
import { Loader2, Play, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

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

export function CustomVideoPlayer3({ sources, title = "GokuPlay" }: Player3Props) {
  const validSources = useMemo(() => sources.filter((source) => source.url.trim()), [sources])
  const [activeIndex, setActiveIndex] = useState(0)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [isAdLoading, setIsAdLoading] = useState(false)
  const [adNotice, setAdNotice] = useState<string | null>(null)

  useEffect(() => {
    setActiveIndex(0)
    setIsUnlocked(false)
    setAdNotice(null)
  }, [sources])

  const activeSource = validSources[activeIndex]

  const startPlayback = async () => {
    setIsAdLoading(true)
    setAdNotice(null)
    try {
      const response = await fetch("/api/vast-ad", { cache: "no-store" })
      const data = await response.json().catch(() => null)
      if (response.ok && data?.mediaUrl) {
        setAdNotice("Publicidad cargada. El video comenzará enseguida.")
      }
    } catch {
      setAdNotice("No se pudo cargar la publicidad; iniciando el video.")
    } finally {
      setIsUnlocked(true)
      setIsAdLoading(false)
    }
  }

  if (!activeSource) {
    return <div className="flex min-h-screen items-center justify-center bg-black text-sm text-muted-foreground">No hay enlaces de video disponibles.</div>
  }

  return (
    <main className="flex min-h-screen flex-col bg-black text-white">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-orange-400">Reproductor 3</p>
          <h1 className="text-base font-semibold sm:text-lg">{title}</h1>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-400"><Volume2 className="size-4" /> Selecciona una opción</div>
      </header>

      <section className="flex flex-1 flex-col items-center justify-center gap-5 p-3 sm:p-6">
        <div className="w-full max-w-5xl overflow-hidden rounded-xl border border-white/10 bg-zinc-950 shadow-2xl shadow-orange-950/20">
          <div className="relative aspect-video bg-black">
            {!isUnlocked ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.16),transparent_55%)] p-6 text-center">
                <div className="flex size-20 items-center justify-center rounded-full border border-orange-400/40 bg-orange-500/15 text-orange-300 shadow-lg shadow-orange-950/40 sm:size-24">
                  <Play className="ml-1 size-9 fill-current sm:size-11" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-lg font-semibold sm:text-xl">Listo para reproducir</p>
                  <p className="mt-1 text-sm text-zinc-400">Presiona Play para cargar el video</p>
                </div>
                <Button onClick={startPlayback} disabled={isAdLoading} className="bg-orange-500 text-black hover:bg-orange-400">
                  {isAdLoading ? <Loader2 data-icon="inline-start" className="animate-spin" /> : <Play data-icon="inline-start" className="fill-current" />}
                  {isAdLoading ? "Cargando..." : "Play"}
                </Button>
              </div>
            ) : isDirectVideo(activeSource.url) ? (
              <video key={activeSource.url} className="h-full w-full" controls autoPlay playsInline src={activeSource.url} onError={() => setAdNotice("Este enlace no se pudo reproducir en el navegador.")} />
            ) : (
              <iframe key={activeSource.url} className="h-full w-full" src={activeSource.url} title={activeSource.name} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
            )}
          </div>
        </div>

        {adNotice && <p className="text-center text-xs text-zinc-400" role="status">{adNotice}</p>}

        <nav className="flex w-full max-w-5xl flex-wrap gap-2" aria-label="Fuentes de video">
          {validSources.map((source, index) => (
            <Button key={`${source.url}-${index}`} variant={index === activeIndex ? "default" : "outline"} onClick={() => { setActiveIndex(index); setIsUnlocked(false); setAdNotice(null) }} className={cn("border-white/15", index === activeIndex && "bg-orange-500 text-black hover:bg-orange-400")}>
              {source.name || `Opción ${index + 1}`}
            </Button>
          ))}
        </nav>
      </section>
    </main>
  )
}

export type { VideoSource }
