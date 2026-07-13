import { NextRequest } from "next/server";
import { getProductDetail, updateSellerProduct, deleteSellerProduct } from "@/lib/services/product.service";
import { updateProductSchema } from "@/lib/validators/product.schema";
import { getAuthUser } from "@/lib/utils/auth-helpers";
import { ok, badRequest, unauthorized, forbidden, notFound, handleError } from "@/lib/utils/api-response";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const product = await getProductDetail(slug);
    if (!product) {
      return notFound("Produk");
    }

    return ok(product);
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { user, error: authError } = await getAuthUser();
    if (authError || !user) {
      return unauthorized();
    }

    // Retrieve original product to get ID
    const product = await getProductDetail(slug);
    if (!product) {
      return notFound("Produk");
    }

    const body = await req.json();
    const validation = updateProductSchema.safeParse(body);
    if (!validation.success) {
      return badRequest("Validasi gagal");
    }

    const updated = await updateSellerProduct(product.id, user.id, validation.data);
    return ok(updated, { message: "Produk berhasil diperbarui" });
  } catch (error: any) {
    if (error.message === "FORBIDDEN") {
      return forbidden("Anda tidak berhak mengubah produk ini.");
    }
    return handleError(error);
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { user, error: authError } = await getAuthUser();
    if (authError || !user) {
      return unauthorized();
    }

    const product = await getProductDetail(slug);
    if (!product) {
      return notFound("Produk");
    }

    await deleteSellerProduct(product.id, user.id);
    return ok({ deleted: true }, { message: "Produk berhasil dihapus" });
  } catch (error: any) {
    if (error.message === "FORBIDDEN") {
      return forbidden("Anda tidak berhak menghapus produk ini.");
    }
    return handleError(error);
  }
}
