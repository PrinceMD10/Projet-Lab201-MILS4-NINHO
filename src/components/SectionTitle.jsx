import styles from './SectionTitle.module.css';
export default function SectionTitle({ eyebrow, title, children }) {
  return <div className={styles.header}><p>{eyebrow}</p><h2>{title}</h2><div className={styles.line}/>{children}</div>;
}
