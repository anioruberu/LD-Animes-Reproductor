"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { CustomVideoPlayerOrange } from "@/components/custom-video-player-orange"
import { ExternalLink } from "lucide-react"

function VideoPlayerContent() {
  const searchParams = useSearchParams()
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [videoTitle, setVideoTitle] = useState<string>("GokuPlay - Reproductor")
  const [error, setError] = useState<string | null>(null)

  const extractTitleFromUrl = (url: string): string => {
    try {
      // No extraer título de zilla-networks, usar el por defecto
      if (url.includes("player.zilla-networks.com")) {
        return "GokuPlay - Reproductor"
      }
      
      // Decodificar la URL
      const decodedUrl = decodeURIComponent(url)
      
      // Extraer el nombre del archivo (última parte después de la última /)
      const fileName = decodedUrl.split("/").pop() || ""
      
      // Remover la extensión del archivo
      const titleWithoutExt = fileName.replace(/\.(mp4|mkv|webm|avi|mov)$/i, "").trim()
      
      // Si tenemos un título válido, devolverlo
      if (titleWithoutExt && titleWithoutExt.length > 0) {
        return titleWithoutExt
      }
    } catch (error) {
      console.error("[v0] Error extrayendo título:", error)
    }
    
    // Si no se puede extraer, devolver el título por defecto
    return "GokuPlay - Reproductor"
  }

  useEffect(() => {
    const url = searchParams.get("url")
    if (!url) {
      setError("No se proporcionó una URL de video")
      return
    }

    const isPixelDrain = url.includes("pixeldrain.com")
    const isHuggingFace = url.includes("huggingface.co") && (url.endsWith(".mkv") || url.endsWith(".mp4"))
    const isZillaNetworks = url.includes("player.zilla-networks.com") || url.includes(".m3u8")
    const isDirectVideo = url.match(/\.(mp4|mkv|webm|avi|mov)(\?.*)?$/i)

    if (!isPixelDrain && !isHuggingFace && !isZillaNetworks && !isDirectVideo) {
      setError("La URL proporcionada no es compatible con el reproductor personalizado")
      return
    }

    let processedUrl = decodeURIComponent(url)

    if (isPixelDrain) {
      if (processedUrl.includes("/api/file/")) {
        if (!processedUrl.startsWith("http")) {
          processedUrl = `https://${processedUrl}`
        }
      } else {
        let fileId = ""

        if (processedUrl.includes("/u/")) {
          fileId = processedUrl.split("/u/")[1]?.split("?")[0]?.split("#")[0]
        } else if (!processedUrl.includes("/")) {
          fileId = processedUrl.replace("pixeldrain.com", "").trim()
        } else {
          const parts = processedUrl.split("/")
          fileId = parts[parts.length - 1]?.split("?")[0]?.split("#")[0]
        }

        if (fileId) {
          processedUrl = `https://pixeldrain.com/api/file/${fileId}`
        } else {
          setError("No se pudo extraer el ID del archivo de Pixeldrain de la URL proporcionada")
          return
        }
      }
    }

    // Extraer el título de la URL
    const extractedTitle = extractTitleFromUrl(url)
    setVideoTitle(extractedTitle)

    console.log("[v0] Original URL:", url)
    console.log("[v0] Processed URL:", processedUrl)
    console.log("[v0] Título extraído:", extractedTitle)
    setVideoUrl(processedUrl)
  }, [searchParams])

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center text-white max-w-md">
          <div className="mb-6">
            <ExternalLink className="h-16 w-16 mx-auto mb-4 text-red-400" />
            <h1 className="text-2xl font-bold mb-2">Error</h1>
            <p className="text-gray-300">{error}</p>
          </div>
          <div className="space-y-3">
            <p className="text-sm text-gray-400">URLs compatibles:</p>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>• pixeldrain.com (enlaces directos)</li>
              <li>• huggingface.co (archivos .mkv o .mp4)</li>
              <li>• player.zilla-networks.com (archivos .m3u8)</li>
              <li>• Enlaces directos a videos (.mp4, .mkv, .webm, .m3u8)</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  if (!videoUrl) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Cargando reproductor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black overflow-hidden" style={{ height: "100vh", width: "100vw" }}>
      <div className="w-full h-full flex items-center justify-center">
        <CustomVideoPlayerOrange
          src={videoUrl}
          title={videoTitle}
          onError={() => setError("Error al cargar el video")}
          forceFullSize={true}
        />
      </div>
    </div>
  )
}

export default function VideoTestPage() {
  useEffect(() => {
    document.title = "GokuPlay - Reporductor"
    document.body.style.margin = "0"
    document.body.style.padding = "0"
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.margin = ""
      document.body.style.padding = ""
      document.body.style.overflow = ""
    }
  }, [])

  return (
    <Suspense
      fallback={
        <div
          className="fixed inset-0 bg-black flex items-center justify-center"
          style={{ height: "100vh", width: "100vw" }}
        >
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Cargando...</p>
          </div>
        </div>
      }
    >
      <VideoPlayerContent />
    </Suspense>
  )
}
