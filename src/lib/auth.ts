import type { Session, User } from "@/types/auth";
import {
  clearSession,
  getSession,
  getUsers,
  saveSession,
  saveUsers,
} from "./storage";

export function createUser(
  email: string,
  password: string,
): {
  ok: boolean;
  user: User | null;
  error: string | null;
} {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPassword = password.trim();

  if (!normalizedEmail || !normalizedPassword) {
    return {
      ok: false,
      user: null,
      error: "Email and password are required",
    };
  }

  const users = getUsers();
  const userExists = users.some((user) => user.email === normalizedEmail);

  if (userExists) {
    return {
      ok: false,
      user: null,
      error: "User already exists",
    };
  }

  const user: User = {
    id: crypto.randomUUID(),
    email: normalizedEmail,
    password: normalizedPassword,
    createdAt: new Date().toISOString(),
  };

  saveUsers([...users, user]);

  return {
    ok: true,
    user,
    error: null,
  };
}

export function loginUser(
  email: string,
  password: string,
): {
  ok: boolean;
  session: Session | null;
  error: string | null;
} {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPassword = password.trim();

  const user = getUsers().find(
    (item) =>
      item.email === normalizedEmail && item.password === normalizedPassword,
  );

  if (!user) {
    return {
      ok: false,
      session: null,
      error: "Invalid email or password",
    };
  }

  const session: Session = {
    userId: user.id,
    email: user.email,
  };

  saveSession(session);

  return {
    ok: true,
    session,
    error: null,
  };
}

export function signupUser(
  email: string,
  password: string,
): {
  ok: boolean;
  session: Session | null;
  error: string | null;
} {
  const result = createUser(email, password);

  if (!result.ok || !result.user) {
    return {
      ok: false,
      session: null,
      error: result.error,
    };
  }

  const session: Session = {
    userId: result.user.id,
    email: result.user.email,
  };

  saveSession(session);

  return {
    ok: true,
    session,
    error: null,
  };
}

export function logoutUser() {
  clearSession();
}

export function getActiveSession(): Session | null {
  return getSession();
}

export function hasActiveSession(): boolean {
  return Boolean(getSession());
}
