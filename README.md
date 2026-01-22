# 🐾 BeniceAstro - Tienda Online Veterinaria

Tienda online completa para productos de animales domésticos construida con Astro, Supabase y TypeScript.

## ✨ Características Principales

### 🔐 Autenticación y Usuarios
- ✅ Sistema completo de registro y login con Supabase Auth
- ✅ Recuperación y cambio de contraseña funcional
- ✅ Perfil de usuario editable
- ✅ Sección "Mis Pedidos" con historial completo

### 📧 Newsletter y Descuentos
- ✅ Popup automático de suscripción a newsletter
- ✅ Generación automática de códigos promocionales
- ✅ Sistema de códigos de descuento aplicables al carrito
- ✅ Validación de códigos con fecha de expiración

### 🔍 Buscador Instantáneo (Live Search)
- ✅ Búsqueda en tiempo real sin recargar la página
- ✅ Resultados flotantes con imagen y precio
- ✅ Implementación con debounce (300ms)
- ✅ API Route con consultas ILIKE en Supabase
- ✅ Mensaje "No encontrado" cuando no hay resultados

### 🎯 Filtrado Avanzado de Productos
Filtros combinables por:
- ✅ Tipo de animal (Perro, Gato, Otros)
- ✅ Tamaño (Mini, Mediano, Grande)
- ✅ Categoría (Alimentación, Higiene, Salud, Accesorios, Juguetes)
- ✅ Edad (Cachorro/Joven, Adulto, Senior)

### 🛒 Carrito y Checkout
- ✅ Carrito persistente con localStorage
- ✅ Gestión de cantidades y stock
- ✅ Aplicación de códigos promocionales
- ✅ Proceso de checkout con creación de pedidos
- ✅ Reducción automática de stock

### 📦 Gestión Post-Venta

#### Cancelación de Pedidos
- ✅ Botón "Cancelar Pedido" solo para pedidos en estado "Pagado"
- ✅ Restauración automática de stock mediante stored procedure
- ✅ Operación atómica con transacciones SQL

#### Devoluciones
- ✅ Botón "Solicitar Devolución" para pedidos entregados
- ✅ Modal informativo con:
  - Dirección de envío para devolución
  - Confirmación de email
  - Información de reembolso (5-7 días)

### 👨‍💼 Panel de Administración

#### Dashboard con Analíticas
- ✅ KPI Cards:
  - 💰 Ventas Totales del Mes
  - ⏳ Pedidos Pendientes
  - 🏆 Producto Más Vendido
- ✅ Gráfico de ventas de los últimos 7 días (Chart.js)
- ✅ Tabla de gestión de pedidos
- ✅ Actualización de estados de pedidos
- ✅ Consultas SQL optimizadas con agregaciones

## 🛠️ Stack Tecnológico

- **Framework:** Astro 4.x con SSR (Server-Side Rendering)
- **Base de Datos:** Supabase (PostgreSQL)
- **Autenticación:** Supabase Auth
- **Lenguaje:** TypeScript (Strict mode)
- **Estilos:** Tailwind CSS
- **Gráficos:** Chart.js
- **Arquitectura:** Islands Architecture

## 📁 Estructura del Proyecto

```
src/
├── components/         # Componentes interactivos
├── layouts/
│   └── Layout.astro   # Layout principal con header/footer
├── pages/
│   ├── index.astro    # Página de inicio
│   ├── productos.astro # Catálogo con filtros
│   ├── carrito.astro  # Carrito de compras
│   ├── login.astro    # Inicio de sesión
│   ├── registro.astro # Registro de usuarios
│   ├── perfil.astro   # Perfil de usuario
│   ├── mis-pedidos.astro # Historial de pedidos
│   ├── admin/
│   │   └── index.astro # Panel de administración
│   └── api/           # API Routes
│       ├── search.ts  # Buscador instantáneo
│       ├── newsletter.ts # Suscripción newsletter
│       ├── create-order.ts # Crear pedidos
│       └── cancel-order.ts # Cancelar pedidos
├── lib/
│   └── supabase.ts    # Cliente de Supabase
├── types/
│   └── index.ts       # Definiciones TypeScript
└── styles/
    └── global.css     # Estilos globales
```

## 🚀 Instalación y Configuración

### 1. Clonar e instalar dependencias

```bash
npm install
```

### 2. Configurar Supabase

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Copia el archivo `.env.example` a `.env`:

