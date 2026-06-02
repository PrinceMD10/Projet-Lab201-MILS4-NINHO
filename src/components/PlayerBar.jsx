import { formatTime } from '../utils/date';
import styles from './PlayerBar.module.css';
export default function PlayerBar({ track, playing, progress, duration, warning, onToggle, onPrev, onNext, onSeek, onClose }) {
  if (!track) return null;
  return <div className={styles.player}><div className={styles.info}><strong>{track.name}</strong><small>{track.feat || 'Ninho — M.I.L.S 4'}</small>{warning && <em>{warning}</em>}</div><button onClick={onPrev}>⏮</button><button className={styles.play} onClick={onToggle}>{playing?'Ⅱ':'▶'}</button><button onClick={onNext}>⏭</button><span>{formatTime(progress)}</span><input type="range" min="0" max={duration || 1} value={progress} onChange={(e)=>onSeek(Number(e.target.value))}/><span>{formatTime(duration)}</span><button className={styles.close} onClick={onClose}>×</button></div>;
}
