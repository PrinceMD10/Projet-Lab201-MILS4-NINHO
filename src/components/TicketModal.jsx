import { useState } from 'react';
import { formatDate } from '../utils/date';
import styles from './TicketModal.module.css';
export default function TicketModal({ date, onClose, onConfirm }) {
  const [form,setForm]=useState({name:'',email:'',phone:'',qty:1,category:'Standard',payment:'Carte bancaire',accept:false});
  const [status,setStatus]=useState(null);
  if(!date) return null;
  const categoryExtra = form.category === 'Premium' ? 35 : form.category === 'Early' ? -10 : 0;
  const unit = Math.max(0, Number(date.price) + categoryExtra);
  const total=Number(form.qty)*unit;
  const endpoint=import.meta.env.VITE_MAIL_API_ENDPOINT;
  const recipient=import.meta.env.VITE_TICKETING_RECIPIENT || 'billetterie@ton-domaine.com';
  const summary=`Reservation Ninho - M.I.L.S 4\nNom: ${form.name}\nEmail: ${form.email}\nTelephone: ${form.phone || 'Non renseigne'}\nConcert: ${date.ville} - ${date.lieu}\nAdresse: ${date.address}\nDate: ${formatDate(date.date)}\nCategorie: ${form.category}\nPaiement choisi: ${form.payment}\nQuantite: ${form.qty}\nTotal: ${total} EUR`;
  const mailto=`mailto:${encodeURIComponent(recipient)}?subject=${encodeURIComponent(`Reservation Ninho - ${date.ville}`)}&body=${encodeURIComponent(summary)}`;
  function downloadReceipt(order){
    const blob=new Blob([summary+`\nReference: ${order.id}`],{type:'text/plain;charset=utf-8'});
    const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`reservation-ninho-${date.ville}.txt`; a.click(); URL.revokeObjectURL(url);
  }
  async function submit(e){
    e.preventDefault();
    if(!form.name.trim()||!form.email.includes('@')||!form.accept){setStatus(['err','Nom, e-mail valide et acceptation des conditions obligatoires.']);return;}
    const order={id:`MILS4-${Date.now()}`,...form,qty:Number(form.qty),unit,total,city:date.ville,venue:date.lieu,address:date.address,date:date.date,createdAt:new Date().toISOString()};
    onConfirm(order);
    if(endpoint){try{const res=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...order,to:form.email,bcc:recipient,subject:`Reservation Ninho - ${date.ville}`,message:summary})}); if(!res.ok) throw new Error(`HTTP ${res.status}`); setStatus(['ok','Réservation enregistrée et demande e-mail envoyée à ton endpoint.']);}catch(err){setStatus(['err',`Réservation enregistrée, mais l’e-mail serveur a échoué : ${err.message}`]);}}
    else setStatus(['ok','Réservation enregistrée. Pour un vrai e-mail automatique, configure VITE_MAIL_API_ENDPOINT. Tu peux aussi utiliser le bouton mail ou télécharger le reçu.']);
    downloadReceipt(order);
  }
  return <div className={styles.overlay} onMouseDown={(e)=>{ if(e.target===e.currentTarget) onClose(); }}><form className={styles.modal} onSubmit={submit}><button type="button" className={styles.close} onClick={onClose}>×</button><span>Achat billet</span><h2>{date.ville}</h2><p>{date.lieu} · {formatDate(date.date)} · portes {date.doors} · show {date.show}</p>{!endpoint&&<div className={styles.notice}>Le front-end enregistre la commande et génère un reçu. Pour envoyer un vrai e-mail automatiquement, branche l’endpoint fourni dans <code>.env</code>.</div>}
    <div className={styles.grid}>
      <label>Nom complet<input value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} placeholder="Ex : Laurence Kuzord"/></label>
      <label>E-mail<input type="email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} placeholder="exemple@email.com"/></label>
      <label>Téléphone<input value={form.phone} onChange={(e)=>setForm({...form,phone:e.target.value})} placeholder="+33 ..."/></label>
      <label>Quantité<select value={form.qty} onChange={(e)=>setForm({...form,qty:e.target.value})}>{[1,2,3,4,5,6].map((n)=><option key={n}>{n}</option>)}</select></label>
      <label>Catégorie<select value={form.category} onChange={(e)=>setForm({...form,category:e.target.value})}><option>Early</option><option>Standard</option><option>Premium</option></select></label>
      <label>Paiement souhaité<select value={form.payment} onChange={(e)=>setForm({...form,payment:e.target.value})}><option>Carte bancaire</option><option>PayPal</option><option>Virement</option><option>Paiement sur place</option></select></label>
    </div>
    <label className={styles.check}><input type="checkbox" checked={form.accept} onChange={(e)=>setForm({...form,accept:e.target.checked})}/> J’accepte les conditions de réservation démo.</label>
    <div className={styles.total}><span>{form.qty} × {unit} €</span><strong>{total} €</strong></div>{status&&<p className={status[0]==='ok'?styles.ok:styles.err}>{status[1]}</p>}<div className={styles.actions}><button type="submit">Confirmer et générer le reçu</button><a href={mailto}>Envoyer par e-mail</a></div></form></div>;
}
