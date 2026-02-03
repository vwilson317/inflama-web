/**
 * Cloudflare R2 configuration
 */
const CLOUDFLARE_ACCOUNT_ID = 'b2853b5750a1d01efcd157ea2501621d';
const CLOUDFLARE_BUCKET_NAME = 'inflama';

/**
 * Generates a public URL for an image stored in Cloudflare R2
 * @param imageKey - The key/path of the image in the R2 bucket (e.g., 'profiles/image.jpg')
 * @returns The public URL for the image
 */
export function getCloudflareImageUrl(imageKey: string): string {
  // Cloudflare R2 public URL format: https://pub-<account-id>.r2.dev/<bucket-name>/<object-key>
  return `https://pub-${CLOUDFLARE_ACCOUNT_ID}.r2.dev/${CLOUDFLARE_BUCKET_NAME}/${imageKey}`;
}
