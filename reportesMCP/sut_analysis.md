# Análisis del Sistema Under Test (SUT) - UPEX Galaxy QA Practice Site

## Descripción General del Sistema

UPEX Galaxy QA Practice Site es una plataforma de comercio electrónico educativa diseñada específicamente para la práctica y aprendizaje de pruebas de software (QA). El sistema simula una tienda en línea especializada en cursos de testing y automatización, proporcionando un entorno realista para practicar diferentes tipos de pruebas de software.

## Módulos y Características Principales

### 1. Sistema de Autenticación

- Login con usuario y contraseña
- Gestión de sesiones
- Validaciones de seguridad
- Protección de rutas privadas

### 2. Catálogo de Cursos

El sistema presenta un catálogo completo de cursos de testing, divididos en las siguientes categorías:

#### Testing Manual

- **QA Software Testing Course (STLC)**
  - Enfocado en el ciclo de vida del testing de software
  - Conceptos fundamentales de QA
  - Metodologías de pruebas

#### Testing de Bases de Datos

- **Database Testing Course (SQL)**
  - Pruebas de bases de datos
  - Fundamentos de SQL
  - Validación de datos

#### Testing de APIs

- **API Testing with POSTMAN Course**
  - Pruebas de APIs REST
  - Uso de Postman
  - Automatización de pruebas de API

#### Automatización de Pruebas

- **Cypress Course (e2e)**
  - Automatización con Cypress
  - Pruebas end-to-end
  - Mejores prácticas
  
- **Playwright Course (e2e)**
  - Framework de Playwright
  - Pruebas multi-navegador
  - Automatización moderna
  
- **Selenium Course (e2e)**
  - Automatización con Selenium
  - WebDriver
  - Frameworks de testing

### 3. Sistema de Carrito de Compras

- Funcionalidad de "Agregar al Carrito"
- Contador de items en carrito
- Gestión de productos
- Precios unificados ($50 por curso)

### 4. Sistema de Navegación

- Paginación (9 páginas disponibles)
- Navegación entre categorías
- Enlaces a detalles de cursos
- Integración con la plataforma principal de UPEX

### 5. Características Técnicas

- Diseño responsivo
- Interfaz de usuario moderna
- Sistema de rutas protegidas
- Gestión de estados
- Validaciones del lado del cliente

## Valor como Sistema Under Test (SUT)

Este sistema es ideal como SUT porque:

1. **Diversidad de Funcionalidades**: Permite practicar diferentes tipos de pruebas:
   - Pruebas funcionales
   - Pruebas de UI/UX
   - Pruebas de integración
   - Pruebas de seguridad
   - Pruebas de rendimiento

2. **Escenarios Realistas**:
   - Flujos de compra completos
   - Gestión de sesiones
   - Validaciones de formularios
   - Manejo de errores

3. **Complejidad Adecuada**:
   - Suficientemente complejo para pruebas significativas
   - No demasiado complejo para principiantes
   - Escenarios comunes en aplicaciones web reales

4. **Aspectos de Seguridad**:
   - Autenticación
   - Autorización
   - Protección de rutas
   - Validación de inputs

Este sistema proporciona un entorno ideal para practicar y aprender diferentes aspectos del testing de software, desde pruebas básicas hasta automatización avanzada.
