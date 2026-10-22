export default function About({ profile }) {
  const rawWhatsapp = profile?.whatsapp || profile?.phone;
  const cleanWhatsapp = rawWhatsapp ? rawWhatsapp.replace(/\D/g, "") : null;
  const whatsappUrl = cleanWhatsapp
    ? `https://wa.me/${cleanWhatsapp.length === 10 ? `91${cleanWhatsapp}` : cleanWhatsapp}`
    : null;

  return (
    <section id="about" className="about-section">
      <div className="section-container">
        <p className="section-label">ABOUT ME</p>

        <h2 className="section-title">
          Building, learning, and <span className="cursive-accent">solving problems</span>.
        </h2>

        <p className="about-bio">{profile.bio}</p>

        <div className="about-info">
          {profile.location && (
            <div className="about-info-item card-3d">
              <span className="info-icon">📍</span>
              <strong>Location</strong>
              <span className="info-value">{profile.location}</span>
            </div>
          )}

          {profile.email && (
            <div className="about-info-item card-3d">
              <span className="info-icon">✉️</span>
              <strong>Email</strong>
              <a href={`mailto:${profile.email}`} className="info-value info-link">
                {profile.email}
              </a>
            </div>
          )}

          {rawWhatsapp && (
            <div className="about-info-item card-3d whatsapp-info-item">
              <span className="info-icon">💬</span>
              <strong>WhatsApp</strong>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="info-value info-link"
              >
                {rawWhatsapp} ↗
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}