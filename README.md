# El mundo de Angelina

Sitio estático en español con un menú de juegos y un vestidor virtual interactivo. Sin instalación, backend ni cuentas.

## Abrir

Abre `index.html` en un navegador moderno. También puedes servir la carpeta con Python:

```powershell
python -m http.server 5173
```

Visita `http://localhost:5173`.

## Incluye

- Menú inicial con Mi vestidor creativo disponible y dos ideas de juegos señaladas como próximas.
- Personaje femenino o masculino, edad entre 6 y 60 años, tres alturas y complexiones, caras, tonos de piel y colores y formas de ojos.
- 15 peinados (incluidos tres estilos anime con mechones y sombras) y 18 tonos de pelo naturales y de fantasía. El sombrero se adapta al peinado.
- 11 formas de ojos, incluidos tres estilos anime con iris degradados, pestañas y reflejos; 7 colores de ojos y 7 formas de boca. Los outfits anteriores conservan su sonrisa original al abrirse.
- 52 prendas y accesorios originales ilustrados en SVG, con ropa casual, deportiva y elegante. Cada espacio sin vestir conserva una prenda base opaca.
- Seis vestidos kawaii de decoración abundante: conejitos, fresitas, lazos de lavanda, nubes, gatitos y estrellas, con encajes, volantes y perlas ilustradas.
- Estética kawaii con tonos pastel, estampados de conejitos, gatitos y ositos, lazos, corazones y ribetes decorativos.
- Camisetas de equipo, chaquetas deportivas, buzos, blazers con camisa, blusa con lazo y prendas de fiesta. Once pares de zapatos: zapatillas, mocasines, bailarinas, zapatos con hebilla y botas, entre otros.
- Arrastrar prendas con ratón, mantener pulsado para arrastrar en pantallas táctiles, o pulsar una prenda para vestir. Los botones también funcionan con teclado.
- Vestidos que reemplazan la parte superior e inferior, prendas que se ajustan al personaje, filtros combinables de categoría y estilo, quitar prendas y outfits aleatorios.
- Hasta 30 outfits guardados en el navegador con `localStorage`, restauración y eliminación.
- Descarga de la imagen del outfit como PNG.
- Personaje con cinco dedos y uñas en cada mano.
- Botón para ir al **Salón Brillitos** y volver conservando el personaje y su outfit.
- Peluquería con cortes y peinados, 18 sprays en estantes que se pueden arrastrar a la cabeza, y animación de gotas al teñir. El lavado muestra espuma y agua y retira el spray temporal para recuperar el color anterior.
- Maquillaje con labiales, rubores y sombras, y manicura con las manos ampliadas y ocho esmaltes. Se pueden aplicar arrastrando o tocando los productos y retirar con sus botones de limpieza.
- Maquillaje y uñas guardados con el outfit y visibles en la imagen descargada. Los accesorios de cabeza se apartan visualmente durante la visita al salón y se conservan al volver.
- Diseño adaptable a móvil, tableta y escritorio.

La edad cambia las proporciones por etapas (infancia, adolescencia y adultez); no es un simulador anatómico. Las alturas son relativas y las ilustraciones estilizadas. Se puede usar un accesorio a la vez.

## Publicar

Sube `index.html`, `styles.css`, `app.js`, `salon.css`, `salon.js`, `responsive.css` y `responsive.js` a la carpeta pública de tu hosting, conservando sus nombres y estructura. No se necesita compilación. El sitio usa rutas con `#`, por lo que no requiere redirecciones del servidor.

Las tipografías de Google Fonts son opcionales: si no hay conexión, se utilizan las fuentes de respaldo. El juego no necesita servicios externos. Los outfits guardados pertenecen al navegador y al origen usados; no se sincronizan entre dispositivos ni entre el archivo local y el sitio publicado. Descarga las imágenes que quieras conservar.

## Archivos

- `index.html`: estructura de las pantallas.
- `styles.css`: diseño y adaptación a distintos tamaños.
- `app.js`: ilustraciones SVG, personalización, vestuario, arrastre, colección y descarga.
- `salon.js` y `salon.css`: estaciones, estantes, productos, arrastre y animaciones del salón de belleza.
- `responsive.js` y `responsive.css`: controles táctiles ampliados y vista rápida del personaje al bajar por los productos. Se puede ocultar, tocar para volver al personaje completo o usar como destino al arrastrar una prenda o producto. Mantener pulsado inicia el arrastre táctil; acercar el dedo a un borde vertical desplaza la página.

Para añadir prendas, amplía la lista `clothes` en `app.js`; las formas se dibujan en `garment()`.
