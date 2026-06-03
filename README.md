# Malla Curricular Interactiva - Ingeniería en Informática (INFO) Beta V1.1

Una interfaz interactiva y de diseño premium para visualizar, consultar y planificar el avance académico de la carrera de Ingeniería en Informática en el CUCEI (Universidad de Guadalajara - UdeG), sincronizando calificaciones y horarios en tiempo real.

Desarrollado y mantenido por [Im_JVallejo](https://imjvallejo.dev) ([@Yukyshiram](https://github.com/Yukyshiram)) de SKL Connect.

---

## Características Principales

*   **Sincronización Automática con LEO:** Permite conectar tus credenciales oficiales de LEO para importar tu Kardex y materias cursando actualmente de forma automática.
*   **Código de Colores Inteligente:** Las materias aprobadas (Kardex) y en curso se iluminan usando las paletas cromáticas nativas de cada tema (crema/coral en Atardecer, crema/morado en Crepúsculo, etc.) con una mezcla al 12% para una legibilidad óptima. En el Modo Claro, adoptan verde y amarillo pastel de alta visibilidad para contrastar contra el fondo claro. Las pendientes permanecen oscuras con efecto glassmorphic.
*   **Resaltado Dinámico de Flujos (Prerrequisitos):** Al hacer clic o pasar el cursor sobre cualquier materia, se resaltan automáticamente todos sus prerrequisitos recursivos (en rojo) y sus postrequisitos (en cian), difuminando el resto para analizar rutas de aprendizaje con facilidad.
*   **Autocompletado de Módulos Especializantes:** Identifica automáticamente si has aprobado/cursado materias de alguna de las especialidades e integra las materias correspondientes en los slots vacíos de la malla principal. Permite la selección manual de hasta 2 módulos de especialización simultáneos.
*   **Buscador Inteligente e Insensible a Acentos:** Filtra y resalta materias por nombre, clave, área o competencia. El motor ignora marcas diacríticas (acentos y tildes), permitiendo buscar "calculo" o "programacion" sin errores.
*   **Banner Dinámico de Avance:** Muestra tu progreso porcentual de créditos y la relación de créditos obtenidos/totales (ej. `200 / 375 C` con `53.33%` de avance).
*   **Temas Personalizados Interactivos:** Selector de temas premium (Atardecer, Crepúsculo Morado, Bosque Esmeralda, Espacio Profundo y Modo Claro Pastel) con transiciones de fondo aceleradas por GPU y sin lag de repintado.
*   **Validación de Carrera:** Sistema de alertas en tiempo real que advierte al estudiante si su carrera registrada en LEO difiere de Ingeniería en Informática (INFO).
*   **Interactividad en Módulos de Especialidad:** Las materias de especialidad en la bandeja inferior ahora reflejan su estado académico (aprobado/cursando) y permiten abrir detalles y temarios en PDF sin alterar la selección del módulo.
*   **Diseño Responsivo Optimizado:** Drawer de detalles lateral responsivo interactivo en móviles con overlay de difuminado and botón de cierre nativo.
*   **Footer Premium Integrado:** Pie de página glassmorphic con créditos corporativos de SKL Connect, derechos reservados y un botón interactivo de contacto en Instagram (@im_jvallejo) con hover adaptativo según el tema visual activo.

---

## Tecnologías y Estructura

*   **Frontend:** React 19 + Vite (Rápido HMR y build optimizado).
*   **Estilos:** Vanilla CSS (Glassmorphism, variables personalizadas, responsividad nativa, animaciones GPU).
*   **API Proxy / Backend:** Integración serverless para Vercel (`api/proxy.js`) y desarrollo (`vite.config.js`) que reescribe cabeceras HTTP de origen y referencia para evitar bloqueos por CORS (`403 Forbidden`).
*   **SEO:** Optimizado con datos estructurados JSON-LD, OpenGraph, Twitter Cards, `sitemap.xml` y `robots.txt` estáticos en la raíz.

---

## Instalación y Uso Local

### Requisitos
*   Node.js (versión 18 o superior)
*   npm o yarn

### Pasos
1.  Clona el repositorio:
    ```bash
    git clone https://github.com/Yukyshiram/malla-info-cucei-new.git
    cd malla-info-cucei-new
    ```
2.  Instala las dependencias:
    ```bash
    npm install
    ```
3.  Inicia el servidor de desarrollo local:
    ```bash
    npm run dev
    ```
4.  Abre el navegador en http://localhost:5173.

---

## Historial de Cambios (Changelog)

### v1.1.0 (2026-06-03)
*   **Añadido:** Selector temático con 5 presets (Atardecer, Crepúsculo, Esmeralda, Espacio y Modo Claro).
*   **Añadido:** Validación automática del plan de carrera en login (alerta si la carrera en LEO no es INFO).
*   **Añadido:** Bandeja interactiva de optativas (cargas coloreadas por Kardex, clicable para detalles individuales).
*   **Añadido:** Cajón modal de detalles responsivo en celulares con overlay translúcido y cierre por toque exterior.
*   **Mejorado:** Transiciones de color optimizadas por GPU (vía opacidad) erradicando lag de repintado.
*   **Mejorado:** Normalización en la grilla (todas las materias apilan secuencias abajo y flujos arriba).
*   **Mejorado:** Visibilidad de Kardex en temas oscuros (mezcla al 12% con card bg) y en modo claro (pasteles sólidos).
*   **Corregido:** Leyenda invisible de "Materia Seleccionada" en modo claro usando la variable `--color-selected`.
*   **Corregido:** Desalineamiento en Protocolo (`V0733`) al ocultar el pill de prerrequisitos mediante espaciador de 1px.

---

## Licencia

Este proyecto está bajo la licencia MIT. Siéntete libre de clonarlo, modificarlo y adaptarlo a tu carrera.

*Desarrollado con ❤️ por [Im_JVallejo](https://imjvallejo.dev).*
