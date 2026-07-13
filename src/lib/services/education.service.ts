import {
  findArticles,
  findArticleBySlug,
  findRelatedArticles,
  trackArticleView,
  createArticle,
  findVideos,
  trackVideoView,
  findQuizzes,
  findQuizById,
  findQuizWithAnswers,
  getUserQuizResult,
  saveQuizResult,
  getUserBookmarks,
  toggleBookmark,
  isArticleBookmarked,
  getUserLearningProgress,
  type ArticleFilters,
  type VideoFilters,
} from "@/lib/repositories/education.repository";

// ============================================================
// LAYANAN EDUKASI
// Lapisan logika bisnis antara rute API dan repositori
// ============================================================

// ============================================================
// ARTIKEL
// ============================================================

export async function listArticles(filters: ArticleFilters) {
  return findArticles(filters);
}

export async function getArticleDetail(slug: string, userId?: string) {
  const article = await findArticleBySlug(slug);
  if (!article) return null;

  // Catat tampilan artikel (non-blocking, tidak menghalangi respons)
  trackArticleView(article.id).catch(() => {});

  // Ambil artikel terkait
  const related = await findRelatedArticles(article.id, article.category);

  // Status bookmark (hanya jika pengguna sudah login)
  let is_bookmarked = false;
  if (userId) {
    is_bookmarked = await isArticleBookmarked(userId, article.id);
  }

  return { ...article, related, is_bookmarked };
}

export async function publishArticle(
  authorId: string,
  input: Parameters<typeof createArticle>[1]
) {
  return createArticle(authorId, input);
}

// ============================================================
// VIDEO
// ============================================================

export async function listVideos(filters: VideoFilters) {
  return findVideos(filters);
}

export async function registerVideoView(videoId: string) {
  // Non-blocking
  trackVideoView(videoId).catch(() => {});
}

// ============================================================
// KUIS
// ============================================================

export async function listQuizzes() {
  return findQuizzes();
}

export async function getQuizDetail(quizId: string, userId?: string) {
  const quiz = await findQuizById(quizId);
  if (!quiz) return null;

  // Cek apakah pengguna sudah pernah mengikuti kuis ini
  let previous_result = null;
  if (userId) {
    previous_result = await getUserQuizResult(quizId, userId);
  }

  return { ...quiz, previous_result };
}

export async function submitQuiz(
  userId: string,
  quizId: string,
  answers: number[]
): Promise<{
  score: number;
  passed: boolean;
  correct_count: number;
  total_questions: number;
  explanations: { question: string; correct: number; your_answer: number; explanation: string | null }[];
}> {
  // Ambil kuis beserta jawaban yang benar (hanya di server)
  const quiz = await findQuizWithAnswers(quizId);
  if (!quiz) throw new Error("QUIZ_NOT_FOUND");

  const questions = quiz.questions ?? [];
  if (questions.length === 0) throw new Error("QUIZ_HAS_NO_QUESTIONS");
  if (answers.length !== questions.length) throw new Error("ANSWER_COUNT_MISMATCH");

  // Nilai kuis
  let correct_count = 0;
  const explanations: { question: string; correct: number; your_answer: number; explanation: string | null }[] = [];

  questions
    .sort((a: any, b: any) => a.sort_order - b.sort_order)
    .forEach((q: any, i: number) => {
      const isCorrect = answers[i] === q.correct_answer;
      if (isCorrect) correct_count++;
      explanations.push({
        question: q.question,
        correct: q.correct_answer,
        your_answer: answers[i],
        explanation: q.explanation ?? null,
      });
    });

  const score = Math.round((correct_count / questions.length) * 100);
  const passed = score >= quiz.pass_score;

  // Simpan hasil (upsert — boleh mengulang)
  await saveQuizResult({ quiz_id: quizId, user_id: userId, score, passed, answers });

  return {
    score,
    passed,
    correct_count,
    total_questions: questions.length,
    explanations,
  };
}

// ============================================================
// BOOKMARK
// ============================================================

export async function getMyBookmarks(userId: string, page = 1, per_page = 12) {
  return getUserBookmarks(userId, page, per_page);
}

export async function toggleArticleBookmark(userId: string, articleId: string) {
  return toggleBookmark(userId, articleId);
}

// ============================================================
// PROGRES BELAJAR
// ============================================================

export async function getLearningProgress(userId: string) {
  return getUserLearningProgress(userId);
}
