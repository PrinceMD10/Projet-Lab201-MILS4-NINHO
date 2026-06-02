import { albumInfo, streamingLinks } from '../data/tracks';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.copy}>
        <p className={styles.kicker}>Ninho · {albumInfo.label} · 09 janvier 2026</p>
        <h1>M.I.L.S <span>4</span></h1>
        <p className={styles.lead}>Application React premium pour présenter l’album, écouter les fichiers autorisés, gérer les réservations, consulter les médias et piloter la campagne.</p>
        <div className={styles.actions}>
          <a className={styles.primary} href="#tracklist">Écouter les titres</a>
          <a className={styles.secondary} href="#tour">Réserver une date</a>
        </div>
        <div className={styles.streaming} aria-label="Liens streaming">
          {Object.entries(streamingLinks).map(([name, url]) => <a key={name} href={url} target="_blank" rel="noreferrer">{name}</a>)}
        </div>
      </div>
      <div className={styles.visual} aria-label="Affiche stylisée M.I.L.S 4">
        <div className={styles.orbit} />
        <img src={albumInfo.poster} alt="Affiche graphique Ninho M.I.L.S 4" className={styles.poster} />
        <div className={styles.badge}>Rec. 118</div>
        <div className={styles.note}>Remplaceable par une affiche officielle autorisée dans public/images/</div>
      </div>
    </section>
  );
}
