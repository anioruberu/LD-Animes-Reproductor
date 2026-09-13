const PRIVATE_REPOSITORY = "anioruberu/mp4"

type CloudflareRuntime = typeof globalThis & {
  env?: Record<string, string | undefined>
}

export function getHuggingFaceToken() {
  const runtime = globalThis as CloudflareRuntime
  return process.env.GokuPlay || runtime.env?.GokuPlay || ""
}

export function isPrivateHuggingFaceUrl(value: string) {
  try {
    const url = new URL(value)
    return url.hostname === "huggingface.co" && url.pathname.startsWith(`/anioruberu/mp4/`)
  } catch {
    return false
  }
}

export function getHuggingFaceProxyUrl(value: string) {
  return isPrivateHuggingFaceUrl(value) ? `/api/huggingface?url=${encodeURIComponent(value)}` : value
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
