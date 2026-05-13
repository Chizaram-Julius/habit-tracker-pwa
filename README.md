# Habit Tracker PWA

## Live URL

https://habit-tracker-pwa-idea.netlify.app/

## GitHub Repository

https://github.com/Chizaram-Julius/habit-tracker-pwa

## Demo Video (≤ 2 minutes)

https://drive.google.com/file/d/13vgJQpuXPPz-Lc3ZAQoyh_bVxE0nSDzk/view?usp=sharing
---

## 📌 Project Overview

Habit Tracker PWA is a mobile-first Progressive Web App built as part of HNG Stage 3 Frontend Track.

The application strictly follows the Technical Requirements Document (TRD) and implements:

* User authentication (signup, login, logout)
* Protected dashboard
* Habit management (create, edit, delete)
* Daily habit completion tracking
* Streak calculation
* Local persistence using `localStorage`
* Offline support using service worker (PWA)

---

## 🚀 Features

### Authentication

* Signup with email and password
* Login with validation
* Logout functionality
* Session persistence using `localStorage`

### Dashboard

* Displays only logged-in user’s habits
* Protected route (redirects unauthenticated users)

### Habit Management

* Create new habits
* Edit existing habits
* Delete habits with confirmation
* Toggle daily completion
* Automatic streak calculation

### PWA Support

* Installable app
* Service worker caching
* Offline app shell support

---

## 🛠️ Tech Stack

* Next.js (App Router)
* React
* TypeScript
* Tailwind CSS
* localStorage (Persistence)
* Vitest (Unit Testing)
* React Testing Library (Integration Testing)
* Playwright (E2E Testing)
* Netlify (Deployment)

---

## 📂 Project Structure

```bash
src/
  app/
    dashboard/
    login/
    signup/
  components/
    auth/
    habits/
    shared/
  lib/
    auth.ts
    habits.ts
    slug.ts
    streaks.ts
    validators.ts
tests/
  unit/
  integration/
  e2e/
```

---

## ⚙️ How to Run the App

### 1. Clone the repository

```bash
git clone https://github.com/Chizaram-Julius/habit-tracker-pwa
cd habit-tracker-pwa
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## 🏗️ Build the App

```bash
npm run build
```

---

## 🧪 Running Tests

### Unit Tests (with coverage)

```bash
npm run test:unit
```

### Integration Tests

```bash
npm run test:integration
```

### End-to-End Tests

```bash
npm run test:e2e
```

---

## 📊 Coverage Report

* Generated using:

```bash
npm run test:unit
```

* Coverage folder:

```bash
coverage/
```

* Meets required threshold (≥ 80%)

---

## 💾 Local Storage Structure

### `habit-tracker-users`

```ts
{
  id: string;
  email: string;
  password: string;
  createdAt: string;
}
```

### `habit-tracker-session`

```ts
{
  userId: string;
  email: string;
} | null
```

### `habit-tracker-habits`

```ts
{
  id: string;
  userId: string;
  name: string;
  description: string;
  frequency: "daily";
  createdAt: string;
  completions: string[];
}
```

---

## 📦 PWA Implementation

Files used:

* `public/manifest.json`
* `public/sw.js`
* `public/icons/icon-192.png`
* `public/icons/icon-512.png`
* `RegisterServiceWorker.tsx`

Features:

* App shell caching
* Offline support after first load
* Installable app

---

## 📖 TRD Mapping

### Routes

| Route        | Description              |
| ------------ | ------------------------ |
| `/`          | Splash screen + redirect |
| `/signup`    | User signup              |
| `/login`     | User login               |
| `/dashboard` | Protected dashboard      |

---

### Utility Functions

| File          | Function               |
| ------------- | ---------------------- |
| slug.ts       | getHabitSlug           |
| validators.ts | validateHabitName      |
| streaks.ts    | calculateCurrentStreak |
| habits.ts     | toggleHabitCompletion  |

---

### Required Test IDs

Implemented:

* `splash-screen`
* `auth-login-email`
* `auth-login-password`
* `auth-login-submit`
* `auth-signup-email`
* `auth-signup-password`
* `auth-signup-submit`
* `dashboard-page`
* `empty-state`
* `create-habit-button`
* `habit-form`
* `habit-name-input`
* `habit-description-input`
* `habit-frequency-select`
* `habit-save-button`
* `auth-logout-button`
* `confirm-delete-button`
* slug-based habit IDs

---

## 🧪 Test Files & Coverage

### Unit Tests

* `slug.test.ts` → slug generation
* `validators.test.ts` → validation rules
* `streaks.test.ts` → streak logic
* `habits.test.ts` → toggle logic

### Integration Tests

* `auth-flow.test.tsx` → authentication flow
* `habit-form.test.tsx` → habit CRUD

### E2E Tests

* `app.spec.ts` → full user journey

---

## ⚖️ Assumptions & Trade-offs

* Authentication is local (TRD requirement)
* Passwords stored in localStorage (no backend allowed)
* Only daily habits supported
* No external APIs used
* Focused on deterministic behavior for testing

