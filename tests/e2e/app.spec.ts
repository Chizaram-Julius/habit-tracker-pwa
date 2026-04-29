import { expect, test } from "@playwright/test";

const USERS_KEY = "habit-tracker-users";
const SESSION_KEY = "habit-tracker-session";
const HABITS_KEY = "habit-tracker-habits";

async function clearStorage(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.evaluate(() => localStorage.clear());
}

async function seedUser(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.evaluate(
    ({ usersKey }) => {
      localStorage.setItem(
        usersKey,
        JSON.stringify([
          {
            id: "user-1",
            email: "test@example.com",
            password: "password123",
            createdAt: "2026-04-28T00:00:00.000Z",
          },
          {
            id: "user-2",
            email: "second@example.com",
            password: "password123",
            createdAt: "2026-04-28T00:00:00.000Z",
          },
        ])
      );
    },
    { usersKey: USERS_KEY }
  );
}

async function seedSession(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.evaluate(
    ({ sessionKey }) => {
      localStorage.setItem(
        sessionKey,
        JSON.stringify({
          userId: "user-1",
          email: "test@example.com",
        })
      );
    },
    { sessionKey: SESSION_KEY }
  );
}

async function seedHabitsForTwoUsers(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.evaluate(
    ({ habitsKey }) => {
      localStorage.setItem(
        habitsKey,
        JSON.stringify([
          {
            id: "habit-1",
            userId: "user-1",
            name: "Drink Water",
            description: "Drink water daily",
            frequency: "daily",
            createdAt: "2026-04-28T00:00:00.000Z",
            completions: [],
          },
          {
            id: "habit-2",
            userId: "user-2",
            name: "Read Books",
            description: "Other user habit",
            frequency: "daily",
            createdAt: "2026-04-28T00:00:00.000Z",
            completions: [],
          },
        ])
      );
    },
    { habitsKey: HABITS_KEY }
  );
}

test.describe("Habit Tracker app", () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page);
  });

  test("shows the splash screen and redirects unauthenticated users to /login", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByTestId("splash-screen")).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test("redirects authenticated users from / to /dashboard", async ({ page }) => {
    await seedSession(page);

    await page.goto("/");

    await expect(page.getByTestId("splash-screen")).toBeVisible();
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("prevents unauthenticated access to /dashboard", async ({ page }) => {
    await page.goto("/dashboard");

    await expect(page).toHaveURL(/\/login/);
  });

  test("signs up a new user and lands on the dashboard", async ({ page }) => {
    await page.goto("/signup");

    await page.getByTestId("auth-signup-email").fill("new@example.com");
    await page.getByTestId("auth-signup-password").fill("password123");
    await page.getByTestId("auth-signup-submit").click();

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByTestId("dashboard-page")).toBeVisible();
  });

  test("logs in an existing user and loads only that user's habits", async ({ page }) => {
    await seedUser(page);
    await seedHabitsForTwoUsers(page);

    await page.goto("/login");

    await page.getByTestId("auth-login-email").fill("test@example.com");
    await page.getByTestId("auth-login-password").fill("password123");
    await page.getByTestId("auth-login-submit").click();

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByTestId("habit-card-drink-water")).toBeVisible();
    await expect(page.getByTestId("habit-card-read-books")).not.toBeVisible();
  });

  test("creates a habit from the dashboard", async ({ page }) => {
    await seedSession(page);

    await page.goto("/dashboard");

    await page.getByTestId("create-habit-button").click();
    await page.getByTestId("habit-name-input").fill("Drink Water");
    await page.getByTestId("habit-description-input").fill("Drink 2 litres daily");
    await page.getByTestId("habit-save-button").click();

    await expect(page.getByTestId("habit-card-drink-water")).toBeVisible();
  });

  test("completes a habit for today and updates the streak", async ({ page }) => {
    await seedSession(page);
    await seedHabitsForTwoUsers(page);

    await page.goto("/dashboard");

    await page.getByTestId("habit-complete-drink-water").click();

    await expect(page.getByTestId("habit-streak-drink-water")).toContainText(
      "Current streak: 1"
    );
  });

  test("persists session and habits after page reload", async ({ page }) => {
    await seedSession(page);

    await page.goto("/dashboard");

    await page.getByTestId("create-habit-button").click();
    await page.getByTestId("habit-name-input").fill("Drink Water");
    await page.getByTestId("habit-save-button").click();

    await page.reload();

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByTestId("habit-card-drink-water")).toBeVisible();
  });

  test("logs out and redirects to /login", async ({ page }) => {
    await seedSession(page);

    await page.goto("/dashboard");

    await page.getByTestId("auth-logout-button").click();

    await expect(page).toHaveURL(/\/login/);
  });

  test("loads the cached app shell when offline after the app has been loaded once", async ({
    page,
    context,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await context.setOffline(true);

    await page.goto("/");

    await expect(page.locator("body")).toBeVisible();

    await context.setOffline(false);
  });
});