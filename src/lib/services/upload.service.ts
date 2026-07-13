import { createAdminRouteClient } from "@/lib/utils/auth-helpers";

// ============================================================
// UPLOAD SERVICE — Supabase Storage
// Supported buckets: avatars, store-logos, store-banners,
//                    product-images, review-images, education
// ============================================================

export type StorageBucket =
  | "avatars"
  | "store-logos"
  | "store-banners"
  | "product-images"
  | "review-images"
  | "education";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export interface UploadResult {
  url: string;
  path: string;
  bucket: StorageBucket;
}

// ============================================================
// GENERIC UPLOAD
// ============================================================

export async function uploadFile(
  bucket: StorageBucket,
  path: string,
  file: File,
  options?: { allowedTypes?: string[]; maxSize?: number }
): Promise<UploadResult> {
  const allowedTypes = options?.allowedTypes ?? ALLOWED_IMAGE_TYPES;
  const maxSize = options?.maxSize ?? MAX_FILE_SIZE;

  // Validate
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`INVALID_FILE_TYPE:${file.type}`);
  }
  if (file.size > maxSize) {
    throw new Error(`FILE_TOO_LARGE:${Math.round(maxSize / 1024 / 1024)}MB`);
  }

  const supabase = await createAdminRouteClient();

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true, contentType: file.type });

  if (error) throw error;

  const { data: publicUrl } = supabase.storage.from(bucket).getPublicUrl(data.path);

  return { url: publicUrl.publicUrl, path: data.path, bucket };
}

// ============================================================
// SPECIFIC UPLOAD HELPERS
// ============================================================

export async function uploadAvatar(userId: string, file: File): Promise<UploadResult> {
  const ext = file.name.split(".").pop();
  const path = `${userId}/avatar.${ext}`;
  return uploadFile("avatars", path, file);
}

export async function uploadProductImage(
  storeId: string,
  productId: string,
  file: File,
  index = 0
): Promise<UploadResult> {
  const ext = file.name.split(".").pop();
  const path = `${storeId}/${productId}/${index}.${ext}`;
  return uploadFile("product-images", path, file);
}

export async function uploadStoreLogo(storeId: string, file: File): Promise<UploadResult> {
  const ext = file.name.split(".").pop();
  const path = `${storeId}/logo.${ext}`;
  return uploadFile("store-logos", path, file);
}

export async function uploadStoreBanner(storeId: string, file: File): Promise<UploadResult> {
  const ext = file.name.split(".").pop();
  const path = `${storeId}/banner.${ext}`;
  return uploadFile("store-banners", path, file);
}

export async function uploadReviewImage(
  reviewId: string,
  file: File,
  index = 0
): Promise<UploadResult> {
  const ext = file.name.split(".").pop();
  const path = `${reviewId}/${index}.${ext}`;
  return uploadFile("review-images", path, file);
}

// ============================================================
// DELETE FILE
// ============================================================

export async function deleteFile(bucket: StorageBucket, path: string): Promise<void> {
  const supabase = await createAdminRouteClient();
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw error;
}
