import { describe, expect, it } from "vitest";
import type { Habit } from "@/types/habit";
import { toggleHabitCompletion } from "@/lib/habits";

const baseHabit: Habit = {
  id: "habit-1",
  userId: "user-1",
  name: "Drink Water",
  description: "Drink enough water daily",
  frequency: "daily",
  createdAt: "2026-04-28T00:00:00.000Z",
  completions: [],
};

describe("toggleHabitCompletion", () => {
  it("adds a completion date when the date is not present", () => {
    const result = toggleHabitCompletion(baseHabit, "2026-04-28");

    expect(result.completions).toContain("2026-04-28");
  });

  it("removes a completion date when the date already exists", () => {
    const habit = {
      ...baseHabit,
      completions: ["2026-04-28"],
    };

    const result = toggleHabitCompletion(habit, "2026-04-28");

    expect(result.completions).not.toContain("2026-04-28");
  });

  it("does not mutate the original habit object", () => {
    const habit = {
      ...baseHabit,
      completions: [],
    };

    toggleHabitCompletion(habit, "2026-04-28");

    expect(habit.completions).toEqual([]);
  });

  it("does not return duplicate completion dates", () => {
    const habit = {
      ...baseHabit,
      completions: ["2026-04-28", "2026-04-28"],
    };

    const result = toggleHabitCompletion(habit, "2026-04-28");

    expect(result.completions).toEqual([]);
  });
});
