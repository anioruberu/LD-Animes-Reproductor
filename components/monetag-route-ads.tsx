"use client"

import { useEffect } from "react"

type MonetagRouteAdsProps = {
  serviceWorkerPath: string
}

export function MonetagRouteAds({ serviceWorkerPath }: MonetagRouteAdsProps) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register(serviceWorkerPath, { scope: `${serviceWorkerPath.replace(/\/sw\.js$/, "/")}` }).catch((error) => {
        console.error("[v0] Monetag service worker registration failed:", error)
      })
    }
  }, [serviceWorkerPath])

  return null
}
