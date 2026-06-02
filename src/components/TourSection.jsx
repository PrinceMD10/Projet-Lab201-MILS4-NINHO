import { useMemo, useState } from "react";
import { formatDate } from "../utils/date";
import SectionTitle from "./SectionTitle";
import styles from "./TourSection.module.css";

export default function TourSection({ dates }) {
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(
    () =>
      dates
        .filter(
          (d) =>
            filter === "all" ||
            (filter === "available" ? !d.soldout : d.soldout),
        )
        .sort((a, b) => new Date(a.date) - new Date(b.date)),
    [dates, filter],
  );

  return (
    <section id="tour" className={styles.section}>
      <SectionTitle eyebrow="04 — Billetterie" title="Dates" />

      <div className={styles.filters}>
        {[
          ["all", "Toutes"],
          ["available", "Disponibles"],
          ["soldout", "Sold Out"],
        ].map(([value, label]) => (
          <button
            key={value}
            className={filter === value ? styles.selected : ""}
            onClick={() => setFilter(value)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className={styles.table}>
        {filtered.length === 0 ? (
          <p className={styles.empty}>Aucune date trouvée.</p>
        ) : (
          filtered.map((d) => (
            <article
              key={d.id}
              className={`${styles.row} ${d.soldout ? styles.soldout : ""}`}
            >
              <div className={styles.rowMain}>
                <div>
                  <strong>{formatDate(d.date)}</strong>
                  <small>
                    {d.ville}, {d.pays}
                  </small>
                </div>

                <div className={styles.venue}>
                  <b>{d.lieu}</b>
                  <small>{d.type}</small>
                </div>

                <div>
                  {d.soldout ? (
                    <span className={styles.badge}>Complet</span>
                  ) : (
                    <span className={styles.available}>Disponible</span>
                  )}
                </div>
              </div>

              <div className={styles.actions}>
                {d.soldout ? (
                  <button disabled>Complet</button>
                ) : (
                  <a
                    href={d.ticketUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.buyLink}
                  >
                    Réserver
                  </a>
                )}
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
