import { HABITS_KEY, SESSION_KEY, USERS_KEY } from "./constants";
import type { User, Session } from "@/types/auth";
import type { Habit } from "@/types/habit";

function isBrowser() {
  return typeof window !== "undefined";
}

function readJson<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;

  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (!isBrowser()) return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function getUsers(): User[] {
  return readJson<User[]>(USERS_KEY, []);
}

export function saveUsers(users: User[]) {
  writeJson(USERS_KEY, users);
}

export function getSession(): Session | null {
  return readJson<Session | null>(SESSION_KEY, null);
}

export function saveSession(session: Session | null) {
  writeJson(SESSION_KEY, session);
}

export function clearSession() {
  saveSession(null);
}

export function getHabits(): Habit[] {
  return readJson<Habit[]>(HABITS_KEY, []);
}

export function saveHabits(habits: Habit[]) {
  writeJson(HABITS_KEY, habits);
}
