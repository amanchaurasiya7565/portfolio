export default function Education({ education }) {
  return (
    <section id="education">
      <div className="section-container">
        <p className="section-label">EDUCATION</p>

        <h2>My academic journey</h2>

        {education.map((item) => (
          <div className="timeline-item" key={item._id}>
            <h3>{item.degree}</h3>

            <p>
              {item.startYear} — {item.endYear}
            </p>

            <strong>{item.institution}</strong>

            {item.location && (
              <p>{item.location}</p>
            )}

            {item.grade && (
              <p>Grade: {item.grade}</p>
            )}

            {item.description && (
              <p>{item.description}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}