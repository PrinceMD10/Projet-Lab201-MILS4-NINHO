export function loadStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);

    if (!value) {
      return fallback;
    }

    const parsed = JSON.parse(value);

    if (parsed === null || parsed === undefined) {
      return fallback;
    }

    return parsed;
  } catch (error) {
    console.warn(`Erreur de lecture du stockage : ${key}`, error);
    return fallback;
  }
}

export function saveStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Erreur d'écriture du stockage : ${key}`, error);
  }
}

export function removeStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn(`Erreur de suppression du stockage : ${key}`, error);
  }
}

export function clearStorage() {
  try {
    localStorage.clear();
  } catch (error) {
    console.warn("Erreur lors du nettoyage du stockage", error);
  }
}