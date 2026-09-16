# Hasan Av Dünyası

Düzova, KKTC'de av, outdoor ve kamp ekipmanları satan Hasan Av Dünyası'nın
katalog sitesi ve yönetim paneli. Sepet/ödeme yok — sipariş süreci telefon
ve WhatsApp üzerinden yürüyor.

İki parçalı bir monorepo:

| Klasör | Ne | Teknoloji |
|---|---|---|
| [`frontend/`](frontend) | Public site + `/admin` yönetim paneli | Next.js 16 (App Router), React 19, Tailwind v4 |
| [`backend/`](backend) | REST API + veritabanı | Laravel 13, SQLite |

`frontend`, backend'e hiç bağlanmadan da tek başına çalışır: `lib/api.ts`
tek veri kapısıdır ve `NEXT_PUBLIC_API_URL` tanımlı değilse otomatik olarak
`lib/mockData.ts`'teki örnek veriye düşer. Bu, arayüzü backend olmadan
geliştirmeyi/gözden geçirmeyi mümkün kılar.

## Gereksinimler

- Node.js ≥ 20.9 ve npm
- PHP ≥ 8.3 ve Composer

## Frontend'i çalıştırma

```sh
cd frontend
npm install
npm run dev
```

`http://localhost:3000` — backend olmadan, örnek verilerle açılır.

Diğer script'ler: `npm run build`, `npm run lint` (ESLint), `npm run typecheck`
(`tsc --noEmit`).

### Ortam değişkenleri

`frontend/.env.example`'ı kopyalayıp `.env.local` yap (git'e girmez):

| Değişken | Açıklama |
|---|---|
| `NEXT_PUBLIC_API_URL` | Tanımlıysa site ve admin panel bu adresteki Laravel API'ye bağlanır (ör. `http://localhost:8000/api/v1`). Tanımsızsa mock veri kullanılır ve admin panel "Backend bağlı değil" uyarısı gösterir. |

## Backend'i çalıştırma

```sh
cd backend
composer install
copy .env.example .env   # PowerShell: Copy-Item .env.example .env
php artisan key:generate
touch database\database.sqlite   # PowerShell: New-Item database\database.sqlite -ItemType File
php artisan migrate --seed
php artisan serve
```

`http://localhost:8000/api/v1/products` gibi uçlar açılır. Seed, örnek
kategori/marka/ürün verisiyle (`database/data/catalog.json`) ve birkaç demo
siparişle gelir — gerçek veri değildir.

Testler: `php artisan test` (veya `composer test`).

Frontend'i bu backend'e bağlamak için `frontend/.env.local` içine:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## Durum

Arayüz (public site + admin panel CRUD ekranları) tamamlanmış durumda.
Kimlik doğrulama, gerçek ürün içeriği/fotoğrafları ve canlıya alma
(deploy) altyapısı henüz eklenmedi — kodun içindeki `TODO` yorumları bu
noktaları işaretliyor (özellikle `frontend/lib/admin/session.ts` ve
`backend/routes/api.php`).
