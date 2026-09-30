const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  toggle.textContent = open ? '×' : '☰';
  nav.classList.toggle('open', open);
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Ouvrir le menu');
  toggle.textContent = '☰';
}));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.classList.contains('open')) {
    toggle.click();
    toggle.focus();
  }
});
document.querySelector('#year').textContent = new Date().getFullYear();
// Commandes vidéo : lecture, progression et son, avec contrôles natifs en secours.
document.querySelectorAll('.video-card').forEach(card => {
  const video = card.querySelector('video');
  const play = card.querySelector('.video-play');
  const controls = card.querySelector('.video-controls');
  const progress = card.querySelector('.video-progress');
  const sound = card.querySelector('.video-sound');
  const error = card.parentElement.querySelector('.video-error');
  const formatTime = seconds => {
    if (!Number.isFinite(seconds)) return '0:00';
    return Math.floor(seconds / 60) + ':' + String(Math.floor(seconds % 60)).padStart(2, '0');
  };
  const update = () => {
    const duration = Number.isFinite(video.duration) ? video.duration : 0;
    progress.disabled = duration <= 0;
    progress.value = duration > 0 ? video.currentTime / duration * 100 : 0;
    progress.setAttribute('aria-valuetext', formatTime(video.currentTime) + ' sur ' + formatTime(duration));
    card.querySelector('.video-current').textContent = formatTime(video.currentTime);
    card.querySelector('.video-duration').textContent = formatTime(duration);
    card.classList.toggle('is-playing', !video.paused && !video.ended);
    play.setAttribute('aria-label', video.paused ? 'Lire la vidéo' : 'Mettre la vidéo en pause');
    play.querySelector('span').textContent = video.paused ? '▶' : '❚❚';
  };
  play.addEventListener('click', async () => {
    if (!video.paused) { video.pause(); return; }
    try { await video.play(); error.hidden = true; }
    catch { error.hidden = false; video.controls = true; play.hidden = true; controls.hidden = true; }
  });
  sound.addEventListener('click', () => {
    video.muted = !video.muted;
  });
  video.addEventListener('volumechange', () => {
    const muted = video.muted || video.volume === 0;
    sound.textContent = muted ? 'Son coupé' : 'Son activé';
    sound.setAttribute('aria-label', muted ? 'Activer le son' : 'Couper le son');
    sound.setAttribute('aria-pressed', String(muted));
  });
  progress.addEventListener('input', () => {
    if (Number.isFinite(video.duration) && video.duration > 0) video.currentTime = Number(progress.value) / 100 * video.duration;
  });
  ['loadedmetadata', 'durationchange', 'timeupdate', 'play', 'pause', 'ended'].forEach(event => video.addEventListener(event, update));
  video.addEventListener('error', () => { error.hidden = false; video.controls = true; play.hidden = true; controls.hidden = true; });
  update();
  play.hidden = false;
  controls.hidden = false;
  video.controls = false;
});
