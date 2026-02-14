export interface Profile {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  preferred_categories: string[];
  difficulty_level: "beginner" | "intermediate" | "advanced";
  daily_goal: number;
  created_at: string;
  updated_at: string;
}

export interface Streak {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
  updated_at: string;
}

export interface Deck {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: string | null;
  tags: string[];
  card_count: number;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface Card {
  id: string;
  deck_id: string;
  user_id: string;
  prompt: string;
  answer: string;
  explanation: string | null;
  tags: string[];
  ease_factor: number;
  interval_days: number;
  repetitions: number;
  next_review_date: string;
  last_reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface QuizResult {
  id: string;
  user_id: string;
  quiz_type: "daily" | "custom" | "review";
  category: string | null;
  total_questions: number;
  correct_answers: number;
  score_percentage: number | null;
  time_taken_seconds: number | null;
  completed_at: string;
}

export interface QuizAnswer {
  id: string;
  quiz_result_id: string;
  user_id: string;
  question_text: string;
  correct_answer: string;
  user_answer: string;
  is_correct: boolean;
  source: "api" | "custom_deck" | null;
  card_id: string | null;
  answered_at: string;
}

export interface Bookmark {
  id: string;
  user_id: string;
  title: string;
  content: string;
  source_url: string | null;
  category: string | null;
  created_at: string;
}

export interface Achievement {
  id: string;
  user_id: string;
  achievement_key: string;
  achievement_name: string;
  description: string | null;
  unlocked_at: string;
}

export interface KnowledgeCardData {
  id: string;
  title: string;
  summary: string;
  content?: string;
  source: string;
  sourceUrl?: string;
  category: string;
  imageUrl?: string;
}

export interface TriviaQuestion {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  category: string;
  difficulty: string;
  type: "multiple" | "boolean";
}
