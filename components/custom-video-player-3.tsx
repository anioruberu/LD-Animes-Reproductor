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
    <main className="flex min-h-screen flex-col bg-[#17100b] text-white">
      <header className="border-b border-orange-300/20 bg-[#25140b] px-4 py-4 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-orange-300">Reproductor 3</p>
      </header>

      <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 p-4 sm:p-6">
        <div className="flex items-center justify-between rounded-xl bg-orange-600 px-4 py-3">
          <p className="flex items-center gap-2 text-lg font-bold"><Volume2 className="size-5" /> Selecciona un servidor</p>
          <span className="text-sm text-orange-100">{validSources.length} opciones</span>
        </div>

        <div className="rounded-2xl border border-orange-400/30 bg-[#3a1d0d] p-3 shadow-xl">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {validSources.map((source, index) => (
              <button
                key={`${source.url}-${index}`}
                type="button"
                onClick={() => { setActiveIndex(index); setIsUnlocked(false); setAdNotice(null) }}
                className={cn("group flex min-h-28 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-orange-500 bg-[#160d08] p-3 text-center transition hover:bg-orange-950/60", index === activeIndex && "bg-orange-950/70 ring-2 ring-orange-300/60")}
                aria-pressed={index === activeIndex}
              >
                <span className="text-xs font-bold text-orange-300">{index + 1}</span>
                <span className="text-sm font-bold uppercase leading-tight tracking-wide">Servidor {index + 1}</span>
                {index === activeIndex && <span className="text-[11px] text-orange-200">Seleccionado</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-orange-300/30 bg-[#09090b] shadow-2xl">
          <div className="relative aspect-video">
            {!isUnlocked ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.22),transparent_55%)] p-5 text-center">
                <p className="text-sm text-orange-200">Pulsa reproducir para cargar el video</p>
                <Button onClick={startPlayback} disabled={isAdLoading} size="lg" className="rounded-full bg-orange-500 px-7 text-white hover:bg-orange-400">
                  {isAdLoading ? <Loader2 data-icon="inline-start" className="animate-spin" /> : <Play data-icon="inline-start" className="fill-current" />}
                  {isAdLoading ? "Cargando anuncio..." : "Reproducir"}
                </Button>
              </div>
            ) : isDirectVideo(activeSource.url) ? (
              <video key={activeSource.url} className="h-full w-full" controls autoPlay playsInline src={activeSource.url} onError={() => setAdNotice("Este enlace no se pudo reproducir en el navegador.")} />
            ) : (
              <iframe key={activeSource.url} className="h-full w-full" src={activeSource.url} title={activeSource.name} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
            )}
          </div>
        </div>
        {adNotice && <p className="text-center text-xs text-orange-200" role="status">{adNotice}</p>}
      </section>
    </main>
  )
}

export type { VideoSource }
