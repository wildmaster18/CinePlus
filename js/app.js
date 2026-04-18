$(document).ready(function () {
  /* Carga el archivo de películas desde el servidor usando AJAX */
  $.ajax({
    url: "data/peliculas.json",
    method: "GET",
    dataType: "json",

    success: function (peliculas) {
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

        /* Construye la tarjeta HTML de cada película */
        html += `
          <div class="col-sm-6 col-md-4 col-lg-3 mb-2">
            <div class="card h-100 shadow-sm">
              <img src="${rutaImg}" class="card-img-top" alt="${peli.titulo}">
              <div class="card-body d-flex flex-column">
                <h5 class="card-title">${peli.titulo}</h5>
                <div class="mb-2">${htmlGeneros}</div>
                <div class="mt-auto">
                  <a href="pages/detalle.html?id=${peli.id}"
                     class="btn btn-primary btn-sm w-100">Ver más</a>
                </div>
              </div>
            </div>
          </div>`;
      }

      /* Inserta todas las tarjetas dentro del contenedor de la página */
      $("#lista-peliculas").html(html);
    },

    /* Muestra un mensaje de error si el archivo JSON no se pudo cargar */
    error: function (xhr, status, error) {
      console.error("Error al cargar las películas:", error);
      $("#lista-peliculas").html(`
        <div class="col-12">
          <div class="alert alert-danger text-center" role="alert">
            No se pudo cargar la lista de películas. Intenta nuevamente más tarde.
          </div>
        </div>
      `);
    },
  });
});
