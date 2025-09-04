# 📊 Análisis y decisiones de diseño — FakeStore

## 1. Interfaz y experiencia de usuario

- **Diseño limpio y oscuro**: se usó un tema oscuro con buen contraste (texto claro sobre fondo oscuro) para facilitar la lectura y dar aspecto moderno.
- **Jerarquía visual**: los productos se presentan como tarjetas con imagen grande, título destacado y precio resaltado en color.
- **Carrito lateral**: se eligió un panel lateral fijo porque permite al usuario seguir navegando mientras revisa su carrito, sin perder contexto.
- **Modal de detalle**: mejora la experiencia mostrando más información sin recargar la vista principal.

## 2. Estructura de datos

- **Estado global (`state`)**:
  - `products`: productos obtenidos de la API.
  - `filtered`: lista filtrada/ordenada.
  - `cart`: objeto con la forma:
    ```js
    {
      [id]: { id, title, price, image, qty }
    }
    ```
  - `query`, `category`, `sort`: controlan búsqueda, filtros y ordenamientos.

- **Persistencia**:
  - El carrito se guarda como JSON en `localStorage` bajo la clave `"fakestore-cart"`.
  - Al cargar la página, se recupera y renderiza automáticamente.

## 3. Filtros y ordenamientos

- **Categoría**: permite segmentar los productos según clasificación.
- **Búsqueda**: por título y descripción para localizar fácilmente un producto específico.
- **Ordenamiento**:
  - Precio ascendente y descendente.
  - Orden alfabético A–Z / Z–A.
- **Justificación**: estas opciones cubren los criterios más comunes de exploración en tiendas online, mejorando la usabilidad.

## 4. Responsividad

- **Grid flexible**: productos en columnas adaptables (`auto-fill, minmax`).
- **Media queries**: reorganizan filtros en pantallas pequeñas.
- **Carrito y modal**: se ajustan al ancho de dispositivo.

## 5. Accesibilidad

- Uso de `aria-live`, `aria-hidden`, `aria-expanded` para mejorar compatibilidad con lectores de pantalla.
- Botones con `aria-label` en acciones críticas (cerrar modal, eliminar del carrito, etc.).

---

## 6. Wireframes

Los bocetos iniciales (disponibles en `docs/wireframes.png`) guiaron la disposición:
- Barra superior con búsqueda, filtros y botón de carrito.
- Grid de productos.
- Carrito lateral persistente.
- Modal de detalle.
