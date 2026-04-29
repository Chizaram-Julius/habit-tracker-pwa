import { describe, expect, it, beforeEach, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HabitList from "@/components/habits/HabitList";
import { HABITS_KEY, SESSION_KEY } from "@/lib/constants";

const replaceMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: replaceMock,
  }),
}));

describe("habit form", () => {
  beforeEach(() => {
    localStorage.clear();
    replaceMock.mockClear();

    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        userId: "user-1",
        email: "test@example.com",
      }),
    );
  });

  it("shows a validation error when habit name is empty", async () => {
    const user = userEvent.setup();

    render(<HabitList />);

    await user.click(screen.getByTestId("create-habit-button"));
    await user.click(screen.getByTestId("habit-save-button"));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Habit name is required",
    );
  });

  it("creates a new habit and renders it in the list", async () => {
    const user = userEvent.setup();

    render(<HabitList />);

    await user.click(screen.getByTestId("create-habit-button"));
    await user.type(screen.getByTestId("habit-name-input"), "Drink Water");
    await user.type(
      screen.getByTestId("habit-description-input"),
      "Drink 2 litres daily",
    );
    await user.click(screen.getByTestId("habit-save-button"));

    expect(screen.getByTestId("habit-card-drink-water")).toBeInTheDocument();

    const habits = JSON.parse(localStorage.getItem(HABITS_KEY) ?? "[]");

    expect(habits).toHaveLength(1);
    expect(habits[0].userId).toBe("user-1");
  });

  it("edits an existing habit and preserves immutable fields", async () => {
    const user = userEvent.setup();

    localStorage.setItem(
      HABITS_KEY,
      JSON.stringify([
        {
          id: "habit-1",
          userId: "user-1",
          name: "Drink Water",
          description: "Old description",
          frequency: "daily",
          createdAt: "2026-04-28T00:00:00.000Z",
          completions: ["2026-04-28"],
        },
      ]),
    );

    render(<HabitList />);

    await user.click(screen.getByTestId("habit-edit-drink-water"));
    await user.clear(screen.getByTestId("habit-name-input"));
    await user.type(screen.getByTestId("habit-name-input"), "Read Books");
    await user.clear(screen.getByTestId("habit-description-input"));
    await user.type(
      screen.getByTestId("habit-description-input"),
      "Updated description",
    );
    await user.click(screen.getByTestId("habit-save-button"));

    const habits = JSON.parse(localStorage.getItem(HABITS_KEY) ?? "[]");

    expect(habits[0]).toMatchObject({
      id: "habit-1",
      userId: "user-1",
      name: "Read Books",
      description: "Updated description",
      frequency: "daily",
      createdAt: "2026-04-28T00:00:00.000Z",
      completions: ["2026-04-28"],
    });
  });

  it("deletes a habit only after explicit confirmation", async () => {
    const user = userEvent.setup();

    localStorage.setItem(
      HABITS_KEY,
      JSON.stringify([
        {
          id: "habit-1",
          userId: "user-1",
          name: "Drink Water",
          description: "",
          frequency: "daily",
          createdAt: "2026-04-28T00:00:00.000Z",
          completions: [],
        },
      ]),
    );

    render(<HabitList />);

    await user.click(screen.getByTestId("habit-delete-drink-water"));

    expect(screen.getByTestId("habit-card-drink-water")).toBeInTheDocument();

    await user.click(screen.getByTestId("confirm-delete-button"));

    expect(
      screen.queryByTestId("habit-card-drink-water"),
    ).not.toBeInTheDocument();
  });

  it("toggles completion and updates the streak display", async () => {
    const user = userEvent.setup();

    localStorage.setItem(
      HABITS_KEY,
      JSON.stringify([
        {
          id: "habit-1",
          userId: "user-1",
          name: "Drink Water",
          description: "",
          frequency: "daily",
          createdAt: "2026-04-28T00:00:00.000Z",
          completions: [],
        },
      ]),
    );

    render(<HabitList />);

    await user.click(screen.getByTestId("habit-complete-drink-water"));

    expect(screen.getByTestId("habit-streak-drink-water")).toHaveTextContent(
      "Current streak: 1",
    );
  });
});
