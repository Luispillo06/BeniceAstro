# 🚀 Guía de Inicio Rápido - BeniceAstro

## ✅ Pasos Completados

1. ✅ Proyecto Astro inicializado
2. ✅ Dependencias instaladas
3. ✅ Estructura de archivos creada
4. ✅ Configuración de TypeScript y Tailwind
5. ✅ Sistema de autenticación implementado
6. ✅ Catálogo de productos con filtros
7. ✅ Carrito y checkout completo
8. ✅ Panel de administración
9. ✅ APIs y funcionalidades avanzadas

## 📋 Próximos Pasos

### 1️⃣ Configurar Supabase

1. Ve a [https://supabase.com](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto
3. Copia las credenciales:
   - URL del proyecto
   - Anon/Public Key

### 2️⃣ Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu-clave-anon-aqui
```

### 3️⃣ Crear Base de Datos

1. Abre tu proyecto en Supabase
2. Ve a **SQL Editor**
3. Copia todo el contenido del archivo `supabase-schema.sql`
4. Pégalo en el editor SQL
5. Haz click en **Run** o presiona `Ctrl+Enter`

Esto creará:
- ✅ Todas las tablas necesarias
- ✅ Políticas de seguridad (RLS)
- ✅ Funciones SQL (stored procedures)
- ✅ 17 productos de ejemplo
- ✅ 3 códigos promocionales

### 4️⃣ Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: **http://localhost:4321**

## 🧪 Probar la Aplicación

### Crear Usuario Regular
1. Ve a `/registro`
2. Crea una cuenta con cualquier email
3. Podrás:
   - Ver productos
   - Añadir al carrito
   - Crear pedidos
   - Ver tu historial
   - Cancelar pedidos en estado "Pagado"

### Crear Usuario Admin
1. Registra un usuario con email que contenga "admin"
   - Ejemplo: `admin@beniceastro.com`
2. Tendrás acceso adicional a:
   - Panel de administración (`/admin`)
   - Analíticas y KPIs
   - Gestión de pedidos

### Probar Códigos Promocionales
Códigos incluidos en la base de datos:
- `BIENVENIDO10` - 10% de descuento
- `VERANO20` - 20% de descuento

### Probar Newsletter
1. Espera 5 segundos en la página principal
2. Aparecerá un popup automático
3. Suscríbete con tu email
4. Recibirás un código promocional generado automáticamente

## 🎯 Funcionalidades Clave

### 🔍 Buscador Instantáneo
- Escribe en la barra de búsqueda del header
- Resultados en tiempo real
- Implementado con debounce de 300ms

### 🎨 Filtros de Productos
Ve a `/productos` y prueba:
- Filtro por tipo de animal (Perro, Gato, Otros)
- Filtro por tamaño (Mini, Mediano, Grande)
- Filtro por categoría
- Filtro por edad
- Combinación de múltiples filtros

### 🛒 Carrito de Compras
- Añade productos al carrito
- Modifica cantidades
- Aplica códigos promocionales
- El carrito persiste entre sesiones

### 📦 Gestión de Pedidos
En `/mis-pedidos`:
- Ver historial completo
- **Cancelar pedidos** (solo en estado "Pagado")
  - El stock se restaura automáticamente
- **Solicitar devoluciones** (solo entregados)
  - Modal con instrucciones

### 📊 Panel de Administración
En `/admin` (solo para admins):
- KPIs del mes actual
- Gráfico de ventas (últimos 7 días)
- Tabla de gestión de pedidos
- Cambiar estados de pedidos

## 📁 Archivos Importantes

```
BeniceAstro/
├── supabase-schema.sql      # ⚠️ IMPORTANTE: Ejecutar en Supabase
├── .env.example              # Plantilla de variables de entorno
├── README.md                 # Documentación completa
├── package.json              # Dependencias
├── astro.config.mjs          # Configuración de Astro
├── tailwind.config.mjs       # Configuración de Tailwind
└── src/
    ├── pages/                # Todas las páginas
    ├── layouts/Layout.astro  # Layout principal
    ├── lib/supabase.ts       # Cliente de Supabase
    └── types/index.ts        # Definiciones TypeScript
```

## 🐛 Solución de Problemas

### Error: "Cannot find module '@supabase/supabase-js'"
```bash
npm install
```

### Error: Variables de entorno no definidas
1. Verifica que el archivo `.env` existe
2. Comprueba que las variables están correctamente escritas
3. Reinicia el servidor de desarrollo

### Error al crear pedidos
1. Asegúrate de haber ejecutado `supabase-schema.sql`
2. Verifica que las funciones SQL estén creadas
3. Comprueba que hay stock disponible

### Error de autenticación
1. Verifica las credenciales en `.env`
2. Comprueba que el proyecto de Supabase está activo
3. Revisa que las políticas RLS están habilitadas

## 🚀 Despliegue a Producción

### Opción 1: Vercel
```bash
npm run build
# Despliega la carpeta dist/
```

### Opción 2: Netlify
```bash
npm run build
# Despliega la carpeta dist/
```

### Variables de Entorno en Producción
No olvides configurar:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

## 📚 Recursos Adicionales

- [Documentación de Astro](https://docs.astro.build)
- [Documentación de Supabase](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Chart.js](https://www.chartjs.org/docs)

## 💡 Características Técnicas Destacadas

1. **Row Level Security (RLS)**
   - Los usuarios solo ven sus propios pedidos
   - Seguridad a nivel de base de datos

2. **Stored Procedures**
   - Operaciones atómicas para pedidos
   - Restauración automática de stock

3. **Islands Architecture**
   - JavaScript mínimo en el cliente
   - Carga rápida y eficiente

4. **TypeScript Strict**
   - Tipado estricto en todo el proyecto
   - Menor probabilidad de errores

5. **API Routes**
   - Endpoints para búsqueda, newsletter, pedidos
   - Lógica de negocio en el servidor

## ✨ Próximas Mejoras Sugeridas

- [ ] Integración con Stripe para pagos reales
- [ ] Sistema de emails transaccionales
- [ ] Gestión de productos desde el admin
- [ ] Sistema de reseñas
- [ ] Wishlist de productos
- [ ] Notificaciones en tiempo real

---

**¿Listo para empezar?** Ejecuta `npm run dev` y abre http://localhost:4321

**¿Problemas?** Revisa el README.md o contacta al equipo de desarrollo.

🐾 **¡Disfruta construyendo con BeniceAstro!**
