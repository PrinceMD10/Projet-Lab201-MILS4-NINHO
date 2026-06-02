import { albumInfo } from '../data/tracks';
import SectionTitle from './SectionTitle';
import styles from './ProjectSection.module.css';

const stats = [['16','titres'], ['09.01','sortie'], ['REC.118','label'], ['100%','interactif']];

export default function ProjectSection() {
  return (
    <section id="project" className={styles.project}>
      <SectionTitle eyebrow="01 — Album" title="M.I.L.S 4" />

      <div className={styles.grid}>
        <div className={styles.story}>
          <p>
            <strong>M.I.L.S 4</strong> est le quatrième et dernier volet de la
            série « Maintenant Ils Le Savent », un projet emblématique qui a
            accompagné l’ascension de <strong>Ninho</strong> parmi les figures
            majeures du rap français.
          </p>

          <p>
            Sorti le <strong>09 janvier 2026</strong> sous le label
            <strong> Rec. 118</strong>, l’album marque un retour aux
            fondamentaux de l’artiste avec des productions soignées, des
            textes incisifs et une identité fidèle à l’univers qui a construit
            son succès.
          </p>

          <p>
            À travers 16 titres mêlant introspection, réussite, ambition et
            regard sur son parcours, Ninho clôt la saga M.I.L.S avec un projet
            pensé comme un hommage à ses débuts tout en affirmant son statut
            incontournable dans le rap francophone.
          </p>

          <p>
            Porté par des morceaux comme <em>+971</em>, <em>King Von</em>,
            <em> Wallet</em>, <em>Au 33ème</em> ou <em>Des Piges</em>, l’album
            offre une expérience immersive autour de l’univers artistique de
            Ninho et de son évolution au fil des années.
          </p>
        </div>

        <div className={styles.posterCard}>
          <img src="/images/mils4-poster.svg" alt="Affiche M.I.L.S 4" />
          <div>
            <span>Affiche campagne</span>
            <strong>Ninho — M.I.L.S 4</strong>
            <small>Style noir · or · rouge / Rec. 118</small>
          </div>
        </div>

        <div className={styles.stats}>
          {stats.map(([value, label]) => (
            <div key={label} className={styles.stat}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
