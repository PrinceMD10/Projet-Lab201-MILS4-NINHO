import SectionTitle from './SectionTitle';
import styles from './DashboardSection.module.css';
export default function DashboardSection({ dates, orders, subscribers, posts, onDetail }) {
  const available = dates.filter((d) => !d.soldout).length;
  const revenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const soldTickets = orders.reduce((sum, order) => sum + Number(order.qty || 0), 0);
  const cards = [
    {label:'Commandes', value:orders.length, sub:'Réservations enregistrées', detail:{title:'Commandes billetterie', description:'Liste des dernières commandes sauvegardées localement dans le navigateur.', items: orders.slice(0,8).map((o)=>({label:`${o.name} · ${o.city}`, value:`${o.qty} billet(s) · ${o.total} €`}))}},
    {label:'CA démo', value:`${revenue} €`, sub:'Total localStorage', detail:{title:'Chiffre d’affaires démo', description:'Calcul local basé sur les commandes validées dans la modale d’achat.', items:[{label:'Total', value:`${revenue} €`},{label:'Commandes', value:orders.length},{label:'Panier moyen', value:orders.length ? `${Math.round(revenue / orders.length)} €` : '0 €'}]}},
    {label:'Billets', value:soldTickets, sub:'Quantité vendue', detail:{title:'Billets vendus', description:'Quantité totale de billets réservés dans l’application.', items:dates.map((d)=>({label:d.ville, value:orders.filter((o)=>o.city===d.ville).reduce((s,o)=>s+Number(o.qty||0),0)+' billet(s)'}))}},
    {label:'Abonnés', value:subscribers.length, sub:'Newsletter', detail:{title:'Abonnés newsletter', description:'Emails enregistrés via le formulaire News & Media.', items:subscribers.slice(0,10).map((s)=>({label:s.email, value:new Date(s.createdAt).toLocaleDateString('fr-FR')}))}},
  ];
  return <section id="dashboard" className={styles.dashboard}>
    <SectionTitle eyebrow="02 — Dashboard" title="Pilotage" />
    <div className={styles.cards}>{cards.map((card)=><button className={styles.card} key={card.label} onClick={()=>onDetail(card.detail)}><span>{card.label}</span><strong>{card.value}</strong><small>{card.sub} · ouvrir →</small></button>)}</div>
    <div className={styles.panelGrid}>
      <button className={styles.panel} onClick={()=>onDetail({title:'Disponibilité tournée',description:'Répartition des dates disponibles et complètes.',items:dates.map((d)=>({label:`${d.ville} · ${d.lieu}`,value:d.soldout?'Complet':`${d.price} € · disponible`}))})}><h3>Disponibilité tournée</h3><div className={styles.bar}><i style={{width:`${dates.length ? (available/dates.length)*100 : 0}%`}}/></div><p>{available} date(s) disponible(s) sur {dates.length}</p></button>
      <button className={styles.panel} onClick={()=>onDetail({title:'Contenus média',description:'Articles consultables dans News & Media.',items:posts.map((p)=>({label:p.titre,value:p.cat}))})}><h3>Contenus média</h3><div className={styles.pills}>{posts.slice(0,4).map((p)=><span key={p.id}>{p.cat}</span>)}</div><p>{posts.length} article(s) publiés et consultables.</p></button>
    </div>
  </section>;
}
