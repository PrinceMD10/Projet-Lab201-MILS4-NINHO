import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { tracks } from "./data/tracks";
import { initialTourDates } from "./data/tourDates";
import { initialBlogPosts } from "./data/blogPosts";
import { durationToSeconds } from "./utils/date";
import { loadStorage, saveStorage } from "./utils/storage";
import { safeEmail } from "./utils/security";
import NavBar from "./components/NavBar";
import Hero from "./components/Hero";
import ProjectSection from "./components/ProjectSection";
import DashboardSection from "./components/DashboardSection";
import TrackList from "./components/TrackList";
import TourSection from "./components/TourSection";
import MediaSection from "./components/MediaSection";
import PlayerBar from "./components/PlayerBar";
import TicketModal from "./components/TicketModal";
import ArticleModal from "./components/ArticleModal";
import TrackDetailModal from "./components/TrackDetailModal";
import EventDetailModal from "./components/EventDetailModal";
import DashboardDetailModal from "./components/DashboardDetailModal";
import AdminModal from "./components/AdminModal";
import Footer from "./components/Footer";
import "./styles/global.css";

const keys = {
  tourDates: "ninho.mils4.tourDates",
  blogPosts: "ninho.mils4.blogPosts",
  orders: "ninho.mils4.orders",
  subscribers: "ninho.mils4.subscribers",
};

