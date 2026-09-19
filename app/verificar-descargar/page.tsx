import { Suspense } from "react"
import { DownloadVerification } from "@/components/download-verification"
import { MonetagRouteAds } from "@/components/monetag-route-ads"

export default async function VerifyDownloadPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await searchParams
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") query.set(key, value)
    else if (Array.isArray(value)) value.forEach((item) => query.append(key, item))
  }
  const destination = query.size ? `/descargar?${query.toString()}` : "/descargar"

  return (
    <>
      <MonetagRouteAds serviceWorkerPath="/descargar/sw.js" />
      <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 px-4 py-12 text-white">
        <div className="mx-auto flex min-h-[70vh] w-full max-w-md items-center">
          <section className="w-full rounded-xl border border-slate-700 bg-slate-800/60 p-6 shadow-xl">
            <div className="mb-6 text-center">
              <h1 className="text-3xl font-bold">Preparar descarga</h1>
              <p className="mt-2 text-slate-400">Completa la verificación para continuar.</p>
            </div>
            <Suspense fallback={<p className="text-center text-slate-400">Cargando verificación...</p>}>
              <DownloadVerification destination={destination} accentClassName="bg-blue-600 hover:bg-blue-700" />
            </Suspense>
          </section>
        </div>
      </main>
    </>
  )
}
