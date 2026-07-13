import { NextRequest } from "next/server";
import { getAuthUser, isSeller } from "@/lib/utils/auth-helpers";
import { getProfileWithStore } from "@/lib/repositories/user.repository";
import {
  uploadAvatar,
  uploadProductImage,
  uploadStoreLogo,
  uploadStoreBanner,
  uploadReviewImage,
  StorageBucket,
} from "@/lib/services/upload.service";
import { ok, badRequest, unauthorized, forbidden, handleError } from "@/lib/utils/api-response";

const VALID_BUCKETS: StorageBucket[] = [
  "avatars",
  "store-logos",
  "store-banners",
  "product-images",
  "review-images",
  "education",
];

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ bucket: string }> }
) {
  try {
    const { bucket } = await params;
    const { user, error: authError } = await getAuthUser();
    if (authError || !user) {
      return unauthorized();
    }

    if (!VALID_BUCKETS.includes(bucket as StorageBucket)) {
      return badRequest(`Bucket "${bucket}" tidak valid.`);
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return badRequest("File wajib diunggah");
    }

    let uploadResult;

    switch (bucket as StorageBucket) {
      case "avatars":
        uploadResult = await uploadAvatar(user.id, file);
        break;

      case "store-logos": {
        if (!isSeller(user)) return forbidden();
        const profile = await getProfileWithStore(user.id);
        const store = profile?.seller_profile;
        if (!store) return forbidden("Anda belum memiliki toko.");
        uploadResult = await uploadStoreLogo(store.id, file);
        break;
      }

      case "store-banners": {
        if (!isSeller(user)) return forbidden();
        const profile = await getProfileWithStore(user.id);
        const store = profile?.seller_profile;
        if (!store) return forbidden("Anda belum memiliki toko.");
        uploadResult = await uploadStoreBanner(store.id, file);
        break;
      }

      case "product-images": {
        if (!isSeller(user)) return forbidden();
        const profile = await getProfileWithStore(user.id);
        const store = profile?.seller_profile;
        if (!store) return forbidden();
        
        const productId = formData.get("product_id") as string;
        const indexStr = formData.get("index") as string;
        const index = indexStr ? parseInt(indexStr, 10) : 0;
        
        if (!productId) return badRequest("product_id wajib diisi");
        
        uploadResult = await uploadProductImage(store.id, productId, file, index);
        break;
      }

      case "review-images": {
        const reviewId = formData.get("review_id") as string;
        const indexStr = formData.get("index") as string;
        const index = indexStr ? parseInt(indexStr, 10) : 0;
        
        if (!reviewId) return badRequest("review_id wajib diisi");
        
        uploadResult = await uploadReviewImage(reviewId, file, index);
        break;
      }

      default:
        return badRequest("Pengunggahan tidak didukung untuk tipe ini.");
    }

    return ok(uploadResult, { message: "File berhasil diunggah" });
  } catch (error: any) {
    if (error.message.startsWith("INVALID_FILE_TYPE:")) {
      return badRequest("Tipe file tidak didukung. Harap unggah gambar.");
    }
    if (error.message.startsWith("FILE_TOO_LARGE:")) {
      const sizeLimit = error.message.split(":")[1];
      return badRequest(`File terlalu besar. Batas maksimal adalah ${sizeLimit}`);
    }
    return handleError(error);
  }
}
