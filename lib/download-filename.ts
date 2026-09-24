export function getDownloadFilename(value: string) {
  try {
    const pathname = new URL(value).pathname
    const filename = decodeURIComponent(pathname.split("/").pop() ?? "").trim()
    return filename || "archivo.bin"
  } catch {
    return "archivo.bin"
  }
}
