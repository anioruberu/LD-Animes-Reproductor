"use client"

import { useEffect } from "react"

type MonetagRouteAdsProps = {
  serviceWorkerPath: string
}

const SCRIPT_ID = "quge5-multiuse-283271"

export function MonetagRouteAds({ serviceWorkerPath }: MonetagRouteAdsProps) {
  useEffect(() => {
    if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement("script")
      script.id = SCRIPT_ID
      script.src = "https://quge5.com/88/tag.min.js"
      script.async = true
      script.dataset.zone = "283271"
      script.dataset.cfasync = "false"
      document.head.appendChild(script)
    }

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
