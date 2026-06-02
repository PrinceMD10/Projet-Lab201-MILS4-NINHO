import styles from './TrackDetailModal.module.css';

export default function TrackDetailModal({ track, onClose, onPlay }) {
  if (!track) return null;
  return (
    <div className={styles.overlay} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <article className={styles.modal}>
        <button className={styles.close} onClick={onClose}>×</button>
        <div className={styles.head}>
          <span>{String(track.num).padStart(2, '0')}</span>
          <div>
            <p>Fiche titre</p>
            <h2>{track.name}</h2>
            {track.feat && <strong>{track.feat}</strong>}
          </div>
        </div>
        <p className={styles.description}>{track.description}</p>
        <div className={styles.grid}>
          <Info label="Durée" value={track.dur} />
          <Info label="BPM" value={track.bpm} />
          <Info label="Ambiance" value={track.mood} />
          <Info label="Thèmes" value={track.theme} />
          <Info label="Producteur" value={track.producer} />
          <Info label="Statut audio" value={track.status} />
        </div>
        <div className={styles.fileBox}>
          <span>Chemin audio attendu</span>
          <code>{track.file}</code>
        </div>
        <div className={styles.actions}>
          {/* FIX: onPlay ferme aussi la modale (géré dans App.jsx) */}
          <button onClick={onPlay}>▶ Lire ce titre</button>
          {track.youtube && (
            <a href={track.youtube} target="_blank" rel="noreferrer">▶ YouTube</a>
          )}
          {track.spotify && (
            <a href={track.spotify} target="_blank" rel="noreferrer">Spotify</a>
          )}
        </div>
      </article>
    </div>
  );
}

function Info({ label, value }) {
  return <div className={styles.info}><span>{label}</span><strong>{value || '—'}</strong></div>;
}
