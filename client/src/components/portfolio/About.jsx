export default function About({ profile }) {
  return (
    <section id="about">
      <div className="section-container">
        <p className="section-label">ABOUT ME</p>

        <h2>Building, learning, and solving problems.</h2>

        <p>{profile.bio}</p>

        <div className="about-info">
          {profile.location && (
            <div>
              <strong>Location</strong>
              <span>{profile.location}</span>
            </div>
          )}

          {profile.email && (
            <div>
              <strong>Email</strong>
              <span>{profile.email}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}