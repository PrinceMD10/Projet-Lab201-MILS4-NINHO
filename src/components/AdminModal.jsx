import { useEffect, useState } from "react";
import { formatDate } from "../utils/date";
import {
  getToken,
  login as loginAdmin,
  logout,
  saveToken,
  verifyToken,
} from "../services/Auth";
import {
  cleanNumber,
  cleanText,
  safeDate,
  safeExternalUrl,
  safeImagePath,
} from "../utils/security";
import styles from "./AdminModal.module.css";

const emptyDate = {
  date: "",
  ville: "",
  pays: "France",
  lieu: "",
  price: 69,
  soldout: false,
  capacity: 10000,
  type: "Arena",
  address: "",
  doors: "19:00",
  show: "21:00",
  ticketUrl: "https://www.ticketmaster.fr/search?q=Ninho",
  notes: "",
};

const emptyPost = {
  titre: "",
  cat: "Studio",
  excerpt: "",
  content: "",
  date: new Date().toISOString().slice(0, 10),
  image: "/images/ninho-mils4-poster.svg",
};

function sanitizeDateForm(form) {
  return {
    date: safeDate(form.date),
    ville: cleanText(form.ville, 80),
    pays: cleanText(form.pays, 80) || "France",
    lieu: cleanText(form.lieu, 120),
    price: cleanNumber(form.price, { min: 0, max: 10000, fallback: 0 }),
    soldout: Boolean(form.soldout),
    capacity: cleanNumber(form.capacity, { min: 0, max: 1000000, fallback: 0 }),
    type: cleanText(form.type, 60),
    address: cleanText(form.address, 180),
    doors: cleanText(form.doors, 20),
    show: cleanText(form.show, 20),
    ticketUrl: safeExternalUrl(form.ticketUrl, ""),
    notes: cleanText(form.notes, 600),
  };
}

function sanitizePostForm(form) {
  return {
    titre: cleanText(form.titre, 120),
    cat: cleanText(form.cat, 40) || "Studio",
    excerpt: cleanText(form.excerpt, 280),
    content: cleanText(form.content, 5000),
    date: safeDate(form.date) || new Date().toISOString().slice(0, 10),
    image: safeImagePath(form.image),
  };
}

