"use client"

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react"
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
  const [isChecking, setIsChecking] = useState(true)
  const [isBlocked, setIsBlocked] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const runDetection = useCallback(async () => {
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
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => void runDetection(), 900)
    return () => window.clearTimeout(timer)
  }, [runDetection])

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

export function AdBlockerNotice() {
  const { isBlocked, isChecking, retry } = useAdBlocker()
  if (isChecking || !isBlocked) return null
  return (
    <div className="absolute inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-black/85 p-2 backdrop-blur-sm sm:p-4" role="alert" aria-live="assertive">
      <div className="w-full max-w-sm max-h-full overflow-y-auto rounded-xl border border-amber-400/30 bg-slate-950/95 p-3 text-center text-white shadow-2xl sm:rounded-2xl sm:p-5">
        <div className="mx-auto mb-2 flex size-9 items-center justify-center rounded-full bg-amber-400/15 text-amber-300 sm:mb-3 sm:size-12">
          <AlertTriangle className="size-5 sm:size-6" aria-hidden="true" />
        </div>
        <h2 className="text-sm font-semibold sm:text-lg">Bloqueador de anuncios detectado</h2>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-300 sm:mt-2 sm:text-sm">Desactiva tu bloqueador para reproducir este contenido y apoyar el mantenimiento del sitio.</p>
        <div className="mt-2 flex items-center justify-center gap-1.5 text-[10px] text-slate-400 sm:mt-4 sm:gap-2 sm:text-xs"><ShieldCheck className="size-3.5 shrink-0 text-emerald-400 sm:size-4" aria-hidden="true" /> Tus datos permanecen protegidos.</div>
        <Button variant="outline" size="sm" className="mt-3 border-white/20 bg-white/10 text-xs text-white hover:bg-white/20 hover:text-white sm:mt-5" onClick={retry}>
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

