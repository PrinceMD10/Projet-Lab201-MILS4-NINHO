import { albumInfo, streamingLinks } from "../data/tracks";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.copy}>
        <p className={styles.kicker}>
          Ninho · {albumInfo.label} · 09 janvier 2026
        </p>
        <h1>
          M.I.L.S <span>4</span>
        </h1>
        <p className={styles.lead}>
          Ninho, de son vrai nom William Nzobazola, est l’un des rappeurs les
          plus influents de la scène française. Né le 2 avril 1996, il s’est
          imposé grâce à sa polyvalence, alternant morceaux mélodiques, rap
          technique et titres plus introspectifs. Révélé au grand public avec la
          série de mixtapes M.I.L.S (« Maintenant Ils Le Savent »), il a ensuite
          enchaîné les succès avec des albums certifiés disque de diamant et des
          centaines de certifications en France. Son écriture mêle récits de
          réussite, réflexions personnelles et observations de son
          environnement, ce qui lui a permis de devenir une figure majeure du
          rap francophone.
        </p>
        <div className={styles.actions}>
          <a className={styles.primary} href="#tracklist">
            Écouter les titres
          </a>
          <a className={styles.secondary} href="#tour">
            Réserver une date
          </a>
        </div>
        <div className={styles.streaming} aria-label="Liens streaming">
          {Object.entries(streamingLinks).map(([name, url]) => (
            <a key={name} href={url} target="_blank" rel="noreferrer">
              {name}
            </a>
          ))}
        </div>
      </div>
      <div className={styles.visual} aria-label="Affiche stylisée M.I.L.S 4">
        <div className={styles.orbit} />
        <img
          src={albumInfo.poster}
          alt="Affiche graphique Ninho M.I.L.S 4"
          className={styles.poster}
        />
        <div className={styles.badge}>Rec. 118</div>
      </div>
    </section>
  );
}
