# Análisis Funcional: PLP y Carrito de Compras

## Resumen de la Exploración
La página presenta un catálogo de cursos (PLP - Product List Page) con funcionalidad de carrito de compras. Cada producto muestra:
- Imagen del curso
- Título del curso
- Descripción breve
- Precio ($50 para todos los cursos)
- Botón "Add to Cart"
- Paginación (9 productos por página)

## Elementos Principales
1. Header
   - Logo QA Practice
   - Contador de carrito con número de items

2. Listado de Productos
   - Grid de productos (3x3)
   - Imágenes clickeables que redirigen a UPEX
   - Botones "Add to Cart" en cada producto

3. Paginación
   - Botones numerados (1-9)
   - Flechas de navegación (prev/next)

## Casos de Prueba Propuestos

### 1. Visualización del PLP
1. Verificar carga correcta del grid de productos
2. Validar información completa de cada producto
3. Comprobar responsividad del diseño
4. Verificar funcionamiento de paginación
5. Validar que las imágenes se cargan correctamente

### 2. Funcionalidad del Carrito
1. Agregar un producto al carrito
   - Validar actualización del contador
   - Verificar persistencia del producto agregado
2. Agregar múltiples productos
   - Validar límite de cantidad
   - Verificar suma correcta en el contador
3. Agregar el mismo producto varias veces
   - Verificar comportamiento (si suma cantidad o muestra error)
4. Validar estado del carrito después de refresh de página

### 3. Navegación
1. Verificar enlaces a detalles de productos
2. Validar funcionamiento de la paginación
   - Navegación entre páginas
   - Persistencia de productos en carrito al cambiar página
3. Validar URL y estados de navegación

### 4. Validaciones de Seguridad
1. Verificar protección de rutas sin autenticación
2. Validar token de sesión para operaciones del carrito
3. Verificar manejo de errores en requests

### 5. Casos de Error
1. Validar comportamiento con conexión lenta
2. Verificar mensajes de error cuando el servidor no responde
3. Validar comportamiento cuando las imágenes no cargan
4. Verificar manejo de errores en la API del carrito

## Priorización de Automatización
Alta Prioridad:
- Agregar productos al carrito
- Validar contador del carrito
- Verificar persistencia de productos
- Navegación básica del PLP

Media Prioridad:
- Validaciones de UI/UX
- Casos de múltiples productos
- Paginación

Baja Prioridad:
- Casos extremos de error
- Pruebas de rendimiento
- Validaciones de imagen

## Consideraciones Técnicas
1. Selectors identificados:
   - Botón Add to Cart: button[contains(text(), 'Add to Cart')]
   - Contador del carrito: button[contains(text(), 'Cart')]
   - Productos: div[role="grid"] > div
   - Paginación: button[type="button"]

2. Estado del carrito:
   - Se mantiene en el estado de la aplicación
   - Persiste entre navegaciones
   - Se actualiza en tiempo real

3. Puntos de validación:
   - Contador del carrito
   - Estado de botones Add to Cart
   - Mensajes de confirmación/error
   - URLs de navegación
