export const ACHIEVEMENTS = {
  first_quiz: {
    key: "first_quiz",
    name: "First Steps",
    description: "Complete your first quiz",
  },
  streak_7: {
    key: "streak_7",
    name: "Week Warrior",
    description: "Maintain a 7-day streak",
  },
  streak_30: {
    key: "streak_30",
    name: "Monthly Master",
    description: "Maintain a 30-day streak",
  },
  deck_creator: {
    key: "deck_creator",
    name: "Deck Builder",
    description: "Create your first custom deck",
  },
  card_collector_50: {
    key: "card_collector_50",
    name: "Card Collector",
    description: "Create 50 flashcards",
  },
  perfect_quiz: {
    key: "perfect_quiz",
    name: "Perfect Score",
    description: "Score 100% on a quiz",
  },
  history_buff: {
    key: "history_buff",
    name: "History Buff",
    description: "Score 90%+ on 10 history quizzes",
  },
  bookworm: {
    key: "bookworm",
    name: "Bookworm",
    description: "Bookmark 25 knowledge cards",
  },
  review_master: {
    key: "review_master",
    name: "Review Master",
    description: "Complete 100 spaced repetition reviews",
  },
} as const;

export type AchievementKey = keyof typeof ACHIEVEMENTS;
