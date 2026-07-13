import { NextResponse } from "next/server";

// ============================================================
// STANDARD API RESPONSE TYPES
// ============================================================

export interface ApiSuccess<T> {
  success: true;
  data: T;
  meta?: PaginationMeta;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
  code: ErrorCode;
  details?: Record<string, string[]>;
}

export interface PaginationMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export type ErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "CONFLICT"
  | "INTERNAL_ERROR"
  | "PAYMENT_ERROR"
  | "INSUFFICIENT_STOCK"
  | "RATE_LIMITED";

// ============================================================
// RESPONSE HELPERS
// ============================================================

export function ok<T>(
  data: T,
  options?: { message?: string; meta?: PaginationMeta; status?: number }
): NextResponse<ApiSuccess<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(options?.message && { message: options.message }),
      ...(options?.meta && { meta: options.meta }),
    },
    { status: options?.status ?? 200 }
  );
}

export function created<T>(data: T, message?: string): NextResponse<ApiSuccess<T>> {
  return ok(data, { message, status: 201 });
}

export function noContent(): NextResponse {
  return new NextResponse(null, { status: 204 });
}

export function badRequest(
  error: string,
  details?: Record<string, string[]>
): NextResponse<ApiError> {
  return NextResponse.json(
    { success: false, error, code: "VALIDATION_ERROR" as ErrorCode, ...(details && { details }) },
    { status: 400 }
  );
}

export function unauthorized(
  error = "Anda harus login terlebih dahulu."
): NextResponse<ApiError> {
  return NextResponse.json(
    { success: false, error, code: "UNAUTHORIZED" as ErrorCode },
    { status: 401 }
  );
}

export function forbidden(
  error = "Anda tidak memiliki izin untuk melakukan tindakan ini."
): NextResponse<ApiError> {
  return NextResponse.json(
    { success: false, error, code: "FORBIDDEN" as ErrorCode },
    { status: 403 }
  );
}

export function notFound(resource = "Data"): NextResponse<ApiError> {
  return NextResponse.json(
    { success: false, error: `${resource} tidak ditemukan.`, code: "NOT_FOUND" as ErrorCode },
    { status: 404 }
  );
}

export function conflict(error: string): NextResponse<ApiError> {
  return NextResponse.json(
    { success: false, error, code: "CONFLICT" as ErrorCode },
    { status: 409 }
  );
}

export function serverError(
  error = "Terjadi kesalahan server. Silakan coba lagi."
): NextResponse<ApiError> {
  return NextResponse.json(
    { success: false, error, code: "INTERNAL_ERROR" as ErrorCode },
    { status: 500 }
  );
}

export function insufficientStock(productName: string): NextResponse<ApiError> {
  return NextResponse.json(
    {
      success: false,
      error: `Stok ${productName} tidak mencukupi.`,
      code: "INSUFFICIENT_STOCK" as ErrorCode,
    },
    { status: 422 }
  );
}

// ============================================================
// ERROR HANDLER — catches unknown errors
// ============================================================

export function handleError(error: unknown): NextResponse<ApiError> {
  if (error instanceof Error) {
    console.error("[API Error]", error.message);

    // Supabase / PostgreSQL duplicate key
    if (error.message.includes("duplicate key")) {
      return conflict("Data sudah ada.");
    }

    // Supabase RLS violation
    if (error.message.includes("violates row-level security")) {
      return forbidden();
    }
    
    // Return actual error message for debugging instead of masking it
    return serverError(error.message || JSON.stringify(error, Object.getOwnPropertyNames(error)));
  }

  console.error("[API Error] Unknown:", error);
  return serverError(JSON.stringify(error, Object.getOwnPropertyNames(error)));
}
