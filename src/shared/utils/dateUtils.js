// Returns a stable date key like "2026-05-10".
// We use keys like this because arrays can compare strings easily.
export function getDateKey(date = new Date()) {
  return date.toISOString().split("T")[0];
}

// Converts current clock time into minutes after midnight.
// Example: 9:30 AM becomes 570, which is easy to compare with a habit window.
export function getCurrentMinutes(date = new Date()) {
  return date.getHours() * 60 + date.getMinutes();
}

export function formatReadableDate(date) {
  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function formatReadableTime(date) {
  return date
    .toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    })
    .toLowerCase();
}

export function addDays(date, amount) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + amount);
  return nextDate;
}

// Generates a date list ending today.
// Tally uses this to draw the heatmap without hardcoded analytics data.
export function getRecentDateKeys(dayCount) {
  const today = new Date();

  return Array.from({ length: dayCount }, (_, index) => {
    const offset = index - (dayCount - 1);
    return getDateKey(addDays(today, offset));
  });
}
