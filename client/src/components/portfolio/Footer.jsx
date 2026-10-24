import { getWhatsappUrl } from "../../utils/whatsapp";

export default function Footer({ profile }) {
  const whatsappUrl = getWhatsappUrl(profile?.whatsapp || profile?.phone);

  return (
    <footer className="footer-container">
      <p className="footer-copyright">
        © {new Date().getFullYear()} {profile?.name || "Aman Chaurasiya"}.
        All rights reserved.
      </p>

      <div className="footer-social-icons">
        {profile?.github && (
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub Profile"
            title="GitHub"
            className="footer-icon-link github"
          >
            <svg
              className="footer-svg-icon"
              viewBox="0 0 24 24"
              fill="currentColor"
              width="20"
              height="20"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
          </a>
        )}

        {profile?.linkedin && (
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn Profile"
            title="LinkedIn"
            className="footer-icon-link linkedin"
          >
            <svg
              className="footer-svg-icon"
              viewBox="0 0 24 24"
              fill="currentColor"
              width="20"
              height="20"
            >
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37h2.79V10.9H6.46M7.86 6.35a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
            </svg>
          </a>
        )}

        {whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp Chat"
            title="WhatsApp"
            className="footer-icon-link whatsapp"
          >
            <svg
              className="footer-svg-icon"
              viewBox="0 0 24 24"
              fill="currentColor"
              width="20"
              height="20"
            >
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.04 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M8.53 7.33C8.37 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7 8.5 7 9.71C7 10.93 7.89 12.1 8 12.27C8.14 12.44 9.76 14.94 12.25 16C12.84 16.27 13.3 16.42 13.66 16.53C14.25 16.72 14.79 16.69 15.22 16.63C15.7 16.56 16.68 16.03 16.89 15.45C17.1 14.87 17.1 14.38 17.04 14.27C16.97 14.17 16.81 14.11 16.56 13.99C16.32 13.86 15.12 13.27 14.9 13.19C14.68 13.1 14.52 13.06 14.36 13.3C14.19 13.55 13.73 14.11 13.58 14.27C13.44 14.44 13.31 14.46 13.07 14.34C12.82 14.21 11.79 13.87 10.57 12.79C9.62 11.94 8.98 10.9 8.85 10.66C8.73 10.42 8.84 10.29 8.96 10.16C9.07 10.05 9.21 9.87 9.33 9.73C9.45 9.58 9.5 9.47 9.58 9.31C9.66 9.14 9.62 9 9.56 8.88C9.5 8.76 9.03 7.62 8.85 7.15C8.65 6.69 8.47 6.75 8.33 6.75C8.2 6.74 8.04 6.74 7.87 6.74" />
            </svg>
          </a>
        )}

        {profile?.leetcode && (
          <a
            href={profile.leetcode}
            target="_blank"
            rel="noreferrer"
            aria-label="LeetCode Profile"
            title="LeetCode"
            className="footer-icon-link leetcode"
          >
            <svg
              className="footer-svg-icon"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="currentColor"
            >
              <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.247 2.198 5.86 2.164 8.067-.08l5.427-5.51a1.364 1.364 0 0 0 0-1.928 1.363 1.363 0 0 0-1.928 0l-5.427 5.511a3.023 3.023 0 0 1-4.277.042l-4.277-4.194a3.25 3.25 0 0 1-.7-1.002 3.14 3.14 0 0 1-.192-.562 3.09 3.09 0 0 1-.035-1.317 3.044 3.044 0 0 1 .685-1.189l3.854-4.126 5.406-5.788a1.374 1.374 0 0 0-.961-2.312z" />
              <path fill="#FFA116" d="M9.833 10.924a1.363 1.363 0 0 0 0 1.928l2.583 2.583a1.363 1.363 0 0 0 1.928-1.928l-2.583-2.583a1.363 1.363 0 0 0-1.928 0z" />
            </svg>
          </a>
        )}

        {profile?.codechef && (
          <a
            href={profile.codechef}
            target="_blank"
            rel="noreferrer"
            aria-label="CodeChef Profile"
            title="CodeChef"
            className="footer-icon-link codechef"
          >
            <svg
              className="footer-svg-icon"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
          </a>
        )}

        {profile?.codeforces && (
          <a
            href={profile.codeforces}
            target="_blank"
            rel="noreferrer"
            aria-label="Codeforces Profile"
            title="Codeforces"
            className="footer-icon-link codeforces"
          >
            <svg
              className="footer-svg-icon"
              viewBox="0 0 24 24"
              width="20"
              height="20"
            >
              <rect x="2" y="9" width="5" height="12" rx="1.5" fill="#318CE7"/>
              <rect x="9.5" y="3" width="5" height="18" rx="1.5" fill="#FFD700"/>
              <rect x="17" y="6" width="5" height="15" rx="1.5" fill="#FF3333"/>
            </svg>
          </a>
        )}
      </div>
    </footer>
  );
}