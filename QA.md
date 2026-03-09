# BrainDrip QA Tracker

## Open Bugs

_(none)_

---

## Resolved Bugs

### Bug 1: Sign-up screen gives no feedback on success — Fixed
- After successful sign-up, form is replaced with a confirmation message showing the user's email
- "Go to Sign In" button navigates to login screen

### Bug 2: Decks sub-routes showing as separate tabs — Fixed
- Added `app/(tabs)/decks/_layout.tsx` with Stack navigator

### Bug 3: Profile screen shows "Guest User" when logged in — Fixed
- Profile now reads from auth store to display user email/display name
- Shows number of selected interests

### Bug 4: No sign out button anywhere in the app — Fixed
- Added Sign Out button to bottom of Profile screen with confirmation dialog
