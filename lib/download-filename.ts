export function getDownloadFilename(value: string) {
  try {
    const pathname = new URL(value).pathname
    const filename = decodeURIComponent(pathname.split("/").pop() ?? "").trim()
    return filename || "video.mp4"
  } catch {
    return "video.mp4"
  }
}
