const CODED_PREFIX = "v1_"

export function encodeVideoUrl(url: string): string {
  if (typeof window === "undefined") return url

  const bytes = new TextEncoder().encode(url)
  let binary = ""
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })

  return `${CODED_PREFIX}${btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "")}`
}

export function decodeVideoUrl(value: string | null): string | null {
  if (!value || !value.startsWith(CODED_PREFIX) || typeof window === "undefined") return value

  try {
    const base64 = value.slice(CODED_PREFIX.length).replace(/-/g, "+").replace(/_/g, "/")
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=")
    const binary = atob(padded)
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0))
    return new TextDecoder().decode(bytes)
  } catch {
    return value
  }
}

export function getVideoUrlParam(url: string, encode: boolean): string {
  return encode ? encodeVideoUrl(url) : url
}

export function decodeVideoUrlParam(value: string | null): string | null {
  return value ? decodeVideoUrl(value) : null
}
