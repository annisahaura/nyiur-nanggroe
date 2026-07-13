import { createRouteClient } from "@/lib/utils/auth-helpers";
import { parsePaginationParams, toRange, buildPaginationMeta } from "@/lib/utils/pagination";
import { sanitizeImageUrl } from "@/lib/utils/image-sanitizer";

export function sanitizeArticle(a: any): any {
  if (!a) return a;
  a.cover_image = sanitizeImageUrl(a.cover_image, a.slug || a.title);
  return a;
}

export function sanitizeVideo(v: any): any {
  if (!v) return v;
  v.thumbnail_url = sanitizeImageUrl(v.thumbnail_url, v.slug || v.title);
  return v;
}

// ============================================================
// REPOSITORI EDUKASI
// Mengelola: artikel, video, kuis, bookmark, progres belajar
// ============================================================

const ARTICLE_SELECT = `
  id, title, title_en, slug, excerpt, content, cover_image,
  author_id, category, tags, read_time, is_published, is_featured,
  view_count, published_at, created_at, updated_at,
  author:profiles(id, full_name, avatar_url)
`;

const VIDEO_SELECT = `
  id, title, slug, description, thumbnail_url, video_url,
  duration, author_id, category, tags, is_published, view_count, created_at,
  author:profiles(id, full_name, avatar_url)
`;

// ============================================================
// ARTIKEL
// ============================================================

export interface ArticleFilters {
  q?: string;
  category?: string;
  tag?: string;
  is_featured?: boolean;
  page?: number;
  per_page?: number;
}

export async function findArticles(filters: ArticleFilters = {}) {
  const supabase = await createRouteClient();
  const pagination = parsePaginationParams(
    new URLSearchParams({
      page: String(filters.page ?? 1),
      per_page: String(filters.per_page ?? 12),
    })
  );
  const { from, to } = toRange(pagination);

  let query = supabase
    .from("education_articles")
    .select(ARTICLE_SELECT, { count: "exact" })
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (filters.q) {
    query = query.or(`title.ilike.%${filters.q}%,excerpt.ilike.%${filters.q}%`);
  }
  if (filters.category) {
    query = query.eq("category", filters.category);
  }
  if (filters.tag) {
    query = query.contains("tags", [filters.tag]);
  }
  if (filters.is_featured) {
    query = query.eq("is_featured", true);
  }

  const { data, count, error } = await query.range(from, to);
  if (error) throw error;

  return {
    data: (data ?? []).map(sanitizeArticle),
    meta: buildPaginationMeta(count ?? 0, pagination),
  };
}

export async function findArticleBySlug(slug: string) {
  const supabase = await createRouteClient();

  const { data, error } = await supabase
    .from("education_articles")
    .select(ARTICLE_SELECT)
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error) return null;
  return sanitizeArticle(data);
}

export async function findRelatedArticles(articleId: string, category: string, limit = 3) {
  const supabase = await createRouteClient();

  const { data } = await supabase
    .from("education_articles")
    .select("id, title, slug, excerpt, cover_image, read_time, published_at, category")
    .eq("category", category)
    .eq("is_published", true)
    .neq("id", articleId)
    .order("view_count", { ascending: false })
    .limit(limit);

  return (data ?? []).map(sanitizeArticle);
}

export async function trackArticleView(articleId: string) {
  const supabase = await createRouteClient();
  await supabase.rpc("increment_article_view", { article_id: articleId });
}

export async function createArticle(
  authorId: string,
  input: {
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    cover_image?: string;
    category: string;
    tags?: string[];
    read_time?: number;
    is_published?: boolean;
    is_featured?: boolean;
  }
) {
  const supabase = await createRouteClient();

  const { data, error } = await supabase
    .from("education_articles")
    .insert({
      author_id: authorId,
      ...input,
      published_at: input.is_published ? new Date().toISOString() : null,
    })
    .select(ARTICLE_SELECT)
    .single();

  if (error) throw error;
  return sanitizeArticle(data);
}

// ============================================================
// VIDEO
// ============================================================

export interface VideoFilters {
  q?: string;
  category?: string;
  page?: number;
  per_page?: number;
}

export async function findVideos(filters: VideoFilters = {}) {
  const supabase = await createRouteClient();
  const pagination = parsePaginationParams(
    new URLSearchParams({
      page: String(filters.page ?? 1),
      per_page: String(filters.per_page ?? 12),
    })
  );
  const { from, to } = toRange(pagination);

  let query = supabase
    .from("education_videos")
    .select(VIDEO_SELECT, { count: "exact" })
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (filters.q) {
    query = query.or(`title.ilike.%${filters.q}%,description.ilike.%${filters.q}%`);
  }
  if (filters.category) {
    query = query.eq("category", filters.category);
  }

  const { data, count, error } = await query.range(from, to);
  if (error) throw error;

  return {
    data: (data ?? []).map(sanitizeVideo),
    meta: buildPaginationMeta(count ?? 0, pagination),
  };
}

