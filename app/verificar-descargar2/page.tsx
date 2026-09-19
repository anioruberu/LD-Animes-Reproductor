import { DownloadVerification } from "@/components/download-verification"
import { MonetagRouteAds } from "@/components/monetag-route-ads"

export default async function VerifyDownloadTwoPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await searchParams
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") query.set(key, value)
    else if (Array.isArray(value)) value.forEach((item) => query.append(key, item))
  }
  const destination = query.size ? `/descargar2?${query.toString()}` : "/descargar2"

  return (
    <>
      <MonetagRouteAds serviceWorkerPath="/descargar2/sw.js" />
      <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 px-4 py-12 text-white">
        <div className="mx-auto flex min-h-[70vh] w-full max-w-md items-center">
          <section className="w-full rounded-xl border border-slate-700 bg-slate-800/60 p-6 shadow-xl">
            <div className="mb-6 text-center">
              <h1 className="text-3xl font-bold">Preparar descarga</h1>
              <p className="mt-2 text-slate-400">Completa la verificación para continuar.</p>
            </div>
            <DownloadVerification destination={destination} accentClassName="bg-orange-600 hover:bg-orange-700" />
          </section>
        </div>
      </main>
    </>
  )
}
