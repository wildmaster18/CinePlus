# CinePlus

## Datos del estudiante

**Nombre:** Mateo Sebastian Carranza Ortiz  
**Materia:** Aplicaciones Web  
**Universidad:** Universidad Politécnica Salesiana  
**Unidad:** Unidad 1 - Diseño y creación de páginas web

## Descripción

Este proyecto consiste en una aplicación web dinámica de películas desarrollada a partir del código base de la tarea. La página permite ver películas en cartelera, consultar su detalle, reproducir el tráiler, rentar una o varias películas y enviar mensajes desde un formulario de contacto.

## Funcionalidades implementadas

- Se trabajó sobre el código base indicado en la tarea.
- Se modificó la estructura de `peliculas.json` con los campos solicitados.
- Se agregaron 5 películas nuevas.
- Se muestra en el detalle si la película es estreno o cartelera regular, junto con su precio.
- Se agregó un spinner con retraso de 5 segundos antes de mostrar las películas.
- Se creó la página `renta.html` con selección de películas, días de renta y forma de pago.
- Se muestra un modal con el resumen de la renta y el total a pagar.
- Se agregó una sección de reseñas cargadas desde `resenas.json`.
- Se muestran las calificaciones en estrellas.
- Se agregó el botón **Ver tráiler** en cada tarjeta.
- Se implementó una alerta de bienvenida que aparece una sola vez usando `localStorage`.
- Se aplicó animación `fadeIn` al cargar las películas.
- Se validó el formulario de contacto con mensajes personalizados.
- Se personalizó el diseño con Google Fonts, colores propios, navbar en todas las páginas y footer al borde inferior.

## Instrucciones de uso

1. Clonar o descargar el repositorio.
2. Abrir la carpeta del proyecto en Visual Studio Code.
3. Ejecutar `index.html` con Live Server.
4. Navegar por las páginas del sistema para probar sus funciones.

## Estructura general del proyecto

- `index.html`: página principal
- `pages/detalle.html`: detalle de película
- `pages/renta.html`: formulario de renta
- `pages/contacto.html`: formulario de contacto
- `js/`: archivos JavaScript
- `css/`: estilos del proyecto
- `data/`: archivos JSON
- `img/`: imágenes de las películas
