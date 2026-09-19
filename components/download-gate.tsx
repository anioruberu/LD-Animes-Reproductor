"use client"

import { useEffect, useState } from "react"
import { Turnstile } from "@marsidev/react-turnstile"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

if (!TURNSTILE_SITE_KEY) {
  console.warn("[v0] NEXT_PUBLIC_TURNSTILE_SITE_KEY no está configurada")
}

type DownloadGateProps = {
  onDownload: () => void | Promise<void>
  downloading: boolean
  accentClassName: string
  disabledClassName: string
}

const WAIT_SECONDS = 60

async function validateTurnstileToken(token: string) {
  const response = await fetch("/api/validar-descarga", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  })

  if (!response.ok) {
    throw new Error("No se pudo validar la verificación")
  }

  return response.json() as Promise<{ success: boolean }>
}

export function DownloadGate({
  onDownload,
  downloading,
  accentClassName,
  disabledClassName,
}: DownloadGateProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(WAIT_SECONDS)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [verifying, setVerifying] = useState(false)
  const [verificationError, setVerificationError] = useState<string | null>(null)

  useEffect(() => {
    let lastTick = Date.now()

    const tick = () => {
      if (document.visibilityState !== "visible") {
        lastTick = Date.now()
        return
      }

      const elapsedSeconds = Math.floor((Date.now() - lastTick) / 1000)
      if (elapsedSeconds < 1) return

      lastTick += elapsedSeconds * 1000
      setRemainingSeconds((current) => Math.max(0, current - elapsedSeconds))
    }

    const interval = window.setInterval(tick, 250)
    document.addEventListener("visibilitychange", tick)

    return () => {
      window.clearInterval(interval)
      document.removeEventListener("visibilitychange", tick)
    }
  }, [])

  const isLocked = remainingSeconds > 0 || downloading || verifying || !turnstileToken

  const handleDownloadClick = async () => {
    if (!turnstileToken || isLocked) return

    setVerifying(true)
    setVerificationError(null)

    try {
      const result = await validateTurnstileToken(turnstileToken)
      if (!result.success) throw new Error("Verificación rechazada")
      await onDownload()
    } catch (error) {
      console.error("[v0] Turnstile validation error:", error)
      setTurnstileToken(null)
      setVerificationError("No se pudo verificar. Completa la casilla nuevamente.")
    } finally {
      setVerifying(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {TURNSTILE_SITE_KEY ? (
        <div className="flex justify-center rounded-lg bg-slate-900/60 p-3" aria-label="Verificación de seguridad">
          <Turnstile
            siteKey={TURNSTILE_SITE_KEY}
            onSuccess={(token) => {
              setTurnstileToken(token)
              setVerificationError(null)
            }}
            onExpire={() => setTurnstileToken(null)}
            onError={() => {
              setTurnstileToken(null)
              setVerificationError("No se pudo cargar la verificación.")
            }}
          />
        </div>
      ) : null}
      {verificationError && (
        <p className="text-center text-sm text-red-300" role="alert">{verificationError}</p>
      )}
      <Button
        onClick={handleDownloadClick}
        disabled={isLocked}
        className={`w-full ${accentClassName} ${isLocked ? disabledClassName : ""} text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2`}
      >
        <Download className="h-5 w-5 fill-current" />
        {downloading
          ? "Descargando..."
          : verifying
            ? "Verificando..."
            : remainingSeconds > 0
              ? `Espera ${remainingSeconds} segundos para descargar`
              : "Descargar Ahora"}
      </Button>
      {remainingSeconds > 0 && (
        <p className="text-center text-sm text-gray-400" role="status" aria-live="polite">
          Mantén esta página abierta durante un minuto. La cuenta se pausa si cambias de pestaña.
        </p>
      )}
    </div>
  )
}
