export default function Hero({ profile }) {
  const rawWhatsapp = profile?.whatsapp || profile?.phone;
  const cleanWhatsapp = rawWhatsapp ? rawWhatsapp.replace(/\D/g, "") : null;
  const whatsappUrl = cleanWhatsapp
    ? `https://wa.me/${cleanWhatsapp.length === 10 ? `91${cleanWhatsapp}` : cleanWhatsapp}`
    : null;

  return (
    <section id="home" className="hero">
      <div className="hero-content">
        <p className="hero-intro">
          Hello, I'm
        </p>

        <h1 className="hero-title">{profile.name}</h1>

        <h2 className="hero-headline">
          {profile.headline}
        </h2>

        <p className="hero-description">
          {profile.bio}
        </p>

        <div className="hero-buttons">
          <a
            href="#projects"
            className="primary-button hero-cta"
          >
            <span>View Projects</span>
            <span className="btn-arrow">↓</span>
          </a>

          <a
            href="#contact"
            className="secondary-button hero-cta"
          >
            <span>Contact Me</span>
            <span className="btn-arrow">→</span>
          </a>
        </div>

        <div className="social-links">
          {profile.github && (
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="social-pill"
            >
              GitHub ↗
            </a>
          )}

          {profile.linkedin && (
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="social-pill"
            >
              LinkedIn ↗
            </a>
          )}

          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="social-pill whatsapp-pill"
            >
              WhatsApp ↗
            </a>
          )}
        </div>
      </div>

      {profile.profileImage && (
        <div className="hero-image-wrapper">
          <div className="hero-image-ring card-3d">
            <img
              src={profile.profileImage}
              alt={profile.name}
            />
          </div>
        </div>
      )}
    </section>
  );
}