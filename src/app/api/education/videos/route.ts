import { NextRequest } from "next/server";
import { listVideos } from "@/lib/services/education.service";
import { videoFilterSchema } from "@/lib/validators/education.schema";
import { ok, badRequest, handleError } from "@/lib/utils/api-response";

// GET /api/education/videos — daftar video edukasi
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const params: Record<string, any> = {};
    searchParams.forEach((value, key) => (params[key] = value));

    const validation = videoFilterSchema.safeParse(params);
    if (!validation.success) {
      return badRequest("Filter video tidak valid");
    }

    const result = await listVideos(validation.data);
    return ok(result.data, { meta: result.meta });
  } catch (error) {
    return handleError(error);
  }
}
