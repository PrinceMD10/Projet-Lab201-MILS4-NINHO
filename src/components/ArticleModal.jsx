import { formatDate } from '../utils/date';
import styles from './ArticleModal.module.css';
export default function ArticleModal({ article,onClose }) {
  if(!article) return null;
  return <div className={styles.overlay} onMouseDown={(e)=>{ if(e.target===e.currentTarget) onClose(); }}><article className={styles.modal}><button onClick={onClose} className={styles.close}>×</button><img src={article.image || '/images/ninho-mils4-poster.svg'} alt={article.titre} /><div className={styles.body}><span>{article.cat} · {formatDate(article.date)}</span><h2>{article.titre}</h2><p>{article.content}</p><div className={styles.meta}><strong>Information liée</strong><small>Contenu sauvegardé dans l’application et modifiable depuis le back-office.</small></div></div></article></div>;
}
