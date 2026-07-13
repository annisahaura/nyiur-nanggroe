import { createRouteClient } from "@/lib/utils/auth-helpers";
import { sanitizeImageUrl } from "@/lib/utils/image-sanitizer";

// ============================================================
// REPOSITORI KATEGORI
// ============================================================

export function sanitizeCategory(c: any): any {
  if (!c) return c;
  c.image_url = sanitizeImageUrl(c.image_url, c.slug || c.name);
  return c;
}

const CATEGORY_SELECT = `
  id, name, name_en, slug, description, icon, image_url,
  parent_id, sort_order, product_count, is_active
`;

export async function findAllCategories(includeInactive = false) {
  const supabase = await createRouteClient();

  let query = supabase
    .from("categories")
    .select(CATEGORY_SELECT)
    .order("sort_order", { ascending: true });

  if (!includeInactive) {
    query = query.eq("is_active", true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map(sanitizeCategory);
}

export async function findCategoryBySlug(slug: string) {
  const supabase = await createRouteClient();

  const { data, error } = await supabase
    .from("categories")
    .select(CATEGORY_SELECT)
    .eq("slug", slug)
    .single();

  if (error) return null;
  return sanitizeCategory(data);
}

export async function findCategoryById(id: string) {
  const supabase = await createRouteClient();

  const { data, error } = await supabase
    .from("categories")
    .select(CATEGORY_SELECT)
    .eq("id", id)
    .single();

  if (error) return null;
  return sanitizeCategory(data);
}

export async function getCategoryTree() {
  const supabase = await createRouteClient();

  // Ambil kategori induk (tanpa parent)
  const { data, error } = await supabase
    .from("categories")
    .select(CATEGORY_SELECT)
    .eq("is_active", true)
    .is("parent_id", null)
    .order("sort_order", { ascending: true });

  if (error) throw error;

  const parents = data ?? [];

  // Ambil subkategori (dengan parent)
  const { data: children } = await supabase
    .from("categories")
    .select(CATEGORY_SELECT)
    .eq("is_active", true)
    .not("parent_id", "is", null)
    .order("sort_order", { ascending: true });

  // Gabungkan subkategori ke induknya
  return parents.map(sanitizeCategory).map((parent) => ({
    ...parent,
    children: (children ?? []).map(sanitizeCategory).filter((c) => c.parent_id === parent.id),
  }));
}

export async function createCategory(input: {
  name: string;
  name_en?: string;
  slug: string;
  description?: string;
  icon?: string;
  image_url?: string;
  parent_id?: string;
  sort_order?: number;
}) {
  const supabase = await createRouteClient();

  const { data, error } = await supabase
    .from("categories")
    .insert(input)
    .select(CATEGORY_SELECT)
    .single();

  if (error) throw error;
  return sanitizeCategory(data);
}
