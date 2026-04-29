export function getTodayKey() {
  return new Date().toISOString().split("T")[0];
}

export function getCurrentMinutes() {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

export function getTimeWindowEnd(time) {
  const windows = {
    morning: 12 * 60,
    afternoon: 17 * 60,
    evening: 20 * 60 + 30,
    night: 24 * 60,
  };

  return windows[time];
}

export function getTimeWindowLabel(time) {
  const labels = {
    morning: "5:00 AM - 12:00 PM",
    afternoon: "12:00 PM - 5:00 PM",
    evening: "5:00 PM - 8:30 PM",
    night: "8:30 PM - 12:00 AM",
  };

  return labels[time];
}

export function getTimePeriodLabel(time) {
  const labels = {
    morning: "Morning",
    afternoon: "Afternoon",
    evening: "Evening",
    night: "Night",
  };

  return labels[time];
}

export function isHabitBacklogged(habit) {
  const today = getTodayKey();
  const completedToday = habit.completedDates.includes(today);
  const currentMinutes = getCurrentMinutes();
  const endMinutes = getTimeWindowEnd(habit.time);

  return currentMinutes >= endMinutes && !completedToday;
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
