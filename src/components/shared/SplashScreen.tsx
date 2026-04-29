export default function SplashScreen() {
  return (
    <main
      data-testid="splash-screen"
      className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white"
    >
      <section className="text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500 text-3xl font-bold">
          H
        </div>

        <h1 className="text-3xl font-bold tracking-tight">Habit Tracker</h1>

        <p className="mt-3 text-sm text-slate-300">
          Build consistency one day at a time.
        </p>
      </section>
    </main>
  );
}
