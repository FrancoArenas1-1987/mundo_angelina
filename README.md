# El mundo de Angelina

Sitio estático en español con vestidor y salón de belleza, taller de dibujo, jardín interactivo y juego del colgado. Sin instalación, backend ni cuentas.

## Abrir

Abre `index.html` en un navegador moderno. También puedes servir la carpeta con Python:

```powershell
python -m http.server 5173
```

Visita `http://localhost:5173`.

## Incluye

- Menú inicial con cuatro juegos disponibles: Mi vestidor creativo, Pequeño gran artista, Mi jardín mágico y El juego del colgado.
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

## Nuevos juegos

- **Pequeño gran artista** (`#artista`): lienzo de 1.000 × 700, pincel, goma, tres sellos, paleta y color personalizado, tamaño ajustable, 20 pasos de deshacer, rehacer, ideas y descarga PNG con fondo blanco. Admite ratón, tacto, lápiz y teclado (flechas para mover, Espacio para pintar). El dibujo se conserva al navegar, pero se pierde al recargar o cerrar: descarga las obras que quieras conservar.
- **Mi jardín mágico** (`#jardin`): nueve parcelas y seis flores. Planta, aplica dos riegos y dos rayitos de luz y colecciona la flor. Sin temporizadores ni marchitamiento. Incluye pequeñas curiosidades de las flores. Guarda parcelas y colección en `localStorage` y valida los datos al recuperarlos; si el navegador impide el guardado, permite seguir jugando y avisa.
- **El juego del colgado** (`#colgado`): 1.604 palabras españolas únicas, seleccionadas de vocabulario cotidiano y escolar para lectores de 11 años, en siete categorías. Incluye tres rangos de longitud y una selección con todas las palabras. Seis errores posibles, una letra de ayuda gratuita, teclado físico y botones, Ñ independiente y vocales que revelan también las tildes y la Ü. Muestra la escritura correcta al terminar. Cada combinación de filtros tiene su propio mazo aleatorio sin repeticiones hasta agotarlo durante la visita. Los niveles se basan en longitud, no en una evaluación curricular.
- Los tres juegos funcionan abriendo el archivo local, sin conexión ni dependencias nuevas de ejecución.

## Publicar

Sube `index.html`, `styles.css`, `app.js`, `salon.css`, `salon.js`, `responsive.css`, `responsive.js`, `games.css`, `games.js`, `words.js`, `score-rules.js`, `scores.js` y `scores.css` a la carpeta pública de tu hosting, conservando sus nombres y estructura. No se necesita compilación. El sitio usa rutas con `#`, por lo que no requiere redirecciones del servidor.

Las tipografías de Google Fonts son opcionales: si no hay conexión, se utilizan las fuentes de respaldo. El juego no necesita servicios externos. Los outfits guardados pertenecen al navegador y al origen usados; no se sincronizan entre dispositivos ni entre el archivo local y el sitio publicado. Descarga las imágenes que quieras conservar.

## Archivos

- `index.html`: estructura de las pantallas.
- `styles.css`: diseño y adaptación a distintos tamaños.
- `app.js`: ilustraciones SVG, personalización, vestuario, arrastre, colección y descarga.
- `salon.js` y `salon.css`: estaciones, estantes, productos, arrastre y animaciones del salón de belleza.
- `responsive.js` y `responsive.css`: controles táctiles ampliados y vista rápida del personaje al bajar por los productos. Se puede ocultar, tocar para volver al personaje completo o usar como destino al arrastrar una prenda o producto. Mantener pulsado inicia el arrastre táctil; acercar el dedo a un borde vertical desplaza la página.

Para añadir prendas, amplía la lista `clothes` en `app.js`; las formas se dibujan en `garment()`.

## Archivos de los nuevos juegos y pruebas

- `games.js`: dibujo, jardín y partidas del colgado.
- `games.css`: estilos de las tres pantallas y menú de cuatro tarjetas.
- `words.js`: vocabulario por categorías y eliminación de duplicados normalizados, conservando la Ñ.
- `tests/games.cjs`: pruebas de vocabulario, navegación, PNG, dibujo táctil, cuidados y persistencia, partidas ganadas/perdidas, pistas, Ñ, tildes, mazos y vista móvil.

Con Node y Playwright disponibles, ejecuta:

```powershell
node tests/games.cjs
```

Puedes pasar la ruta del módulo Playwright como segundo argumento y definir `BROWSER_EXECUTABLE` para usar un Chromium existente. Las pruebas abren `index.html` directamente. `GAMES_SCREENSHOT_DIR` permite guardar capturas móviles. Las pruebas previas siguen en `tests/`.

## Puntajes locales y jugadores

El botón **Elegir apodo** permite crear hasta 20 jugadores en el mismo navegador. **Puntajes** (`#puntajes`) muestra la clasificación general, una tabla por juego y las últimas actividades del apodo activo. Los puntajes se guardan automáticamente en `localStorage` con la clave `angelina-scores-v1`.

| Juego | Puntos |
| --- | --- |
| El colgado | 100 por resolver una palabra nueva, 10 por cada error disponible y 5 por letra; la ayuda resta 25. |
| Mi jardín mágico | 25 por cada flor nueva cultivada y coleccionada. |
| Pequeño gran artista | 50 al pulsar **Terminar obra**, usando al menos 3 colores, 2 herramientas y 10 trazos o sellos. |
| Mi vestidor creativo | 30 al guardar un outfit nuevo con parte superior, inferior y zapatos, o vestido y zapatos. |
| Salón Brillitos | 20 al guardar un look nuevo después de usar dos estaciones. |

No se vuelve a premiar la misma palabra, imagen, combinación de prendas o look para el mismo apodo. Cada nueva flor cuenta por separado. Deshacer y rehacer en el artista también restaura el avance del objetivo. Los puntos pertenecen al apodo activo al completar la actividad. Cambiar de jugador reinicia la palabra del colgado; el dibujo, el jardín y el personaje siguen siendo compartidos en ese navegador.

**Alcance:** funciona íntegramente en GitHub Pages, sin servicios, cuentas, credenciales ni backend. La clasificación es local: otros navegadores, dispositivos y visitantes tienen sus propias tablas. Se sincroniza entre pestañas del mismo sitio y navegador; utiliza Web Locks cuando está disponible para evitar duplicar o perder premios simultáneos. Abrir el archivo local y abrir el sitio publicado no comparte datos.

Borrar los datos del sitio elimina perfiles y puntos; el modo privado puede eliminarlos al cerrar. Si el almacenamiento falla o contiene datos inválidos, la aplicación lo indica y no afirma haber guardado. Los datos inválidos no se sobrescriben. Hay un límite de 10.000 actividades premiadas en el conjunto de jugadores. Al ser un juego local, los puntajes pueden modificarse con las herramientas del navegador: no es una clasificación verificada para competiciones.

Archivos:
- `score-rules.js`: reglas comunes de cálculo y validación.
- `scores.js`: apodos, guardado, deduplicación y clasificación.
- `scores.css`: barra del jugador, tabla y selector de apodos.
- `tests/score-rules.cjs` y `tests/scores.cjs`: reglas y pruebas de navegador (cinco juegos, perfiles separados, recarga, duplicados, filtros, varias pestañas y errores de almacenamiento).

Pruebas:

```powershell
node --test tests/score-rules.cjs
node tests/scores.cjs
```

La prueba de navegador acepta la ruta al módulo Playwright como argumento, `BROWSER_EXECUTABLE` para seleccionar Chromium y `SCORES_SCREENSHOT` para guardar una captura de la tabla.
