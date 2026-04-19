$(document).ready(function () {
  /* Carga las películas desde el JSON para generar los checkboxes */
  $.ajax({
    url: "../data/peliculas.json",
    method: "GET",
    dataType: "json",

    success: function (peliculas) {
      let htmlCheck = "";
      let fechaHoy = new Date();

      /* Recorre cada película y genera un checkbox con su precio */
      for (let i = 0; i < peliculas.length; i++) {
        let peli = peliculas[i];
        let fechaEstreno = new Date(peli.estreno + "T00:00:00");
        let esEstreno = fechaEstreno > fechaHoy;
        let precio = esEstreno ? peli.precios.estreno : peli.precios.normal;

        /* Badge que indica si la película está en estreno o cartelera regular */
        let etiqueta = esEstreno
          ? '<span class="badge bg-danger ms-1">Estreno</span>'
          : '<span class="badge bg-secondary ms-1">Regular</span>';

        /* Genera el checkbox con los datos de la película en atributos data */
        htmlCheck += `
          <div class="form-check mb-2 border-bottom pb-2">
            <input class="form-check-input chk-pelicula" type="checkbox"
              id="chk-${peli.id}"
              value="${peli.id}"
              data-titulo="${peli.titulo}"
              data-precio="${precio}">
            <label class="form-check-label text-white" for="chk-${peli.id}">
              <strong>${peli.titulo}</strong> ${etiqueta}
              <small class="text-muted d-block">$${precio.toFixed(2)} por día</small>
            </label>
          </div>`;
      }

      $("#lista-checkboxes").html(htmlCheck);
    },

    /* Muestra error si no se pueden cargar las películas */
    error: function () {
      $("#lista-checkboxes").html(
        "<p class='text-danger'>No se pudieron cargar las películas.</p>",
      );
    },
  });

  /* Valida el formulario y abre el modal al hacer clic en Confirmar */
  $("#btn-rentar").on("click", function () {
    let valido = true;

    /* Valida que el nombre no esté vacío */
    let nomCliente = $("#nomCliente").val().trim();
    if (nomCliente === "") {
      $("#nomCliente").addClass("is-invalid").removeClass("is-valid");
      valido = false;
    } else {
      $("#nomCliente").removeClass("is-invalid").addClass("is-valid");
    }

    /* Recoge las películas seleccionadas con sus precios */
    let pelisElegidas = [];
    $(".chk-pelicula:checked").each(function () {
      pelisElegidas.push({
        titulo: $(this).data("titulo"),
        precio: parseFloat($(this).data("precio")),
      });
    });

    if (pelisElegidas.length === 0) {
      $("#error-peliculas").removeClass("d-none");
      valido = false;
    } else {
      $("#error-peliculas").addClass("d-none");
    }

    /* Valida que los días estén en el rango permitido */
    let cantDias = parseInt($("#cantDias").val());
    if (isNaN(cantDias) || cantDias < 1 || cantDias > 30) {
      $("#cantDias").addClass("is-invalid").removeClass("is-valid");
      valido = false;
    } else {
      $("#cantDias").removeClass("is-invalid").addClass("is-valid");
    }

    /* Valida que se haya seleccionado una forma de pago */
    let formaPago = $("#formaPago").val();
    if (formaPago === "") {
      $("#formaPago").addClass("is-invalid").removeClass("is-valid");
      valido = false;
    } else {
      $("#formaPago").removeClass("is-invalid").addClass("is-valid");
    }

    if (!valido) return;

    /* Calcula el total sumando precio por días de cada película elegida */
    let totalPagar = 0;
    let htmlFilas = "";

    for (let i = 0; i < pelisElegidas.length; i++) {
      let subtotal = pelisElegidas[i].precio * cantDias;
      totalPagar += subtotal;

      htmlFilas += `
        <tr>
          <td>${pelisElegidas[i].titulo}</td>
          <td class="text-center">${cantDias}</td>
          <td class="text-end">$${pelisElegidas[i].precio.toFixed(2)}</td>
          <td class="text-end fw-bold">$${subtotal.toFixed(2)}</td>
        </tr>`;
    }

    /* Construye el resumen que se muestra dentro del modal */
    let htmlResumen = `
      <table class="table table-bordered mb-3">
        <tr><th>Cliente</th><td>${nomCliente}</td></tr>
        <tr><th>Forma de pago</th><td>${formaPago}</td></tr>
      </table>
      <h6 class="fw-bold mb-2">Detalle de películas:</h6>
      <table class="table table-sm table-striped">
        <thead class="table-dark">
          <tr>
            <th>Película</th>
            <th class="text-center">Días</th>
            <th class="text-end">Precio/día</th>
            <th class="text-end">Subtotal</th>
          </tr>
        </thead>
        <tbody>${htmlFilas}</tbody>
      </table>
      <div class="alert alert-success text-end fw-bold fs-5 mb-0">
        Total a pagar: $${totalPagar.toFixed(2)}
      </div>`;

    $("#contenido-modal").html(htmlResumen);

    /* Abre el modal de confirmación con Bootstrap */
    let modal = new bootstrap.Modal(
      document.getElementById("modal-confirmacion"),
    );
    modal.show();
  });

  /* Limpia el formulario y cierra el modal al hacer clic en Nueva Renta */
  $("#btn-nueva-renta").on("click", function () {
    $("#nomCliente").val("").removeClass("is-valid is-invalid");
    $("#cantDias").val(1).removeClass("is-valid is-invalid");
    $("#formaPago").val("").removeClass("is-valid is-invalid");
    $(".chk-pelicula").prop("checked", false);
    $("#error-peliculas").addClass("d-none");

    let modal = bootstrap.Modal.getInstance(
      document.getElementById("modal-confirmacion"),
    );
    modal.hide();
  });
});
