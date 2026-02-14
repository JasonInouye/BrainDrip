export const CATEGORIES = [
  { key: "history", label: "History", icon: "book" },
  { key: "science", label: "Science", icon: "flask" },
  { key: "geography", label: "Geography", icon: "globe" },
  { key: "pop_culture", label: "Pop Culture", icon: "star" },
  { key: "technology", label: "Technology", icon: "laptop" },
  { key: "literature", label: "Literature", icon: "book-open" },
  { key: "math", label: "Mathematics", icon: "calculator" },
  { key: "art", label: "Art & Design", icon: "palette" },
  { key: "sports", label: "Sports", icon: "football" },
  { key: "nature", label: "Nature", icon: "leaf" },
] as const;

export type CategoryKey = (typeof CATEGORIES)[number]["key"];

// Open Trivia DB category IDs
export const TRIVIA_CATEGORY_MAP: Record<string, number> = {
  history: 23,
  science: 17,
  geography: 22,
  pop_culture: 14,
  technology: 18,
  literature: 10,
  math: 19,
  art: 25,
  sports: 21,
  nature: 17,
};

export const DIFFICULTY_LEVELS = [
  { key: "beginner", label: "Beginner" },
  { key: "intermediate", label: "Intermediate" },
  { key: "advanced", label: "Advanced" },
] as const;
