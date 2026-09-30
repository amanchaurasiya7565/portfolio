import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const links = [["About", "#about"], ["Skills", "#skills"], ["Projects", "#projects"], ["Education", "#education"], ["Experience", "#experience"], ["Resume", "#resume"], ["Contact", "#contact"]];

  return (
    <header className="navbar">
      <a href="#home" className="logo" aria-label="Aman Chaurasiya home">
        <img src="/aman-logo.png" alt="Aman Chaurasiya logo" />
      </a>
      <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Toggle navigation" aria-expanded={open}>
        {open ? "✕" : "☰"}
      </button>
      <nav className={open ? "nav-open" : ""}>
        {links.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}
      </nav>
    </header>
  );
}
