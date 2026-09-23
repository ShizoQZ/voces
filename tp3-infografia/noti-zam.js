// =============================================================
// NOTI-ZAM — datos + navegación entre pantallas (intro / hub / detalle)
// =============================================================
(function () {
  "use strict";

  // Posiciones (%) de cada burbuja en el hub, aproximadas a partir
  // de las referencias. left/top = esquina superior izquierda de la burbuja.
  const NOTICIAS = [
    {
      id: "doblaje-ia",
      etiqueta: "Doblaje con IA",
      left: "46.5%", top: "8%",
      icono: "img/noticias/icons/icon_7.png",
      panel: "img/noticias/paneles/doblaje-ia.png",
      caption: "El 30% de los doblajes ya se hacen con procesos de clonación de voces."
    },
    {
      id: "ley-ia",
      etiqueta: "Ley de IA",
      left: "70.5%", top: "2%",
      icono: "img/noticias/icons/icon_6.png",
      panel: "img/noticias/paneles/ley-ia.png",
      caption: "La Unión Europea instauró la Ley de Inteligencia Artificial."
    },
    {
      id: "leyes-mundiales",
      etiqueta: "Leyes mundiales",
      left: "87%", top: "8%",
      icono: "img/noticias/icons/icon_3.png",
      panel: "img/noticias/paneles/leyes-mundiales.png",
      caption: "A nivel global, distintos países ya implementan leyes estrictas contra la clonación de voz sin consentimiento."
    },
    {
      id: "batalla-ia",
      etiqueta: "Batalla contra la IA",
      left: "62.5%", top: "31%",
      icono: "img/noticias/icons/icon_2.png",
      panel: "img/noticias/paneles/batalla-ia.png",
      caption: "La industria mundial del doblaje se enfrenta a la IA."
    },
    {
      id: "ley-elvis",
      etiqueta: "Ley Elvis",
      left: "82%", top: "40%",
      icono: "img/noticias/icons/icon_1.png",
      panel: "img/noticias/paneles/ley-elvis.png",
      caption: "La Ley ELVIS, la primera ley que elevó la voz humana como un derecho de propiedad explícito."
    },
    {
      id: "voces-actores",
      etiqueta: "Voces de actores",
      left: "49%", top: "47%",
      icono: "img/noticias/icons/icon_5.png",
      panel: "img/noticias/paneles/voces-actores.png",
      caption: "Más casos de usuarios que toman la voz de actores sin su consentimiento."
    },
    {
      id: "manifestaciones",
      etiqueta: "Manifestaciones",
      left: "67.5%", top: "60.5%",
      icono: "img/noticias/icons/icon_4.png",
      panel: "img/noticias/paneles/manifestaciones.png",
      caption: "Actores de todo el mundo se manifestaron exigiendo protección jurídica para su voz."
    }
  ];

  const app = document.getElementById("app-notizam");
  const vistas = {
    intro: document.getElementById("vista-intro"),
    hub: document.getElementById("vista-hub"),
    detalle: document.getElementById("vista-detalle")
  };
  const pill = document.getElementById("notizam-pill");
  const cajaIntro = document.getElementById("caja-intro");
  const contenedorBurbujas = document.getElementById("burbujas-noticias");

  const panelImg = document.getElementById("panel-noticia-img");
  const panelWrap = document.getElementById("panel-noticia");
  const captionBox = document.getElementById("notizam-caption");
  const captionVacio = document.getElementById("notizam-pie-vacio");
  const captionTexto = document.getElementById("caption-texto");
  const captionIconoImg = document.getElementById("caption-icono-img");
  const captionIconoWrap = document.getElementById("caption-icono");

  // jerarquía simple: la píldora "Noti-Zam" funciona como botón "volver"
  // un nivel a la vez. Desde la intro, vuelve a la pantalla de inicio del sitio.
  const PADRE = { hub: "intro", detalle: "hub" };
  const URL_INICIO_SITIO = "index.html";

  /** Hace que un <img> muestre el placeholder punteado si no carga. */
  function prepararImagenPlaceholder(img) {
    const marco = img.closest(".marco-imagen");
    if (!marco) return;
    img.addEventListener("error", () => marco.classList.add("sin-imagen"));
    img.addEventListener("load", () => marco.classList.remove("sin-imagen"));
    // si ya está roto al cargar la página
    if (img.complete && img.naturalWidth === 0 && img.src) {
      marco.classList.add("sin-imagen");
    }
  }

  function mostrarVista(nombre) {
    Object.entries(vistas).forEach(([clave, el]) => {
      el.hidden = clave !== nombre;
    });
    app.dataset.vistaActual = nombre;

    // el copete (caption) solo existe en la vista de detalle
    const esDetalle = nombre === "detalle";
    captionBox.hidden = !esDetalle;
    captionVacio.hidden = esDetalle;
  }

  function abrirNoticia(noticia) {
    panelImg.src = noticia.panel;
    panelImg.alt = noticia.etiqueta;
    panelWrap.dataset.placeholder = "ilustración: " + noticia.panel;

    captionIconoImg.src = noticia.icono;
    captionIconoImg.alt = noticia.etiqueta;
    captionIconoWrap.dataset.placeholder = "";
    captionTexto.textContent = noticia.caption;

    mostrarVista("detalle");
  }

  function crearBurbujas() {
    NOTICIAS.forEach((noticia) => {
      const boton = document.createElement("button");
      boton.type = "button";
      boton.className = "burbuja-noticia";
      boton.style.left = noticia.left;
      boton.style.top = noticia.top;
      boton.setAttribute("aria-label", "Abrir noticia: " + noticia.etiqueta);

      const circulo = document.createElement("span");
      circulo.className = "burbuja-circulo marco-imagen";
      circulo.dataset.placeholder = noticia.id;

      const img = document.createElement("img");
      img.src = noticia.icono;
      img.alt = "";
      prepararImagenPlaceholder(img);
      circulo.appendChild(img);

      const etiqueta = document.createElement("span");
      etiqueta.className = "burbuja-etiqueta";
      etiqueta.textContent = noticia.etiqueta;

      boton.appendChild(circulo);
      boton.appendChild(etiqueta);
      boton.addEventListener("click", () => abrirNoticia(noticia));

      contenedorBurbujas.appendChild(boton);
    });
  }

  // ---- eventos de navegación ----
  cajaIntro.addEventListener("click", () => mostrarVista("hub"));

  // la píldora "Noti-Zam" es el único botón de retroceso:
  // detalle -> hub -> intro -> pantalla de inicio del sitio
  pill.addEventListener("click", () => {
    const actual = app.dataset.vistaActual;
    const padre = PADRE[actual];
    if (padre) {
      mostrarVista(padre);
    } else {
      window.location.href = URL_INICIO_SITIO;
    }
  });

  // preparar placeholders de imágenes fijas (logo / personaje / panel)
  document.querySelectorAll(".marco-imagen img[src]").forEach(prepararImagenPlaceholder);

  // ---- inicio ----
  crearBurbujas();
  mostrarVista("intro");
})();
