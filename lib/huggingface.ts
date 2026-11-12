const PRIVATE_REPOSITORY = "anioruberu/mp4"

export function isPrivateHuggingFaceUrl(value: string) {
  try {
    const url = new URL(value)
    return url.hostname === "huggingface.co" && url.pathname.startsWith(`/anioruberu/mp4/`)
  } catch {
    return false
  }
}

export function isHuggingFaceUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === "https:" && (url.hostname === "huggingface.co" || url.hostname.endsWith(".huggingface.co"))
  } catch {
    return false
  }
}

export function getHuggingFaceProxyUrl(value: string) {
  // El canvas de PDF.js necesita CORS; pasar cualquier URL HTTPS por el proxy.
  // El proxy solo adjunta el token cuando el destino es Hugging Face.
  try {
    const url = new URL(value)
    return url.protocol === "https:" ? `/api/huggingface?url=${encodeURIComponent(value)}` : value
  } catch {
    return value
  }
}

export function isPrivateRepositoryPath(value: string) {
  try {
    const url = new URL(value)
    return url.hostname === "huggingface.co" && url.pathname.startsWith(`/anioruberu/mp4/`)
  } catch {
    return false
  }
}

export { PRIVATE_REPOSITORY }