```bash
cp .env.example .env
```

3. Añade tus credenciales en `.env`:

```env
SUPABASE_URL=tu_url_de_supabase
SUPABASE_ANON_KEY=tu_clave_anonima
```

### 3. Crear la base de datos

Ejecuta el archivo `supabase-schema.sql` en el editor SQL de Supabase:

- Abre tu proyecto en Supabase
- Ve a "SQL Editor"
- Copia y pega el contenido de `supabase-schema.sql`
- Ejecuta el script

Esto creará:
- ✅ Tablas: users, products, orders, order_items, newsletters, promo_codes
- ✅ Políticas RLS (Row Level Security)
- ✅ Funciones SQL: `create_order_and_reduce_stock`, `cancel_order_and_restore_stock`
- ✅ Datos de ejemplo (17 productos y 3 códigos promocionales)

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:4321`

### 5. Construir para producción

```bash
npm run build
npm run preview
```

## 📝 Funciones SQL Importantes

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

## 🎯 Datos de Prueba

El sistema incluye:
- **17 productos** de ejemplo (perros, gatos y otros animales)
- **3 códigos promocionales**:
  - `BIENVENIDO10` - 10% descuento (activo)
  - `VERANO20` - 20% descuento (activo)
  - `BLACKFRIDAY30` - 30% descuento (expirado)

## 👤 Usuarios

### Usuario Regular
- Regístrate en `/registro`
- Acceso a: productos, carrito, perfil, mis pedidos

### Usuario Admin
- Usa un email que contenga "admin" (ej: admin@beniceastro.com)
- Acceso adicional al panel de administración en `/admin`

## 🔒 Seguridad

- ✅ Row Level Security (RLS) en todas las tablas
- ✅ Autenticación con Supabase Auth
- ✅ Validación de permisos en rutas protegidas
- ✅ Funciones SQL con SECURITY DEFINER
- ✅ Validación de stock antes de crear pedidos

## 🎨 Características UX

- ✅ Diseño responsive y moderno
- ✅ Feedback visual en todas las acciones
- ✅ Estados de carga y mensajes de error
- ✅ Badges de estado con colores semánticos
- ✅ Carrito persistente entre sesiones
- ✅ Contador de carrito en tiempo real

## 📊 Estados de Pedidos

1. **Pendiente** 🟡 - Pedido creado, esperando pago
2. **Pagado** 🔵 - Pago confirmado, listo para envío
3. **Enviado** 🟣 - Pedido en camino
4. **Entregado** 🟢 - Pedido recibido por el cliente
5. **Cancelado** 🔴 - Pedido cancelado (stock restaurado)

## 🛡️ Políticas RLS

- Los usuarios solo pueden ver sus propios pedidos
- Los productos son visibles para todos (lectura pública)
- Las newsletters pueden ser creadas por cualquiera
- Los códigos promocionales activos son visibles para todos

## 📦 Dependencias Principales

```json
{
  "@astrojs/node": "^8.2.1",
  "@astrojs/tailwind": "^5.1.0",
  "@supabase/supabase-js": "^2.39.3",
  "astro": "^4.16.18",
  "chart.js": "^4.4.1",
  "tailwindcss": "^3.4.1"
}
```

## 🎓 Valor Educativo

Este proyecto demuestra:
- ✅ Arquitectura Islands de Astro
- ✅ Integración completa con Supabase
- ✅ Gestión de estado con localStorage
- ✅ API Routes en Astro
- ✅ TypeScript estricto
- ✅ Stored Procedures y transacciones SQL
- ✅ Row Level Security (RLS)
- ✅ Visualización de datos con Chart.js
- ✅ Diseño responsive con Tailwind CSS
- ✅ UX moderna y accesible

## 🚧 Próximas Mejoras

- [ ] Integración con pasarela de pago real (Stripe)
- [ ] Sistema de envío de emails transaccionales
- [ ] Panel de gestión de productos para admin
- [ ] Sistema de reseñas y valoraciones
- [ ] Wishlist de productos favoritos
- [ ] Notificaciones push
- [ ] Chat de soporte en tiempo real

## 📄 Licencia

Este proyecto es de uso educativo y demostrativo.

## 👨‍💻 Desarrollo

Desarrollado como ejemplo completo de tienda online moderna usando las últimas tecnologías web.

---

**¡Gracias por usar BeniceAstro! 🐾**

Para cualquier duda o sugerencia, contacta con nosotros.
