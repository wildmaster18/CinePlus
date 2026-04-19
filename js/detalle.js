$(document).ready(function () {
  /* Lee el parámetro "id" de la URL para saber qué película mostrar */
  let paramUrl = new URLSearchParams(window.location.search);
  let idPeli = paramUrl.get("id");

  if (!idPeli) {
    mostrarError();
    return;
  }

  /* Carga el JSON y busca la película que coincide con el id */
  $.ajax({
    url: "../data/peliculas.json",
    method: "GET",
    dataType: "json",

    success: function (peliculas) {
      /* Busca la película cuyo id coincide con el de la URL */
      let pelicula = null;
      for (let i = 0; i < peliculas.length; i++) {
        if (peliculas[i].id == idPeli) {
          pelicula = peliculas[i];
          break;
        }
      }

      if (!pelicula) {
        mostrarError();
        return;
      }

      /* Actualiza el título de la pestaña del navegador */
      document.title = pelicula.titulo + " - CinePlus";

      /* Asigna el título, sinopsis y tráiler en el HTML */
      $("#titulo").text(pelicula.titulo);
      $("#sinopsis").text(pelicula.sinopsis);
      $("#trailer").attr("src", pelicula.trailer);

      /* Construye la ruta de imagen */
      let rutaImg = pelicula.imagen.startsWith("http")
        ? pelicula.imagen
        : "../img/" + pelicula.imagen;
      $("#poster").attr("src", rutaImg);

      /* Recorre los géneros y genera un badge por cada uno */
      let htmlGeneros = "";
      for (let j = 0; j < pelicula.generos.length; j++) {
        htmlGeneros += `<span class="badge bg-secondary me-1">${pelicula.generos[j]}</span>`;
      }
      $("#generos").html(htmlGeneros);

      /* Compara la fecha de estreno con la fecha actual para definir el precio */
      let fechaHoy = new Date();
      let fechaEstr = new Date(pelicula.estreno + "T00:00:00");
      let esEstreno = fechaEstr > fechaHoy;
      let precio = esEstreno
        ? pelicula.precios.estreno
        : pelicula.precios.normal;

      /* Genera el badge de ESTRENO o CARTELERA según la fecha */
      let htmlBadge = "";
      if (esEstreno) {
        htmlBadge = `
          <span class="badge bg-danger fs-6 me-2">ESTRENO</span>
          <span class="badge bg-warning text-dark fs-6">Precio: $${precio.toFixed(2)}</span>
          <p class="text-danger mt-2 mb-0 fw-bold small">¡Esta película acaba de estrenarse!</p>`;
      } else {
        htmlBadge = `
          <span class="badge bg-secondary fs-6 me-2">En Cartelera</span>
          <span class="badge bg-success fs-6">Precio: $${precio.toFixed(2)}</span>`;
      }
      $("#badge-precio").html(htmlBadge);

      /* Oculta el spinner y muestra el contenido con animación */
      $("#spinner-detalle").hide();
      $("#info-pelicula").fadeIn(600);

      /* Carga las reseñas de esta película desde resenas.json via AJAX */
      $.ajax({
        url: "../data/resenas.json",
        method: "GET",
        dataType: "json",

        success: function (todasResenas) {
          /* Filtra solo las reseñas que corresponden a esta película */
          let resenasPeli = [];
          for (let k = 0; k < todasResenas.length; k++) {
            if (todasResenas[k].idPelicula == idPeli) {
              resenasPeli.push(todasResenas[k]);
            }
          }

          if (resenasPeli.length === 0) {
            $("#lista-resenas").html(
              "<p class='text-muted'>No hay reseñas para esta película todavía.</p>",
            );
            return;
          }

          /* Construye las tarjetas de reseñas con estrellas */
          let htmlResenas = "";
          for (let r = 0; r < resenasPeli.length; r++) {
            let resena = resenasPeli[r];

            /* Genera estrellas llenas y vacías según la calificación */
            let estrellas = "";
            for (let s = 1; s <= 5; s++) {
              estrellas += s <= resena.calificacion ? "★" : "☆";
            }

            htmlResenas += `
              <div class="card mb-3 shadow-sm">
                <div class="card-body">
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <strong>${resena.autor}</strong>
                    <span style="color:#f5c518; font-size:1.2rem; letter-spacing:2px;">
                      ${estrellas}
                    </span>
                  </div>
                  <p class="card-text mb-0">${resena.comentario}</p>
                </div>
              </div>`;
          }

          $("#lista-resenas").html(htmlResenas);
        },

        /* Muestra un mensaje si las reseñas no se pudieron cargar */
        error: function () {
          $("#lista-resenas").html(
            "<p class='text-danger small'>No se pudieron cargar las reseñas.</p>",
          );
        },
      });
    },

    error: function () {
      mostrarError();
    },
  });

  /* Muestra un mensaje de error si la película no se pudo cargar */
  function mostrarError() {
    $("#spinner-detalle").hide();
    $("main").html(`
      <div class="alert alert-danger text-center" role="alert">
        No se pudo cargar la información de esta película.
      </div>
      <div class="text-center mt-3">
        <a href="../index.html" class="btn btn-secondary">← Volver al inicio</a>
      </div>
    `);
  }
});
