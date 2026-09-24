export type MangaLibraryItem = {
  url: string
  title?: string
}

export const MANGA_LIBRARY_STORAGE_KEY = "ld-animes-manga-library"
export const MANGA_PROGRESS_STORAGE_KEY = "ld-animes-manga-progress"

function getProgressMap(): Record<string, number> {
  if (typeof window === "undefined") return {}
  try {
    const value = JSON.parse(localStorage.getItem(MANGA_PROGRESS_STORAGE_KEY) || "{}")
    return value && typeof value === "object" ? value : {}
  } catch {
    return {}
  }
}

export function readMangaProgress(url: string) {
  const page = getProgressMap()[url]
  return typeof page === "number" && page > 0 ? page : 1
}

export function saveMangaProgress(url: string, page: number) {
  localStorage.setItem(MANGA_PROGRESS_STORAGE_KEY, JSON.stringify({ ...getProgressMap(), [url]: page }))
}

export function getMangaTitle(url: string) {
  try {
    return decodeURIComponent(url.split("/").pop()?.split("?")[0] || url).replace(/\.(pdf)$/i, "")
  } catch {
    return url
  }
}

export function readMangaLibrary(): MangaLibraryItem[] {
  if (typeof window === "undefined") return []
  try {
    const value = JSON.parse(localStorage.getItem(MANGA_LIBRARY_STORAGE_KEY) || "[]")
    return Array.isArray(value) ? value.filter((item) => typeof item?.url === "string" && item.url) : []
  } catch {
    return []
  }
}

export function writeMangaLibrary(items: MangaLibraryItem[]) {
  localStorage.setItem(MANGA_LIBRARY_STORAGE_KEY, JSON.stringify(items))
}

export function saveMangaToLibrary(url: string, title?: string) {
  const items = readMangaLibrary().filter((item) => item.url !== url)
  writeMangaLibrary([...items, { url, title: title || getMangaTitle(url) }])
}
