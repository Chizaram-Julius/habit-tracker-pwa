import { describe, expect, it, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SignupForm from "@/components/auth/SignupForm";
import LoginForm from "@/components/auth/LoginForm";
import { SESSION_KEY, USERS_KEY } from "@/lib/constants";

const replaceMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: replaceMock,
  }),
}));

describe("auth flow", () => {
  beforeEach(() => {
    localStorage.clear();
    replaceMock.mockClear();
  });

  it("submits the signup form and creates a session", async () => {
    const user = userEvent.setup();

    render(<SignupForm />);

    await user.type(
      screen.getByTestId("auth-signup-email"),
      "test@example.com",
    );
    await user.type(screen.getByTestId("auth-signup-password"), "password123");
    await user.click(screen.getByTestId("auth-signup-submit"));

    const users = JSON.parse(localStorage.getItem(USERS_KEY) ?? "[]");
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) ?? "null");

    expect(users).toHaveLength(1);
    expect(users[0].email).toBe("test@example.com");
    expect(session.email).toBe("test@example.com");
    expect(replaceMock).toHaveBeenCalledWith("/dashboard");
  });

  it("shows an error for duplicate signup email", async () => {
    const user = userEvent.setup();

    render(<SignupForm />);

    await user.type(
      screen.getByTestId("auth-signup-email"),
      "test@example.com",
    );
    await user.type(screen.getByTestId("auth-signup-password"), "password123");
    await user.click(screen.getByTestId("auth-signup-submit"));

    await user.clear(screen.getByTestId("auth-signup-email"));
    await user.clear(screen.getByTestId("auth-signup-password"));

    await user.type(
      screen.getByTestId("auth-signup-email"),
      "test@example.com",
    );
    await user.type(screen.getByTestId("auth-signup-password"), "password123");
    await user.click(screen.getByTestId("auth-signup-submit"));

    expect(screen.getByRole("alert")).toHaveTextContent("User already exists");
  });

  it("submits the login form and stores the active session", async () => {
    const user = userEvent.setup();

    localStorage.setItem(
      USERS_KEY,
      JSON.stringify([
        {
          id: "user-1",
          email: "test@example.com",
          password: "password123",
          createdAt: "2026-04-28T00:00:00.000Z",
        },
      ]),
    );

    render(<LoginForm />);

    await user.type(screen.getByTestId("auth-login-email"), "test@example.com");
    await user.type(screen.getByTestId("auth-login-password"), "password123");
    await user.click(screen.getByTestId("auth-login-submit"));

    const session = JSON.parse(localStorage.getItem(SESSION_KEY) ?? "null");

    expect(session).toEqual({
      userId: "user-1",
      email: "test@example.com",
    });
    expect(replaceMock).toHaveBeenCalledWith("/dashboard");
  });

  it("shows an error for invalid login credentials", async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    await user.type(
      screen.getByTestId("auth-login-email"),
      "wrong@example.com",
    );
    await user.type(screen.getByTestId("auth-login-password"), "wrongpass");
    await user.click(screen.getByTestId("auth-login-submit"));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Invalid email or password",
    );
  });
});
