"use client";

import { useEffect, useMemo, useState } from "react";
import type { Habit } from "@/types/habit";
import type { Session } from "@/types/auth";
import { getActiveSession, logoutUser } from "@/lib/auth";
import { getHabits, saveHabits } from "@/lib/storage";
import { toggleHabitCompletion } from "@/lib/habits";
import HabitForm from "./HabitForm";
import HabitCard from "./HabitCard";
import { useRouter } from "next/navigation";

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function HabitList() {
  const router = useRouter();

  const [session, setSession] = useState<Session | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [habitToDelete, setHabitToDelete] = useState<Habit | null>(null);

  const today = getToday();

  useEffect(() => {
    const activeSession = getActiveSession();
    setSession(activeSession);
    setHabits(getHabits());
  }, []);

  const userHabits = useMemo(() => {
    if (!session) return [];
    return habits.filter((habit) => habit.userId === session.userId);
  }, [habits, session]);

  function persistHabits(nextHabits: Habit[]) {
    setHabits(nextHabits);
    saveHabits(nextHabits);
  }

  function handleLogout() {
    logoutUser();
    router.replace("/login");
  }

  function handleCreateClick() {
    setEditingHabit(null);
    setShowForm(true);
  }

  function handleCancelForm() {
    setShowForm(false);
    setEditingHabit(null);
  }

  function handleSaveHabit(values: {
    name: string;
    description: string;
    frequency: "daily";
  }) {
    if (!session) return;

    if (editingHabit) {
      const nextHabits = habits.map((habit) =>
        habit.id === editingHabit.id
          ? {
              ...habit,
              name: values.name,
              description: values.description,
              frequency: "daily" as const,
            }
          : habit,
      );

      persistHabits(nextHabits);
      setEditingHabit(null);
      setShowForm(false);
      return;
    }

    const newHabit: Habit = {
      id: crypto.randomUUID(),
      userId: session.userId,
      name: values.name,
      description: values.description,
      frequency: "daily",
      createdAt: new Date().toISOString(),
      completions: [],
    };

    persistHabits([...habits, newHabit]);
    setShowForm(false);
  }

  function handleEditHabit(habit: Habit) {
    setEditingHabit(habit);
    setShowForm(true);
  }

  function handleToggleCompletion(habit: Habit) {
    const updatedHabit = toggleHabitCompletion(habit, today);
    const nextHabits = habits.map((item) =>
      item.id === habit.id ? updatedHabit : item,
    );

    persistHabits(nextHabits);
  }

  function handleConfirmDelete() {
    if (!habitToDelete) return;

    const nextHabits = habits.filter((habit) => habit.id !== habitToDelete.id);
    persistHabits(nextHabits);
    setHabitToDelete(null);
  }

  return (
    <main
      data-testid="dashboard-page"
      className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 lg:px-8"
    >
      <section className="mx-auto max-w-4xl">
        <header className="flex flex-col gap-4 rounded-3xl bg-slate-950 p-5 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-300">Signed in as</p>
            <h1 className="break-all text-xl font-bold">{session?.email}</h1>
          </div>

          <button
            data-testid="auth-logout-button"
            type="button"
            onClick={handleLogout}
            className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-slate-200"
          >
            Logout
          </button>
        </header>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Your Habits</h2>
            <p className="mt-1 text-sm text-slate-600">
              Track your daily progress and keep your streak alive.
            </p>
          </div>

          <button
            data-testid="create-habit-button"
            type="button"
            onClick={handleCreateClick}
            className="rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-700"
          >
            Create Habit
          </button>
        </div>

        {showForm && (
          <div className="mt-6">
            <HabitForm
              initialHabit={editingHabit}
              onCancel={handleCancelForm}
              onSave={handleSaveHabit}
            />
          </div>
        )}

        <section className="mt-6 space-y-4">
          {userHabits.length === 0 ? (
            <div
              data-testid="empty-state"
              className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center"
            >
              <h2 className="text-xl font-bold">No habits yet</h2>
              <p className="mt-2 text-sm text-slate-600">
                Create your first daily habit to begin tracking your streak.
              </p>
            </div>
          ) : (
            userHabits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                today={today}
                onToggleComplete={handleToggleCompletion}
                onEdit={handleEditHabit}
                onDeleteRequest={setHabitToDelete}
              />
            ))
          )}
        </section>
      </section>

      {habitToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 flex items-center justify-center bg-black/50 px-4"
        >
          <section className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold">Delete habit?</h2>
            <p className="mt-2 text-sm text-slate-600">
              This action cannot be undone.
            </p>

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setHabitToDelete(null)}
                className="flex-1 rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                data-testid="confirm-delete-button"
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 rounded-xl bg-red-600 px-4 py-3 font-semibold text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
