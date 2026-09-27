# LD Animes Reproductor

Aplicación web para reproducir videos y leer archivos PDF como manga. Incluye dos reproductores de video y dos visores PDF con estilos independientes, biblioteca local de progreso y flujos de descarga protegidos.

## Funciones principales

- Reproductor de video azul y reproductor naranja.
- Visor PDF azul (`/visor`) y visor naranja (`/visor2`).
- Lectura de manga de derecha a izquierda.
- Guardado local del progreso por archivo PDF para recuperar la última página visitada.
- Biblioteca local de mangas y videos.
- Soporte para URLs codificadas y proxy para archivos alojados en Hugging Face.
- Descargas con verificación mediante reCAPTCHA o Turnstile.
- Integración de analítica de Vercel.

## Rutas importantes

| Ruta | Uso |
| --- | --- |
| `/` | Página principal y generador de reproductor |
| `/reproductor` | Reproductor azul |
| `/reproductor2` | Reproductor naranja |
| `/visor` | Visor PDF azul |
| `/visor2` | Visor PDF naranja |
| `/descargar` | Flujo de descarga azul |
| `/descargar2` | Flujo de descarga naranja |
| `/verificar-descargar` | Verificación de descarga azul |
| `/verificar-descargar2` | Verificación de descarga naranja |

## Publicidad: tipos y proveedores

Actualmente el proyecto tiene **dos integraciones publicitarias**:

### 1. Monetag

- **Proveedor:** Monetag.
- **Tipo:** script publicitario de zona y registro de Service Worker.
- **Comportamiento:** se carga únicamente en los flujos de descarga (`/descargar` y `/descargar2`) y sus páginas de verificación. El formato concreto que entregue Monetag puede variar según la campaña, país, dispositivo y configuración de la zona; el código no dibuja un banner HTML propio.
- **Script:** `https://quge5.com/88/tag.min.js`.
- **Zona:** `283271`.
- **Service Workers:** `public/descargar/sw.js` y `public/descargar2/sw.js`.
- **Implementación:** `components/monetag-route-ads.tsx`.

### 2. Anuncio de video VAST

- **Proveedor configurado:** endpoint VAST externo de `troubled-entertainment.com`.
- **Tipo:** anuncio de video instream VAST; la aplicación solicita el XML, extrae un archivo MP4 o WebM y devuelve la URL compatible.
- **Endpoint interno:** `/api/vast-ad`.
- **Importante:** el proveedor y el formato dependen del XML remoto. La aplicación no incluye una red de banners ni Google AdSense configurado.

## Configuración requerida

Las variables de entorno se configuran desde Vercel:

- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
- `RECAPTCHA_SECRET_KEY`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY`
- `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL`

No se deben guardar claves secretas en el código ni en el repositorio.

## Desarrollo local

```bash
pnpm install
pnpm dev
```

Después, abre `http://localhost:3000`.

## Producción

```bash
pnpm build
pnpm start
```

## Tecnologías

- Next.js 16 y React 19.
- TypeScript.
- Tailwind CSS y componentes Radix UI.
- PDF.js para renderizar documentos PDF.
- Supabase JS para las funciones que lo requieren.
- Vercel Analytics.

## Notas de privacidad y mantenimiento

- El progreso y las bibliotecas del usuario se guardan en `localStorage` del navegador; no se sincronizan entre dispositivos.
- Los scripts publicitarios externos pueden establecer cookies, registrar eventos o redirigir según sus propias políticas. Antes de publicar, conviene revisar los términos del proveedor y mostrar el aviso de privacidad/cookies correspondiente.
- Las URLs de publicidad externas deben considerarse dependencias de terceros y comprobarse periódicamente.

## Licencia

No se ha definido una licencia de código abierto en este repositorio. Todos los derechos quedan reservados hasta que se publique una licencia explícita.
