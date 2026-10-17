# Pars Medya

Pars Medya web sitesi (https://parsmedya.net): Next.js (App Router), TypeScript, Tailwind CSS ve Supabase.

- Türkçe sayfalar `/`, İngilizce sayfalar `/en` altında.
- Yönetim paneli `/admin`; blog, iletişim mesajları, analitik ve yerel SEO verileri Supabase'de.

## Geliştirme

```bash
pnpm install
pnpm dev
```

`.env.example` dosyasını `.env.local` olarak kopyalayıp Supabase bilgilerini girin. Supabase anahtarları yoksa site çalışır ama blog boş görünür.

## Kontroller

```bash
pnpm exec tsc --noEmit
pnpm lint
pnpm test
pnpm build
```

## Yayın

Site cPanel (Alastyr) üzerinde Phusion Passenger ile çalışır. `main` dalına merge etmek yayın başlatmaz. Yayın, GitHub Actions'taki **Production Deploy** iş akışıyla (`workflow_dispatch`) ya da admin panelindeki "Güncellemeyi Kur" ile elle başlatılır. İş akışı build alır, `.next/standalone` çıktısını sunucuya yükler, Passenger'ı yeniden başlatır ve sağlık kontrollerini çalıştırır. Sunucu bilgileri GitHub Actions secret'larında tutulur.
