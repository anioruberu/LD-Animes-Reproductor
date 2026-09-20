import { NextResponse } from "next/server"

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify"
const ALLOWED_DESTINATIONS = new Set(["/descargar", "/descargar2"])

function getAuthorizedDestination(destination: string) {
  try {
    const url = new URL(destination, "https://reproductor.ldanimes.xyz")
    if (!ALLOWED_DESTINATIONS.has(url.pathname) || url.origin !== "https://reproductor.ldanimes.xyz") return null
    url.searchParams.set("verified", "1")
    return `${url.pathname}?${url.searchParams.toString()}`
  } catch {
    return null
  }
}

export async function POST(request: Request) {
  const secretKey = process.env.TURNSTILE_SECRET_KEY

  if (!secretKey) {
    console.error("[v0] TURNSTILE_SECRET_KEY no está configurada")
    return NextResponse.json({ authorized: false, error: "Servicio no configurado" }, { status: 503 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ authorized: false, error: "Solicitud inválida" }, { status: 400 })
  }

  const token = typeof body === "object" && body !== null && "token" in body
    ? (body as { token?: unknown }).token
    : null
  const destination = typeof body === "object" && body !== null && "destination" in body
    ? (body as { destination?: unknown }).destination
    : null

  if (typeof token !== "string" || token.length === 0 || token.length > 4096) {
    return NextResponse.json({ authorized: false, error: "Token inválido" }, { status: 400 })
  }

  if (typeof destination !== "string") {
    return NextResponse.json({ authorized: false, error: "Destino inválido" }, { status: 400 })
  }

  const authorizedDestination = getAuthorizedDestination(destination)
  if (!authorizedDestination) {
    return NextResponse.json({ authorized: false, error: "Destino inválido" }, { status: 400 })
  }

  const formData = new URLSearchParams({ secret: secretKey, response: token })

  try {
    const verificationResponse = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData,
      cache: "no-store",
    })
    const verification = await verificationResponse.json() as { success?: boolean }

    if (!verificationResponse.ok || verification.success !== true) {
      return NextResponse.json({ authorized: false, error: "Verificación inválida" }, { status: 400 })
    }

    return NextResponse.json({ authorized: true, redirectUrl: authorizedDestination })
  } catch (error) {
    console.error("[v0] Turnstile request error:", error)
    return NextResponse.json({ authorized: false, error: "Error de verificación" }, { status: 502 })
  }
}
