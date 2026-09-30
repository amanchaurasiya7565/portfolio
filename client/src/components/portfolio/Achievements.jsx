export default function Achievements({ achievements }) {
  return (
    <section id="achievements">
      <div className="section-container">
        <p className="section-label">
          ACHIEVEMENTS
        </p>

        <h2>Milestones</h2>

        <div className="projects-grid">
          {achievements.map((item) => (
            <div
              className="achievement-card"
              key={item._id}
            >
              <h3>{item.title}</h3>

              {item.date && <p>{item.date}</p>}

              <p>{item.description}</p>

              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  View achievement
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}