"use client"

import { useState } from "react"
import { Turnstile } from "@marsidev/react-turnstile"
import { ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

type DownloadVerificationProps = {
  destination: string
  accentClassName: string
}

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

export function DownloadVerification({ destination, accentClassName }: DownloadVerificationProps) {
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const continueToDownload = async () => {
    if (!captchaToken || isVerifying) return

    setIsVerifying(true)
    setError(null)

    try {
      const response = await fetch("/api/validar-descarga", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: captchaToken, destination }),
      })
      const result = await response.json() as { authorized?: boolean; redirectUrl?: string; error?: string }

      if (!response.ok || !result.authorized || !result.redirectUrl) {
        throw new Error(result.error ?? "Verificación inválida")
      }

      window.location.assign(result.redirectUrl)
    } catch (verificationError) {
      console.error("[v0] Turnstile validation error:", verificationError)
      setCaptchaToken(null)
      setError("No se pudo verificar. Completa la casilla nuevamente.")
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 text-white">
        <ShieldCheck className="h-6 w-6 text-emerald-400" aria-hidden="true" />
        <div>
          <h2 className="font-semibold">Verificación de seguridad</h2>
          <p className="text-sm text-slate-400">Confirma que eres una persona para continuar.</p>
        </div>
      </div>

      {siteKey ? (
        <div className="flex justify-center rounded-lg border border-slate-700 bg-slate-950/60 p-4">
          <Turnstile
            siteKey={siteKey}
            onSuccess={(token) => {
              setCaptchaToken(token)
              setError(null)
            }}
            onExpire={() => setCaptchaToken(null)}
            onError={() => {
              setCaptchaToken(null)
              setError("No se pudo cargar Turnstile.")
            }}
          />
        </div>
      ) : (
        <p className="rounded-lg border border-red-900/60 bg-red-950/30 p-3 text-sm text-red-200" role="alert">
          La verificación Turnstile no está configurada.
        </p>
      )}

      {error && <p className="text-center text-sm text-red-300" role="alert">{error}</p>}

      <Button
        type="button"
        onClick={continueToDownload}
        disabled={!captchaToken || isVerifying || !siteKey}
        className={`w-full ${accentClassName} text-white font-semibold py-3 disabled:cursor-not-allowed disabled:opacity-50`}
      >
        {isVerifying ? "Verificando..." : "Verificar y continuar a la descarga"}
      </Button>
    </div>
  )
}
