# BrainDrip QA Tracker

## Open Bugs

### Bug 1: Sign-up screen gives no feedback on success
**Severity:** High
**Screen:** `(auth)/register.tsx`
**Steps to reproduce:**
1. Open the app and navigate to Sign Up
2. Enter email and password, tap "Create Account"
3. Sign-up succeeds but nothing happens — no message, no redirect

**Expected behavior:**
- Show a success message telling the user to check their email for a confirmation link
- Disable the form after successful submission to prevent duplicate requests

**Actual behavior:**
- Screen stays unchanged with no feedback
- Attempting to sign up again shows a "wait 40 seconds" rate-limit error
- User has no idea the sign-up worked or that email confirmation is required

**Fix:**
- After successful `signUp()`, display a confirmation message instead of silently doing nothing
- Optionally: auto-navigate to login screen with a banner saying "Check your email to confirm"

---

## Resolved Bugs

_(none yet)_
