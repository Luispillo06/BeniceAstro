# BeniceAstro - Tienda Online Veterinaria

## Estado del Proyecto
- [x] Estructura base del proyecto
- [x] Configuración de Supabase
- [x] Sistema de autenticación
- [x] Catálogo de productos con filtros avanzados
- [x] Carrito de compras
- [x] Panel de administración
- [x] Sistema de newsletter y códigos promocionales
- [x] Buscador instantáneo
- [x] Gestión de pedidos y cancelaciones
- [x] Sistema de devoluciones

## Stack Tecnológico
- Astro 4.x con TypeScript (Strict)
- Supabase (Auth + Database + RLS)
- Tailwind CSS
- Chart.js
- Islands Architecture
- Node Adapter (SSR)

## Estructura del Proyecto
```
src/
├── components/     # Componentes interactivos
├── layouts/        
│   └── Layout.astro # Layout con header, footer, auth
├── pages/          
│   ├── index.astro         # Página principal
│   ├── productos.astro     # Catálogo con filtros
│   ├── carrito.astro       # Carrito de compras
│   ├── login.astro         # Inicio de sesión
│   ├── registro.astro      # Registro
│   ├── perfil.astro        # Perfil de usuario
│   ├── mis-pedidos.astro   # Historial de pedidos
│   ├── api/                # API routes
│   │   ├── search.ts       # Buscador live
│   │   ├── newsletter.ts   # Suscripción
│   │   ├── create-order.ts # Crear pedidos
│   │   └── cancel-order.ts # Cancelar pedidos
│   └── admin/
│       └── index.astro     # Dashboard analítico
├── lib/
│   └── supabase.ts         # Cliente Supabase
├── types/
│   └── index.ts            # Tipos TypeScript
└── styles/
    └── global.css          # Estilos + Tailwind
```

## Instrucciones para Despliegue

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar Supabase
- Copiar `.env.example` a `.env`
- Añadir credenciales de Supabase
- Ejecutar `supabase-schema.sql` en SQL Editor

### 3. Ejecutar en desarrollo
```bash
npm run dev
```

### 4. Compilar para producción
```bash
npm run build
npm run preview
```

## Características Principales
✅ Autenticación completa (login, registro, recuperar contraseña)
✅ Buscador instantáneo con debounce
✅ Filtros combinables (animal, tamaño, categoría, edad)
✅ Carrito con localStorage y códigos promocionales
✅ Newsletter con popup automático
✅ Gestión de pedidos con estados
✅ Cancelación de pedidos con restauración de stock
✅ Sistema de devoluciones
✅ Panel de administración con analíticas
✅ Gráficos de ventas (Chart.js)
✅ Row Level Security (RLS)
✅ Stored Procedures SQL
