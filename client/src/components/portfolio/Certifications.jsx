export default function Certifications({
  certifications,
}) {
  return (
    <section id="certifications">
      <div className="section-container">
        <p className="section-label">
          CERTIFICATIONS
        </p>

        <h2>Courses & certifications</h2>

        <div className="certifications-grid">
          {certifications.map((item) => (
            <div
              className="certification-card"
              key={item._id}
            >
              <h3>{item.name}</h3>

              <p>{item.issuer}</p>

              <p>{item.issueDate}</p>

              {item.credentialId && (
                <small>
                  Credential: {item.credentialId}
                </small>
              )}

              {item.credentialUrl && (
                <div>
                  <a
                    href={item.credentialUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Verify credential
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}