import { useEffect, useState } from "react";
import styles from "./NavBar.module.css";

const links = [
  ["#project", "Projet"],
  ["#dashboard", "Dashboard"],
  ["#tracklist", "Tracklist"],
  ["#tour", "Billets"],
];

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`${styles.nav} ${compact ? styles.compact : ""}`}>
      <a className={styles.brand} href="#hero" onClick={() => setOpen(false)}>
        NINHO<span>M.I.L.S 4</span>
      </a>
      <nav className={`${styles.links} ${open ? styles.open : ""}`}>
        {links.map(([href, label]) => (
          <a key={href} href={href} onClick={() => setOpen(false)}>
            {label}
          </a>
        ))}
      </nav>
      <button
        className={`${styles.burger} ${open ? styles.burgerOpen : ""}`}
        onClick={() => setOpen((value) => !value)}
        aria-label="Ouvrir le menu"
      >
        <span />
        <span />
        <span />
      </button>
    </header>
  );
}
