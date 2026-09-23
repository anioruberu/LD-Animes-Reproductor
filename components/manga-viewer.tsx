'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, Download, Maximize, BookOpen, Rows3 } from 'lucide-react'
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
  const [pdf, setPdf] = useState<any>(null)
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)
  const [inputUrl, setInputUrl] = useState('')
  const viewerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Cargar PDF
  useEffect(() => {
    let cancelled = false
    let loadingTask: pdfjs.PDFDocumentLoadingTask | null = null

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
        if (cancelled) return

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
              <p className="text-slate-500 text-xs mt-2">La pantalla del visor ofrece descargar el PDF y verlo directamente; no crea un embed.</p>
            </div>

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
    <div ref={viewerRef} className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center p-2 sm:p-4">
        <div className="pointer-events-auto flex flex-col items-center gap-1 rounded-2xl border border-slate-700/80 bg-slate-900/90 p-1.5 shadow-2xl backdrop-blur-md sm:gap-2 sm:p-2">
          <Button size="icon" variant="ghost" onClick={handlePrevPage} disabled={currentPage === 1 || !pdf} title="Página anterior" aria-label="Página anterior"><ChevronRight className="h-4 w-4" /></Button>
          <span className="w-10 rounded-md bg-slate-800 px-1 py-2 text-center text-[10px] text-white sm:w-12 sm:text-xs">{currentPage} / {totalPages}</span>
          <Button size="icon" variant="ghost" onClick={handleNextPage} disabled={currentPage === totalPages || !pdf} title="Página siguiente" aria-label="Página siguiente"><ChevronLeft className="h-4 w-4" /></Button>
          <div className="h-px w-7 bg-slate-700" />
          <Button size="icon" variant={readingMode === 'manga' ? 'default' : 'ghost'} onClick={() => setReadingMode('manga')} title="Lectura de manga" aria-label="Lectura de manga"><BookOpen className="h-4 w-4" /></Button>
          <Button size="icon" variant={readingMode === 'normal' ? 'default' : 'ghost'} onClick={() => setReadingMode('normal')} title="Lectura normal" aria-label="Lectura normal"><Rows3 className="h-4 w-4" /></Button>
          <div className="h-px w-7 bg-slate-700" />
          <Button size="icon" variant="ghost" onClick={handleDownload} title="Descargar PDF" aria-label="Descargar PDF"><Download className="h-4 w-4" /></Button>
          <Button size="icon" variant="ghost" onClick={handleFullscreen} title="Pantalla completa" aria-label="Pantalla completa"><Maximize className="h-4 w-4" /></Button>
        </div>
      </div>
      <div className="flex h-screen w-full items-center justify-center overflow-hidden bg-slate-950">
        {loading ? <div className="text-gray-400">Cargando...</div> : <canvas ref={setCanvas} className="block h-full w-full object-contain border-0" />}
      </div>
    </div>
  )
}
