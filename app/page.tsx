"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Play, Copy, ExternalLink, Download, FileText } from "lucide-react"
import { encodeVideoUrl } from "@/lib/url-codec"
import { MangaLibrary } from "@/components/manga-library"
import { saveMangaToLibrary } from "@/lib/manga-library"
import { VideoLibrary } from "@/components/video-library"
import { encodePlaylist, writeVideoLibrary, readVideoLibrary, type PlaylistItem } from "@/lib/playlist"

export default function HomePage() {
  const [url, setUrl] = useState("")
  const [contentMode, setContentMode] = useState<"video" | "pdf">("video")
  const [subtitlesUrl, setSubtitlesUrl] = useState("")
  const [encodeUrl, setEncodeUrl] = useState(false)
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
  setVideoUrl(url.trim())
  setSubtitlesUrl(subtitlesUrl.trim())
    const saved: PlaylistItem = { url: url.trim(), subtitlesUrl: subtitlesUrl.trim() || undefined }
    const library = readVideoLibrary()
    if (editingLibraryIndex !== null) {
      const updated = library.map((item, index) => index === editingLibraryIndex ? saved : item)
      writeVideoLibrary(updated)
      setEditingLibraryIndex(null)
    } else {
      writeVideoLibrary([...library.filter((item) => item.url !== saved.url), saved])
    }
    setShowEmbedOptions(true)

    // También permitir ir a la página /r si lo desea
    // router.push(`/r?url=${encodeURIComponent(url)}`)
  }

  const [selectedPlayer, setSelectedPlayer] = useState<'blue' | 'orange'>('blue')
  const [playlistItems, setPlaylistItems] = useState<PlaylistItem[]>([])
  const [editingLibraryIndex, setEditingLibraryIndex] = useState<number | null>(null)

  const handleOpenPdf = (event: React.FormEvent) => {
    event.preventDefault()
    const value = url.trim()
    if (!value) {
      setError("Por favor ingresa una URL de PDF")
      return
    }
    if (!/^https:\/\//i.test(value)) {
      setError("La URL debe comenzar con https://")
      return
    }
    saveMangaToLibrary(value)
    const mangaUrl = encodeUrl ? encodeVideoUrl(value) : value
    router.push(`/v?url=${encodeURIComponent(mangaUrl)}`)
  }

  const handleGoToPlayer = (playerType: 'blue' | 'orange' = 'blue') => {
    if (videoUrl) {
      const encodedUrl = encodeURIComponent(encodeUrl ? encodeVideoUrl(videoUrl) : videoUrl)
      const route = playerType === 'orange' ? '/reproductor2' : '/reproductor'
      const encodedSubtitles = subtitlesUrl.trim() ? `/sub=${encodeURIComponent(subtitlesUrl.trim())}` : ""
      router.push(`${route}?url=${encodedUrl}${encodedSubtitles}`)
    }
  }

  const handleDownload = () => {
    if (videoUrl) {
      const encodedUrl = encodeURIComponent(encodeUrl ? encodeVideoUrl(videoUrl) : videoUrl)
      router.push(`/${selectedPlayer === 'orange' ? 'verificar-descargar2' : 'verificar-descargar'}?url=${encodedUrl}`)
    }
  }

  const copyToClipboard = (text: string, itemType: string) => {
    navigator.clipboard.writeText(text)
    setCopiedItem(itemType)
    setTimeout(() => setCopiedItem(null), 2000)
  }

  const getShareUrl = () => {
    if (!videoUrl) return ""
    const route = selectedPlayer === 'orange' ? '/reproductor2' : '/reproductor'
    const suffix = subtitlesUrl.trim() ? `/sub=${encodeURIComponent(subtitlesUrl.trim())}` : ""
    const encodedVideo = encodeURIComponent(encodeUrl ? encodeVideoUrl(videoUrl) : videoUrl)
    return `${window.location.origin}${route}?url=${encodedVideo}${suffix}`
  }

  const getEmbedCode = () => {
    if (!videoUrl) return ""
    const encodedUrl = encodeURIComponent(encodeUrl ? encodeVideoUrl(videoUrl) : videoUrl)
    const route = selectedPlayer === 'orange' ? '/reproductor2' : '/reproductor'
    const encodedSubtitles = subtitlesUrl.trim() ? `/sub=${encodeURIComponent(subtitlesUrl.trim())}` : ""
    const shareUrl = `${window.location.origin}${route}?url=${encodedUrl}${encodedSubtitles}`
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
          <h1 className="text-3xl font-bold text-white mb-2">LD Animes</h1>
          <p className="text-gray-400">Elige qué quieres abrir</p>
          <div className="mt-5 grid grid-cols-2 gap-2 rounded-lg bg-slate-800 p-1">
            <button type="button" onClick={() => { setContentMode("video"); setError("") }} className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${contentMode === "video" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}>
              <Play className="mr-2 inline h-4 w-4" />Videos
            </button>
            <button type="button" onClick={() => { setContentMode("pdf"); setError("") }} className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${contentMode === "pdf" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"}`}>
              <FileText className="mr-2 inline h-4 w-4" />PDF / Manga
            </button>
          </div>
        </div>

        {contentMode === "video" && <VideoLibrary
        onOpen={(items) => {
          if (items.length === 1) {
            setUrl(items[0].url)
            setSubtitlesUrl(items[0].subtitlesUrl || "")
            setVideoUrl(items[0].url)
            setShowEmbedOptions(true)
          }
        }}
        onEdit={(item, index) => {
          setEditingLibraryIndex(index)
          setUrl(item.url)
          setSubtitlesUrl(item.subtitlesUrl || "")
          setVideoUrl(null)
          setShowEmbedOptions(false)
          setError("")
        }}
      />}
  {contentMode === "pdf" ? (
          <>
            <MangaLibrary onOpen={(item) => router.push(`/v?url=${encodeURIComponent(item.url)}`)} />
            <form onSubmit={handleOpenPdf} className="mt-6 space-y-4">
            <div>
              <label htmlFor="pdf-url" className="mb-2 block text-sm font-medium text-gray-300">URL del archivo PDF</label>
              <Input id="pdf-url" type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://huggingface.co/anioruberu/mp4/resolve/main/01.pdf" className="w-full bg-slate-800 border-slate-700 text-white placeholder-gray-500" />
              <label htmlFor="encode-pdf-url" className="mt-3 flex items-start gap-3 rounded-lg border border-slate-700 bg-slate-800/60 p-3 text-sm text-gray-300 cursor-pointer">
                <input id="encode-pdf-url" type="checkbox" checked={encodeUrl} onChange={(e) => setEncodeUrl(e.target.checked)} className="mt-0.5 h-4 w-4 accent-indigo-600" />
                <span><span className="block font-medium text-white">Codificar URL</span><span className="block text-xs text-gray-500">Aplica la misma codificación segura que la opción de videos.</span></span>
              </label>
            </div>
            {error && <div className="rounded-lg border border-red-800 bg-red-900/20 p-3 text-sm text-red-300">{error}</div>}
            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"><FileText className="mr-2 h-4 w-4" />Abrir PDF como manga</Button>
          </form>
          </>
        ) : null}

  <form onSubmit={handleSubmit} className={`space-y-4 ${contentMode === "pdf" ? "hidden" : ""}`}>
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

          <div>
            <label htmlFor="subtitles-url" className="block text-sm font-medium text-gray-300 mb-2">
              Fuente de los subtítulos (opcional)
            </label>
            <Input
              id="subtitles-url"
              type="url"
              placeholder="https://ejemplo.com/subtitulos.srt"
              value={subtitlesUrl}
              onChange={(e) => setSubtitlesUrl(e.target.value)}
              className="w-full bg-slate-800 border-slate-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">Hugging Face seguirá buscando automáticamente su archivo .srt si lo dejas vacío.</p>
          </div>

          <label htmlFor="encode-url" className="flex items-start gap-3 rounded-lg border border-slate-700 bg-slate-800/60 p-3 text-sm text-gray-300 cursor-pointer">
            <input
              id="encode-url"
              type="checkbox"
              checked={encodeUrl}
              onChange={(e) => setEncodeUrl(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-blue-600"
            />
            <span>
              <span className="block font-medium text-white">Codificar URL</span>
              <span className="block text-xs text-gray-500">Oculta la fuente en los enlaces compartidos usando Base64.</span>
            </span>
          </label>

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

        <section className={`${contentMode === "pdf" ? "hidden" : ""} mt-6 rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-4`}>
          <div className="mb-3">
            <h2 className="text-sm font-semibold text-white">Playlist</h2>
            <p className="mt-1 text-xs text-slate-400">Agrega varios videos para reproducirlos automáticamente, de forma independiente de la biblioteca local.</p>
          </div>
          {playlistItems.length > 0 && (
            <div className="mb-3 flex flex-col gap-2">
              {playlistItems.map((item, index) => (
                <div key={`${item.url}-${index}`} className="flex items-center gap-2 rounded-lg bg-slate-800 p-2 text-xs text-slate-200">
                  <span className="w-5 shrink-0 text-indigo-300">{index + 1}.</span>
                  <span className="min-w-0 flex-1 truncate">{item.title || item.url}</span>
                  <Button type="button" size="sm" variant="ghost" onClick={() => setPlaylistItems((current) => current.filter((_, itemIndex) => itemIndex !== index))}>Quitar</Button>
                </div>
              ))}
            </div>
          )}
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => {
              if (!url.trim()) { setError("Ingresa una URL antes de agregarla a la playlist"); return }
              const item: PlaylistItem = { url: url.trim(), subtitlesUrl: subtitlesUrl.trim() || undefined }
              setPlaylistItems((current) => [...current, item])
              setError("")
            }}>Agregar video actual</Button>
            <Button type="button" className="flex-1 bg-indigo-600 hover:bg-indigo-700" disabled={playlistItems.length === 0} onClick={() => {
              const playlist = encodePlaylist(playlistItems)
              router.push(`${selectedPlayer === "orange" ? "/reproductor2" : "/reproductor"}?playlist=${encodeURIComponent(playlist)}`)
            }}>Reproducir playlist ({playlistItems.length})</Button>
          </div>
        </section>

        {contentMode === "video" && videoUrl && showEmbedOptions && (
          <div className="mt-8 space-y-4">
            {/* Embed Preview */}
            <div className="bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden">
              <div className="aspect-video bg-black relative">
                <iframe
                  key={selectedPlayer}
                  src={`${window.location.origin}${selectedPlayer === 'orange' ? '/reproductor2' : '/reproductor'}?url=${encodeURIComponent(encodeUrl ? encodeVideoUrl(videoUrl) : videoUrl)}${subtitlesUrl.trim() ? `/sub=${encodeURIComponent(subtitlesUrl.trim())}` : ''}`}
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
