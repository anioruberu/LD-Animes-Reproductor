'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, Download, Copy, ZoomIn, ZoomOut, Home, BookOpen } from 'lucide-react'
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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [pdf, setPdf] = useState<any>(null)
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)
  const [inputUrl, setInputUrl] = useState('')
  const router = useRouter()

  // Cargar PDF
  useEffect(() => {
    const loadPdf = async () => {
      try {
        setLoading(true)
        setError(null)
        const pdf = await pdfjs.getDocument({ url: getHuggingFaceProxyUrl(pdfUrl) }).promise
        setPdf(pdf)
        setTotalPages(pdf.numPages)
        setCurrentPage(1)
      } catch (err) {
        setError('Error al cargar el PDF')
        console.error('[v0] Error cargando PDF:', err)
      } finally {
        setLoading(false)
      }
    }

    if (pdfUrl) {
      loadPdf()
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

  const handleZoomIn = () => {
    setScale((prev) => Math.min(3, prev + 0.2))
  }

  const handleZoomOut = () => {
    setScale((prev) => Math.max(0.5, prev - 0.2))
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
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Barra superior */}
      <div className="bg-slate-800 border-b border-slate-700 p-4">
        <div className="flex items-center justify-between gap-4">
          <Link href="/">
            <Button size="sm" variant="ghost">
              <Home className="w-4 h-4" />
            </Button>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDownload}
              title="Descargar PDF"
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCopy}
              title={copied ? 'Copiado!' : 'Copiar URL'}
              className={copied ? 'text-green-400' : ''}
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Área de visualización */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 overflow-auto">
        {loading ? (
          <div className="text-gray-400">Cargando...</div>
        ) : (
          <div className="flex justify-center items-center max-w-full">
            <canvas
              ref={setCanvas}
              className="max-w-full max-h-[calc(100vh-180px)] border border-slate-700 rounded"
            />
          </div>
        )}
      </div>

      {/* Controles */}
      <div className="bg-slate-800 border-t border-slate-700 p-4">
        <div className="flex items-center justify-between gap-4">
          {/* Botones de navegación */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handlePrevPage}
              disabled={currentPage === 1 || !pdf}
              title="Página anterior (lectura RTL)"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>

            <div className="flex items-center gap-2 px-4 py-2 bg-slate-700 rounded text-sm text-white min-w-[120px] justify-center">
              <span>{currentPage}</span>
              <span className="text-gray-400">/</span>
              <span>{totalPages}</span>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={handleNextPage}
              disabled={currentPage === totalPages || !pdf}
              title="Página siguiente (lectura RTL)"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </div>

          {/* Zoom */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleZoomOut}
              disabled={scale <= 0.5}
            >
              <ZoomOut className="w-4 h-4" />
            </Button>

            <div className="flex items-center gap-2 px-3 py-2 bg-slate-700 rounded text-sm text-white min-w-[80px] justify-center">
              {Math.round(scale * 100)}%
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={handleZoomIn}
              disabled={scale >= 3}
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <p className="text-xs text-gray-400 text-center mt-2">Lectura de derecha a izquierda (Manga)</p>
      </div>
    </div>
  )
}
