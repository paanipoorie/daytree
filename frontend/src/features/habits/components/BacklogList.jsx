import { getTimePeriod } from "../../../shared/constants/timePeriods";
import { formatReadableDate } from "../../../shared/utils/dateUtils";

function BacklogList({ habits }) {
  const todayLabel = formatReadableDate(new Date());

  return (
    <section className="backlog-panel">
      <h2>Backlogs</h2>

      {habits.length === 0 && (
        <p className="empty-message">No pending habits.</p>
      )}

      {habits.map((habit) => {
        const period = getTimePeriod(habit.time);

        return (
          <article className="backlog-item" key={habit.id}>
            <span className="backlog-category">{period?.label}</span>
            <strong>{habit.name}</strong>
            <span className="backlog-date">{todayLabel}</span>
            <span className="backlog-time">{period?.windowLabel}</span>
          </article>
        );
      })}
    </section>
  );
}

export default BacklogList;
