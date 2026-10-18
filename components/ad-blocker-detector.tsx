"use client"

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react"
import { usePathname } from "next/navigation"
import { AlertTriangle, RefreshCw, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

type DetectionResult = "blocked" | "clear"

type AdBlockerContextValue = { isBlocked: boolean; isChecking: boolean; retry: () => void }
const AdBlockerContext = createContext<AdBlockerContextValue>({ isBlocked: false, isChecking: true, retry: () => undefined })
export const useAdBlocker = () => useContext(AdBlockerContext)

function testAdElement(): Promise<boolean> {
  return new Promise((resolve) => {
    const bait = document.createElement("div")
    bait.className = "ad adsbox ad-banner ad-unit"
    bait.setAttribute("aria-hidden", "true")
    bait.style.cssText = "position:absolute;left:-10000px;top:-10000px;width:1px;height:1px;pointer-events:none;"
    document.body.appendChild(bait)

    window.setTimeout(() => {
      const style = window.getComputedStyle(bait)
      const blocked = bait.offsetHeight === 0 || bait.offsetWidth === 0 || style.display === "none" || style.visibility === "hidden"
      bait.remove()
      resolve(blocked)
    }, 150)
  })
}

function testAdScript(): Promise<boolean> {
  return new Promise((resolve) => {
    const script = document.createElement("script")
    script.async = true
    script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
    script.onload = () => { script.remove(); resolve(false) }
    script.onerror = () => { script.remove(); resolve(true) }
    document.head.appendChild(script)
    window.setTimeout(() => {
      if (document.head.contains(script)) {
        script.remove()
        resolve(true)
      }
    }, 1800)
  })
}

async function detectAdBlocker(): Promise<DetectionResult> {
  const [elementBlocked, scriptBlocked] = await Promise.all([testAdElement(), testAdScript()])
  // Los bloqueadores pueden ocultar el señuelo o impedir la petición publicitaria.
  return elementBlocked || scriptBlocked ? "blocked" : "clear"
}

export function AdBlockerDetector({ children }: { children?: ReactNode }) {
  const pathname = usePathname()
  const isShortRoute = pathname === "/r" || pathname === "/r2" || pathname === "/d" || pathname === "/d2"
  const [isChecking, setIsChecking] = useState(!isShortRoute)
  const [isBlocked, setIsBlocked] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const runDetection = useCallback(async () => {
    if (isShortRoute) {
      setIsBlocked(false)
      setIsChecking(false)
      setIsRefreshing(false)
      return
    }
    setIsChecking(true)

    try {
      const result = await detectAdBlocker()
      const blocked = result === "blocked"
      setIsBlocked(blocked)
    } catch {
      setIsBlocked(false)
    } finally {
      setIsChecking(false)
      setIsRefreshing(false)
    }
  }, [isShortRoute])

  useEffect(() => {
    if (isShortRoute) {
      void runDetection()
      return
    }

    const timer = window.setTimeout(() => void runDetection(), 900)
    return () => window.clearTimeout(timer)
  }, [isShortRoute, runDetection])

  const handleRetry = () => {
    setIsRefreshing(true)
    void runDetection()
  }

  return (
    <AdBlockerContext.Provider value={{ isBlocked, isChecking, retry: handleRetry }}>
      {children}
    </AdBlockerContext.Provider>
  )
}

export function AdBlockerNotice({ variant = "player" }: { variant?: "player" | "download" }) {
  const { isBlocked, isChecking, retry } = useAdBlocker()
  if (isChecking || !isBlocked) return null
  const isDownload = variant === "download"
  return (
    <div className={`${isDownload ? "fixed" : "absolute"} inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-black/90 p-3 backdrop-blur-md ${isDownload ? "sm:p-8 md:p-12" : "sm:p-4"}`} role="alert" aria-live="assertive">
      <div className={`max-h-[calc(100dvh-1.5rem)] w-full overflow-y-auto rounded-2xl border border-amber-400/30 bg-slate-950/98 text-center text-white shadow-2xl ${isDownload ? "max-w-2xl p-6 sm:max-h-[calc(100dvh-4rem)] sm:p-12" : "max-w-sm p-3 sm:p-5"}`}>
        <div className={`mx-auto flex items-center justify-center rounded-full bg-amber-400/15 text-amber-300 ${isDownload ? "mb-5 size-16 sm:mb-6 sm:size-20" : "mb-2 size-9 sm:mb-3 sm:size-12"}`}>
          <AlertTriangle className={isDownload ? "size-9 sm:size-10" : "size-5 sm:size-6"} aria-hidden="true" />
        </div>
        <h2 className={isDownload ? "text-xl font-semibold sm:text-2xl" : "text-sm font-semibold sm:text-lg"}>Bloqueador de anuncios detectado</h2>
        <p className={isDownload ? "mx-auto mt-3 max-w-xl text-base leading-relaxed text-slate-300 sm:mt-4 sm:text-lg" : "mt-1.5 text-xs leading-relaxed text-slate-300 sm:mt-2 sm:text-sm"}>Desactiva tu bloqueador para reproducir este contenido y apoyar el mantenimiento del sitio.</p>
        <div className={isDownload ? "mt-5 flex items-center justify-center gap-2 text-sm text-slate-400 sm:mt-6 sm:text-base" : "mt-2 flex items-center justify-center gap-1.5 text-[10px] text-slate-400 sm:mt-4 sm:gap-2 sm:text-xs"}><ShieldCheck className={isDownload ? "size-5 shrink-0 text-emerald-400" : "size-3.5 shrink-0 text-emerald-400 sm:size-4"} aria-hidden="true" /> Tus datos permanecen protegidos.</div>
        <Button variant="outline" size={isDownload ? "default" : "sm"} className={isDownload ? "mt-7 border-white/20 bg-white/10 px-6 text-sm text-white hover:bg-white/20 hover:text-white sm:mt-8" : "mt-3 border-white/20 bg-white/10 text-xs text-white hover:bg-white/20 hover:text-white sm:mt-5"} onClick={retry}>
          <RefreshCw data-icon="inline-start" aria-hidden="true" /> Comprobar de nuevo
        </Button>
      </div>
    </div>
  )
}

// Declared for compatibility with extensions that inspect the app namespace.
declare global {
  interface Window {
    ldAnimesInternalAdBlocker?: boolean
  }
}

if (typeof window !== "undefined") window.ldAnimesInternalAdBlocker = true

export default AdBlockerDetector

