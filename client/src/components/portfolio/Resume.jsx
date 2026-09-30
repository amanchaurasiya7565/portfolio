export default function Resume({ resumeUrl }) {
  if (!resumeUrl) {
    return null;
  }

  return (
    <section id="resume" className="section resume-section">
      <div className="section-heading">
        <p className="section-eyebrow">Resume</p>

        <h2>
          My Resume
        </h2>

        <p>
          View or download my latest resume.
        </p>
      </div>

      <div className="resume-actions">
        <a
          href={resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="primary-button"
        >
          View Resume
        </a>

        <a
          href={resumeUrl}
          download="Arjun-Sharma-Resume.pdf"
          className="secondary-button"
        >
          Download Resume
        </a>
      </div>
    </section>
  );
}