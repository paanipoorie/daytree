function HeatmapGrid({ days }) {
  return (
    <section className="heatmap-panel" aria-label="Habit completion heatmap">
      <div className="heatmap-grid">
        {days.map((day) => (
          <span
            className={`heatmap-cell heatmap-${day.level}`}
            key={day.dateKey}
            title={`${day.dateKey}: ${
              day.completionRate === null ? "No progress" : `${day.completionRate}%`
            }`}
          />
        ))}
      </div>
    </section>
  );
}

export default HeatmapGrid;
