export default function Footer({ profile }) {
  return (
    <footer>
      <p>
        © {new Date().getFullYear()} {profile.name}.
        All rights reserved.
      </p>

      <div>
        {profile.github && (
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        )}

        {profile.linkedin && (
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
        )}
      </div>
    </footer>
  );
}