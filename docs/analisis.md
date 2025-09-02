# Análisis de diseño y decisiones

## Objetivo
Entregar una experiencia de compra sencilla, moderna y clara, cumpliendo con los requisitos de consumo de API, catálogo dinámico y carrito persistente.

## Estructura de datos
- **Estado global** (`state` en `app.js`):
  ```js
  {
    products: [],   // datos en crudo desde la API
    filtered: [],   // resultado tras búsqueda/filtros/orden
    cart: {         // carrito indexado por id de producto
      [id]: { id, title, price, image, qty }
    },
    query: '',      // texto de búsqueda
    category: 'all',// categoría activa
    sort: 'relevance' // criterio de orden
  }
  ```
- **Persistencia**: `cart` se guarda en `localStorage` bajo la clave `fakestore-cart`.
- **Representación del carrito**: Objeto indexado para acceso O(1) por id y facilidad de agregados/incrementos.

## Justificación de filtros y ordenamientos
- **Búsqueda** en título + descripción para mayor descubrimiento.
- **Categoría** para reducir el set de resultados y encontrar rápido.
- **Orden** por precio (±) y por nombre (A–Z / Z–A), cubriendo los criterios más usados en retail.
- **Relevancia** mantiene el orden por defecto de la API cuando no se desea forzar un orden.

## Usabilidad y accesibilidad
- Controles superiores siempre visibles (*topbar* sticky).
- Carrito accesible desde cualquier pantalla (panel lateral).
- Atributos `aria-*` en secciones dinámicas y botones.
- Colores con alto contraste y tipografía legible.
- Controles de cantidad grandes y táctiles.

## Organización del código
- Código modular por funciones: `renderProducts`, `applyPipeline`, `renderCart`, etc.
- Separación en archivos `HTML`, `CSS` y `JS`.
- Utilidades (`$`, `$$`, `money`, `debounce`) para simplificar interacciones.

## Mejoras futuras
- Paginación/infinite scroll.
- Estado de carga / skeletons.
- Cache de productos/categorías en `localStorage` con invalidación.
- Test unitarios (Vitest/Jest) para helpers y reducer del carrito.
