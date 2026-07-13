import { event } from "./index";

/**
 * Strongly typed tracking helper functions for startup analytics.
 */

export const trackMarketplace = {
  viewProduct: (productId: string, name: string, category: string, price: number) => {
    event({
      action: "view_item",
      category: "marketplace",
      label: name,
      value: price,
      product_id: productId,
      product_category: category,
    });
  },

  addToCart: (productId: string, name: string, quantity: number, price: number) => {
    event({
      action: "add_to_cart",
      category: "marketplace",
      label: name,
      value: price * quantity,
      product_id: productId,
      quantity,
    });
  },

  beginCheckout: (cartTotal: number, itemCount: number) => {
    event({
      action: "begin_checkout",
      category: "marketplace",
      value: cartTotal,
      item_count: itemCount,
    });
  },

  purchase: (transactionId: string, total: number, carbonSaved: number) => {
    event({
      action: "purchase",
      category: "marketplace",
      label: transactionId,
      value: total,
      carbon_saved_kg: carbonSaved,
    });
  },
};

export const trackAI = {
  chatOpened: () => {
    event({
      action: "ai_chat_opened",
      category: "ai",
    });
  },

  questionAsked: (question: string) => {
    event({
      action: "ai_question_asked",
      category: "ai",
      label: question.substring(0, 100), // Limit label length
    });
  },

  visualSearchUsed: () => {
    event({
      action: "ai_visual_search",
      category: "ai",
    });
  },
};

export const trackEducation = {
  articleRead: (title: string, category: string) => {
    event({
      action: "article_read",
      category: "education",
      label: title,
      article_category: category,
    });
  },

  quizCompleted: (quizTitle: string, score: number, passed: boolean) => {
    event({
      action: "quiz_completed",
      category: "education",
      label: quizTitle,
      value: score,
      passed: passed ? 1 : 0,
    });
  },
};
