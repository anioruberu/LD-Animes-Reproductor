"use client"

import { Suspense, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { CustomVideoPlayer3, type VideoSource } from "@/components/custom-video-player-3"

function getDomainName(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return "Servidor"
  }
}

function Player3Content() {
  const searchParams = useSearchParams()
  const sources = useMemo<VideoSource[]>(() => {
    const encodedSources = searchParams.get("sources")
    if (encodedSources) {
      try {
        const parsed = JSON.parse(encodedSources) as Array<Partial<VideoSource>>
        const fromJson = parsed
          .filter((source) => typeof source.url === "string")
          .map((source, index) => ({ name: source.name || getDomainName(source.url as string) || `Opción ${index + 1}`, url: source.url as string }))
        if (fromJson.length) return fromJson
      } catch {
        // Se mantiene el formato de parámetros individuales como alternativa.
      }
    }

    return Array.from({ length: 10 }, (_, index) => {
      const suffix = index === 0 ? "" : String(index + 1)
      return {
        name: searchParams.get(`name${suffix}`) || getDomainName(searchParams.get(`url${suffix}`) || "") || `Opción ${index + 1}`,
        url: searchParams.get(`url${suffix}`) || "",
      }
    }).filter((source) => source.url)
  }, [searchParams])

  return <CustomVideoPlayer3 sources={sources} title={searchParams.get("title") || "GokuPlay - Reproductor 3"} />
}

export default function Reproductor3Page() {
  return <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-black text-white">Cargando reproductor...</div>}><Player3Content /></Suspense>
}
