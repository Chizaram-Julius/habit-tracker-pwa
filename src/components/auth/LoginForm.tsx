"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/auth";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = loginUser(email, password);

    if (!result.ok) {
      setError(result.error ?? "Login failed");
      return;
    }

    if (!result.session) {
      setError("Login failed");
      return;
    }

    localStorage.setItem(
      "habit-tracker-session",
      JSON.stringify(result.session),
    );

    router.replace("/dashboard");
  }

  return (
    <section className="w-full max-w-md rounded-3xl bg-white p-6 shadow-lg">
      <h1 className="text-2xl font-bold">Welcome back</h1>
      <p className="mt-2 text-sm text-slate-600">
        Log in to continue tracking your habits.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label htmlFor="login-email" className="block text-sm font-semibold">
            Email
          </label>
          <input
            id="login-email"
            data-testid="auth-login-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
          />
        </div>

        <div>
          <label
            htmlFor="login-password"
            className="block text-sm font-semibold"
          >
            Password
          </label>
          <input
            id="login-password"
            data-testid="auth-login-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
          />
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        <button
          data-testid="auth-login-submit"
          type="submit"
          className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-700"
        >
          Log in
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-600">
        Need an account?{" "}
        <Link href="/signup" className="font-semibold text-indigo-700">
          Sign up
        </Link>
      </p>
    </section>
  );
}
