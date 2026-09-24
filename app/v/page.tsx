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
    title: 'Visor de Manga - PDF Reader',
    description: 'Visualiza archivos PDF como manga con lectura de derecha a izquierda',
  }
}

export default async function MangaViewerPage({ searchParams }: PageProps) {
  const params = await searchParams
  const pdfUrl = params.url || params.curl
  if (!pdfUrl) return null

  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center">Cargando...</div>}>
      <MangaViewer pdfUrl={pdfUrl} />
    </Suspense>
  )
}
