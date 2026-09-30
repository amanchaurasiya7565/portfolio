export default function Skills({ skills }) {
  const groupedSkills = skills.reduce((groups, skill) => {
    if (!groups[skill.category]) {
      groups[skill.category] = [];
    }

    groups[skill.category].push(skill);

    return groups;
  }, {});

  return (
    <section id="skills">
      <div className="section-container">
        <p className="section-label">SKILLS</p>

        <h2>Technologies I work with</h2>

        <div className="skills-grid">
          {Object.entries(groupedSkills).map(
            ([category, categorySkills]) => (
              <div
                className="skill-category"
                key={category}
              >
                <h3>{category}</h3>

                {categorySkills.map((skill) => (
                  <div
                    className="skill"
                    key={skill._id}
                  >
                    <div className="skill-header">
                      <span>{skill.name}</span>
                      <span>{skill.level}%</span>
                    </div>

                    <div className="skill-bar">
                      <div
                        className="skill-progress"
                        style={{
                          width: `${skill.level}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}