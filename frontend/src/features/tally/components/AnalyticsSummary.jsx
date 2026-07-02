function AnalyticsSummary({ dailyAverage, longestStreak, currentStreak }) {
  return (
    <section className="analytics-summary">
      <article>
        <span>Daily Average</span>
        <strong>{dailyAverage}%</strong>
      </article>

      <article>
        <span>Longest Streak</span>
        <strong>{longestStreak} days</strong>
      </article>

      <article>
        <span>Current Streak</span>
        <strong>{currentStreak} days</strong>
      </article>
    </section>
  );
}

export default AnalyticsSummary;