export async function trackVideoView(videoId: string) {
  const supabase = await createRouteClient();
  await supabase.rpc("increment_video_view", { video_id: videoId });
}

// ============================================================
// KUIS
// ============================================================

export async function findQuizzes() {
  const supabase = await createRouteClient();

  const { data, error } = await supabase
    .from("quizzes")
    .select(`
      id, title, description, article_id, question_count,
      time_limit, pass_score, is_active, created_at,
      article:education_articles(title, slug)
    `)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function findQuizById(quizId: string) {
  const supabase = await createRouteClient();

  // CATATAN: correct_answer sengaja tidak disertakan pada respons publik
  const { data, error } = await supabase
    .from("quizzes")
    .select(`
      id, title, description, article_id, question_count,
      time_limit, pass_score, is_active, created_at,
      questions:quiz_questions(
        id, quiz_id, question, options, sort_order
      ),
      article:education_articles(id, title, slug)
    `)
    .eq("id", quizId)
    .eq("is_active", true)
    .single();

  if (error) return null;
  return data;
}

export async function findQuizWithAnswers(quizId: string) {
  // Hanya dipanggil server-side untuk keperluan penilaian
  const supabase = await createRouteClient();

  const { data, error } = await supabase
    .from("quizzes")
    .select(`
      id, title, question_count, pass_score, time_limit,
      questions:quiz_questions(
        id, quiz_id, question, options, correct_answer, explanation, sort_order
      )
    `)
    .eq("id", quizId)
    .single();

  if (error) return null;
  return data;
}

export async function getUserQuizResult(quizId: string, userId: string) {
  const supabase = await createRouteClient();

  const { data } = await supabase
    .from("quiz_results")
    .select("id, score, passed, answers, completed_at")
    .eq("quiz_id", quizId)
    .eq("user_id", userId)
    .single();

  return data ?? null;
}

export async function saveQuizResult(input: {
  quiz_id: string;
  user_id: string;
  score: number;
  passed: boolean;
  answers: number[];
}) {
  const supabase = await createRouteClient();

  // Upsert — boleh mengulang kuis, tetapi hasil disimpan
  const { data, error } = await supabase
    .from("quiz_results")
    .upsert(
      { ...input, completed_at: new Date().toISOString() },
      { onConflict: "quiz_id,user_id" }
    )
    .select("id, score, passed, completed_at")
    .single();

  if (error) throw error;
  return data;
}

// ============================================================
// BOOKMARK
// ============================================================

export async function getUserBookmarks(userId: string, page = 1, per_page = 12) {
  const supabase = await createRouteClient();
  const pagination = parsePaginationParams(
    new URLSearchParams({ page: String(page), per_page: String(per_page) })
  );
  const { from, to } = toRange(pagination);

  const { data, count, error } = await supabase
    .from("article_bookmarks")
    .select(
      `id, created_at, article:education_articles(id, title, slug, excerpt, cover_image, read_time, category, published_at)`,
      { count: "exact" }
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;

  return {
    data: data ?? [],
    meta: buildPaginationMeta(count ?? 0, pagination),
  };
}

export async function isArticleBookmarked(userId: string, articleId: string): Promise<boolean> {
  const supabase = await createRouteClient();

  const { data } = await supabase
    .from("article_bookmarks")
    .select("id")
    .eq("user_id", userId)
    .eq("article_id", articleId)
    .single();

  return !!data;
}

export async function toggleBookmark(
  userId: string,
  articleId: string
): Promise<{ bookmarked: boolean }> {
  const supabase = await createRouteClient();

  const existing = await isArticleBookmarked(userId, articleId);

  if (existing) {
    await supabase
      .from("article_bookmarks")
      .delete()
      .eq("user_id", userId)
      .eq("article_id", articleId);
    return { bookmarked: false };
  } else {
    await supabase
      .from("article_bookmarks")
      .insert({ user_id: userId, article_id: articleId });
    return { bookmarked: true };
  }
}

// ============================================================
// PROGRES BELAJAR PENGGUNA
// ============================================================

export async function getUserLearningProgress(userId: string) {
  const supabase = await createRouteClient();

  const [{ data: stats }, { count: bookmarkCount }, { count: quizCount }] = await Promise.all([
    supabase
      .from("user_statistics")
      .select("articles_read, quizzes_passed")
      .eq("user_id", userId)
      .single(),
    supabase
      .from("article_bookmarks")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase
      .from("quiz_results")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("passed", true),
  ]);

  return {
    articles_read: stats?.articles_read ?? 0,
    quizzes_passed: stats?.quizzes_passed ?? 0,
    bookmarks_count: bookmarkCount ?? 0,
    passed_quizzes: quizCount ?? 0,
  };
}
