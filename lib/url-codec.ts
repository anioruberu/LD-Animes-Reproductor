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
  if (!value || typeof window === "undefined") return value

  try {
    const encodedValue = value.startsWith(CODED_PREFIX) ? value.slice(CODED_PREFIX.length) : value
    const base64 = encodedValue.replace(/-/g, "+").replace(/_/g, "/")
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=")
    const binary = atob(padded)
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0))
    const decoded = new TextDecoder().decode(bytes)

    // Solo aceptar Base64 si el resultado es una URL; así las URLs normales siguen funcionando.
    return /^https?:\/\//i.test(decoded) ? decoded : value
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
