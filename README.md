# AsisteQR - Sistema Profesional de Control de Asistencia

## 🎯 Descripción General

AsisteQR es un sistema premium de gestión de asistencias con tecnología de punta, diseñado con estándares profesionales estilo Windows 11. Incluye geolocalización precisa (hasta 10m), análisis con IA simulada y una experiencia UX/UI excepcional.

## ✨ Características Principales

### 🏠 Página Principal (home.html)
- Diseño landing page profesional
- Secciones: Hero, Características, Beneficios, Demo
- Botones de acceso a modo estudiante y administrador
- Información detallada de todas las funcionalidades
- Estadísticas y métricas de impacto
- Diseño responsivo y animaciones fluidas

### 🔐 Sistema de Login (index.html)
- Interfaz moderna con gradientes y animaciones
- Validación en tiempo real
- Credenciales de acceso:
  - **Usuario:** admin
  - **Contraseña:** admin123
- Datos ficticios precargados automáticamente

### 📱 Módulo Escáner QR (qr/)
**Características:**
- Geolocalización GPS de alta precisión (máximo 10m de imprecisión)
- Validación automática de ubicación del evento
- Captura de coordenadas exactas (latitud/longitud)
- Precisión GPS en tiempo real
- Indicador visual de calidad de señal
- Radio de verificación configurable (10 metros)
- Estadísticas en tiempo real

**Datos capturados por asistencia:**
- Coordenadas GPS (lat, lng)
- Precisión del GPS (accuracy en metros)
- Distancia al punto del evento
- Timestamp exacto
- Información del estudiante
- Información del evento

### 📅 Módulo Eventos (eventos/)
**Funcionalidades:**
- Crear, editar y eliminar eventos
- Formulario completo con validación
- Tarjetas visuales estilo Windows 11
- Estadísticas por evento
- Códigos QR únicos generados automáticamente
- Filtros y búsqueda avanzada
- Vista de cupos y asistencias

**Datos ficticios incluidos:**
- 5 eventos académicos variados
- Fechas, horarios, ubicaciones
- Descripciones detalladas
- Capacidad de asistentes

### 📊 Módulo Reportes (reportes/)
**Características:**
- Tabla completa de asistencias con geolocalización
- Filtros por evento, fecha y búsqueda
- Visualización de coordenadas GPS
- Indicadores de precisión (Excelente/Buena/Regular)
- Distancia al punto del evento
- Exportación a Excel (CSV funcional)
- Exportación a PDF (simulada)
- Estadísticas resumidas
- Mapa conceptual de ubicaciones

### 🤖 Módulo Análisis con IA (analisis/)
**Análisis Profesional incluye:**

1. **Resumen Ejecutivo**
   - Total de asistencias
   - Estudiantes activos
   - Promedio por evento
   - Tasa de participación
   - Precisión GPS promedio

2. **Tendencias de Asistencia**
   - Gráfico visual de tendencias
   - Comparación semanal
   - Identificación de patrones
   - Insights automáticos

3. **Horarios Pico**
   - Top 4 franjas horarias más concurridas
   - Conteo de asistencias por hora

4. **Compromiso Estudiantil**
   - Tasa de participación global
   - Promedio eventos por estudiante
   - Estudiantes recurrentes (3+ asistencias)
   - Métricas visuales con barras

5. **Predicciones y Recomendaciones**
   - Proyección de crecimiento
   - Asistencia esperada próximo evento
   - Recomendaciones estratégicas
   - Alertas de riesgo identificadas
   - Niveles de confianza por predicción

6. **Análisis Geográfico**
   - Precisión GPS promedio
   - Distancia promedio al evento
   - Porcentaje de registros con precisión excelente
   - Validación geográfica

## 🎨 Diseño y Estilo

### Paleta de Colores Profesional
- **Primary:** #0078D4 (Azul Microsoft)
- **Secondary:** #00B294 (Verde azulado)
- **Accent:** #00A4EF (Azul cielo)
- **AI Purple:** #8B5CF6 (Morado para IA)
- **Success:** #107C10 (Verde)
- **Warning:** #F7630C (Naranja)
- **Error:** #D13438 (Rojo)

### Características de Diseño
- Estilo Windows 11 (Fluent Design)
- Bordes redondeados consistentes
- Sombras sutiles y profesionales
- Gradientes modernos
- Animaciones suaves
- Tipografía Segoe UI
- Sistema de grid responsivo
- Hover effects elegantes

