export type PlaylistItem = {
  url: string
  subtitlesUrl?: string
  title?: string
}

const PREFIX = "v1_"

function toBase64Url(value: string) {
  const bytes = new TextEncoder().encode(value)
  let binary = ""
  bytes.forEach((byte) => { binary += String.fromCharCode(byte) })
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "")
}

function fromBase64Url(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=")
  const binary = atob(base64)
  return new TextDecoder().decode(Uint8Array.from(binary, (character) => character.charCodeAt(0)))
}

export function encodePlaylist(items: PlaylistItem[]) {
  return `${PREFIX}${toBase64Url(JSON.stringify(items))}`
}

export function decodePlaylist(value: string | null): PlaylistItem[] {
  if (!value) return []
  try {
    const parsed = JSON.parse(fromBase64Url(value.startsWith(PREFIX) ? value.slice(PREFIX.length) : value))
    if (!Array.isArray(parsed)) return []
    return parsed.filter((item): item is PlaylistItem => typeof item?.url === "string" && item.url.length > 0)
  } catch {
    return []
  }
}

export function getVideoTitle(url: string) {
  try {
    return decodeURIComponent(url.split("/").pop()?.split("?")[0] || url).replace(/\.(mp4|mkv|webm|avi|mov)$/i, "")
  } catch {
    return url
  }
}

export const PLAYLIST_STORAGE_KEY = "ld-animes-video-library"
export const readVideoLibrary = (): PlaylistItem[] => {
  if (typeof window === "undefined") return []
  try { return JSON.parse(localStorage.getItem(PLAYLIST_STORAGE_KEY) || "[]") } catch { return [] }
}
export const writeVideoLibrary = (items: PlaylistItem[]) => localStorage.setItem(PLAYLIST_STORAGE_KEY, JSON.stringify(items))

export function isCompatibleVideo(url: string) {
  return Boolean(url.includes("pixeldrain.com") || url.includes("huggingface.co") || url.includes("player.zilla-networks.com") || url.includes(".m3u8") || url.match(/\.(mp4|mkv|webm|avi|mov)(\?.*)?$/i))
}
