# Appwrite kurulumu

Bu uygulama React istemcisini ve Appwrite Cloud'u korur. `VITE_` ile başlayan değerler yalnızca endpoint/proje/koleksiyon kimliği gibi herkese açık değerlerdir; erişim anahtarları buraya yazılmaz.

## Koleksiyonlar

`portfolio_contents` koleksiyonunda aşağıdaki öznitelikleri oluşturun. Metin alanlarını isteğe bağlı yapın; `title`, `slug`, `description`, `contentType`, `sourceType`, `isFeatured`, `isPublished`, `isVisible` ve `displayOrder` zorunludur.

| Tür | Alanlar |
| --- | --- |
| string | title, slug, description, shortDescription, contentType, sourceType, sourceId, sourceUrl, embedUrl, playbackMode, thumbnailUrl, thumbnailFileId, repositoryUrl, liveDemoUrl, clientName, publishedAt, archivedAt, sourceSnapshot |
| string array | categories, tags, technologies, manualFields |
| boolean | isFeatured, isPublished, isVisible, showDownloadLink |
| integer | displayOrder, durationSeconds |

`site_settings` için `site-settings` kimlikli tek belge kullanın: `brandName`, `contactTitle`, `contactDescription`, `contactEmail`, `footerText`.

`social_links`: `label`, `platform`, `url`, `isVisible`, `displayOrder`.
`navigation_links`: `label`, `href`, `isVisible`, `displayOrder`.
`youtube_channels`: `name`, `channelId`, `channelUrl`, `ownerName`, `channelType`, `isActive`.

`portfolio_media` bucket'ında yalnızca görüntü/video MIME türlerine, makul boyut sınırına ve admin yazma iznine izin verin.

## İzinler

- Public kullanıcı: yalnızca yayımlanmış içerikleri okuyabilmelidir. Bu, ayrı bir public projection/Function veya belge düzeyi izin ile sağlanmalıdır.
- Giriş yapmış admin: koleksiyonlar ve media bucket üzerinde create/update/read yetkisine sahip olmalıdır.
- Silme yerine uygulama `archivedAt` alanını kullanır; kalıcı delete iznini vermeyin.
- Appwrite Console'da web platformuna production domain ve local development originlerini ekleyin.

Tek admin için Appwrite Console'da bu kullanıcıya özel ekip/role oluşturup yazma yetkisini o role verin. İstemci arayüzündeki giriş kontrolü tek başına yeterli değildir.

## Entegrasyon Function

`appwrite/functions/integrations` klasörünü Node 20+ Appwrite Function olarak dağıtın. Function değişkenleri:

- `GITHUB_TOKEN`: isteğe bağlı, server-side kişisel erişim anahtarı. OAuth uygulanacaksa tokenı Function tarafında saklayın.
- `YOUTUBE_API_KEY`: yalnızca server-side YouTube Data API anahtarı.

Function'ın execute iznini yalnızca admin ekibine verin. Bu Function kullanıcıya token, ham HTTP hata gövdesi veya stack trace döndürmez. GitHub/YouTube API'lerinin rate limit ve kota mesajlarını anlaşılır hale getirir.

## Eski içeriklerin taşınması

Mevcut `videos` ve `projects` kayıtlarını Appwrite Console veya admin üzerinden `portfolio_contents`a aktarın. Video için `sourceType=youtube`, proje için `sourceType=github`/`manual` seçin. Her kayıt önce `isPublished=false` ile taslak olarak girilmeli, sonra kontrol edilerek yayımlanmalıdır.

## MEGA

MEGA paylaşım URL'leri `sourceUrl` olarak kaydedilir ve varsayılan `playbackMode=external` kullanılır. Uygulama yalnızca YouTube/Vimeo allowlist'inden gelen iframe URL'lerini gömer. MEGA için doğrulanmış MP4/HLS adresi sağlanmadıkça dış bağlantı kartı gösterilir; dosyalar uygulama sunucusundan proxy'lenmez veya kopyalanmaz.
