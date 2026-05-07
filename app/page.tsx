"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Play, Copy, ExternalLink, Download } from "lucide-react"

export default function HomePage() {
  const [url, setUrl] = useState("")
  const [error, setError] = useState("")
  const [copiedItem, setCopiedItem] = useState<string | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [showEmbedOptions, setShowEmbedOptions] = useState(false)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!url.trim()) {
      setError("Por favor ingresa una URL")
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

    // Mostrar el embed del video
    setVideoUrl(url)
    setShowEmbedOptions(true)

    // También permitir ir a la página /r si lo desea
    // router.push(`/r?url=${encodeURIComponent(url)}`)
  }

  const [selectedPlayer, setSelectedPlayer] = useState<'blue' | 'orange'>('blue')

  const handleGoToPlayer = (playerType: 'blue' | 'orange' = 'blue') => {
    if (videoUrl) {
      const encodedUrl = encodeURIComponent(videoUrl)
      const route = playerType === 'orange' ? '/r2' : '/r'
      router.push(`${route}?url=${encodedUrl}`)
    }
  }

  const handleDownload = () => {
    if (videoUrl) {
      const encodedUrl = encodeURIComponent(videoUrl)
      router.push(`/d?url=${encodedUrl}`)
    }
  }

  const copyToClipboard = (text: string, itemType: string) => {
    navigator.clipboard.writeText(text)
    setCopiedItem(itemType)
    setTimeout(() => setCopiedItem(null), 2000)
  }

  const getShareUrl = () => {
    if (!videoUrl) return ""
    const route = selectedPlayer === 'orange' ? '/r2' : '/r'
    return `${window.location.origin}${route}?url=${encodeURIComponent(videoUrl)}`
  }

  const getEmbedCode = () => {
    if (!videoUrl) return ""
    const encodedUrl = encodeURIComponent(videoUrl)
    const route = selectedPlayer === 'orange' ? '/r2' : '/r'
    const shareUrl = `${window.location.origin}${route}?url=${encodedUrl}`
    return `<iframe src="${shareUrl}" width="100%" height="600" frameborder="0" allowfullscreen style="border-radius: 8px; border: none;"></iframe>`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-lg">
              <Play className="h-8 w-8 text-white fill-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Reproductor de Video</h1>
          <p className="text-gray-400">Ingresa una URL de video compatible</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-300 mb-2">
              URL del Video
            </label>
            <Input
              id="url"
              type="text"
              placeholder="https://example.com/video.mp4 o enlace directo"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-slate-800 border-slate-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-900/20 border border-red-800 rounded-lg text-sm text-red-300">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Play className="h-4 w-4 fill-current" />
            Reproducir Video
          </Button>
        </form>

        {videoUrl && showEmbedOptions && (
          <div className="mt-8 space-y-4">
            {/* Embed Preview */}
            <div className="bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden">
              <div className="aspect-video bg-black relative">
                <iframe
                  key={selectedPlayer}
                  src={`${window.location.origin}${selectedPlayer === 'orange' ? '/r2' : '/r'}?url=${encodeURIComponent(videoUrl)}`}
                  className="w-full h-full"
                  allowFullScreen
                  title={selectedPlayer === 'blue' ? 'LD Animes' : 'GokuPlay -Reporductor'}
                />
              </div>
            </div>

            {/* Opciones de compartir */}
            <div className="space-y-3">
              {/* Opción 1: URL Directa */}
              <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-4">
                <h3 className="text-sm font-semibold text-white mb-3">URL Directa</h3>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    readOnly
                    value={getShareUrl()}
                    className="flex-1 bg-slate-900 border border-slate-600 rounded px-3 py-2 text-xs text-gray-300 truncate min-w-0"
                  />
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                      onClick={() => copyToClipboard(getShareUrl(), "url")}
                      className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded transition-colors flex items-center justify-center gap-1 text-xs"
                    >
                      <Copy className="h-4 w-4" />
                      <span className="hidden sm:inline">{copiedItem === "url" ? "¡Copiado!" : "Copiar"}</span>
                      <span className="sm:hidden">{copiedItem === "url" ? "Copiado" : "Copiar"}</span>
                    </Button>
                    <Button
                      onClick={() => handleGoToPlayer(selectedPlayer)}
                      className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded transition-colors flex items-center justify-center gap-1 text-xs"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>Ir</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Opción 1.5: Descargar Video */}
              <Button
                onClick={handleDownload}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Download className="h-4 w-4 fill-current" />
                Descargar Video
              </Button>

              {/* Opción 2: Código Embed */}
              <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-4">
                <h3 className="text-sm font-semibold text-white mb-3">Código para Embed</h3>
                <div className="flex flex-col gap-3">
                  <div className="flex gap-2 w-full mb-3">
                    <Button
                      onClick={() => setSelectedPlayer('blue')}
                      className={`flex-1 py-2 rounded transition-colors text-xs font-semibold ${
                        selectedPlayer === 'blue'
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-slate-700 hover:bg-slate-600 text-gray-300'
                      }`}
                    >
                      LD Animes
                    </Button>
                    <Button
                      onClick={() => setSelectedPlayer('orange')}
                      className={`flex-1 py-2 rounded transition-colors text-xs font-semibold ${
                        selectedPlayer === 'orange'
                          ? 'bg-orange-600 hover:bg-orange-700 text-white'
                          : 'bg-slate-700 hover:bg-slate-600 text-gray-300'
                      }`}
                    >
                      GokuPlay
                    </Button>
                  </div>
                  
                  <textarea
                    readOnly
                    value={getEmbedCode()}
                    className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-xs text-gray-300 font-mono h-24 resize-none w-full"
                  />
                  <Button
                    onClick={() => copyToClipboard(getEmbedCode(), "embed")}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <Copy className="h-4 w-4" />
                    {copiedItem === "embed" ? "¡Copiado!" : "Copiar Código"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Botón para agregar otro video */}
            <Button
              onClick={() => {
                setUrl("")
                setVideoUrl(null)
                setShowEmbedOptions(false)
                setError("")
              }}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 rounded-lg transition-colors"
            >
              Agregar otro video
            </Button>
          </div>
        )}

        {!videoUrl && (
          <div className="mt-8 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <h2 className="text-sm font-semibold text-white mb-3">Formatos Compatibles:</h2>
            <ul className="text-xs text-gray-400 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>.mp4</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>.mkv</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>.m3u8</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>.webm</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>.avi</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>.mov</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
