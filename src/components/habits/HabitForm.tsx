"use client";

import { FormEvent, useState } from "react";
import type { Habit } from "@/types/habit";
import { validateHabitName } from "@/lib/validators";

type HabitFormProps = {
  initialHabit?: Habit | null;
  onCancel: () => void;
  onSave: (values: {
    name: string;
    description: string;
    frequency: "daily";
  }) => void;
};

export default function HabitForm({
  initialHabit = null,
  onCancel,
  onSave,
}: HabitFormProps) {
  const [name, setName] = useState(initialHabit?.name ?? "");
  const [description, setDescription] = useState(
    initialHabit?.description ?? "",
  );
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = validateHabitName(name);

    if (!validation.valid) {
      setError(validation.error ?? "Invalid habit name");
      return;
    }

    setError("");
    onSave({
      name: validation.value,
      description: description.trim(),
      frequency: "daily",
    });
  }

  return (
    <form
      data-testid="habit-form"
      onSubmit={handleSubmit}
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div>
        <label
          htmlFor="habit-name"
          className="block text-sm font-semibold text-slate-800"
        >
          Habit name
        </label>
        <input
          id="habit-name"
          data-testid="habit-name-input"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
          placeholder="Drink Water"
        />
      </div>

      <div className="mt-4">
        <label
          htmlFor="habit-description"
          className="block text-sm font-semibold text-slate-800"
        >
          Description
        </label>
        <textarea
          id="habit-description"
          data-testid="habit-description-input"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className="mt-2 min-h-24 w-full rounded-xl border border-slate-300 px-4 py-3"
          placeholder="Optional habit description"
        />
      </div>

      <div className="mt-4">
        <label
          htmlFor="habit-frequency"
          className="block text-sm font-semibold text-slate-800"
        >
          Frequency
        </label>
        <select
          id="habit-frequency"
          data-testid="habit-frequency-select"
          value="daily"
          disabled
          className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-slate-700"
        >
          <option value="daily">Daily</option>
        </select>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          data-testid="habit-save-button"
          type="submit"
          className="rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-700"
        >
          Save Habit
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-100"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
