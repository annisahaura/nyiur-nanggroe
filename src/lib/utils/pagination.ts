import type { PaginationMeta } from "./api-response";

// ============================================================
// PAGINATION PARAMS
// ============================================================

export interface PaginationParams {
  page: number;
  per_page: number;
  offset: number;
}

export function parsePaginationParams(
  searchParams: URLSearchParams,
  defaults = { page: 1, per_page: 20 }
): PaginationParams {
  const page = Math.max(1, parseInt(searchParams.get("page") ?? String(defaults.page), 10) || 1);
  const per_page = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get("per_page") ?? String(defaults.per_page), 10) || defaults.per_page)
  );

  return {
    page,
    per_page,
    offset: (page - 1) * per_page,
  };
}

// ============================================================
// BUILD PAGINATED RESPONSE META
// ============================================================

export function buildPaginationMeta(
  total: number,
  params: PaginationParams
): PaginationMeta {
  const total_pages = Math.ceil(total / params.per_page);

  return {
    page: params.page,
    per_page: params.per_page,
    total,
    total_pages,
    has_next: params.page < total_pages,
    has_prev: params.page > 1,
  };
}

// ============================================================
// SUPABASE RANGE HELPER
// ============================================================

export function toRange(params: PaginationParams): { from: number; to: number } {
  return {
    from: params.offset,
    to: params.offset + params.per_page - 1,
  };
}
