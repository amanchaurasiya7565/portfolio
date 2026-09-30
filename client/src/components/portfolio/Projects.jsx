export default function Projects({ projects }) {
  return (
    <section id="projects">
      <div className="section-container">
        <p className="section-label">PROJECTS</p>

        <h2>Things I've built</h2>

        <div className="projects-grid">
          {projects.map((project) => (
            <article
              className="project-card"
              key={project._id}
            >
              {project.image && (
                <img
                  src={project.image}
                  alt={project.title}
                />
              )}

              <div className="project-content">
                {project.featured && (
                  <span className="featured">
                    Featured
                  </span>
                )}

                <h3>{project.title}</h3>

                <p>{project.description}</p>

                <div className="technologies">
                  {project.technologies.map((tech) => (
                    <span key={tech}>
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="project-links">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      GitHub
                    </a>
                  )}

                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}