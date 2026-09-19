"use client"

import { useEffect, useState } from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"

type DownloadGateProps = {
  onDownload: () => void
  downloading: boolean
  accentClassName: string
  disabledClassName: string
}

const WAIT_SECONDS = 60

export function DownloadGate({
  onDownload,
  downloading,
  accentClassName,
  disabledClassName,
}: DownloadGateProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(WAIT_SECONDS)

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

  useEffect(() => {
    const scriptId = "quge5-multiuse-283271"
    if (document.getElementById(scriptId)) return

    const script = document.createElement("script")
    script.id = scriptId
    script.src = "https://quge5.com/88/tag.min.js"
    script.async = true
    script.dataset.zone = "283271"
    script.dataset.cfasync = "false"
    document.body.appendChild(script)

    return () => {
      script.remove()
    }
  }, [])

  const isLocked = remainingSeconds > 0 || downloading

  return (
    <div className="flex flex-col gap-3">
      <Button
        onClick={onDownload}
        disabled={isLocked}
        className={`w-full ${accentClassName} ${isLocked ? disabledClassName : ""} text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2`}
      >
        <Download className="h-5 w-5 fill-current" />
        {downloading
          ? "Descargando..."
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
