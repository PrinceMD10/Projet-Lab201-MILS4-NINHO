import { formatDate } from '../utils/date';
import styles from './EventDetailModal.module.css';

export default function EventDetailModal({ event, onClose, onBuy }) {
  if (!event) return null;
  return (
    <div className={styles.overlay} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <article className={styles.modal}>
        <button className={styles.close} onClick={onClose}>×</button>
        <span className={styles.kicker}>Fiche concert</span>
        <h2>{event.ville}</h2>
        <p className={styles.lead}>{event.lieu} · {formatDate(event.date)}</p>
        <div className={styles.grid}>
          <Info label="Pays" value={event.pays} />
          <Info label="Type" value={event.type} />
          <Info label="Prix" value={`${event.price} €`} />
          <Info label="Capacité" value={`${event.capacity?.toLocaleString('fr-FR') || '—'} places`} />
          <Info label="Ouverture" value={event.doors} />
          <Info label="Show" value={event.show} />
        </div>
        <div className={styles.address}><span>Adresse</span><strong>{event.address}</strong><p>{event.notes}</p></div>
        <div className={styles.actions}>
          <button disabled={event.soldout} onClick={() => onBuy(event)}>{event.soldout ? 'Date complète' : 'Acheter dans l’app'}</button>
          <a href={event.ticketUrl} target="_blank" rel="noreferrer">Voir billetterie externe</a>
        </div>
      </article>
    </div>
  );
}
function Info({ label, value }) { return <div className={styles.info}><span>{label}</span><strong>{value}</strong></div>; }
