import SectionTitle from "./SectionTitle";
import { streamingLinks } from "../data/tracks";
import styles from "./TrackList.module.css";

export default function TrackList({
  tracks,
  current,
  playing,
  onPlay,
  onDetails,
}) {
  return (
    <section id="tracklist" className={styles.section}>
      <SectionTitle eyebrow="03 — Tracklist" title="Les titres" />

      <p className={styles.help}>
        Plonge dans l’univers de Ninho : découvre M.I.L.S 4, explore les titres,
        les exclusivités et reste connecté à toute son actualité.
      </p>

      <div className={styles.streaming}>
        <a
          href={streamingLinks.spotify}
          target="_blank"
          rel="noreferrer"
          className={styles.streamBtn}
        >
          Spotify
        </a>

        <a
          href={streamingLinks.youtube}
          target="_blank"
          rel="noreferrer"
          className={styles.streamBtn}
        >
          YouTube
        </a>

        <a
          href={streamingLinks.apple}
          target="_blank"
          rel="noreferrer"
          className={styles.streamBtn}
        >
          Apple Music
        </a>

        <a
          href={streamingLinks.deezer}
          target="_blank"
          rel="noreferrer"
          className={styles.streamBtn}
        >
          Deezer
        </a>
      </div>

      <div className={styles.list}>
        {tracks.map((track, index) => (
          <article
            key={track.num}
            className={`${styles.track} ${
              current === index ? styles.active : ""
            }`}
          >
            <button
              className={styles.main}
              onClick={() => onPlay(index)}
              aria-label={`Lire ${track.name}`}
            >
              <span className={styles.num}>
                {String(track.num).padStart(2, "0")}
              </span>

              <span className={styles.title}>
                <strong>{track.name}</strong>
                {track.feat && <small>{track.feat}</small>}
                <em>
                  {track.mood} · {track.bpm} BPM
                </em>
              </span>

              <span className={styles.state}>
                {current === index && playing ? "❚❚ Pause" : "▶ Play"}
              </span>

              <span className={styles.duration}>{track.dur}</span>
            </button>

            <button className={styles.details} onClick={() => onDetails(track)}>
              Infos
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
