import { useMemo, useState } from 'react';
import { formatDate } from '../utils/date';
import SectionTitle from './SectionTitle';
import styles from './TourSection.module.css';

export default function TourSection({ dates, onBuy, onDetails }) {
  const [filter,setFilter]=useState('all');
  const filtered=useMemo(()=>dates.filter((d)=>filter==='all'||(filter==='available'?!d.soldout:d.soldout)).sort((a,b)=>new Date(a.date)-new Date(b.date)),[dates,filter]);
  return <section id="tour" className={styles.section}><SectionTitle eyebrow="04 — Billetterie" title="Dates" />
    <div className={styles.filters}>{[['all','Toutes'],['available','Disponibles'],['soldout','Sold out']].map(([v,l])=><button key={v} className={filter===v?styles.selected:''} onClick={()=>setFilter(v)}>{l}</button>)}</div>
    <div className={styles.table}>{filtered.length===0?<p className={styles.empty}>Aucune date trouvée.</p>:filtered.map((d)=><article key={d.id} className={`${styles.row} ${d.soldout?styles.soldout:''}`}>
      <button className={styles.rowMain} onClick={()=>onDetails(d)}>
        <div><strong>{formatDate(d.date)}</strong><small>{d.ville}, {d.pays}</small></div>
        <div className={styles.venue}><b>{d.lieu}</b><small>{d.type} · portes {d.doors}</small></div>
        <div className={styles.price}>{d.price} €</div>
        <div>{d.soldout?<span className={styles.badge}>Complet</span>:<span className={styles.available}>Disponible</span>}</div>
      </button>
      <div className={styles.actions}>
        <button onClick={()=>onDetails(d)}>Détails</button>
        {d.soldout ? <button disabled>Complet</button> : <button onClick={()=>onBuy(d)}>Acheter</button>}
      </div>
    </article>)}</div>
  </section>;
}
