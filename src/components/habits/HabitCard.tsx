"use client";

import type { Habit } from "@/types/habit";
import { getHabitSlug } from "@/lib/slug";
import { calculateCurrentStreak } from "@/lib/streaks";

type HabitCardProps = {
  habit: Habit;
  today: string;
  onToggleComplete: (habit: Habit) => void;
  onEdit: (habit: Habit) => void;
  onDeleteRequest: (habit: Habit) => void;
};

export default function HabitCard({
  habit,
  today,
  onToggleComplete,
  onEdit,
  onDeleteRequest,
}: HabitCardProps) {
  const slug = getHabitSlug(habit.name);
  const completedToday = habit.completions.includes(today);
  const streak = calculateCurrentStreak(habit.completions, today);

  return (
    <article
      data-testid={`habit-card-${slug}`}
      className={`rounded-3xl border p-5 shadow-sm ${
        completedToday
          ? "border-emerald-200 bg-emerald-50"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-950">{habit.name}</h2>
          {habit.description && (
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {habit.description}
            </p>
          )}

          <p
            data-testid={`habit-streak-${slug}`}
            className="mt-3 text-sm font-semibold text-indigo-700"
          >
            Current streak: {streak}
          </p>
        </div>

        <span
          className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
            completedToday
              ? "bg-emerald-600 text-white"
              : "bg-slate-200 text-slate-700"
          }`}
        >
          {completedToday ? "Completed today" : "Incomplete today"}
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <button
          data-testid={`habit-complete-${slug}`}
          type="button"
          onClick={() => onToggleComplete(habit)}
          className="rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          {completedToday ? "Unmark Today" : "Mark Complete"}
        </button>

        <button
          data-testid={`habit-edit-${slug}`}
          type="button"
          onClick={() => onEdit(habit)}
          className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
        >
          Edit
        </button>

        <button
          data-testid={`habit-delete-${slug}`}
          type="button"
          onClick={() => onDeleteRequest(habit)}
          className="rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-700 hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </article>
  );
}
