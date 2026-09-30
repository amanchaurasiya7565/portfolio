export default function Contact({ profile }) {
  return (
    <section id="contact">
      <div className="section-container">
        <p className="section-label">CONTACT</p>

        <h2>Let's build something together.</h2>

        <p>
          I'm open to internships, projects,
          collaborations, and interesting
          software engineering opportunities.
        </p>

        <a href={`mailto:${profile.email}`}>
          {profile.email}
        </a>
      </div>
    </section>
  );
}