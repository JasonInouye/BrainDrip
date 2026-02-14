# BrainDrip — Claude Code Project Brief

> A mobile learning app that delivers daily curated knowledge, quizzes, and user-created flashcard decks with spaced repetition.

---

## Project Overview

BrainDrip is a React Native mobile app that combines two learning experiences:
1. **Curated daily knowledge** — bite-sized facts from Wikipedia and trivia APIs across categories like history, science, and pop culture.
2. **Personal learning decks** — user-created flashcard decks (e.g., Git commands, vocab, shortcuts) reinforced through spaced repetition and auto-generated quizzes.

The app targets iOS first, tested via Expo Go on iPhone.

---

## Tech Stack

| Layer              | Technology                | Details                                                  |
|--------------------|---------------------------|----------------------------------------------------------|
| Framework          | React Native + Expo       | Use `create-expo-app` with TypeScript template            |
| Language           | TypeScript                | Strict mode, full-stack consistency                       |
| Navigation         | Expo Router               | File-based routing                                        |
| Backend / Database | Supabase                  | PostgreSQL, Auth (email + Apple Sign-In), REST API        |
| State Management   | Zustand or React Context  | Lightweight, minimal boilerplate                          |
| Push Notifications | Expo Notifications        | Daily reminders                                           |
| Content APIs       | Wikipedia API, Open Trivia DB | Knowledge feed + quiz questions                      |
| Styling            | NativeWind (Tailwind CSS) | Utility-first styling for React Native                   |
| Testing            | iOS via Expo Go           | Primary device: iPhone                                    |

---

## External APIs

### Wikipedia / Wikimedia REST API
- **Endpoint:** `https://api.wikimedia.org/feed/v1/wikipedia/en/featured/{YYYY}/{MM}/{DD}`
- **Use:** Daily featured article, "On This Day" events, random article summaries
- **Auth:** Free personal API token (Bearer token)
- **Docs:** https://api.wikimedia.org/wiki/Main_Page

### Open Trivia Database
- **Endpoint:** `https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple`
- **Use:** Daily quiz questions — supports category, difficulty, type (multiple choice / true-false)
- **Auth:** None required
- **Session Tokens:** `https://opentdb.com/api_token.php?command=request` (prevents duplicate questions)
- **Docs:** https://opentdb.com/api_config.php

### Numbers API (optional)
- **Endpoint:** `http://numbersapi.com/{number}/trivia?json`
- **Use:** Fun math/date trivia facts
- **Auth:** None required

---

## Database Schema (Supabase / PostgreSQL)

### `profiles`
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  preferred_categories TEXT[] DEFAULT '{}',
  difficulty_level TEXT DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  daily_goal INT DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `streaks`
```sql
CREATE TABLE streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_activity_date DATE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `decks`
```sql
CREATE TABLE decks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  card_count INT DEFAULT 0,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `cards`
```sql
CREATE TABLE cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deck_id UUID REFERENCES decks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  answer TEXT NOT NULL,
  explanation TEXT,
  tags TEXT[] DEFAULT '{}',
  -- Spaced repetition fields
  ease_factor FLOAT DEFAULT 2.5,
  interval_days INT DEFAULT 0,
  repetitions INT DEFAULT 0,
  next_review_date DATE DEFAULT CURRENT_DATE,
  last_reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `quiz_results`
```sql
CREATE TABLE quiz_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  quiz_type TEXT NOT NULL CHECK (quiz_type IN ('daily', 'custom', 'review')),
  category TEXT,
  total_questions INT NOT NULL,
  correct_answers INT NOT NULL,
  score_percentage FLOAT,
  time_taken_seconds INT,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `quiz_answers`
```sql
CREATE TABLE quiz_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_result_id UUID REFERENCES quiz_results(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  user_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  source TEXT CHECK (source IN ('api', 'custom_deck')),
  card_id UUID REFERENCES cards(id) ON DELETE SET NULL,
  answered_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `bookmarks`
```sql
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  source_url TEXT,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `achievements`
```sql
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_key TEXT NOT NULL,
  achievement_name TEXT NOT NULL,
  description TEXT,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_key)
);
```

