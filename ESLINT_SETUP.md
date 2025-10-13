# ESLint Deployment Safety Setup

Bu doküman, uygulamanızın ESLint sisteminin Vercel deploy gibi çalışacak şekilde nasıl yapılandırıldığını açıklar.

## 🎯 Amaç

- Deploy sırasında hata verecek hataları yakalamak
- `pnpm build` sırasında hataları göstermek
- Mümkünse compile time'de hataları göstermek
- Vercel deploy davranışını taklit etmek

## ✅ Yapılandırılan Özellikler

### 1. ESLint Konfigürasyonu (`eslint.config.mjs`)
- **Strict kurallar**: Deploy'u engelleyecek hatalar
- **TypeScript kuralları**: `any` kullanımı, kullanılmayan değişkenler
- **React kuralları**: JSX hataları, deprecated özellikler
- **Next.js kuralları**: Image optimizasyonu, güvenlik
- **Genel kurallar**: Console, alert, debugger kullanımı

### 2. Package.json Scripts
```json
{
  "build": "pnpm type-check && pnpm lint && next build",
  "lint": "next lint --max-warnings=0",
  "type-check": "tsc --noEmit",
  "check-all": "pnpm type-check && pnpm lint",
  "pre-commit": "pnpm check-all"
}
```

### 3. Next.js Konfigürasyonu (`next.config.ts`)
```typescript
{
  eslint: { ignoreDuringBuilds: false },
  typescript: { ignoreBuildErrors: false },
  reactStrictMode: true
}
```

### 4. Pre-commit Hooks (Husky)
- Git commit öncesi otomatik kontrol
- Staged dosyalarda linting
- TypeScript type checking

## 🚨 Yakalanan Hata Türleri

### Errors (Deploy'u Engeller)
- `@typescript-eslint/no-explicit-any` - `any` kullanımı
- `@typescript-eslint/no-non-null-assertion` - Non-null assertion (`!`)
- `no-alert` - `alert()` kullanımı
- `no-empty` - Boş bloklar
- `no-extra-semi` - Gereksiz noktalı virgül
- `@next/next/no-img-element` - `<img>` yerine `<Image>` kullanımı
- `react/no-unknown-property` - Bilinmeyen JSX özellikleri

### Warnings (Uyarılar)
- `no-console` - `console.log` kullanımı
- `unused-imports/no-unused-imports` - Kullanılmayan import'lar
- `react-hooks/exhaustive-deps` - Eksik dependency'ler

## 📋 Kullanım

### Build Öncesi Kontrol
```bash
pnpm check-all
```

### Otomatik Düzeltme
```bash
pnpm lint:fix
```

### Pre-commit Kontrolü
```bash
pnpm pre-commit
```

### Husky Kurulumu
```bash
pnpm setup-husky
```

## 🔧 Mevcut Hatalar

Sistem şu anda aşağıdaki hataları tespit ediyor:

1. **Console Statements**: 50+ dosyada `console.log` kullanımı
2. **Alert Statements**: 8 dosyada `alert()` kullanımı
3. **Image Optimization**: 10+ dosyada `<img>` yerine `<Image>` kullanımı
4. **Non-null Assertions**: 3 dosyada `!` operatörü kullanımı
5. **Empty Blocks**: 3 dosyada boş bloklar
6. **Extra Semicolons**: 1 dosyada gereksiz noktalı virgül

## 🚀 Deploy Güvenliği

Artık sisteminiz:
- ✅ Deploy sırasında hata verir
- ✅ `pnpm build` sırasında hataları gösterir
- ✅ Pre-commit sırasında hataları yakalar
- ✅ TypeScript type checking yapar
- ✅ Vercel benzeri davranış sergiler

## 📝 Sonraki Adımlar

1. Mevcut hataları düzeltin:
   ```bash
   pnpm lint:fix  # Otomatik düzeltilebilen hatalar
   ```

2. Manuel düzeltme gereken hatalar:
   - Console statements'ları kaldırın
   - Alert'leri toast notification'larla değiştirin
   - `<img>` tag'lerini `<Image>` ile değiştirin
   - Non-null assertion'ları güvenli kontrollerle değiştirin

3. Pre-commit hook'larını test edin:
   ```bash
   git add .
   git commit -m "test commit"
   ```

Bu sistem sayesinde artık deploy etmeden önce tüm hatalar yakalanacak ve düzeltilecek!