## 📦 Estructura de Archivos

```
asisteqr/
│
├── home.html              # Página principal landing
├── home.css               # Estilos página principal
├── home.js                # Funcionalidad página principal
│
├── index.html             # Login
├── login/
│   ├── login.css          # Estilos login
│   └── login.js           # Lógica autenticación
│
├── qr/
│   ├── escaner.html       # Escáner QR
│   ├── escaner.css        # Estilos escáner
│   └── escaner.js         # Geolocalización y escaneo
│
├── eventos/
│   ├── eventos.html       # Gestión eventos
│   ├── eventos.css        # Estilos eventos
│   └── eventos.js         # CRUD eventos
│
├── reportes/
│   ├── reportes.html      # Reportes
│   ├── reportes.css       # Estilos reportes
│   └── reportes.js        # Filtros y exportación
│
└── analisis/
    ├── analisis.html      # Análisis IA
    ├── analisis.css       # Estilos análisis
    └── analisis.js        # Simulación IA
```

## 🚀 Cómo Usar

### Acceso Inicial
1. Abre `home.html` en tu navegador
2. Explora las secciones y características
3. Haz clic en "Probar Demo" o "Acceso Administrativo"
4. Ingresa credenciales: admin / admin123

### Flujo de Trabajo
1. **Login** → Autenticación
2. **Escáner QR** → Simular escaneo y registro con GPS
3. **Eventos** → Gestionar eventos académicos
4. **Reportes** → Ver datos con geolocalización y exportar
5. **Análisis IA** → Generar insights automáticos

## 📱 Funcionalidades Móviles

- 100% Responsive Design
- Navegación táctil optimizada
- Geolocalización nativa del navegador
- Funciona en cualquier dispositivo

## 💾 Almacenamiento

El sistema usa **localStorage** para persistencia:
- `asisteqr-events` - Eventos
- `asisteqr-students` - Estudiantes (6 ficticios)
- `asisteqr-attendances` - Asistencias con GPS
- `asisteqr-session` - Sesión activa

## 🌐 Compatibilidad

- **Navegadores:** Chrome, Firefox, Edge, Safari
- **Geolocalización:** Requiere HTTPS o localhost
- **Responsive:** Móviles, tablets, desktop

## 🎓 Datos Ficticios Incluidos

### Eventos (5)
- Congreso Internacional de Innovación Tecnológica 2025
- Taller Práctico de Emprendimiento Digital
- Hackathon Universitario - Soluciones Sostenibles
- Seminario de Inteligencia Artificial Aplicada
- Feria de Proyectos de Investigación Estudiantil

### Estudiantes (6)
- Andrea Carolina Morales Gutiérrez (Ing. Sistemas)
- Luis Fernando García Pérez (Administración)
- María José Rodríguez Silva (Ing. Industrial)
- Carlos Alberto Hernández López (Ing. Electrónica)
- Laura Valentina Martínez Cruz (Psicología)
- Diego Alejandro Sánchez Rojas (Contaduría)

## ✅ Características Técnicas

### Geolocalización Precisa
- API Geolocation con `enableHighAccuracy: true`
- Tracking continuo con `watchPosition()`
- Cálculo de distancia con fórmula Haversine
- Validación de radio máximo 10 metros
- Almacenamiento de precisión GPS

### Análisis IA Simulado
- Procesamiento por etapas con animaciones
- Cálculos estadísticos reales
- Predicciones basadas en tendencias
- Métricas de confianza
- Visualizaciones interactivas

### Exportación
- CSV/Excel funcional con encoding UTF-8
- Descarga automática de archivos
- Formato compatible con Excel

## 🔧 Personalización

Puedes modificar fácilmente:
- Colores en variables CSS `:root`
- Radio de geolocalización en `escaner.js`
- Ubicaciones de eventos en `EVENT_LOCATIONS`
- Datos ficticios en `login.js`

## 📄 Licencia

Sistema diseñado para demostración educativa y profesional.

## 👨‍💻 Soporte

Sistema completamente funcional sin dependencias externas. 
Todo el código es vanilla JavaScript, HTML5 y CSS3.

---

**Desarrollado con diseño profesional estilo Windows 11 y UX/UI moderna** ✨