---

## Spaced Repetition Algorithm (SM-2 Based)

Implement the following logic for scheduling card reviews:

```typescript
interface CardReview {
  easeFactor: number;    // starts at 2.5
  intervalDays: number;  // days until next review
  repetitions: number;   // consecutive correct answers
}

function calculateNextReview(
  card: CardReview,
  quality: number // 0-5 rating (0 = total blackout, 5 = perfect recall)
): CardReview {
  let { easeFactor, intervalDays, repetitions } = card;

  if (quality >= 3) {
    // Correct response
    if (repetitions === 0) {
      intervalDays = 1;
    } else if (repetitions === 1) {
      intervalDays = 3;
    } else {
      intervalDays = Math.round(intervalDays * easeFactor);
    }
    repetitions += 1;
  } else {
    // Incorrect response — reset
    repetitions = 0;
    intervalDays = 1;
  }

  // Update ease factor (minimum 1.3)
  easeFactor = Math.max(
    1.3,
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  return { easeFactor, intervalDays, repetitions };
}
```

**Quality Rating Mapping for UI:**
- 5 = "Easy" — recalled instantly
- 4 = "Good" — recalled with minor hesitation
- 3 = "Hard" — recalled with significant effort
- 2 = "Again" — could not recall, show answer
- 0-1 = "Blackout" — no memory at all

---

## App Screens & Navigation Structure

```
app/
├── (auth)/
│   ├── login.tsx
│   ├── register.tsx
│   └── onboarding.tsx
├── (tabs)/
│   ├── _layout.tsx            # Tab navigator
│   ├── index.tsx              # Home / Daily Feed
│   ├── quiz.tsx               # Daily Quiz
│   ├── decks/
│   │   ├── index.tsx          # My Decks list
│   │   ├── [id].tsx           # View/Edit deck & cards
│   │   └── create.tsx         # Create new deck
│   ├── review.tsx             # Spaced Repetition Review Queue
│   └── profile.tsx            # Stats, Streaks, Achievements
└── _layout.tsx                # Root layout
```

### Screen Descriptions

**Home / Daily Feed (`index.tsx`)**
- Shows today's knowledge cards (Wikipedia featured article, "On This Day," trivia facts)
- Mixes in custom deck entries that are due for review
- Shows daily quiz prompt and review queue count
- Pull-to-refresh for new content

