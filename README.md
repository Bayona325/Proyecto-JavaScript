# FakeStore — Demo completa

App web que consume la **Fake Store API** y ofrece catálogo de productos con **búsqueda**, **filtros**, **ordenamientos** y **carrito con persistencia en `localStorage`**.

## 🧩 Tecnologías
- HTML + CSS (sin frameworks)
- JavaScript moderno (ES6+)
- Fetch API para consumo de `https://fakestoreapi.com/products`

## 🚀 Ejecutar
1. Descarga el proyecto y abre `index.html` en tu navegador.
2. Asegúrate de permitir peticiones a Internet (la API es pública).
3. ¡Listo! Deberías ver los productos y poder usar el carrito.

> Si usas Live Server (VSCode), basta con **Open with Live Server**.

## ✨ Funcionalidades
- Catálogo dinámico con cards
- **Búsqueda** por título y descripción (con *debounce*)
- **Filtro por categoría**
- **Ordenamiento** por precio y título
- **Carrito** (agregar, eliminar, cambiar cantidades)
- **Persistencia** del carrito en `localStorage`
- Diseño **responsivo** y accesible (atributos `aria-*`)

## 🗂 Estructura
```
/ (raíz)
├─ index.html
├─ styles.css
├─ app.js
└─ docs/
   ├─ analisis.md
   └─ wireframes.md
```

## 📸 Capturas
> Agrega aquí screenshots de tu propia ejecución cuando lo subas a GitHub.

## 🔒 Notas
- Esta demo no maneja autenticación ni pagos reales (el botón *Pagar* es simulado).
- El almacenamiento local se guarda bajo la clave `fakestore-cart`.
