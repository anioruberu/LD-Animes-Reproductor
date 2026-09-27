'use client'

import { useEffect, useRef } from 'react'

const TOP_AD_SCRIPT_SRC = '//fond-appointment.com/buX/V.sAd/GylX0nYkWtc_/DeBmI9Fu_ZcUOl/knP/TwcU0RNjjHQow/OcDnk/tZN-zTQh2ON/D/Ar5xM/wf'
const BOTTOM_AD_SCRIPT_SRC = '//fond-appointment.com/bwXAV.s_dfGRlk0YY/WMca/ReTmy9PuZZ/UblCkgPQTxcp0/NGj/Q/xWN-DKUVt/NpzPQn2CNnDHEE0cOxQc'

const BOTTOM_AD_SCRIPT = `(function(uckco){
var d = document,
    s = d.createElement('script'),
    l = d.currentScript || d.scripts[d.scripts.length - 1];
s.settings = uckco || {};
s.src = "${BOTTOM_AD_SCRIPT_SRC}";
s.async = true;
s.referrerPolicy = 'no-referrer-when-downgrade';
l.parentNode.insertBefore(s, l);
})({})`

function BannerSlot({ label, scriptSrc, isBottom }: { label: string; scriptSrc: string; isBottom: boolean }) {
  const slotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const slot = slotRef.current
    if (!slot) return

    const script = document.createElement('script')
    script.async = true
    script.referrerPolicy = 'no-referrer-when-downgrade'

    if (isBottom) {
      script.textContent = BOTTOM_AD_SCRIPT
    } else {
      script.src = scriptSrc
      script.settings = {}
    }

    slot.appendChild(script)

    return () => {
      slot.replaceChildren()
    }
  }, [scriptSrc])

  return (
    <div ref={slotRef} className="flex h-full min-h-0 w-full items-center justify-center overflow-hidden" aria-label={label} />
  )
}

export function ViewerBannerAds({ position }: { position: 'top' | 'bottom' }) {
  const isTop = position === 'top'

  return (
    <div className="pointer-events-auto flex h-14 w-full shrink-0 items-center justify-center px-2 sm:h-16 sm:px-4">
      <BannerSlot
        label={isTop ? 'Publicidad superior' : 'Publicidad inferior'}
        scriptSrc={isTop ? TOP_AD_SCRIPT_SRC : BOTTOM_AD_SCRIPT_SRC}
        isBottom={!isTop}
      />
    </div>
  )
}

declare global {
  interface HTMLScriptElement {
    settings?: Record<string, never>
  }
}
