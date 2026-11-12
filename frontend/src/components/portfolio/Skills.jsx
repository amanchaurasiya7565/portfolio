import { useState, useMemo } from "react";

// Fallback high-clarity tech icons when no custom image is uploaded
const DEFAULT_TECH_LOGOS = {
  "c++": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
  "python": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  "javascript": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  "java script": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  "react": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  "react.js": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  "reactjs": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  "html": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
  "html5": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
  "html ,css": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
  "html, css": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
  "css": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
  "css3": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
  "node": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  "node.js": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  "express": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
  "mongodb": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
  "git": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
  "github": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
  "c": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg",
  "java": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
  "docker": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
  "tailwind": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
};

function getSkillLogo(skill) {
  // 1. If uploaded image from backend exists, use it directly
  if (skill.image && typeof skill.image === "string" && skill.image.trim()) {
    return skill.image;
  }
  // 2. Otherwise check popular tech logo dictionary
  const normalized = (skill.name || "").toLowerCase().trim();
  for (const [key, url] of Object.entries(DEFAULT_TECH_LOGOS)) {
    if (normalized === key || normalized.includes(key)) {
      return url;
    }
  }
  return null;
}

export default function Skills({ skills = [] }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [hoveredSkill, setHoveredSkill] = useState(null);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set();
    skills.forEach((s) => {
      if (s.category) set.add(s.category);
    });
    return ["All", ...Array.from(set)];
  }, [skills]);

  // Filter skills
  const filteredSkills = useMemo(() => {
    if (selectedCategory === "All") return skills;
    return skills.filter((s) => s.category === selectedCategory);
  }, [skills, selectedCategory]);

  return (
    <section id="skills" className="skills-section">
      <div className="section-container">
        <p className="section-label">TECHNICAL COMPETENCIES</p>

        <div className="skills-header-row">
          <div>
            <h2 className="section-title">
              Skills & <span className="cursive-accent">Technologies</span>
            </h2>
            <p className="skills-subtitle">
              Tools, languages, and frameworks I use to build scalable, modern applications.
            </p>
          </div>

          {/* Category Filter Pills */}
          {categories.length > 2 && (
            <div className="skills-filter-bar" role="tablist">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`skills-filter-btn ${selectedCategory === cat ? "active" : ""}`}
                  role="tab"
                  aria-selected={selectedCategory === cat}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* New Circular Skills Line Display */}
        <div className="skills-line-wrapper">
          <div className="skills-circles-line">
            {filteredSkills.map((skill) => {
              const logo = getSkillLogo(skill);
              const isHovered = hoveredSkill === (skill._id || skill.name);

              return (
                <div
                  key={skill._id || skill.name}
                  className={`skill-circle-item ${isHovered ? "hovered" : ""}`}
                  onMouseEnter={() => setHoveredSkill(skill._id || skill.name)}
                  onMouseLeave={() => setHoveredSkill(null)}
                  tabIndex="0"
                  aria-label={`${skill.name} (${skill.category})`}
                >
                  {/* Glowing Circular Avatar */}
                  <div className="skill-circle-avatar card-3d">
                    <span className="skill-circle-glow" />
                    <span className="skill-circle-ring" />

                    {logo ? (
                      <img
                        src={logo}
                        alt={`${skill.name} logo`}
                        className="skill-circle-img"
                        loading="lazy"
                        onError={(e) => {
                          // Fallback to text initials if image fails
                          e.currentTarget.style.display = "none";
                          const fallback = e.currentTarget.nextSibling;
                          if (fallback) fallback.style.display = "flex";
                        }}
                      />
                    ) : null}

                    {/* Initials fallback */}
                    <div
                      className="skill-circle-fallback"
                      style={{ display: logo ? "none" : "flex" }}
                    >
                      {skill.name.slice(0, 2).toUpperCase()}
                    </div>

                    {/* Level Badge Pill on hover */}
                    {skill.level ? (
                      <span className="skill-circle-level-badge">
                        {skill.level}%
                      </span>
                    ) : null}
                  </div>

                  {/* Skill Name */}
                  <span className="skill-circle-name">{skill.name}</span>

                  {/* Category Subtitle */}
                  {skill.category && (
                    <span className="skill-circle-category">
                      {skill.category}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {filteredSkills.length === 0 && (
          <div className="skills-empty-note">
            <p>No skills found in this category.</p>
          </div>
        )}
      </div>
    </section>
  );
}