export default function AdminModal({
  open,
  onClose,
  dates,
  setDates,
  posts,
  setPosts,
  orders,
  subscribers,
}) {
  const [logged, setLogged] = useState(false);
  const [username, setUsername] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("dashboard");
  const [dateForm, setDateForm] = useState(emptyDate);
  const [postForm, setPostForm] = useState(emptyPost);
  const [editDate, setEditDate] = useState(null);
  const [editPost, setEditPost] = useState(null);

  useEffect(() => {
    if (!open) return;
    let active = true;
    verifyToken(getToken()).then((valid) => {
      if (active) setLogged(valid);
      if (!valid) logout();
    });
    return () => {
      active = false;
    };
  }, [open]);

  if (!open) return null;

  const revenue = orders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0,
  );
  const tickets = orders.reduce(
    (sum, order) => sum + Number(order.qty || 0),
    0,
  );

  async function handleLogin() {
    setError("");
    setLoading(true);
    try {
      const payload = await loginAdmin(username, pass);
      saveToken(payload.token);
      setLogged(true);
      setUsername("");
      setPass("");
    } catch (loginError) {
      setError(loginError.message || "Connexion refusée.");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    logout();
    setLogged(false);
    setTab("dashboard");
  }

  function exportJson(name, data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${cleanText(name, 80) || "export"}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function saveDate() {
    const payload = sanitizeDateForm(dateForm);
    if (!payload.date || !payload.ville || !payload.lieu) {
      alert("Date, ville et lieu obligatoires.");
      return;
    }

    if (editDate) {
      setDates(
        dates.map((date) =>
          date.id === editDate ? { ...payload, id: editDate } : date,
        ),
      );
      setEditDate(null);
    } else {
      setDates([{ id: Date.now(), ...payload }, ...dates]);
    }
    setDateForm(emptyDate);
  }

  function loadDate(date) {
    setEditDate(date.id);
    setDateForm({ ...emptyDate, ...date });
  }

  function savePost() {
    const payload = sanitizePostForm(postForm);
    if (!payload.titre) {
      alert("Titre obligatoire.");
      return;
    }

    if (editPost) {
      setPosts(
        posts.map((post) =>
          post.id === editPost ? { ...payload, id: editPost } : post,
        ),
      );
      setEditPost(null);
    } else {
      setPosts([{ id: Date.now(), ...payload }, ...posts]);
    }
    setPostForm(emptyPost);
  }

  function loadPost(post) {
    setEditPost(post.id);
    setPostForm({ ...emptyPost, ...post });
  }

  return (
    <div className={styles.overlay}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-title"
      >
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="Fermer"
        >
          ×
        </button>
        <span className={styles.eyebrow}>Back-office sécurisé</span>
        <h2 id="admin-title">Ninho — M.I.L.S 4</h2>

        {!logged ? (
          <div className={styles.login}>
            <input
              type="text"
              placeholder="Identifiant"
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
            <input
              type="password"
              placeholder="Mot de passe"
              autoComplete="current-password"
              value={pass}
              onChange={(event) => setPass(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") handleLogin();
              }}
            />
            <button type="button" onClick={handleLogin} disabled={loading}>
              {loading ? "Connexion..." : "Connexion"}
            </button>
            {error && <p role="alert">{error}</p>}
          </div>
        ) : (
          <>
            <div className={styles.tabs}>
              {["dashboard", "orders", "dates", "posts", "subs"].map(
                (currentTab) => (
                  <button
                    type="button"
                    className={tab === currentTab ? styles.active : ""}
                    onClick={() => setTab(currentTab)}
                    key={currentTab}
                  >
                    {currentTab}
                  </button>
                ),
              )}
              <button type="button" onClick={handleLogout}>
                Déconnexion
              </button>
            </div>

            {tab === "dashboard" && (
              <>
                <div className={styles.kpis}>
                  <Kpi label="Commandes" value={orders.length} />
                  <Kpi label="CA démo" value={`${revenue} €`} />
                  <Kpi label="Billets" value={tickets} />
                  <Kpi label="Abonnés" value={subscribers.length} />
                </div>
                <div className={styles.exportRow}>
                  <button
                    type="button"
                    onClick={() => exportJson("mils4-commandes", orders)}
                  >
                    Exporter commandes
                  </button>
                  <button
                    type="button"
                    onClick={() => exportJson("mils4-abonnes", subscribers)}
                  >
                    Exporter abonnés
                  </button>
                  <button
                    type="button"
                    onClick={() => exportJson("mils4-dates", dates)}
                  >
                    Exporter dates
                  </button>
                </div>
              </>
            )}

            {tab === "orders" && (
              <List empty="Aucune commande.">
                {orders.map((order) => (
                  <p key={order.id}>
                    <strong>{order.name}</strong> · {order.email} · {order.city}{" "}
                    · {order.category} · {order.qty} billet(s) · {order.total} €
                  </p>
                ))}
              </List>
            )}

            {tab === "subs" && (
              <List empty="Aucun abonné.">
                {subscribers.map((subscriber) => (
                  <p key={subscriber.email}>
                    {subscriber.email} ·{" "}
                    {new Date(subscriber.createdAt).toLocaleString("fr-FR")}
                  </p>
                ))}
              </List>
            )}

            {tab === "dates" && (
              <div>
                <div className={styles.form}>
                  <input
                    type="date"
                    value={dateForm.date}
                    onChange={(event) =>
                      setDateForm({ ...dateForm, date: event.target.value })
                    }
                  />
                  <input
                    placeholder="Ville"
                    value={dateForm.ville}
                    onChange={(event) =>
                      setDateForm({ ...dateForm, ville: event.target.value })
                    }
                  />
                  <input
                    placeholder="Pays"
                    value={dateForm.pays}
                    onChange={(event) =>
                      setDateForm({ ...dateForm, pays: event.target.value })
                    }
                  />
                  <input
                    placeholder="Lieu"
                    value={dateForm.lieu}
                    onChange={(event) =>
                      setDateForm({ ...dateForm, lieu: event.target.value })
                    }
                  />
                  <input
                    type="number"
                    min="0"
                    placeholder="Prix"
                    value={dateForm.price}
                    onChange={(event) =>
                      setDateForm({ ...dateForm, price: event.target.value })
                    }
                  />
                  <input
                    type="number"
                    min="0"
                    placeholder="Capacité"
                    value={dateForm.capacity}
                    onChange={(event) =>
                      setDateForm({ ...dateForm, capacity: event.target.value })
                    }
                  />
                  <input
                    placeholder="Type"
                    value={dateForm.type}
                    onChange={(event) =>
                      setDateForm({ ...dateForm, type: event.target.value })
                    }
                  />
                  <input
                    placeholder="Adresse"
                    value={dateForm.address}
                    onChange={(event) =>
                      setDateForm({ ...dateForm, address: event.target.value })
                    }
                  />
                  <input
                    placeholder="Portes"
                    value={dateForm.doors}
                    onChange={(event) =>
                      setDateForm({ ...dateForm, doors: event.target.value })
                    }
                  />
                  <input
                    placeholder="Show"
                    value={dateForm.show}
                    onChange={(event) =>
                      setDateForm({ ...dateForm, show: event.target.value })
                    }
                  />
                  <input
                    placeholder="URL billetterie HTTPS"
                    value={dateForm.ticketUrl}
                    onChange={(event) =>
                      setDateForm({
                        ...dateForm,
                        ticketUrl: event.target.value,
                      })
                    }
                  />
                  <label>
                    <input
                      type="checkbox"
                      checked={dateForm.soldout}
                      onChange={(event) =>
                        setDateForm({
                          ...dateForm,
                          soldout: event.target.checked,
                        })
                      }
                    />{" "}
                    Sold out
                  </label>
                  <textarea
                    placeholder="Notes"
                    value={dateForm.notes}
                    onChange={(event) =>
                      setDateForm({ ...dateForm, notes: event.target.value })
                    }
                  />
                </div>
                <button type="button" className={styles.add} onClick={saveDate}>
                  {editDate ? "Enregistrer la date" : "Ajouter la date"}
                </button>
                {editDate && (
                  <button
                    type="button"
                    className={styles.ghost}
                    onClick={() => {
                      setEditDate(null);
                      setDateForm(emptyDate);
                    }}
                  >
                    Annuler
                  </button>
                )}
                <List>
                  {dates.map((date) => (
                    <p key={date.id}>
                      {formatDate(date.date)} · {date.ville} · {date.lieu} ·{" "}
                      {date.price} €{" "}
                      <button type="button" onClick={() => loadDate(date)}>
                        Modifier
                      </button>{" "}
                      <button
                        type="button"
                        onClick={() =>
                          setDates(dates.filter((item) => item.id !== date.id))
                        }
                      >
                        Suppr.
                      </button>
                    </p>
                  ))}
                </List>
              </div>
            )}

            {tab === "posts" && (
              <div>
                <div className={styles.form}>
                  <input
                    placeholder="Titre"
                    value={postForm.titre}
                    onChange={(event) =>
                      setPostForm({ ...postForm, titre: event.target.value })
                    }
                  />
                  <select
                    value={postForm.cat}
                    onChange={(event) =>
                      setPostForm({ ...postForm, cat: event.target.value })
                    }
                  >
                    <option>Studio</option>
                    <option>Art</option>
                    <option>Interview</option>
                    <option>Clip</option>
                    <option>Annonce</option>
                  </select>
                  <input
                    type="date"
                    value={postForm.date}
                    onChange={(event) =>
                      setPostForm({ ...postForm, date: event.target.value })
                    }
                  />
                  <input
                    placeholder="Image locale /images/..."
                    value={postForm.image}
                    onChange={(event) =>
                      setPostForm({ ...postForm, image: event.target.value })
                    }
                  />
                  <textarea
                    placeholder="Extrait"
                    value={postForm.excerpt}
                    onChange={(event) =>
                      setPostForm({ ...postForm, excerpt: event.target.value })
                    }
                  />
                  <textarea
                    placeholder="Contenu complet"
                    value={postForm.content}
                    onChange={(event) =>
                      setPostForm({ ...postForm, content: event.target.value })
                    }
                  />
                </div>
                <button type="button" className={styles.add} onClick={savePost}>
                  {editPost ? "Enregistrer l’article" : "Publier"}
                </button>
                {editPost && (
                  <button
                    type="button"
                    className={styles.ghost}
                    onClick={() => {
                      setEditPost(null);
                      setPostForm(emptyPost);
                    }}
                  >
                    Annuler
                  </button>
                )}
                <List>
                  {posts.map((post) => (
                    <p key={post.id}>
                      {post.cat} · {post.titre}{" "}
                      <button type="button" onClick={() => loadPost(post)}>
                        Modifier
                      </button>{" "}
                      <button
                        type="button"
                        onClick={() =>
                          setPosts(posts.filter((item) => item.id !== post.id))
                        }
                      >
                        Suppr.
                      </button>
                    </p>
                  ))}
                </List>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Kpi({ label, value }) {
  return (
    <article className={styles.kpi}>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function List({ children, empty }) {
  const arr = Array.isArray(children)
    ? children
    : children != null
      ? [children]
      : [];
  const hasContent = arr.filter(Boolean).length > 0;
  return (
    <div className={styles.list}>
      {hasContent ? children : <p>{empty || "Aucun élément."}</p>}
    </div>
  );
}
