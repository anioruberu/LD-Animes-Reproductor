"use client"

import { useEffect, useState } from "react"
import ReCAPTCHA from "react-google-recaptcha"
import { ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

type DownloadVerificationProps = {
  destination: string
  accentClassName: string
}

const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

export function DownloadVerification({ destination, accentClassName }: DownloadVerificationProps) {
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(10)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (secondsLeft === 0) return

    const timer = window.setInterval(() => {
      setSecondsLeft((current) => Math.max(0, current - 1))
    }, 1000)

    return () => window.clearInterval(timer)
  }, [secondsLeft])

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
      console.error("[v0] reCAPTCHA validation error:", verificationError)
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
        <div className="mx-auto flex h-[78px] w-[304px] items-center justify-center overflow-hidden rounded-lg border border-slate-700 bg-slate-950/60">
          <ReCAPTCHA
            sitekey={siteKey}
            onChange={(token) => {
              setCaptchaToken(token)
              setError(null)
            }}
            onExpired={() => setCaptchaToken(null)}
            onErrored={() => {
              setCaptchaToken(null)
              setError("No se pudo cargar reCAPTCHA.")
            }}
          />
        </div>
      ) : (
        <p className="rounded-lg border border-red-900/60 bg-red-950/30 p-3 text-sm text-red-200" role="alert">
          La verificación no está configurada.
        </p>
      )}

      {error && <p className="text-center text-sm text-red-300" role="alert">{error}</p>}

      {secondsLeft > 0 && (
        <p className="text-center text-sm text-slate-400" aria-live="polite">
          Podrás continuar en {secondsLeft}{" "}{secondsLeft === 1 ? "segundo" : "segundos"}.
        </p>
      )}

      <Button
        type="button"
        onClick={continueToDownload}
        disabled={!captchaToken || isVerifying || !siteKey || secondsLeft > 0}
        className={`w-full ${accentClassName} text-white font-semibold py-3 disabled:cursor-not-allowed disabled:opacity-50`}
      >
        {isVerifying
          ? "Verificando..."
          : secondsLeft > 0
            ? `Esperar ${secondsLeft}s`
            : "Verificar y continuar a la descarga"}
      </Button>
    </div>
  )
}
