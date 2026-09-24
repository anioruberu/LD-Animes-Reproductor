"use client"

import { useEffect } from "react"

type MonetagRouteAdsProps = {
  serviceWorkerPath: string
}

const SCRIPT_SRC = "https://quge5.com/88/tag.min.js"
const ZONE = "283271"

export function MonetagRouteAds({ serviceWorkerPath }: MonetagRouteAdsProps) {
  useEffect(() => {
    const scriptId = `monetag-${serviceWorkerPath.replace(/[^a-z0-9]/gi, "-")}`
    const existingScript = document.getElementById(scriptId)
    existingScript?.remove()

    const script = document.createElement("script")
    script.id = scriptId
    script.src = `${SCRIPT_SRC}?v=${Date.now()}`
    script.async = true
    script.dataset.zone = ZONE
    script.dataset.cfasync = "false"
    script.onload = () => console.log(`[v0] Monetag loaded for ${serviceWorkerPath}`)
    script.onerror = () => console.error(`[v0] Monetag failed to load for ${serviceWorkerPath}`)
    document.body.appendChild(script)

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register(serviceWorkerPath, {
        scope: `${serviceWorkerPath.replace(/\/sw\.js$/, "/")}`,
        updateViaCache: "none",
      }).catch((error) => {
        console.error("[v0] Monetag service worker registration failed:", error)
      })
    }
  }, [serviceWorkerPath])

  return null
}
