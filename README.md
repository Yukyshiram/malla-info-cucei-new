# Malla Curricular Interactiva - Ingeniería en Informática (INFO) Beta

Una interfaz interactiva y de diseño premium para visualizar, consultar y planificar el avance académico de la carrera de Ingeniería en Informática en el CUCEI (Universidad de Guadalajara - UdeG), sincronizando calificaciones y horarios en tiempo real.

Desarrollado y mantenido por [Im_JVallejo](https://imjvallejo.dev) ([@Yukyshiram](https://github.com/Yukyshiram)) de SKL Connect.

---

## Características Principales

*   **Sincronización Automática con LEO:** Permite conectar tus credenciales oficiales de LEO para importar tu Kardex y materias cursando actualmente de forma automática.
*   **Código de Colores Inteligente:** Materias aprobadas se iluminan en verde esmeralda (`#10b981`), materias en curso se iluminan en ámbar (`#f59e0b`), y materias pendientes permanecen oscuras con efecto glassmorphic.
*   **Resaltado Dinámico de Flujos (Prerrequisitos):** Al hacer clic o pasar el cursor sobre cualquier materia, se resaltan automáticamente todos sus prerrequisitos recursivos (en rojo) y sus postrequisitos (en cian), difuminando el resto para analizar rutas de aprendizaje con facilidad.
*   **Autocompletado de Módulos Especializantes:** Identifica automáticamente si has aprobado/cursado materias de alguna de las especialidades e integra las materias correspondientes en los slots vacíos de la malla principal. Permite la selección manual de hasta 2 módulos de especialización simultáneos.
*   **Buscador Inteligente e Insensible a Acentos:** Filtra y resalta materias por nombre, clave, área o competencia. El motor ignora marcas diacríticas (acentos y tildes), permitiendo buscar "calculo" o "programacion" sin errores.
*   **Banner Dinámico de Avance:** Muestra tu progreso porcentual de créditos y la relación de créditos obtenidos/totales (ej. `200 / 375 C` con `53.33%` de avance).

---

## Tecnologías y Estructura

*   **Frontend:** React 19 + Vite (Rápido HMR y build optimizado).
*   **Estilos:** Vanilla CSS (Glassmorphism, variables personalizadas, responsividad nativa).
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

## Licencia

Este proyecto está bajo la licencia MIT. Siéntete libre de clonarlo, modificarlo y adaptarlo a tu carrera.

*Desarrollado con ❤️ por [Im_JVallejo](https://imjvallejo.dev).*
