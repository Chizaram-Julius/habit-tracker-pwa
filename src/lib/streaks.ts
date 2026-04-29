function getPreviousDate(dateString: string): string {
  const [year, month, day] = dateString.split("-").map(Number);

  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() - 1);

  return date.toISOString().slice(0, 10);
}

export function calculateCurrentStreak(
  completions: string[],
  today?: string,
): number {
  const currentDay = today ?? new Date().toISOString().slice(0, 10);
  const completionSet = new Set(completions);

  if (!completionSet.has(currentDay)) {
    return 0;
  }

  let streak = 0;
  let dayToCheck = currentDay;

  while (completionSet.has(dayToCheck)) {
    streak += 1;
    dayToCheck = getPreviousDate(dayToCheck);
  }

  return streak;
}
