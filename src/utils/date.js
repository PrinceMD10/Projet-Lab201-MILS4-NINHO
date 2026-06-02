export function formatDate(value) {
  return new Date(`${value}T00:00:00`).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function durationToSeconds(duration) {
  const [minutes, seconds] = duration.split(':').map(Number);
  return minutes * 60 + seconds;
}

export function formatTime(seconds = 0) {
  const minutes = Math.floor(seconds / 60);
  const remain = Math.floor(seconds % 60);
  return `${minutes}:${String(remain).padStart(2, '0')}`;
}
