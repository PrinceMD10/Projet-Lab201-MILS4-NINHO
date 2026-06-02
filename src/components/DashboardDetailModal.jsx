import styles from './DashboardDetailModal.module.css';

export default function DashboardDetailModal({ detail, onClose }) {
  if (!detail) return null;
  return (
    <div className={styles.overlay} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <article className={styles.modal}>
        <button className={styles.close} onClick={onClose}>×</button>
        <span>Dashboard</span>
        <h2>{detail.title}</h2>
        <p>{detail.description}</p>
        <div className={styles.list}>
          {detail.items?.length ? detail.items.map((item, index) => <div key={index}><strong>{item.label}</strong><small>{item.value}</small></div>) : <div><strong>Aucune donnée</strong><small>Les données apparaîtront après interaction avec l’application.</small></div>}
        </div>
      </article>
    </div>
  );
}
