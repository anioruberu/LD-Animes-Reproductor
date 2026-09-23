import { NextResponse } from "next/server"

const VAST_URL = "https://troubled-entertainment.com/d.mlFAzvdVGZNKvcZvG_Ux/ueum/9xuhZLUDltkUPFT/cs0fN/TDEGyHNZDdEXtJN/zVQ/1nMtTNIr0aN-Qz"

export async function GET() {
  try {
    const response = await fetch(VAST_URL, {
      headers: { Accept: "application/xml,text/xml;q=0.9,*/*;q=0.8" },
      cache: "no-store",
    })

    if (!response.ok) {
      return NextResponse.json({ error: "No se pudo obtener el anuncio" }, { status: 502 })
    }

    const vast = await response.text()
    const mediaFiles = [...vast.matchAll(/<MediaFile[^>]*type=["']video\/(?:mp4|webm)["'][^>]*>\s*<!\[CDATA\[\s*([^\s]+)\s*\]\]>/gi)]
    const mediaUrl = mediaFiles
      .map((match) => match[1])
      .find((url) => url.endsWith(".mp4")) ?? mediaFiles[0]?.[1]

    if (!mediaUrl || !/^https:\/\//i.test(mediaUrl)) {
      return NextResponse.json({ error: "El anuncio no contiene un video compatible" }, { status: 502 })
    }

    return NextResponse.json({ mediaUrl })
  } catch {
    return NextResponse.json({ error: "Error al cargar el anuncio" }, { status: 502 })
  }
}
