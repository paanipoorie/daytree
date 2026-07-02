/**
 * Returns a stable date key like "2026-05-10" using the environment's local timezone.
 * @param {Date|string|number} date
 * @returns {string} YYYY-MM-DD date key
 */
const getDateKey = (date = new Date()) => {
  const d = date instanceof Date ? date : new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Adds offset days to a given date.
 * @param {Date|string|number} date
 * @param {number} amount
 * @returns {Date}
 */
const addDays = (date, amount) => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + amount);
  return nextDate;
};

/**
 * Generates an array of recent local date keys ending today.
 * @param {number} dayCount
 * @returns {string[]}
 */
const getRecentDateKeys = (dayCount = 91) => {
  const today = new Date();
  return Array.from({ length: dayCount }, (_, index) => {
    const offset = index - (dayCount - 1);
    return getDateKey(addDays(today, offset));
  });
};

module.exports = {
  getDateKey,
  addDays,
  getRecentDateKeys,
};
