import { useMemo, useState } from 'react';
import { formatDate } from '../utils/date';
import SectionTitle from './SectionTitle';
import styles from './MediaSection.module.css';
export default function MediaSection({ posts, onOpen, onSubscribe }) {
  const [email,setEmail]=useState(''); const [msg,setMsg]=useState(''); const [cat,setCat]=useState('Tous');
  const categories=useMemo(()=>['Tous',...Array.from(new Set(posts.map((p)=>p.cat)))],[posts]);
  const visible=cat==='Tous'?posts:posts.filter((p)=>p.cat===cat);
  function submit(){ const clean=email.trim().toLowerCase(); if(!clean.includes('@')){setMsg('Adresse e-mail invalide.');return;} onSubscribe(clean); setEmail(''); setMsg('Inscription enregistrée dans le dashboard et le back-office.'); }
  return <section id="media" className={styles.section}><SectionTitle eyebrow="05 — News & Media" title="Studio · Art · Interview" />
    <div className={styles.tabs}>{categories.map((item)=><button key={item} className={cat===item?styles.active:''} onClick={()=>setCat(item)}>{item}</button>)}</div>
    <div className={styles.cards}>{visible.map((p)=><article key={p.id} className={styles.card}>
      <button className={styles.thumb} onClick={()=>onOpen(p)}><img src={p.image || '/images/ninho-mils4-poster.svg'} alt={p.titre}/><span>{p.cat}</span></button>
      <div className={styles.cardBody}><span>{p.cat}</span><h3>{p.titre}</h3><p>{p.excerpt}</p><small>{formatDate(p.date)}</small><button onClick={()=>onOpen(p)}>Lire l’article complet</button></div>
    </article>)}</div>
    <div className={styles.subscribe}><h3>Newsletter M.I.L.S 4</h3><p>Recevoir les clips, dates, contenus médias et annonces. L’adresse apparaît ensuite dans le dashboard et le back-office.</p><div><input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="votre@email.com" onKeyDown={(e)=>{if(e.key==='Enter')submit();}}/><button onClick={submit}>S’inscrire</button></div>{msg && <small>{msg}</small>}</div>
  </section>;
}
