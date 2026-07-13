import { NextRequest } from "next/server";
import { getCategoryTree } from "@/lib/repositories/category.repository";
import { getAuthUser, isAdmin } from "@/lib/utils/auth-helpers";
import { ok, handleError } from "@/lib/utils/api-response";

// GET /api/categories
// Returns categories with optional tree structure
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tree = searchParams.get("tree") === "true";

    const data = await getCategoryTree();

    // Flat list if tree=false or not specified
    if (!tree) {
      const flat = data.flatMap((cat) => [
        { ...cat, children: undefined },
        ...(cat.children ?? []),
      ]);
      return ok(flat);
    }

    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}
