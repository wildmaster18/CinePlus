$(document).ready(function () {
  /* Muestra la alerta de bienvenida solo si es la primera visita del usuario */
  if (!localStorage.getItem("bienvenida")) {
    $("#alerta-bienvenida").removeClass("d-none").hide().fadeIn(700);
    localStorage.setItem("bienvenida", "mostrada");
  }

  /* Muestra el spinner y oculta la galería mientras se espera el AJAX */
  $("#spinner-carga").show();
  $("#lista-peliculas").hide();

  /* Espera 5 segundos antes de ejecutar el AJAX para simular carga */
  setTimeout(function () {
    /* Carga el archivo de películas desde el servidor usando AJAX */
    $.ajax({
      url: "data/peliculas.json",
      method: "GET",
      dataType: "json",

      success: function (peliculas) {
        /* Oculta el spinner y muestra el contenedor de tarjetas */
        $("#spinner-carga").hide();
        $("#lista-peliculas").show();

        let html = "";

        /* Recorre cada película del arreglo con un for */
        for (let i = 0; i < peliculas.length; i++) {
          let peli = peliculas[i];

          /* Construye la ruta de la imagen según si es archivo local o URL */
          let rutaImg = peli.imagen.startsWith("http")
            ? peli.imagen
            : "img/" + peli.imagen;

          /* Recorre el arreglo de géneros y genera un badge por cada uno */
          let htmlGeneros = "";
          for (let j = 0; j < peli.generos.length; j++) {
            htmlGeneros += `<span class="badge bg-dark me-1">${peli.generos[j]}</span>`;
          }

          /* Construye la tarjeta HTML con display:none para aplicar fadeIn después */
          html += `
            <div class="col-sm-6 col-md-4 col-lg-3 mb-2">
              <div class="card h-100 shadow-sm" style="display:none;">
                <img src="${rutaImg}" class="card-img-top" alt="${peli.titulo}">
                <div class="card-body d-flex flex-column">
                  <h5 class="card-title">${peli.titulo}</h5>
                  <div class="mb-2">${htmlGeneros}</div>
                  <div class="mt-auto d-flex gap-2">
                    <a href="pages/detalle.html?id=${peli.id}"
                       class="btn btn-primary btn-sm flex-fill">Ver más</a>
                    <button class="btn btn-outline-light btn-sm flex-fill btn-trailer"
                      data-titulo="${peli.titulo}"
                      data-trailer="${peli.trailer}">
                      ▶ Tráiler
                    </button>
                  </div>
                </div>
              </div>
            </div>`;
        }

        /* Inserta todas las tarjetas dentro del contenedor de la página */
        $("#lista-peliculas").html(html);

        /* Aplica fadeIn escalonado a cada tarjeta con un pequeño retraso entre ellas */
        $(".card").each(function (indice) {
          let tarjeta = $(this);
          setTimeout(function () {
            tarjeta.fadeIn(500);
          }, indice * 120);
        });
      },

      /* Muestra un mensaje de error si el archivo JSON no se pudo cargar */
      error: function (xhr, status, error) {
        console.error("Error al cargar las películas:", error);
        $("#spinner-carga").hide();
        $("#lista-peliculas").show().html(`
          <div class="col-12">
            <div class="alert alert-danger text-center" role="alert">
              No se pudo cargar la lista de películas. Intenta nuevamente más tarde.
            </div>
          </div>
        `);
      },
    });
  }, 5000); /* Retraso de 5 segundos antes de hacer la petición AJAX */

  /* Abre el modal del tráiler al hacer clic en el botón de cada tarjeta */
  $(document).on("click", ".btn-trailer", function () {
    let titulo = $(this).data("titulo");
    let urlTrailer = $(this).data("trailer");

    /* Asigna el título y la URL del tráiler al modal */
    $("#titulo-modal-trailer").text(titulo);
    $("#iframe-trailer").attr("src", urlTrailer);

    /* Abre el modal usando Bootstrap */
    let modal = new bootstrap.Modal(document.getElementById("modal-trailer"));
    modal.show();
  });

  /* Limpia el src del iframe al cerrar el modal para detener el video */
  $("#modal-trailer").on("hidden.bs.modal", function () {
    $("#iframe-trailer").attr("src", "");
  });
});
