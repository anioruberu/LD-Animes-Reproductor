import { NextResponse } from "next/server"

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify"

export async function POST(request: Request) {
  const secretKey = process.env.TURNSTILE_SECRET_KEY

  if (!secretKey) {
    console.error("[v0] TURNSTILE_SECRET_KEY no está configurada")
    return NextResponse.json({ success: false, error: "Servicio no configurado" }, { status: 503 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: "Solicitud inválida" }, { status: 400 })
  }

  const token = typeof body === "object" && body !== null && "token" in body
    ? (body as { token?: unknown }).token
    : null

  if (typeof token !== "string" || token.length === 0 || token.length > 2048) {
    return NextResponse.json({ success: false, error: "Token inválido" }, { status: 400 })
  }

  const formData = new URLSearchParams({
    secret: secretKey,
    response: token,
  })

  try {
    const verificationResponse = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData,
      cache: "no-store",
    })

    const verification = await verificationResponse.json() as { success?: boolean }

    if (!verificationResponse.ok || verification.success !== true) {
      return NextResponse.json({ success: false }, { status: 403 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Turnstile request error:", error)
    return NextResponse.json({ success: false, error: "Error de verificación" }, { status: 502 })
  }
}
