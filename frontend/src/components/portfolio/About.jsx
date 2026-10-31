import { useState, useMemo } from "react";
import { getWhatsappUrl } from "../../utils/whatsapp";

export default function About({ profile }) {
  const [viewMode, setViewMode] = useState("cards"); // "cards" | "story"
  const [copied, setCopied] = useState(false);
  const [activeCard, setActiveCard] = useState(null);

  const rawWhatsapp = profile?.whatsapp || profile?.phone;
  const whatsappUrl = getWhatsappUrl(rawWhatsapp);

  // Parse bio into structured interactive cards
  const bioCards = useMemo(() => {
    if (!profile?.bio) return [];

    const lines = profile.bio
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    if (lines.length === 0) return [];

    // Helper to extract leading emoji and determine appropriate tag
    const parseLine = (line, index) => {
      // Common emojis check
      const emojiMatch = line.match(
        /^([\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F900}-\u{1F9FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2728}\u{26A1}\u{2705}]+)\s*(.*)$/u
      );

      let icon = "💡";
      let text = line;
      if (emojiMatch) {
        icon = emojiMatch[1];
        text = emojiMatch[2];
      }

      // Contextual tag detection
      const lower = text.toLowerCase();
      let tag = "Highlight";
      if (lower.includes("hi") || lower.includes("student") || lower.includes("b.tech")) {
        tag = "Introduction";
        if (!emojiMatch) icon = "👋";
      } else if (lower.includes("c++") || lower.includes("python") || lower.includes("java") || lower.includes("web dev") || lower.includes("tech")) {
        tag = "Tech Stack";
        if (!emojiMatch) icon = "💻";
      } else if (lower.includes("project") || lower.includes("ideas") || lower.includes("hands-on") || lower.includes("experience")) {
        tag = "Practical Craft";
        if (!emojiMatch) icon = "🚀";
      } else if (lower.includes("goal") || lower.includes("software engineer") || lower.includes("impact") || lower.includes("solutions")) {
        tag = "Vision & Goals";
        if (!emojiMatch) icon = "🎯";
      } else if (lower.includes("learning") || lower.includes("growing") || lower.includes("always")) {
        tag = "Mindset";
        if (!emojiMatch) icon = "✨";
      }

      return {
        id: index,
        icon,
        tag,
        text,
      };
    };

    return lines.map((line, idx) => parseLine(line, idx));
  }, [profile?.bio]);

  const handleCopyBio = () => {
    if (!profile?.bio) return;
    navigator.clipboard.writeText(profile.bio);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <section id="about" className="about-section">
      <div className="section-container">
        <p className="section-label">ABOUT ME</p>

        <div className="about-heading-row">
          <h2 className="section-title" style={{ marginBottom: 0 }}>
            Building, learning, and <span className="cursive-accent">solving problems</span>.
          </h2>

          {profile?.bio && (
            <div className="about-interactive-actions">
              <div className="about-view-toggle" role="group" aria-label="Bio view switcher">
                <button
                  type="button"
                  className={`toggle-view-btn ${viewMode === "cards" ? "active" : ""}`}
                  onClick={() => setViewMode("cards")}
                  title="Interactive Cards View"
                  aria-pressed={viewMode === "cards"}
                >
                  <span>🎴 Cards</span>
                </button>
                <button
                  type="button"
                  className={`toggle-view-btn ${viewMode === "story" ? "active" : ""}`}
                  onClick={() => setViewMode("story")}
                  title="Continuous Narrative View"
                  aria-pressed={viewMode === "story"}
                >
                  <span>📄 Narrative</span>
                </button>
              </div>

              <button
                type="button"
                className="about-copy-btn"
                onClick={handleCopyBio}
                title="Copy complete bio"
                aria-label="Copy bio to clipboard"
              >
                {copied ? "✓ Copied!" : "📋 Copy"}
              </button>
            </div>
          )}
        </div>

        {/* Interactive Bio Presentation */}
        {profile?.bio && (
          <div className="about-bio-container">
            {viewMode === "cards" ? (
              <div className="about-bio-cards-grid">
                {bioCards.map((card, idx) => {
                  const isCurrent = activeCard === card.id;
                  return (
                    <div
                      key={card.id}
                      className={`about-bio-card card-3d ${isCurrent ? "card-active" : ""}`}
                      onMouseEnter={() => setActiveCard(card.id)}
                      onMouseLeave={() => setActiveCard(null)}
                      onFocus={() => setActiveCard(card.id)}
                      onBlur={() => setActiveCard(null)}
                      tabIndex="0"
                      role="article"
                      aria-label={`${card.tag}: ${card.text}`}
                    >
                      <div className="bio-card-topbar">
                        <div className="bio-card-icon-pill">
                          <span className="bio-card-emoji">{card.icon}</span>
                          <span className="bio-card-tag">{card.tag}</span>
                        </div>
                        <span className="bio-card-number">
                          {idx < 9 ? `0${idx + 1}` : idx + 1}
                        </span>
                      </div>

                      <p className="bio-card-text">{card.text}</p>

                      <div className="bio-card-glow-bar" />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="about-bio-story-box card-3d">
                <div className="story-box-badge">
                  <span>✨ Personal Narrative</span>
                </div>
                <p className="about-bio preserve-whitespace" style={{ marginBottom: 0 }}>
                  {profile.bio}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Contact & Meta Quick Cards */}
        <div className="about-info">
          {profile?.location && (
            <div className="about-info-item card-3d">
              <span className="info-icon">📍</span>
              <strong>Location</strong>
              <span className="info-value">{profile.location}</span>
            </div>
          )}

          {profile?.email && (
            <div className="about-info-item card-3d">
              <span className="info-icon">✉️</span>
              <strong>Email</strong>
              <a href={`mailto:${profile.email}`} className="info-value info-link">
                {profile.email}
              </a>
            </div>
          )}

          {rawWhatsapp && whatsappUrl && (
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