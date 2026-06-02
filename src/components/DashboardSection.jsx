import SectionTitle from "./SectionTitle";
import styles from "./DashboardSection.module.css";

export default function DashboardSection({
  dates,
  orders,
  subscribers,
  posts,
  onDetail,
}) {
  const available = dates.filter((d) => !d.soldout).length;
  const revenue = orders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0,
  );
  const soldTickets = orders.reduce(
    (sum, order) => sum + Number(order.qty || 0),
    0,
  );

  const cards = [
    {
      label: "Commandes",
      value: orders.length,
      sub: "Réservations enregistrées sur la plateforme",
      detail: {
        title: "Commandes billetterie",
        description: "Suivi des réservations effectuées par les utilisateurs.",
        items: orders.slice(0, 8).map((o) => ({
          label: `${o.name} · ${o.city}`,
          value: `${o.qty} billet(s)`,
        })),
      },
    },

    {
      label: "Chiffre d'affaires",
      value: `${revenue} €`,
      sub: "Montant total généré par la billetterie",
      detail: {
        title: "Chiffre d'affaires",
        description: "Vue globale des revenus générés par les réservations.",
        items: [
          { label: "Total généré", value: `${revenue} €` },
          { label: "Commandes", value: orders.length },
          {
            label: "Panier moyen",
            value: orders.length
              ? `${Math.round(revenue / orders.length)} €`
              : "0 €",
          },
        ],
      },
    },

    {
      label: "Billets",
      value: soldTickets,
      sub: "Billets réservés pour la tournée",
      detail: {
        title: "Billets réservés",
        description: "Répartition des billets réservés selon les villes.",
        items: dates.map((d) => ({
          label: d.ville,
          value:
            orders
              .filter((o) => o.city === d.ville)
              .reduce((s, o) => s + Number(o.qty || 0), 0) + " billet(s)",
        })),
      },
    },

    {
      label: "Abonnés",
      value: subscribers.length,
      sub: "Inscrits aux actualités de l'artiste",
      detail: {
        title: "Abonnés newsletter",
        description:
          "Utilisateurs inscrits aux actualités et annonces officielles.",
        items: subscribers.slice(0, 10).map((s) => ({
          label: s.email,
          value: new Date(s.createdAt).toLocaleDateString("fr-FR"),
        })),
      },
    },
  ];

  return (
    <section id="dashboard" className={styles.dashboard}>
      <SectionTitle eyebrow="02 — Dashboard" title="Pilotage" />
      <p className={styles.description}>
        Projet LAB201 — Tableau de bord de gestion de l’écosystème M.I.L.S 4.
      </p>
      <div className={styles.cards}>
        {cards.map((card) => (
          <button
            className={styles.card}
            key={card.label}
            onClick={() => onDetail(card.detail)}
          >
            <span>{card.label}</span>
            <strong>{card.value}</strong>
            <small>{card.sub}</small>
          </button>
        ))}
      </div>

      <div className={styles.panelGrid}>
        <button
          className={styles.panel}
          onClick={() =>
            onDetail({
              title: "Disponibilité tournée",
              description:
                "Suivi des concerts actuellement ouverts à la réservation.",
              items: dates.map((d) => ({
                label: `${d.ville} · ${d.lieu}`,
                value: d.soldout ? "Complet" : "Disponible",
              })),
            })
          }
        >
          <h3>Disponibilité tournée</h3>

          <div className={styles.bar}>
            <i
              style={{
                width: `${
                  dates.length ? (available / dates.length) * 100 : 0
                }%`,
              }}
            />
          </div>

          <p>{available} concert(s) actuellement ouverts à la réservation.</p>
        </button>

        <button
          className={styles.panel}
          onClick={() =>
            onDetail({
              title: "Contenus média",
              description:
                "Actualités, interviews et contenus liés à l'univers artistique de Ninho.",
              items: posts.map((p) => ({
                label: p.titre,
                value: p.cat,
              })),
            })
          }
        >
          <h3>Contenus média</h3>

          <div className={styles.pills}>
            {posts.slice(0, 4).map((p) => (
              <span key={p.id}>{p.cat}</span>
            ))}
          </div>

          <p>
            Espace média dédié aux interviews, actualités et contenus exclusifs.
          </p>
        </button>
      </div>
    </section>
  );
}
