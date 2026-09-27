'use client'

import { useEffect, useRef } from 'react'

const AD_SCRIPT_SRC = '//fond-appointment.com/buX/V.sAd/GylX0nYkWtc_/DeBmI9Fu_ZcUOl/knP/TwcU0RNjjHQow/OcDnk/tZN-zTQh2ON/D/Ar5xM/wf'

function BannerSlot({ label }: { label: string }) {
  const slotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const slot = slotRef.current
    if (!slot) return

    const script = document.createElement('script')
    script.async = true
    script.referrerPolicy = 'no-referrer-when-downgrade'
    script.src = AD_SCRIPT_SRC
    script.settings = {}
    slot.appendChild(script)

    return () => {
      slot.replaceChildren()
    }
  }, [])

  return (
    <div ref={slotRef} className="flex h-full min-h-0 w-full items-center justify-center overflow-hidden" aria-label={label} />
  )
}

export function ViewerBannerAds() {
  return (
    <>
      <div className="pointer-events-auto absolute inset-x-0 top-8 z-[5] h-14 px-2 sm:h-16 sm:px-4">
        <BannerSlot label="Publicidad superior" />
      </div>
      <div className="pointer-events-auto absolute inset-x-0 bottom-0 z-[5] h-14 px-2 sm:h-16 sm:px-4">
        <BannerSlot label="Publicidad inferior" />
      </div>
    </>
  )
}

declare global {
  interface HTMLScriptElement {
    settings?: Record<string, never>
  }
}
