export interface CardReview {
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
}

export function calculateNextReview(
  card: CardReview,
  quality: number // 0-5 rating
): CardReview {
  let { easeFactor, intervalDays, repetitions } = card;

  if (quality >= 3) {
    if (repetitions === 0) {
      intervalDays = 1;
    } else if (repetitions === 1) {
      intervalDays = 3;
    } else {
      intervalDays = Math.round(intervalDays * easeFactor);
    }
    repetitions += 1;
  } else {
    repetitions = 0;
    intervalDays = 1;
  }

  easeFactor = Math.max(
    1.3,
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  return { easeFactor, intervalDays, repetitions };
}
