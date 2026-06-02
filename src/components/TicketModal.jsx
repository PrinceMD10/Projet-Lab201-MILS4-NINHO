import { formatDate } from "../utils/date";
import styles from "./TicketModal.module.css";

export default function TicketModal({ date, onClose }) {
  if (!date) return null;

  return (
    <div
      className={styles.overlay}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles.modal}>
        <button type="button" className={styles.close} onClick={onClose}>
          ×
        </button>

        <span>Billetterie officielle</span>

        <h2>{date.ville}</h2>

        <p>
          {date.lieu} · {formatDate(date.date)}
        </p>

        <div className={styles.notice}>
          Les réservations sont gérées par la plateforme officielle de
          billetterie partenaire.
        </div>

        <div className={styles.info}>
          <p>
            <strong>Ville :</strong> {date.ville}
          </p>

          <p>
            <strong>Pays :</strong> {date.pays}
          </p>

          <p>
            <strong>Lieu :</strong> {date.lieu}
          </p>

          <p>
            <strong>Date :</strong> {formatDate(date.date)}
          </p>
        </div>

        <div className={styles.actions}>
          <a
            href={date.ticketUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.buyBtn}
          >
            Réserver sur la plateforme officielle
          </a>
        </div>
      </div>
    </div>
  );
}
