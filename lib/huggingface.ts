const PRIVATE_REPOSITORY = "anioruberu/mp4"

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
