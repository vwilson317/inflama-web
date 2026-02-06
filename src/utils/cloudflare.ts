/**
 * Generates a public URL for an image stored in Cloudflare R2.
 *
 * Prefer using an Expo public env var so web builds can configure
 * the base URL without code changes:
 *
 *   EXPO_PUBLIC_IMAGE_BASE_URL=https://b2853b5750a1d01efcd157ea2501621d.r2.cloudflarestorage.com/inflama
 *
 * If that env var is not set, we fall back to a sane default based on
 * your current R2 S3 endpoint.
 */
export function getCloudflareImageUrl(imageKey: string): string {
  const rawBase =
    (typeof process !== 'undefined'
      ? ((process.env as any)
          .EXPO_PUBLIC_IMAGE_BASE_URL as string | undefined)
      : undefined) ??
    'https://pub-45afd9f825694e538736de72a58414c9.r2.dev';

  // Ensure no trailing slash so we don't end up with double slashes
  const base = rawBase.replace(/\/+$/, '');

  // Also strip any accidental leading slashes from the key
  const key = imageKey.replace(/^\/+/, '');

  return `${base}/${key}`;
}
