import { formatDate } from "../utils/date";
import styles from "./TicketModal.module.css";

export default function TicketModal({ date, onClose }) {
  if (!date) return null;

  const ticketUrl =
    typeof date.ticketUrl === "string" && date.ticketUrl.startsWith("https://")
      ? date.ticketUrl
      : "#";

  return (
    <div
      className={styles.overlay}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ticket-title"
      >
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="Fermer"
        >
          ×
        </button>

        <span>Billetterie officielle</span>

        <h2 id="ticket-title">{date.ville}</h2>

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

          {date.address && (
            <p>
              <strong>Adresse :</strong> {date.address}
            </p>
          )}

          {date.doors && (
            <p>
              <strong>Ouverture :</strong> {date.doors}
            </p>
          )}

          {date.show && (
            <p>
              <strong>Début du concert :</strong> {date.show}
            </p>
          )}
        </div>

        <div className={styles.actions}>
          {ticketUrl !== "#" ? (
            <a
              href={ticketUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className={styles.buyBtn}
            >
              Réserver sur la plateforme officielle
            </a>
          ) : (
            <button type="button" className={styles.buyBtn} disabled>
              Billetterie indisponible
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
