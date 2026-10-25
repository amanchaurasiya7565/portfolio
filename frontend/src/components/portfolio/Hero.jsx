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
          <h2 className="hero-headline preserve-whitespace">
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

          {profile?.leetcode && (
            <a
              href={profile.leetcode}
              target="_blank"
              rel="noreferrer"
              className="social-pill leetcode-pill"
              title="LeetCode Profile"
            >
              <svg
                viewBox="0 0 24 24"
                width="15"
                height="15"
                fill="currentColor"
                style={{ verticalAlign: "-2px", marginRight: "6px" }}
              >
                <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.247 2.198 5.86 2.164 8.067-.08l5.427-5.51a1.364 1.364 0 0 0 0-1.928 1.363 1.363 0 0 0-1.928 0l-5.427 5.511a3.023 3.023 0 0 1-4.277.042l-4.277-4.194a3.25 3.25 0 0 1-.7-1.002 3.14 3.14 0 0 1-.192-.562 3.09 3.09 0 0 1-.035-1.317 3.044 3.044 0 0 1 .685-1.189l3.854-4.126 5.406-5.788a1.374 1.374 0 0 0-.961-2.312z" />
                <path fill="#FFA116" d="M9.833 10.924a1.363 1.363 0 0 0 0 1.928l2.583 2.583a1.363 1.363 0 0 0 1.928-1.928l-2.583-2.583a1.363 1.363 0 0 0-1.928 0z" />
              </svg>
              <span>LeetCode</span>
              <span className="pill-arrow">↗</span>
            </a>
          )}

          {profile?.codechef && (
            <a
              href={profile.codechef}
              target="_blank"
              rel="noreferrer"
              className="social-pill codechef-pill"
              title="CodeChef Profile"
            >
              <svg
                viewBox="0 0 24 24"
                width="15"
                height="15"
                fill="currentColor"
                style={{ verticalAlign: "-2px", marginRight: "6px" }}
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
              <span>CodeChef</span>
              <span className="pill-arrow">↗</span>
            </a>
          )}

          {profile?.codeforces && (
            <a
              href={profile.codeforces}
              target="_blank"
              rel="noreferrer"
              className="social-pill codeforces-pill"
              title="Codeforces Profile"
            >
              <svg
                viewBox="0 0 24 24"
                width="15"
                height="15"
                style={{ verticalAlign: "-2px", marginRight: "6px" }}
              >
                <rect x="2" y="9" width="5" height="12" rx="1.5" fill="#318CE7"/>
                <rect x="9.5" y="3" width="5" height="18" rx="1.5" fill="#FFD700"/>
                <rect x="17" y="6" width="5" height="15" rx="1.5" fill="#FF3333"/>
              </svg>
              <span>Codeforces</span>
              <span className="pill-arrow">↗</span>
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