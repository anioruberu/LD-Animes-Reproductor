"use client"

import { useEffect } from "react"

type MonetagRouteAdsProps = {
  serviceWorkerPath: string
}

export function MonetagRouteAds({ serviceWorkerPath }: MonetagRouteAdsProps) {
  useEffect(() => {
    const existingMeta = document.querySelector('meta[name="monetag"]')
    if (!existingMeta) {
      const meta = document.createElement("meta")
      meta.name = "monetag"
      meta.content = "0d58a85eb8a1f5d43be7464494ba925e"
      document.head.appendChild(meta)
    }

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register(serviceWorkerPath, { scope: `${serviceWorkerPath.replace(/\/sw\.js$/, "/")}` }).catch((error) => {
        console.error("[v0] Monetag service worker registration failed:", error)
      })
    }
  }, [serviceWorkerPath])

  return null
}
