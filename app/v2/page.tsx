import { Suspense } from 'react'
import { MangaViewer } from '@/components/manga-viewer'

interface PageProps {
  searchParams: Promise<{
    url?: string
    curl?: string
  }>
}

export async function generateMetadata() {
  return {
    title: 'GokuPlay - Visor PDF',
    description: 'Visualiza archivos PDF con el visor GokuPlay naranja',
  }
}

export default async function GokuPlayViewerPage({ searchParams }: PageProps) {
  const params = await searchParams
  const pdfUrl = params.url || params.curl
  if (!pdfUrl) return null

  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-orange-400">Cargando...</div>}>
      <MangaViewer pdfUrl={pdfUrl} theme="orange" downloadPath="/descargar2" />
    </Suspense>
  )
}
