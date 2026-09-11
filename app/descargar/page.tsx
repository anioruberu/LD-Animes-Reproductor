"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Download, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

function DownloadContent() {
  const searchParams = useSearchParams()
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [downloading, setDownloading] = useState(false)

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
      setError("URL no compatible")
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
          setError("No se pudo extraer el ID del archivo de Pixeldrain")
          return
        }
      }
    }

    console.log("[v0] Download URL:", processedUrl)
    setVideoUrl(processedUrl)
  }, [searchParams])

  const handleDownload = async () => {
    if (!videoUrl) return

    setDownloading(true)

    try {
      const isHuggingFace = videoUrl.includes("huggingface.co")
      const isZillaNetworks = videoUrl.includes("player.zilla-networks.com") || videoUrl.includes(".m3u8")

      // Para HuggingFace: descarga directa rápida del navegador
      if (isHuggingFace) {
        let downloadUrl = videoUrl
        if (!videoUrl.includes("?download=true")) {
          downloadUrl = `${videoUrl}?download=true`
        }

        const link = document.createElement("a")
        link.href = downloadUrl
        link.download = `video_${Date.now()}.mp4`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        setDownloading(false)
        return
      }

      // Para otras URLs que redirigen (zilla-networks, etc): usar fetch + blob
      const response = await fetch(videoUrl)
      if (!response.ok) {
        throw new Error("Error al descargar el archivo")
      }

      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = blobUrl
      link.download = `video_${Date.now()}.mp4`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)
    } catch (err) {
      setError("Error al descargar el video. Intenta de nuevo.")
      console.error("[v0] Download error:", err)
    } finally {
      setDownloading(false)
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 flex items-center justify-center p-4">
        <div className="text-center text-white max-w-md">
          <div className="mb-6">
            <AlertCircle className="h-16 w-16 mx-auto mb-4 text-red-400" />
            <h1 className="text-2xl font-bold mb-2">Error</h1>
            <p className="text-gray-300">{error}</p>
          </div>
          <Button
            onClick={() => window.history.back()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Volver atrás
          </Button>
        </div>
      </div>
    )
  }

  if (!videoUrl) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p>Preparando descarga...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-lg">
              <Download className="h-8 w-8 text-white fill-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Descargar Video</h1>
          <p className="text-gray-400">Haz clic para descargar tu video</p>
        </div>

        <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6 space-y-4">
          <Button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Download className="h-5 w-5 fill-current" />
            {downloading ? "Descargando..." : "Descargar Ahora"}
          </Button>

          <Button
            onClick={() => window.history.back()}
            className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 rounded-lg transition-colors"
          >
            Volver
          </Button>
        </div>

        <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
          <p className="text-xs text-gray-400">
            <strong>Nota:</strong> La descarga comenzará automáticamente. Si el archivo es muy grande, puede tardar dependiendo de tu conexión.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function DownloadPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p>Cargando...</p>
          </div>
        </div>
      }
    >
      <DownloadContent />
    </Suspense>
  )
}
