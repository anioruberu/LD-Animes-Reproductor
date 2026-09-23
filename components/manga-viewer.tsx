'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, Download, Copy, Maximize, BookOpen, Rows3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import * as pdfjs from 'pdfjs-dist'
import { getHuggingFaceProxyUrl } from '@/lib/huggingface'

// pdfjs-dist 6 publica el worker como módulo ES; usar .mjs evita el error de fake worker.
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`

interface MangaViewerProps {
  pdfUrl: string
  isPreview?: boolean
}

export function MangaViewer({ pdfUrl, isPreview = false }: MangaViewerProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [scale, setScale] = useState(1)
  const [readingMode, setReadingMode] = useState<'manga' | 'normal'>('manga')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [pdf, setPdf] = useState<any>(null)
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)
  const [inputUrl, setInputUrl] = useState('')
  const viewerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Cargar PDF
  useEffect(() => {
    let cancelled = false
    let loadingTask: { destroy: () => Promise<void> } | null = null

    const loadPdf = async () => {
      try {
        setLoading(true)
        setError(null)
        setPdf(null)
        setTotalPages(0)

        // Descargamos el archivo completo antes de entregarlo a PDF.js. Así no
        // dependemos de Range/redirects de servidores externos como Hugging Face.
        const response = await fetch(getHuggingFaceProxyUrl(pdfUrl), {
          cache: 'no-store',
        })
        if (!response.ok) {
          throw new Error(`PDF request failed: ${response.status}`)
        }

        const data = new Uint8Array(await response.arrayBuffer())
        if (!data.length) {
          throw new Error('The PDF response was empty')
        }

        loadingTask = pdfjs.getDocument({ data })
        const loadedPdf = await loadingTask.promise
        if (cancelled) {
          await loadedPdf.destroy()
          return
        }

        setPdf(loadedPdf)
        setTotalPages(loadedPdf.numPages)
        setCurrentPage(1)
      } catch (err) {
        if (!cancelled) {
          setError('Error al cargar el PDF')
          console.error('[v0] Error cargando PDF:', err)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    if (pdfUrl) loadPdf()

    return () => {
      cancelled = true
      if (loadingTask) void loadingTask.destroy()
    }
  }, [pdfUrl])

  // Renderizar página
  useEffect(() => {
    const renderPage = async () => {
      if (!pdf || !canvas) return

      try {
        const page = await pdf.getPage(currentPage)
        const context = canvas.getContext('2d')
        if (!context) return

        const viewport = page.getViewport({ scale })
        canvas.width = viewport.width
        canvas.height = viewport.height

        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise
      } catch (err) {
        console.error('[v0] Error renderizando página:', err)
      }
    }

    renderPage()
  }, [pdf, currentPage, scale, canvas])

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
  }

  const handleFullscreen = async () => {
    if (!viewerRef.current) return
    if (document.fullscreenElement) await document.exitFullscreen()
    else await viewerRef.current.requestFullscreen()
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = pdfUrl
    link.download = 'manga.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(pdfUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isPreview || !pdfUrl) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Visor de Manga</h1>
            <p className="text-gray-400 mb-8">Lee tus PDFs con una experiencia de manga, de derecha a izquierda.</p>

            <form
              className="space-y-3 mb-6"
              onSubmit={(event) => {
                event.preventDefault()
                const value = inputUrl.trim()
                if (value) router.push(`/v?url=${encodeURIComponent(value)}`)
              }}
            >
              <label htmlFor="pdf-url" className="sr-only">URL del archivo PDF</label>
              <input
                id="pdf-url"
                type="url"
                value={inputUrl}
                onChange={(event) => setInputUrl(event.target.value)}
                placeholder="https://ejemplo.com/manga.pdf"
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-blue-500 placeholder:text-slate-500 focus:ring-2"
                required
              />
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500">
                <BookOpen className="w-4 h-4 mr-2" />
                Abrir PDF como manga
              </Button>
            </form>

            <div className="rounded-lg border border-slate-700 bg-slate-800/70 p-4 mb-6 text-left">
              <p className="text-gray-300 text-sm mb-2">También puedes usar:</p>
              <code className="text-blue-400 text-xs break-all">/v?curl=TU_URL_PDF</code>
              <p className="text-slate-500 text-xs mt-2">La pantalla del visor solo ofrece descargar y copiar el enlace; no crea un embed.</p>
            </div>

            <Link href="/">
              <Button className="w-full" variant="outline">
                <Home className="w-4 h-4 mr-2" />
                Ir al inicio
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <Link href="/">
            <Button variant="outline">Volver al inicio</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div ref={viewerRef} className="min-h-screen bg-slate-900 flex flex-col">
      <div className="bg-slate-800 border-b border-slate-700 p-3 flex justify-end gap-2">
        <Button size="sm" variant="ghost" onClick={handleDownload} title="Descargar PDF"><Download className="w-4 h-4" /></Button>
        <Button size="sm" variant="ghost" onClick={handleCopy} title="Copiar URL" className={copied ? 'text-green-400' : ''}><Copy className="w-4 h-4" /></Button>
        <Button size="sm" variant="ghost" onClick={handleFullscreen} title="Pantalla completa"><Maximize className="w-4 h-4" /></Button>
      </div>
      <div className="flex-1 flex items-center justify-center p-2 sm:p-4 overflow-auto min-h-0">
        {loading ? <div className="text-gray-400">Cargando...</div> : <canvas ref={setCanvas} className="max-w-full max-h-[calc(100vh-150px)] border border-slate-700 rounded shadow-xl" />}
      </div>
      <div className="bg-slate-800 border-t border-slate-700 p-3 sm:p-4">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button size="sm" variant="outline" onClick={handlePrevPage} disabled={currentPage === 1 || !pdf} title={readingMode === 'manga' ? 'Página anterior, lectura manga' : 'Página anterior'}><ChevronRight className="w-4 h-4" /></Button>
          <span className="px-3 py-2 bg-slate-700 rounded text-sm text-white">{currentPage} / {totalPages}</span>
          <Button size="sm" variant="outline" onClick={handleNextPage} disabled={currentPage === totalPages || !pdf} title={readingMode === 'manga' ? 'Página siguiente, lectura manga' : 'Página siguiente'}><ChevronLeft className="w-4 h-4" /></Button>
          <div className="h-6 w-px bg-slate-600 mx-1" />
          <Button size="sm" variant={readingMode === 'manga' ? 'default' : 'outline'} onClick={() => setReadingMode('manga')} title="Lectura de manga"><BookOpen className="w-4 h-4 mr-1" /> Manga</Button>
          <Button size="sm" variant={readingMode === 'normal' ? 'default' : 'outline'} onClick={() => setReadingMode('normal')} title="Lectura normal"><Rows3 className="w-4 h-4 mr-1" /> Normal</Button>
        </div>
        <p className="text-xs text-gray-400 text-center mt-2">{readingMode === 'manga' ? 'Lectura de derecha a izquierda' : 'Lectura normal de arriba hacia abajo'}</p>
      </div>
    </div>
  )
}
