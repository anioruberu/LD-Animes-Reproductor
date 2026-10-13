"use client"

import { useCallback, useEffect, useState } from "react"
import { AlertTriangle, Check, RefreshCw, ShieldCheck, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const VERIFIED_KEY = "ld-animes-adblock-verified"
const VERIFICATION_TTL = 24 * 60 * 60 * 1000

type DetectionResult = "blocked" | "clear"

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
  return elementBlocked && scriptBlocked ? "blocked" : "clear"
}

export function AdBlockerDetector() {
  const [isChecking, setIsChecking] = useState(true)
  const [isBlocked, setIsBlocked] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const runDetection = useCallback(async (ignoreCache = false) => {
    setIsChecking(true)
    if (!ignoreCache) {
      const verifiedAt = Number(window.localStorage.getItem(VERIFIED_KEY))
      if (verifiedAt && Date.now() - verifiedAt < VERIFICATION_TTL) {
        setIsBlocked(false)
        setIsChecking(false)
        return
      }
    }

    try {
      const result = await detectAdBlocker()
      const blocked = result === "blocked"
      setIsBlocked(blocked)
      if (!blocked) window.localStorage.setItem(VERIFIED_KEY, String(Date.now()))
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
    window.localStorage.removeItem(VERIFIED_KEY)
    setIsRefreshing(true)
    void runDetection(true)
  }

  if (isChecking || !isBlocked) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md" role="alertdialog" aria-modal="true" aria-labelledby="adblock-title" aria-describedby="adblock-description">
      <Card className="w-full max-w-md border-border/80 bg-background/95 shadow-2xl shadow-black/40">
        <CardHeader className="items-center text-center">
          <div className="mb-2 flex size-16 items-center justify-center rounded-full bg-amber-500/15 text-amber-500 ring-8 ring-amber-500/5">
            <AlertTriangle className="size-8" aria-hidden="true" />
          </div>
          <CardTitle id="adblock-title" className="text-2xl">Bloqueador detectado</CardTitle>
          <CardDescription id="adblock-description" className="max-w-sm text-base leading-relaxed">
            Detectamos una extensión que bloquea los anuncios. Desactívala para apoyar el mantenimiento de este servicio gratuito.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/40 p-3 text-sm text-muted-foreground">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
            <p>Tu privacidad y tus datos no se modifican. Solo necesitamos que permitas los anuncios de esta página.</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 sm:flex-row">
          <Button variant="outline" className="w-full sm:flex-1" onClick={handleRetry} disabled={isRefreshing}>
            <RefreshCw className={isRefreshing ? "animate-spin" : ""} data-icon="inline-start" aria-hidden="true" />
            {isRefreshing ? "Comprobando..." : "Comprobar de nuevo"}
          </Button>
          <Button variant="ghost" className="w-full sm:flex-1" onClick={() => setIsBlocked(false)}>
            <Check data-icon="inline-start" aria-hidden="true" />
            Continuar
          </Button>
        </CardFooter>
        <p className="flex items-center justify-center gap-1.5 px-6 pb-5 text-center text-xs text-muted-foreground">
          <X className="size-3.5" aria-hidden="true" />
          Puedes volver a activar tu bloqueador al terminar.
        </p>
      </Card>
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

