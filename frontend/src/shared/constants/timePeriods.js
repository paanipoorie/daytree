// One shared source for the time buckets used across Home, Backlogs, and Tally.
// Keeping these labels in one file avoids duplicated strings like "morning".
export const TIME_PERIODS = [
  {
    id: "morning",
    label: "Morning",
    windowLabel: "5:00 AM - 12:00 PM",
    endMinutes: 12 * 60,
  },
  {
    id: "afternoon",
    label: "Afternoon",
    windowLabel: "12:00 PM - 5:00 PM",
    endMinutes: 17 * 60,
  },
  {
    id: "evening",
    label: "Evening",
    windowLabel: "5:00 PM - 8:30 PM",
    endMinutes: 20 * 60 + 30,
  },
  {
    id: "night",
    label: "Night",
    windowLabel: "8:30 PM - 12:00 AM",
    endMinutes: 24 * 60,
  },
];

export function getTimePeriod(timeId) {
  return TIME_PERIODS.find((period) => period.id === timeId);
}
