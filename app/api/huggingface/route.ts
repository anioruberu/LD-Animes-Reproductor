import { NextRequest } from "next/server"

const PRIVATE_PREFIX = "/anioruberu/mp4/"

function isAllowedTarget(value: string) {
  try {
    const target = new URL(value)
    return target.protocol === "https:" && target.hostname === "huggingface.co" && target.pathname.startsWith(PRIVATE_PREFIX)
  } catch {
    return false
  }
}

export async function GET(request: NextRequest) {
  const targetValue = request.nextUrl.searchParams.get("url")
  const token = process.env.GokuPlay

  if (!targetValue || !token || !isAllowedTarget(targetValue)) {
    return new Response("Not found", { status: 404 })
  }

  const target = new URL(targetValue)
  target.searchParams.set("download", "true")
  const headers = new Headers()
  const range = request.headers.get("range")
  if (range) headers.set("range", range)

  const upstream = await fetch(target, {
    headers: {
      Authorization: `Bearer ${token}`,
      ...(range ? { Range: range } : {}),
    },
    redirect: "follow",
    cache: "no-store",
  })

  if (!upstream.ok && upstream.status !== 206) {
    return new Response("Unable to fetch private video", { status: upstream.status })
  }

  const responseHeaders = new Headers()
  for (const name of ["content-type", "content-length", "content-range", "accept-ranges", "content-disposition", "etag", "last-modified"]) {
    const value = upstream.headers.get(name)
    if (value) responseHeaders.set(name, value)
  }
  responseHeaders.set("Cache-Control", "private, no-store")
  responseHeaders.set("Access-Control-Allow-Origin", "*")

  return new Response(upstream.body, {
    status: upstream.status,
    headers: responseHeaders,
  })
}

export async function HEAD(request: NextRequest) {
  const response = await GET(request)
  return new Response(null, { status: response.status, headers: response.headers })
}
