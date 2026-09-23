import { NextRequest } from "next/server"
import { getHuggingFaceToken } from "@/lib/huggingface"

export const runtime = "edge"

function isAllowedTarget(value: string) {
  try {
    return new URL(value).protocol === "https:"
  } catch {
    return false
  }
}

function isHuggingFaceTarget(value: string) {
  try {
    const hostname = new URL(value).hostname
    return hostname === "huggingface.co" || hostname.endsWith(".huggingface.co")
  } catch {
    return false
  }
}

export async function GET(request: NextRequest) {
  const targetValue = request.nextUrl.searchParams.get("url")
  const token = getHuggingFaceToken()

  if (!targetValue || !isAllowedTarget(targetValue)) {
    return new Response("Not found", { status: 404 })
  }

  const target = new URL(targetValue)
  if (isHuggingFaceTarget(targetValue)) {
    target.searchParams.set("download", "true")
  }
  const range = request.headers.get("range")
  const upstreamHeaders: Record<string, string> = {
    ...(range ? { Range: range } : {}),
  }
  if (token && isHuggingFaceTarget(targetValue)) {
    upstreamHeaders.Authorization = `Bearer ${token}`
  }

  let upstream: Response
  try {
    upstream = await fetch(target, {
    headers: upstreamHeaders,
    redirect: "follow",
    cache: "no-store",
    })
  } catch {
    return new Response("Unable to reach Hugging Face", { status: 502 })
  }

  if (!upstream.ok && upstream.status !== 206) {
    return new Response("Unable to fetch private video", { status: upstream.status })
  }

  const responseHeaders = new Headers()
  for (const name of ["content-type", "content-length", "content-range", "accept-ranges", "content-disposition", "etag", "last-modified"]) {
    const value = upstream.headers.get(name)
    if (value) responseHeaders.set(name, value)
  }

  // Algunos enlaces de resolución entregan octet-stream aunque el archivo sea PDF.
  // PDF.js necesita una respuesta binaria consistente para poder leerla.
  if (target.pathname.toLowerCase().endsWith(".pdf") && !responseHeaders.has("content-type")) {
    responseHeaders.set("content-type", "application/pdf")
  }
  responseHeaders.set("Cache-Control", "private, no-store")
  responseHeaders.set("Access-Control-Allow-Origin", "*")
  responseHeaders.set("Access-Control-Expose-Headers", "Content-Length, Content-Range, Accept-Ranges, Content-Disposition")

  return new Response(upstream.body, {
    status: upstream.status,
    headers: responseHeaders,
  })
}

export async function HEAD(request: NextRequest) {
  const response = await GET(request)
  return new Response(null, { status: response.status, headers: response.headers })
}
