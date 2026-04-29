import {
  formatReadableDate,
  getTimePeriodLabel,
  getTimeWindowLabel,
} from "../utils/dates";

function BacklogList({ habits }) {
  const todayLabel = formatReadableDate(new Date());

  return (
    <section className="backlog-panel">
      <h2>Backlogs</h2>

      {habits.length === 0 && <p className="empty-message">No backlogs.</p>}

      {habits.map((habit) => (
        <article className="backlog-item" key={habit.id}>
          <span className="backlog-category">
            {getTimePeriodLabel(habit.time)}
          </span>
          <strong>{habit.name}</strong>
          <span className="backlog-date">{todayLabel}</span>
          <span className="backlog-time">{getTimeWindowLabel(habit.time)}</span>
        </article>
      ))}
    </section>
  );
}

export default BacklogList;
