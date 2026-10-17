import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Pars Medya',
    short_name: 'Pars Medya',
    description: 'Web, yazılım ve dijital dönüşüm çözümleri.',
    start_url: '/',
    scope: '/',
    lang: 'tr',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#101b33',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  }
}
