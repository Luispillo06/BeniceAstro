# 🐾 BeniceAstro - Tienda Online Veterinaria Profesional

Tienda online **completa y profesional** para productos de animales domésticos construida con Astro, Supabase, Stripe y TypeScript. Incluye todas las funcionalidades de tiendas como Tiendanimal, Zooplus y Kiwoko.

![Astro](https://img.shields.io/badge/Astro-4.16-purple?logo=astro)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?logo=supabase)
![Stripe](https://img.shields.io/badge/Stripe-Payments-blueviolet?logo=stripe)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwindcss)

## 🚀 Características Principales

### 🔐 Autenticación y Usuarios
- Sistema completo de registro y login con Supabase Auth
- Recuperación y cambio de contraseña funcional
- Perfil de usuario editable
- Sección "Mis Pedidos" con historial completo

### 📧 Sistema de Emails Transaccionales (Resend)
- **Email de bienvenida** al registrarse
- **Confirmación de pedido** con detalles y fecha estimada
- **Notificación de envío** con número de seguimiento
- **Cancelación de pedido** con confirmación
- **Newsletter de bienvenida** con código de descuento
- **Email de contacto** desde formulario

### 🔔 Sistema de Notificaciones Toast
- Notificaciones elegantes (success, error, info, warning)
- Animaciones de entrada/salida
- Auto-dismiss configurable
- Posicionamiento en esquina superior derecha

### 🔍 Vista Rápida de Productos (Quick View)
- Modal con galería de imágenes
- Selector de cantidad
- Stock disponible en tiempo real
- Añadir a carrito sin salir de la página
- Añadir a favoritos

### 💳 Carrito y Checkout con Stripe
- Carrito persistente con localStorage
- Slide-over lateral animado
- Códigos promocionales con validación
- Integración completa con Stripe Checkout
- Webhooks para actualización de pedidos

### ❤️ Lista de Favoritos (Wishlist)
- Guardar productos favoritos
- Sincronización con localStorage
- Contador en el header
- Mover a carrito directamente

### 🛍️ Catálogo por Tipo de Animal
- **Perros** - Alimentación, accesorios, higiene, juguetes
- **Gatos** - Comida, areneros, rascadores, juguetes
- **Pájaros** - Semillas, jaulas, accesorios
- **Peces** - Acuarios, alimento, decoración
- **Roedores** - Hámsters, conejos, cobayas

### 🏷️ Página de Ofertas
- Contador regresivo (countdown timer)
- Ofertas flash con temporizador
- Sección de cupones activos
- Newsletter integrado

### ⭐ Sistema de Reseñas
- Valoración con estrellas (1-5)
- Formulario de reseña
- Filtrado por puntuación
- Ordenación (recientes, mejor valoradas)
- Sistema de "útil" (helpful votes)

### 🔗 Productos Relacionados
- Sugerencias basadas en categoría
- Añadir al carrito directo

### 📰 Newsletter y Descuentos
- Popup automático de suscripción
- Generación automática de códigos promocionales
- Sistema de códigos de descuento aplicables al carrito
- Validación de códigos con fecha de expiración

### 🔍 Buscador Instantáneo (Live Search)
- Búsqueda en tiempo real sin recargar la página
- Resultados flotantes con imagen y precio
- Implementación con debounce (300ms)
- API Route con consultas ILIKE en Supabase

### 🎛️ Filtrado Avanzado de Productos
Filtros combinables por:
- Tipo de animal (Perro, Gato, Pájaro, Pez, Roedor)
- Tamaño (Mini, Mediano, Grande)
- Categoría (Alimentación, Higiene, Salud, Accesorios, Juguetes)
- Edad (Cachorro/Joven, Adulto, Senior)

### 📋 Gestión Post-Venta

#### Cancelación de Pedidos
- Botón "Cancelar Pedido" solo para pedidos en estado "Pagado"
- Restauración automática de stock mediante stored procedure
- Email de confirmación de cancelación

#### Devoluciones
- Botón "Solicitar Devolución" para pedidos entregados
- Modal informativo con dirección de envío
- Información de reembolso (5-7 días)

### 📊 Panel de Administración

#### Dashboard con Analíticas
- KPI Cards: Ventas, Pedidos Pendientes, Producto Más Vendido
- Gráfico de ventas de los últimos 7 días (Chart.js)
- Tabla de gestión de pedidos
- Actualización de estados de pedidos

#### Gestión de Productos
- CRUD completo de productos
- Subida de imágenes
- Control de stock
- Precios y ofertas

#### Gestión de Ofertas Flash
- Activar/desactivar ofertas
- Productos en oferta con descuentos

### 📄 Páginas Legales y de Información
- **Política de Privacidad** - RGPD compliant
- **Términos y Condiciones** - Condiciones de uso
- **Política de Cookies** - Banner GDPR con preferencias
- **Envíos y Devoluciones** - Información de envío
- **FAQ** - Preguntas frecuentes con buscador
- **Contacto** - Formulario + información + mapa
- **Sobre Nosotros** - Historia de la empresa
- **Blog** - Artículos sobre cuidado de mascotas

### 🍪 Cookie Banner GDPR
- Consentimiento granular (Analytics, Marketing)
- Aceptar/Rechazar todo
- Configurar preferencias
- Persistencia con localStorage

### 🎨 Navegación Profesional
- **Banner superior** con envío gratis
- **Mega menú** con categorías por animal
- **Menú móvil** responsive
- **Footer completo** con:
  - Beneficios de la tienda
  - Enlaces organizados
  - Newsletter
  - Métodos de pago
  - Redes sociales

## 🛠️ Stack Tecnológico

| Tecnología | Uso |
|------------|-----|
| **Astro 4.16** | Framework principal con SSR |
| **React 19** | Componentes interactivos |
| **TypeScript** | Tipado estricto |
| **Supabase** | Base de datos PostgreSQL + Auth |
| **Stripe** | Procesamiento de pagos |
| **Resend** | Emails transaccionales |
| **Nanostores** | Estado global (carrito, toast) |
| **TailwindCSS** | Estilos |
| **Chart.js** | Gráficos del dashboard |

## 📁 Estructura del Proyecto

```
src/
├── components/           # Componentes React interactivos
│   ├── AddToCartButton.tsx
│   ├── CartButton.tsx
│   ├── CartSlideOver.tsx
│   ├── CookieBanner.tsx      # Banner GDPR de cookies
│   ├── ImageUploader.tsx
│   ├── NewsletterPopup.astro
│   ├── OfertasFlash.astro
│   ├── OfertasToggle.astro
│   ├── ProductCard.tsx       # Tarjeta de producto mejorada
│   ├── ProductReviews.tsx    # Sistema de reseñas
│   ├── QuickViewModal.tsx    # Modal vista rápida
│   ├── RelatedProducts.tsx   # Productos relacionados
│   └── Toast.tsx             # Sistema de notificaciones
├── layouts/
│   └── Layout.astro          # Layout con mega menu y footer
├── lib/
│   ├── email.ts              # Sistema de emails (Resend)
│   └── supabase.ts           # Cliente de Supabase
├── pages/
│   ├── index.astro           # Página de inicio
│   ├── productos.astro       # Catálogo con filtros
│   ├── perros.astro          # Productos para perros
│   ├── gatos.astro           # Productos para gatos
│   ├── pajaros.astro         # Productos para pájaros
│   ├── peces.astro           # Productos para peces
│   ├── roedores.astro        # Productos para roedores
│   ├── ofertas.astro         # Página de ofertas
│   ├── favoritos.astro       # Lista de favoritos
│   ├── carrito.astro         # Carrito de compras
│   ├── checkout.astro        # Proceso de checkout
│   ├── login.astro           # Inicio de sesión
│   ├── registro.astro        # Registro de usuarios
│   ├── perfil.astro          # Perfil de usuario
│   ├── mis-pedidos.astro     # Historial de pedidos
│   ├── contacto.astro        # Formulario de contacto
│   ├── faq.astro             # Preguntas frecuentes
│   ├── sobre-nosotros.astro  # Sobre la empresa
│   ├── privacidad.astro      # Política de privacidad
│   ├── terminos.astro        # Términos y condiciones
│   ├── cookies.astro         # Política de cookies
│   ├── envios.astro          # Envíos y devoluciones
│   ├── admin/
│   │   ├── index.astro       # Panel de administración
│   │   ├── dashboard.astro   # Dashboard analítico
│   │   ├── pedidos.astro     # Gestión de pedidos
│   │   ├── devoluciones.astro
│   │   └── productos/        # CRUD de productos
│   ├── api/
│   │   ├── search.ts         # Buscador instantáneo
│   │   ├── newsletter.ts     # Suscripción newsletter
│   │   ├── create-order.ts   # Crear pedidos + email
│   │   ├── cancel-order.ts   # Cancelar pedidos
│   │   ├── contact.ts        # Formulario de contacto
│   │   ├── returns.ts        # Devoluciones
│   │   ├── stripe/           # Webhooks de Stripe
│   │   └── admin/            # APIs de administración
│   ├── blog/
│   │   └── index.astro       # Blog de mascotas
│   ├── checkout/
│   │   └── success.astro     # Confirmación de pago
│   └── producto/
│       └── [slug].astro      # Página de producto
├── stores/
│   └── cart.ts               # Estado del carrito (nanostores)
├── styles/
│   └── global.css            # Estilos globales
└── types/
    └── index.ts              # Definiciones TypeScript
```

## ⚙️ Instalación y Configuración

### 1. Clonar e instalar dependencias

```bash
git clone <tu-repo>
cd BeniceAstro
npm install
```

### 2. Configurar variables de entorno

Copia el archivo `.env.example` a `.env`:

```bash
cp .env.example .env
```

Configura todas las variables:

```env
# Supabase (requerido)
SUPABASE_URL=tu_url_de_supabase
SUPABASE_ANON_KEY=tu_clave_anonima

# Stripe (requerido para pagos)
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# Resend (requerido para emails)
RESEND_API_KEY=re_xxx

# URL de la aplicación
PUBLIC_SITE_URL=http://localhost:4321
```

### 3. Configurar Supabase

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Ve a "SQL Editor"
3. Ejecuta el contenido de `supabase.sql`

Esto creará:
- Tablas: users, products, orders, order_items, newsletters, promo_codes, reviews
- Políticas RLS (Row Level Security)
- Funciones SQL: `create_order_and_reduce_stock`, `cancel_order_and_restore_stock`
- Datos de ejemplo

### 4. Configurar Stripe

1. Crea una cuenta en [Stripe](https://stripe.com)
2. Obtén las claves desde Dashboard > Developers > API Keys
3. Configura el webhook en Developers > Webhooks
   - URL: `https://tu-dominio.com/api/stripe/webhook`
   - Eventos: `checkout.session.completed`

### 5. Configurar Resend

1. Crea una cuenta en [Resend](https://resend.com)
2. Genera una API Key
3. Verifica tu dominio para enviar emails

### 6. Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:4321`

### 7. Construir para producción

```bash
npm run build
npm run preview
```
## 🗄️ Funciones SQL Importantes

### `create_order_and_reduce_stock`
Función transaccional que:
1. Crea el pedido
2. Añade los items del pedido
3. Reduce el stock de cada producto
4. Valida stock disponible

### `cancel_order_and_restore_stock`
Función transaccional que:
1. Verifica que el pedido esté en estado "pagado"
2. Restaura el stock de todos los productos
3. Cambia el estado a "cancelado"

## 🧪 Datos de Prueba

El sistema incluye:
- **17+ productos** de ejemplo (perros, gatos, pájaros, peces, roedores)
- **3 códigos promocionales**:
  - `BIENVENIDO10` - 10% descuento (activo)
  - `VERANO20` - 20% descuento (activo)
  - `BLACKFRIDAY30` - 30% descuento (expirado)

## 👥 Usuarios

### Usuario Regular
- Regístrate en `/registro`
- Acceso a: productos, carrito, perfil, mis pedidos, favoritos

### Usuario Admin
- Usa un email que contenga "admin" (ej: admin@beniceastro.com)
- Acceso adicional al panel de administración en `/admin`

## 🔒 Seguridad

- Row Level Security (RLS) en todas las tablas
- Autenticación con Supabase Auth
- Validación de permisos en rutas protegidas
- Funciones SQL con SECURITY DEFINER
- Validación de stock antes de crear pedidos
- HTTPS obligatorio en producción

## 📦 Estados de Pedidos

| Estado | Descripción | Acciones disponibles |
|--------|-------------|---------------------|
| **Pendiente** | Esperando pago | Pagar |
| **Pagado** | Pago confirmado | Cancelar |
| **Enviado** | En camino | Ver seguimiento |
| **Entregado** | Recibido | Solicitar devolución |
| **Cancelado** | Cancelado | - |

## 📧 Emails Automáticos

| Evento | Plantilla | Información incluida |
|--------|-----------|---------------------|
| Registro | Bienvenida | Mensaje de bienvenida |
| Compra | Confirmación | Productos, total, fecha entrega |
| Envío | Notificación | Número de seguimiento |
| Cancelación | Confirmación | Detalles del reembolso |
| Newsletter | Bienvenida | Código de descuento |
| Contacto | Confirmación | Copia del mensaje |

## 📚 Dependencias Principales

```json
{
  "astro": "^4.16.18",
  "@astrojs/node": "^8.2.1",
  "@astrojs/react": "^4.3.1",
  "@astrojs/tailwind": "^5.1.0",
  "react": "^19.2.3",
  "react-dom": "^19.2.3",
  "@supabase/supabase-js": "^2.39.3",
  "stripe": "^20.2.0",
  "resend": "^4.5.0",
  "nanostores": "^1.1.0",
  "@nanostores/react": "^0.9.0",
  "chart.js": "^4.4.1",
  "tailwindcss": "^3.4.1"
}
```

## 🎓 Valor Educativo

Este proyecto demuestra:
- Arquitectura Islands de Astro
- Integración completa con Supabase (Auth + Database + RLS)
- Gestión de estado con nanostores y localStorage
- API Routes en Astro (SSR)
- TypeScript estricto
- Stored Procedures y transacciones SQL
- Row Level Security (RLS) para seguridad
- Procesamiento de pagos con Stripe
- Emails transaccionales con Resend
- Visualización de datos con Chart.js
- Diseño responsive con Tailwind CSS
- Componentes React interactivos
- UX moderna y accesible

## ✅ Funcionalidades Implementadas

- [x] Autenticación completa (registro, login, recuperar contraseña)
- [x] Catálogo de productos con filtros avanzados
- [x] Páginas por tipo de animal (perros, gatos, pájaros, peces, roedores)
- [x] Carrito de compras persistente
- [x] Checkout con Stripe
- [x] Emails de confirmación con Resend
- [x] Sistema de favoritos (wishlist)
- [x] Vista rápida de productos
- [x] Sistema de notificaciones toast
- [x] Panel de administración con analytics
- [x] Gestión de pedidos
- [x] Cancelaciones y devoluciones
- [x] Newsletter con códigos promocionales
- [x] Ofertas flash con countdown
- [x] Sistema de reseñas y valoraciones
- [x] Blog de mascotas
- [x] Páginas legales (privacidad, términos, cookies)
- [x] FAQ con buscador
- [x] Formulario de contacto
- [x] Cookie banner GDPR
- [x] Mega menú de navegación
- [x] Footer profesional

## 🚀 Próximas Mejoras (Opcionales)

- [ ] Chat de soporte en tiempo real
- [ ] Sistema de puntos/fidelización
- [ ] Comparador de productos
- [ ] Notificaciones push
- [ ] App móvil (PWA)
- [ ] Multi-idioma

## 📄 Licencia

MIT License - Libre para uso educativo y comercial.

## 👨‍💻 Desarrollo

Desarrollado como ejemplo completo de tienda online profesional usando las últimas tecnologías web.

---

<p align="center">
  <strong>🐾 BeniceAstro - Tu tienda de mascotas online 🐾</strong>
  <br>
  <a href="/contacto">Contacto</a> •
  <a href="/faq">FAQ</a> •
  <a href="/sobre-nosotros">Sobre Nosotros</a>
</p>
