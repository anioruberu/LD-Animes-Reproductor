'use client'

import { useState, useEffect, useRef, type TouchEvent, type TouchList } from 'react'
import { ChevronLeft, ChevronRight, Download, Maximize, BookOpen, Rows3, PanelLeftClose, PanelLeftOpen, Play, Pause } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import * as pdfjs from 'pdfjs-dist'
import { getHuggingFaceProxyUrl } from '@/lib/huggingface'
import { readMangaProgress, saveMangaProgress } from '@/lib/manga-library'
import { decodeVideoUrlParam, encodeVideoUrl } from '@/lib/url-codec'

// pdfjs-dist 6 publica el worker como módulo ES; usar .mjs evita el error de fake worker.
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`

interface MangaViewerProps {
  pdfUrl: string
  theme?: 'blue' | 'orange'
}

export function MangaViewer({ pdfUrl, theme = 'blue' }: MangaViewerProps) {
  const isOrange = theme === 'orange'
  const decodedPdfUrl = decodeVideoUrlParam(pdfUrl) || pdfUrl
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [readingMode, setReadingMode] = useState<'manga' | 'normal'>('manga')
  const [toolbarVisible, setToolbarVisible] = useState(true)
  const [isAutoScrolling, setIsAutoScrolling] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pdf, setPdf] = useState<any>(null)
  const viewerRef = useRef<HTMLDivElement>(null)
  const documentScrollRef = useRef<HTMLDivElement>(null)
  const pageCanvasRefs = useRef<Record<number, HTMLCanvasElement | null>>({})
  const currentPageRef = useRef(1)

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
        const response = await fetch(getHuggingFaceProxyUrl(decodedPdfUrl), {
          cache: 'no-store',
        })
        if (!response.ok) {
          throw new Error(`PDF request failed: ${response.status}`)
        }

        const data = new Uint8Array(await response.arrayBuffer())
        if (!data.length) {
          throw new Error('The PDF response was empty')
        }

        loadingTask = pdfjs.getDocument({
        data,
        isOffscreenCanvasSupported: false,
        useWorkerFetch: false,
        useWasm: true,
        isImageDecoderSupported: false,
        wasmUrl: '/pdfjs/',
      })
        const loadedPdf = await loadingTask.promise
        if (cancelled) return

        setPdf(loadedPdf)
        setTotalPages(loadedPdf.numPages)
        const savedPage = Math.min(readMangaProgress(decodedPdfUrl), loadedPdf.numPages)
        currentPageRef.current = savedPage
        setCurrentPage(savedPage)
      } catch (err) {
        if (!cancelled) {
          setError('Error al cargar el PDF')
          console.error('[v0] Error cargando PDF:', err)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    if (decodedPdfUrl) loadPdf()

    return () => {
      cancelled = true
      if (loadingTask) void loadingTask.destroy()
    }
  }, [decodedPdfUrl])

  // En modo manga se muestra una página a la vez; en modo normal se renderiza
  // todo el documento en una columna, como un lector PDF tradicional.
  useEffect(() => {
    const renderPages = async () => {
      if (!pdf) return

      const pages = readingMode === 'normal' ? Array.from({ length: pdf.numPages }, (_, index) => index + 1) : [currentPage]
      try {
        await Promise.all(pages.map(async (pageNumber) => {
          const pageCanvas = pageCanvasRefs.current[pageNumber]
          if (!pageCanvas) return
          const page = await pdf.getPage(pageNumber)
          const context = pageCanvas.getContext('2d', { alpha: true })
          if (!context) return

          const viewport = page.getViewport({ scale: 1 })
          pageCanvas.width = viewport.width
          pageCanvas.height = viewport.height
          context.save()
          context.globalCompositeOperation = 'source-over'
          context.fillStyle = '#ffffff'
          context.fillRect(0, 0, viewport.width, viewport.height)
          context.restore()
          await page.render({
            canvasContext: context,
            viewport,
            intent: 'display',
            background: '#ffffff',
          }).promise

        }))
      } catch (err) {
        console.error('[v0] Error renderizando páginas:', err)
      }
    }

    renderPages()
  }, [pdf, readingMode, readingMode === 'manga' ? currentPage : null])

  const getVisiblePage = () => {
    const container = documentScrollRef.current
    if (!container || totalPages === 0) return currentPage

    const center = container.getBoundingClientRect().top + container.clientHeight / 2
    let closestPage = currentPage
    let closestDistance = Number.POSITIVE_INFINITY

    for (let pageNumber = 1; pageNumber <= totalPages; pageNumber += 1) {
      const canvas = pageCanvasRefs.current[pageNumber]
      if (!canvas) continue
      const rect = canvas.getBoundingClientRect()
      const distance = Math.abs(rect.top + rect.height / 2 - center)
      if (distance < closestDistance) {
        closestDistance = distance
        closestPage = pageNumber
      }
    }

    return closestPage
  }

  useEffect(() => {
    const container = documentScrollRef.current
    if (!container || readingMode !== 'normal' || loading) return

    const observer = new IntersectionObserver((entries) => {
      const centered = entries.find((entry) => entry.isIntersecting)
      if (!centered) return

      const pageNumber = Number((centered.target as HTMLElement).dataset.page)
      if (!pageNumber || pageNumber === currentPageRef.current) return
      currentPageRef.current = pageNumber
      setCurrentPage(pageNumber)
    }, { root: container, rootMargin: '-45% 0px -45% 0px', threshold: 0.01 })

    Object.entries(pageCanvasRefs.current).forEach(([pageNumber, canvas]) => {
      if (canvas) {
        canvas.dataset.page = pageNumber
        observer.observe(canvas)
      }
    })

    return () => observer.disconnect()
  }, [readingMode, loading, totalPages])

  const switchReadingMode = (mode: 'manga' | 'normal') => {
    const pageToKeep = readingMode === 'normal' ? getVisiblePage() : currentPage
    currentPageRef.current = pageToKeep
    setCurrentPage(pageToKeep)
    setReadingMode(mode)

    if (mode === 'normal') {
      requestAnimationFrame(() => {
        pageCanvasRefs.current[pageToKeep]?.scrollIntoView({ block: 'center' })
      })
    }
  }

  useEffect(() => {
    if (decodedPdfUrl && totalPages > 0) saveMangaProgress(decodedPdfUrl, currentPage)
  }, [decodedPdfUrl, currentPage, totalPages])

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
  }

  useEffect(() => {
    if (!isAutoScrolling || readingMode !== 'normal' || !documentScrollRef.current) return
    const timer = window.setInterval(() => {
      const container = documentScrollRef.current
      if (!container) return
      const atEnd = container.scrollTop + container.clientHeight >= container.scrollHeight - 2
      if (atEnd) {
        setIsAutoScrolling(false)
        return
      }
      container.scrollBy({ top: 1, behavior: 'auto' })
    }, 45)
    return () => window.clearInterval(timer)
  }, [isAutoScrolling, readingMode])

  const handleFullscreen = async () => {
    if (!viewerRef.current) return
    if (document.fullscreenElement) await document.exitFullscreen()
    else await viewerRef.current.requestFullscreen()
  }

  const handleDownload = () => {
    const verificationUrl = new URL('/verificar-descargar', window.location.origin)
    verificationUrl.searchParams.set('curl', encodeVideoUrl(decodedPdfUrl))
    window.location.href = verificationUrl.toString()
  }

  if (!decodedPdfUrl) return null

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

  const progress = totalPages > 0 ? Math.min(100, Math.max(0, (currentPage / totalPages) * 100)) : 0

  return (
    <div
      ref={viewerRef}
      className="relative min-h-screen overflow-hidden bg-slate-950 touch-auto"
    >
      <div className="pointer-events-none fixed inset-x-0 top-0 z-30 px-3 pt-2 sm:px-5 sm:pt-3">
        <div className="mx-auto h-1.5 w-full max-w-3xl overflow-hidden rounded-full bg-slate-800/90 shadow-lg ring-1 ring-slate-700/70" role="progressbar" aria-label="Progreso de lectura" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}>
          <div className={`h-full rounded-full ${isOrange ? 'bg-orange-500' : 'bg-blue-500'} transition-[width] duration-200` } style={{ width: `${progress}%` }} />
        </div>
      </div>
      {toolbarVisible && <div className="pointer-events-none absolute inset-y-0 left-2 z-10 flex items-center sm:left-4">
        <div className={`pointer-events-auto flex origin-left scale-[0.82] flex-col items-center gap-1 rounded-2xl border ${isOrange ? 'border-orange-500/50 bg-orange-950/90' : 'border-slate-700/80 bg-slate-900/90'} p-1.5 shadow-2xl backdrop-blur-md sm:gap-2 sm:p-2`}>
          {readingMode === 'manga' && (
            <>
              <Button size="icon" variant="ghost" onClick={handlePrevPage} disabled={currentPage === 1 || !pdf} title="Página anterior" aria-label="Página anterior"><ChevronRight className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" onClick={handleNextPage} disabled={currentPage === totalPages || !pdf} title="Página siguiente" aria-label="Página siguiente"><ChevronLeft className="h-4 w-4" /></Button>
            </>
          )}
          <div className="my-1 h-px w-6 bg-slate-700" />
          <Button size="icon" variant={readingMode === 'manga' ? 'default' : 'ghost'} className={isOrange && readingMode === 'manga' ? 'bg-orange-500 hover:bg-orange-600' : ''} onClick={() => switchReadingMode('manga')} title="Lectura manga" aria-label="Lectura manga"><BookOpen className="h-4 w-4" /></Button>
          <Button size="icon" variant={readingMode === 'normal' ? 'default' : 'ghost'} className={isOrange && readingMode === 'normal' ? 'bg-orange-500 hover:bg-orange-600' : ''} onClick={() => switchReadingMode('normal')} title="Lectura normal de arriba hacia abajo" aria-label="Lectura normal de arriba hacia abajo"><Rows3 className="h-4 w-4" /></Button>
          {readingMode === 'normal' && <Button size="icon" variant={isAutoScrolling ? 'default' : 'ghost'} onClick={() => setIsAutoScrolling((playing) => !playing)} title={isAutoScrolling ? 'Pausar lectura automática' : 'Reproducir lectura automática'} aria-label={isAutoScrolling ? 'Pausar lectura automática' : 'Reproducir lectura automática'}>{isAutoScrolling ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}</Button>}
          <div className="my-1 h-px w-6 bg-slate-700" />
          <Button size="icon" variant="ghost" onClick={handleDownload} title="Descargar PDF" aria-label="Descargar PDF"><Download className="h-4 w-4" /></Button>
          <Button size="icon" variant="ghost" onClick={handleFullscreen} title="Pantalla completa" aria-label="Pantalla completa"><Maximize className="h-4 w-4" /></Button>
          <Button size="icon" variant="ghost" onClick={() => setToolbarVisible((visible) => !visible)} title={toolbarVisible ? 'Ocultar controles' : 'Mostrar controles'} aria-label={toolbarVisible ? 'Ocultar controles' : 'Mostrar controles'}>
            {toolbarVisible ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
          </Button>
        </div>
      </div>}
      <div className="pointer-events-none fixed right-3 top-3 z-30 rounded-full border border-slate-600/80 bg-slate-900/90 px-3 py-1.5 text-xs font-medium text-white shadow-lg backdrop-blur-md sm:right-5 sm:top-5 sm:px-4 sm:py-2 sm:text-sm">
        {currentPage} / {totalPages}
      </div>
      <div ref={documentScrollRef} className={`h-screen w-full bg-slate-950 ${readingMode === 'normal' ? 'overflow-y-auto pt-20' : 'flex items-center justify-center overflow-hidden'}`}>
        {loading ? <div className="text-gray-400">Cargando...</div> : (
          <div className={readingMode === 'normal' ? 'mx-auto flex w-full max-w-4xl flex-col items-center gap-2 px-2 pb-8' : 'flex h-full w-full items-center justify-center'}>
            {(readingMode === 'normal' ? Array.from({ length: totalPages }, (_, index) => index + 1) : [currentPage]).map((pageNumber) => (
              <canvas
                key={pageNumber}
                ref={(element) => { pageCanvasRefs.current[pageNumber] = element }}
                className={readingMode === 'normal' ? 'block h-auto w-full border-0 shadow-lg' : 'block h-full w-full object-contain border-0'}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
