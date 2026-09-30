export default function Hero({ profile }) {
  return (
    <section id="home" className="hero">
      <div className="hero-content">
        <p className="hero-intro">
          Hello, I'm
        </p>

        <h1>{profile.name}</h1>

        <h2>{profile.headline}</h2>

        <p className="hero-description">
          {profile.bio}
        </p>

        <div className="hero-buttons">
          <a
            href="#projects"
            className="primary-button"
          >
            View Projects
          </a>

          <a
            href="#contact"
            className="secondary-button"
          >
            Contact Me
          </a>
        </div>

        <div className="social-links">
          {profile.github && (
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
            >
              GitHub ↗
            </a>
          )}

          {profile.linkedin && (
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn ↗
            </a>
          )}
        </div>
      </div>

      {profile.profileImage && (
        <div className="hero-image-wrapper">
          <div className="hero-image-ring">
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