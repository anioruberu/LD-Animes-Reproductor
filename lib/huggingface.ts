const PRIVATE_REPOSITORY = "anioruberu/mp4"

export function getHuggingFaceToken() {
  const runtime = globalThis as typeof globalThis & {
    __env__?: Record<string, string | undefined>
  }

  return process.env.GokuPlay || runtime.__env__?.GokuPlay || ""
}

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
  return isHuggingFaceUrl(value) ? `/api/huggingface?url=${encodeURIComponent(value)}` : value
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