export default function App() {
  const [dates, setDates] = useState(() =>
    loadStorage(keys.tourDates, initialTourDates),
  );
  const [posts, setPosts] = useState(() =>
    loadStorage(keys.blogPosts, initialBlogPosts),
  );
  const [orders, setOrders] = useState(() => loadStorage(keys.orders, []));
  const [subscribers, setSubscribers] = useState(() =>
    loadStorage(keys.subscribers, []),
  );
  const [adminOpen, setAdminOpen] = useState(false);
  const [ticketDate, setTicketDate] = useState(null);
  const [article, setArticle] = useState(null);
  const [trackDetails, setTrackDetails] = useState(null);
  const [eventDetails, setEventDetails] = useState(null);
  const [dashboardDetail, setDashboardDetail] = useState(null);
  const [current, setCurrent] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioWarning, setAudioWarning] = useState("");
  const audioRef = useRef(null);

  useEffect(() => {
    const openAdminFromUrl = () => {
      const isAdminUrl =
        window.location.pathname === "/back-office" ||
        window.location.pathname === "/admin" ||
        window.location.hash === "#back-office" ||
        new URLSearchParams(window.location.search).has("admin");

      if (isAdminUrl) {
        setAdminOpen(true);
      }
    };

    openAdminFromUrl();
    window.addEventListener("popstate", openAdminFromUrl);
    window.addEventListener("hashchange", openAdminFromUrl);

    return () => {
      window.removeEventListener("popstate", openAdminFromUrl);
      window.removeEventListener("hashchange", openAdminFromUrl);
    };
  }, []);

  function closeAdmin() {
    setAdminOpen(false);
    if (
      window.location.pathname === "/back-office" ||
      window.location.pathname === "/admin" ||
      window.location.hash === "#back-office" ||
      new URLSearchParams(window.location.search).has("admin")
    ) {
      window.history.replaceState({}, "", "/");
    }
  }

  // Stable ref to avoid stale closure in onended
  const currentRef = useRef(current);
  const playingRef = useRef(playing);
  useEffect(() => {
    currentRef.current = current;
  }, [current]);
  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  const track = current >= 0 ? tracks[current] : null;
  const fallbackDuration = useMemo(
    () => (track ? durationToSeconds(track.dur) : 0),
    [track],
  );

  useEffect(() => saveStorage(keys.tourDates, dates), [dates]);
  useEffect(() => saveStorage(keys.blogPosts, posts), [posts]);
  useEffect(() => saveStorage(keys.orders, orders), [orders]);
  useEffect(() => saveStorage(keys.subscribers, subscribers), [subscribers]);
  useEffect(() => {
    document.body.style.overflow =
      adminOpen ||
      ticketDate ||
      article ||
      trackDetails ||
      eventDetails ||
      dashboardDetail
        ? "hidden"
        : "";
  }, [
    adminOpen,
    ticketDate,
    article,
    trackDetails,
    eventDetails,
    dashboardDetail,
  ]);

  // FIX: audio effect now fully owns play/pause — no second effect needed
  useEffect(() => {
    if (current < 0) return;
    const t = tracks[current];
    setAudioWarning("");
    setProgress(0);
    setDuration(durationToSeconds(t.dur));

    // Destroy previous audio instance
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }

    const audio = new Audio(t.file);
    audioRef.current = audio;
    audio.preload = "metadata";

    audio.onloadedmetadata = () =>
      setDuration(audio.duration || durationToSeconds(t.dur));
    audio.ontimeupdate = () => setProgress(audio.currentTime || 0);

    // FIX: use ref to avoid stale closure
    audio.onended = () => {
      const next = (currentRef.current + 1) % tracks.length;
      setCurrent(next);
      setPlaying(true);
    };

    audio.onerror = () => {
      setPlaying(false);
      setAudioWarning(
        `Fichier audio absent : ${t.file}. Ajoute le MP3 dans public/audio/.`,
      );
    };

    // Always try to play when track changes (playing was set to true by playTrack)
    if (playingRef.current) {
      audio
        .play()
        .catch(() =>
          setAudioWarning(
            "Lecture bloquée par le navigateur. Clique à nouveau sur Play.",
          ),
        );
    }

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [current]);

  // FIX: separate effect only for toggling play/pause on the CURRENT audio instance
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || current < 0) return;
    if (playing) {
      audio
        .play()
        .catch(() =>
          setAudioWarning("Lecture impossible : fichier absent ou bloqué."),
        );
    } else {
      audio.pause();
    }
  }, [playing]);

  function playTrack(index) {
    if (current === index) {
      setPlaying((v) => !v);
    } else {
      setPlaying(true); // set playing BEFORE setCurrent so ref is up to date
      setCurrent(index);
    }
  }

  function nextTrack() {
    setPlaying(true);
    setCurrent((i) => (i + 1) % tracks.length);
  }

  // FIX: guard against null audioRef before accessing currentTime
  function prevTrack() {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    setPlaying(true);
    setCurrent((i) => (i - 1 + tracks.length) % tracks.length);
  }

  function seekTrack(value) {
    if (audioRef.current) audioRef.current.currentTime = value;
    setProgress(value);
  }

  function closePlayer() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    audioRef.current = null;
    setCurrent(-1);
    setPlaying(false);
    setAudioWarning("");
  }

  function addSubscriber(email) {
    const cleanEmail = safeEmail(email);

    if (!cleanEmail) {
      return;
    }

    if (!subscribers.some((item) => item.email === cleanEmail)) {
      setSubscribers((prev) => [
        {
          email: cleanEmail,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
    }
  }

  return (
    <>
      <NavBar />
      <Hero />
      <ProjectSection />
      <DashboardSection
        dates={dates}
        orders={orders}
        subscribers={subscribers}
        posts={posts}
        onDetail={setDashboardDetail}
      />
      <TrackList
        tracks={tracks}
        current={current}
        playing={playing}
        onPlay={playTrack}
        onDetails={setTrackDetails}
      />
      <TourSection
        dates={dates}
        onBuy={setTicketDate}
        onDetails={setEventDetails}
      />
      <MediaSection
        posts={posts}
        onOpen={setArticle}
        onSubscribe={addSubscriber}
      />
      <Footer />
      <PlayerBar
        track={track}
        playing={playing}
        progress={progress}
        duration={duration}
        warning={audioWarning}
        onToggle={() => setPlaying((v) => !v)}
        onPrev={prevTrack}
        onNext={nextTrack}
        onSeek={seekTrack}
        onClose={closePlayer}
      />
      <TicketModal
        date={ticketDate}
        onClose={() => setTicketDate(null)}
        onConfirm={(order) => setOrders((prev) => [order, ...prev])}
      />
      <ArticleModal article={article} onClose={() => setArticle(null)} />
      <TrackDetailModal
        track={trackDetails}
        onClose={() => setTrackDetails(null)}
        onPlay={() => {
          const index = tracks.findIndex(
            (item) => item.num === trackDetails?.num,
          );
          if (index >= 0) playTrack(index);
          setTrackDetails(null); // FIX: ferme la modale après lecture
        }}
      />
      <EventDetailModal
        event={eventDetails}
        onClose={() => setEventDetails(null)}
        onBuy={(event) => {
          setEventDetails(null);
          setTicketDate(event);
        }}
      />
      <DashboardDetailModal
        detail={dashboardDetail}
        onClose={() => setDashboardDetail(null)}
      />
      <AdminModal
        open={adminOpen}
        onClose={closeAdmin}
        dates={dates}
        setDates={setDates}
      />
    </>
  );
}
