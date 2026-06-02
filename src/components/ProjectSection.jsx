import { albumInfo } from '../data/tracks';
import SectionTitle from './SectionTitle';
import styles from './ProjectSection.module.css';
const stats = [['16','titres'], ['09.01','sortie'], ['REC.118','label'], ['100%','interactif']];
export default function ProjectSection() {
  return <section id="project" className={styles.project}>
    <SectionTitle eyebrow="01 — Projet" title="M.I.L.S 4" />
    <div className={styles.grid}>
      <div className={styles.story}>
        <p><strong>Ninho</strong> est maintenant au centre de l’expérience. Les anciens éléments décoratifs ont été transformés en zones consultables : fiches titres, fiches concerts, articles, dashboard et commandes.</p>
        <p>Chaque bouton mène à une action ou à une information : lecture audio, détail d’un morceau, achat, lien de billetterie externe, article complet, inscription newsletter ou suivi back-office.</p>
        <p>Pour utiliser une affiche officielle, ajoute ton image autorisée dans <span className="code">public/images/ninho-official-poster.jpg</span>, puis remplace la source dans les données. L’affiche incluse est une création graphique originale pour le style.</p>
      </div>
      <div className={styles.posterCard}>
        <img src={albumInfo.poster} alt="Affiche M.I.L.S 4" />
        <div><span>Affiche campagne</span><strong>Ninho — M.I.L.S 4</strong><small>Style noir · or · rouge / Rec. 118</small></div>
      </div>
      <div className={styles.stats}>{stats.map(([value,label])=><div key={label} className={styles.stat}><strong>{value}</strong><span>{label}</span></div>)}</div>
    </div>
  </section>;
}
