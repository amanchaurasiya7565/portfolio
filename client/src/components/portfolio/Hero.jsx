import { getWhatsappUrl } from "../../utils/whatsapp";

export default function Hero({ profile }) {
  const whatsappUrl = getWhatsappUrl(profile?.whatsapp || profile?.phone);

  return (
    <section id="home" className="hero">
      <div className="hero-content">
        <p className="hero-intro">
          Hello, I'm
        </p>

        <h1 className="hero-title">{profile?.name || "Portfolio"}</h1>

        {profile?.headline && (
          <h2 className="hero-headline">
            {profile.headline}
          </h2>
        )}

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
          {profile?.github && (
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="social-pill"
            >
              GitHub ↗
            </a>
          )}

          {profile?.linkedin && (
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

      {profile?.profileImage && (
        <div className="hero-image-wrapper">
          <div className="hero-image-ring card-3d">
            <img
              src={profile.profileImage}
              alt={profile?.name || "Profile Photo"}
            />
          </div>
        </div>
      )}
    </section>
  );
}