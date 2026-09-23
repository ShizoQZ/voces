// TRIVIA — datos + navegación (intro -> [pregunta con audio -> video] x 5)
(function () {
  "use strict";

  // Editá acá: archivos de audio/video, texto de la pregunta y respuesta correcta ("real" o "clonada").
  // "respuesta" = si el audio de esa parte es real o clonado (también es lo que dice la etiqueta del video).
  const PREGUNTA = "¿Puedes identificar si esta voz es clonada o real?";
  const PARTES = [
    { audio: "audio/trivia/audio_1.mp3", video: "video/trivia/video_1.mp4", respuesta: "clonada" },
    { audio: "audio/trivia/audio_2.mp3", video: "video/trivia/video_2.mp4", respuesta: "real" },
    { audio: "audio/trivia/audio_3.mp3", video: "video/trivia/video_3.mp4", respuesta: "clonada" },
    { audio: "audio/trivia/audio_4.mp3", video: "video/trivia/video_4.mp4", respuesta: "real" },
    { audio: "audio/trivia/audio_5.mp3", video: "video/trivia/video_5.mp4", respuesta: "clonada" }
  ];
  const URL_INICIO_SITIO = "index.html";

  const $ = (id) => document.getElementById(id);
  const app = $("app-trivia"), vIntro = $("vista-intro"), vJuego = $("vista-juego");
  const audio = $("trivia-audio"), video = $("trivia-video");
  const tarjetaAudio = $("tarjeta-audio"), tarjetaVideo = $("tarjeta-video");
  const btnPlay = $("trivia-play"), ondas = $("trivia-ondas"), cabezal = $("trivia-cabezal");
  const btnSiguiente = $("trivia-siguiente");
  const opciones = document.querySelectorAll(".trivia-opcion");
  let indice = 0;

  // ---- placeholders de imágenes ----
  document.querySelectorAll(".marco-imagen img").forEach((img) => {
    const marco = img.closest(".marco-imagen");
    img.addEventListener("error", () => marco.classList.add("sin-imagen"));
    img.addEventListener("load", () => marco.classList.remove("sin-imagen"));
    if (img.complete && img.naturalWidth === 0) marco.classList.add("sin-imagen");
  });
  video.addEventListener("error", () => tarjetaVideo.classList.add("sin-imagen"));
  video.addEventListener("loadeddata", () => tarjetaVideo.classList.remove("sin-imagen"));

  // ---- barritas de la onda (alturas fijas, aspecto de audio) ----
  const N_BARRAS = 60;
  for (let i = 0; i < N_BARRAS; i++) {
    const b = document.createElement("span");
    b.className = "barra";
    const h = 22 + Math.abs(Math.sin(i * 1.9)) * 22 + (i % 9 === 4 ? 30 : 0) + (i % 5 === 0 ? 8 : 0);
    b.style.height = Math.min(h, 90) + "%";
    ondas.insertBefore(b, cabezal);
  }

  // ---- reproductor de audio ----
  function iconoPlay(reproduciendo) {
    btnPlay.querySelector(".icono-play").hidden = reproduciendo;
    btnPlay.querySelector(".icono-pausa").hidden = !reproduciendo;
    btnPlay.setAttribute("aria-label", reproduciendo ? "Pausar audio" : "Reproducir audio");
  }
  function moverCabezal() {
    const p = audio.duration ? audio.currentTime / audio.duration : 0;
    cabezal.style.left = (p * 100) + "%";
  }
  btnPlay.addEventListener("click", () => {
    if (audio.paused) audio.play().catch(() => {}); else audio.pause();
  });
  audio.addEventListener("play", () => iconoPlay(true));
  audio.addEventListener("pause", () => iconoPlay(false));
  audio.addEventListener("ended", () => { iconoPlay(false); audio.currentTime = 0; moverCabezal(); });
  audio.addEventListener("timeupdate", moverCabezal);
  ondas.addEventListener("click", (e) => {
    if (!audio.duration) return;
    const r = ondas.getBoundingClientRect();
    audio.currentTime = Math.min(Math.max((e.clientX - r.left) / r.width, 0), 1) * audio.duration;
    moverCabezal();
  });

  // ---- navegación ----
  function detenerMedios() { audio.pause(); video.pause(); }

  function mostrarIntro() {
    detenerMedios();
    indice = 0;
    app.dataset.vista = "intro";
    vIntro.hidden = false; vJuego.hidden = true;
  }

  function mostrarPregunta() {
    const parte = PARTES[indice];
    detenerMedios();
    $("trivia-pregunta").textContent = parte.pregunta || PREGUNTA;
    audio.src = parte.audio; audio.currentTime = 0;
    iconoPlay(false); cabezal.style.left = "0%";
    opciones.forEach((o) => { o.disabled = false; o.classList.remove("correcta", "incorrecta"); });
    tarjetaAudio.hidden = false; tarjetaVideo.hidden = true; btnSiguiente.hidden = true;
    app.dataset.vista = "juego";
    vIntro.hidden = true; vJuego.hidden = false;
  }

  function responder(elegida, boton) {
    const parte = PARTES[indice];
    audio.pause();
    opciones.forEach((o) => { o.disabled = true; });
    boton.classList.add(elegida === parte.respuesta ? "correcta" : "incorrecta");

    tarjetaVideo.dataset.placeholder = "video: " + parte.video;
    $("trivia-etiqueta").textContent = parte.respuesta === "real" ? "Real" : "Clonada";
    video.src = parte.video;
    tarjetaAudio.hidden = true; tarjetaVideo.hidden = false; btnSiguiente.hidden = false;
    video.currentTime = 0;
    video.play().catch(() => {});   // arranca reproduciéndose
  }

  $("trivia-intro").addEventListener("click", mostrarPregunta);
  opciones.forEach((o) => o.addEventListener("click", () => responder(o.dataset.opcion, o)));
  btnSiguiente.addEventListener("click", () => {
    indice++;
    if (indice < PARTES.length) mostrarPregunta(); else mostrarIntro();  // tras la 5ª, vuelve al inicio de la trivia
  });
  // píldora: pregunta/video -> intro -> inicio del sitio
  $("trivia-pill").addEventListener("click", () => {
    if (app.dataset.vista === "juego") mostrarIntro(); else window.location.href = URL_INICIO_SITIO;
  });

  mostrarIntro();
})();