**Daily Quiz (`quiz.tsx`)**
- Fetches 10 questions from Open Trivia DB (respecting user's category preferences)
- Mixes in auto-generated questions from user's custom decks
- Progress bar, instant feedback after each question
- End-of-quiz summary with score, streak update

**My Decks (`decks/index.tsx`)**
- List of user's custom decks with card counts and mastery percentage
- FAB or button to create new deck
- Tap deck to view/edit cards

**Deck Detail (`decks/[id].tsx`)**
- List of all cards in the deck
- Add new card (prompt + answer + optional explanation)
- Edit/delete existing cards
- Deck-level stats (mastery %, cards due for review)

**Review Queue (`review.tsx`)**
- Flashcard-style interface showing cards due for review today
- Tap to reveal answer
- Rate recall quality (Easy / Good / Hard / Again)
- Updates spaced repetition schedule in database
- Shows count of remaining reviews

**Profile (`profile.tsx`)**
- Current streak and longest streak
- Overall knowledge score
- Category performance breakdown (bar chart or radar chart)
- Achievements/badges earned
- Settings (notification preferences, difficulty level, categories)

---

## Key Implementation Notes

### Content Fetching Strategy
- Fetch Wikipedia featured content once daily and cache locally
- Open Trivia DB: request a session token on first launch, use it for all quiz requests to avoid duplicates
- Cache fetched content in Supabase or AsyncStorage to minimize API calls

### Auto-Quiz Generation from Custom Decks
When generating quiz questions from a user's custom cards:
1. Take the card's `prompt` as the question
2. Use the card's `answer` as the correct answer
3. Generate 3 plausible wrong answers:
   - Pull random answers from other cards in the same deck
   - If the deck has fewer than 4 cards, use generic distractors or make it a free-response question

### Authentication Flow
1. Launch → check Supabase auth session
2. If no session → show Login/Register screen
3. If new user → show Onboarding (category selection, difficulty)
4. If returning user → go straight to Home tab

### Push Notifications
- Schedule a daily local notification via Expo Notifications
- Customizable reminder time in settings
- Content examples: "You have 5 cards due for review!" or "Your daily quiz is ready!"

---

## Development Phases

### Phase 1: Project Scaffolding
```
Tasks:
1. Create Expo project: npx create-expo-app BrainDrip --template expo-template-blank-typescript
2. Install dependencies:
   - expo-router (navigation)
   - @supabase/supabase-js (database & auth)
   - nativewind + tailwindcss (styling)
   - zustand (state management)
   - expo-notifications
3. Set up Supabase project at supabase.com
4. Run all SQL from the Database Schema section to create tables
5. Configure Supabase client in app (src/lib/supabase.ts)
6. Set up Expo Router file-based navigation structure
7. Create basic tab layout with placeholder screens
8. Verify app runs on iOS via Expo Go
```

### Phase 2: Authentication & Onboarding
```
Tasks:
1. Build Login screen (email + password via Supabase Auth)
2. Build Register screen
3. Build Onboarding screen:
   - Category multi-select (history, science, pop culture, geography, etc.)
   - Difficulty picker (beginner, intermediate, advanced)
   - Save preferences to profiles table
4. Auth state management — redirect based on session status
5. Profile creation on first sign-up (insert into profiles table)
```

### Phase 3: Knowledge Feed
```
Tasks:
1. Create Wikipedia API service (src/services/wikipedia.ts)
   - Fetch today's featured article
   - Fetch "On This Day" events
   - Parse and format response into knowledge card data
2. Create Open Trivia DB service (src/services/trivia.ts)
   - Request session token
   - Fetch questions by category/difficulty
3. Build Knowledge Card component (reusable)
   - Title, summary text, source attribution, category tag
   - Expandable for full content
   - Bookmark button, share button
4. Build Home screen with scrollable feed of daily cards
5. Implement bookmarking (save to Supabase bookmarks table)
```

### Phase 4: Daily Quiz
```
Tasks:
1. Build Quiz screen with question flow:
   - Fetch 10 questions from Open Trivia DB
   - Display one question at a time with answer options
   - Highlight correct/incorrect on selection
   - Show brief explanation
   - Progress bar at top
2. Build end-of-quiz summary screen:
   - Score (e.g., 7/10)
   - Breakdown of correct/incorrect
   - Option to review missed questions
3. Save quiz results to Supabase (quiz_results + quiz_answers tables)
4. Update streak tracking on quiz completion
```

### Phase 5: Custom Knowledge Decks
```
Tasks:
1. Build My Decks list screen
   - Display all user decks with title, card count, mastery %
   - Create new deck button
2. Build Create Deck screen
   - Title, description, category, tags
   - Save to Supabase decks table
3. Build Deck Detail screen
   - List all cards with prompt preview
   - Add Card form: prompt, answer, explanation (optional)
   - Edit/delete cards
   - Save to Supabase cards table
4. Update deck card_count on card add/delete
```

### Phase 6: Spaced Repetition & Review Queue
```
Tasks:
1. Implement SM-2 algorithm (src/lib/spacedRepetition.ts)
2. Build Review Queue screen:
   - Query cards where next_review_date <= today
   - Flashcard UI: show prompt → tap to reveal answer
   - Rating buttons: Easy / Good / Hard / Again
   - Update card's ease_factor, interval_days, repetitions, next_review_date
3. Show review queue count on Home screen tab badge
4. Mix due-for-review custom cards into daily knowledge feed
5. Auto-generate quiz questions from custom deck cards
   - Pull correct answer from card
   - Generate distractors from other cards in same deck
```

### Phase 7: Stats, Streaks & Achievements
```
Tasks:
1. Build Profile/Stats screen:
   - Current streak + longest streak display
   - Knowledge score (cumulative from quizzes)
   - Category performance breakdown
   - Deck mastery levels
2. Implement achievement system:
   - Define achievement keys and unlock conditions:
     - "first_quiz" — complete first quiz
     - "streak_7" — 7-day streak
     - "streak_30" — 30-day streak
     - "deck_creator" — create first custom deck
     - "history_buff" — score 90%+ on 10 history quizzes
     - (etc.)
   - Check conditions after each quiz/review and insert into achievements table
3. Achievement notification/toast when unlocked
```

### Phase 8: Push Notifications & Polish
```
Tasks:
1. Configure Expo Notifications
2. Schedule daily local notification (customizable time)
3. Notification content: review count, quiz reminder, streak warning
4. Settings screen:
   - Notification time picker
   - Category preferences (edit)
   - Difficulty level (edit)
   - Account management
5. UI polish: animations, loading states, empty states, error handling
6. App icon and splash screen
```

### Phase 9: Build & Ship
```
Tasks:
1. Configure Expo EAS Build (eas.json)
2. Create iOS build: eas build --platform ios
3. Submit to TestFlight for beta testing
4. Test on physical iPhone
5. Fix bugs, iterate
6. Submit to App Store: eas submit --platform ios
```

---

## File Structure

```
BrainDrip/
├── app/                        # Expo Router screens
│   ├── (auth)/
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── onboarding.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── index.tsx           # Home / Feed
│   │   ├── quiz.tsx
│   │   ├── decks/
│   │   │   ├── index.tsx
│   │   │   ├── [id].tsx
│   │   │   └── create.tsx
│   │   ├── review.tsx
│   │   └── profile.tsx
│   └── _layout.tsx
├── src/
│   ├── components/
│   │   ├── KnowledgeCard.tsx
│   │   ├── QuizQuestion.tsx
│   │   ├── FlashCard.tsx
│   │   ├── DeckListItem.tsx
│   │   ├── StreakBadge.tsx
│   │   ├── ProgressBar.tsx
│   │   └── AchievementToast.tsx
│   ├── services/
│   │   ├── wikipedia.ts
│   │   ├── trivia.ts
│   │   └── numbersApi.ts
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── spacedRepetition.ts
│   │   └── quizGenerator.ts
│   ├── stores/
│   │   ├── authStore.ts
│   │   ├── feedStore.ts
│   │   ├── quizStore.ts
│   │   ├── deckStore.ts
│   │   └── streakStore.ts
│   ├── types/
│   │   └── index.ts
│   └── constants/
│       ├── categories.ts
│       └── achievements.ts
├── assets/
│   ├── icon.png
│   ├── splash.png
│   └── images/
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
├── app.json
├── eas.json
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── README.md
```

---

## Design Direction

- **Color Palette:** Clean, modern — consider a primary teal/cyan with dark backgrounds for readability
- **Typography:** System fonts for performance; clear hierarchy (large titles, readable body text)
- **Cards:** Rounded corners, subtle shadows, category color accents
- **Mascot (future):** Octopus character — friendly, used in empty states, streak celebrations, and notifications
- **Vibe:** Approachable and encouraging, not overwhelming — think Duolingo meets a clean reading app

---

## Important Reminders

- Always use TypeScript strict mode
- Handle loading states, error states, and empty states for every screen
- Cache API responses to minimize network calls
- Use Supabase Row Level Security (RLS) — users should only access their own data
- Test on iOS via Expo Go throughout development
- Commit frequently with descriptive messages