# 📋 Análisis de Requisitos del Proyecto Venice (Tienda de Mascotas)

## 🎯 Resumen Ejecutivo

Comparativa entre lo que **pide el maestro** y lo que **ya tienes implementado** en tu tienda de mascotas Venice.

---

## ✅ FUNCIONALIDADES YA IMPLEMENTADAS

| Funcionalidad | Estado | Descripción |
|--------------|--------|-------------|
| **Catálogo de productos** | ✅ Completo | Productos con filtros por especie, categoría, tamaño, edad |
| **Carrito persistente** | ✅ Completo | Usa localStorage, funcional |
| **Códigos promocionales** | ✅ Completo | Sistema de descuentos con validación en carrito |
| **Autenticación Supabase** | ✅ Completo | Login, registro, recuperar contraseña |
| **Cambio de contraseña** | ✅ Completo | Página `/actualizar-contrasena` funcional |
| **Panel Admin protegido** | ✅ Completo | Ruta `/adminBenice` con verificación de rol |
| **Control de Stock (atomicidad)** | ✅ Completo | Stored procedures SQL que previenen overselling |
| **Gestión de Pedidos** | ✅ Completo | Crear, cancelar, restaurar stock |
| **Historial "Mis Pedidos"** | ✅ Completo | Estados: Pendiente, Pagado, Enviado, Entregado, Cancelado |
| **Cancelación automática** | ✅ Completo | Botón activo solo en estado "Pagado", restaura stock |
| **Flujo de devolución** | ✅ Completo | Modal informativo con instrucciones y dirección |
| **Base de datos PostgreSQL** | ✅ Completo | Esquema con RLS y transacciones |
| **Newsletter básico** | ✅ Completo | Suscripción con código promo |
| **Buscador instantáneo** | ✅ Completo | API con debounce, ILIKE, resultados flotantes |
| **Astro + Tailwind + Node adapter** | ✅ Completo | Compatible con Coolify/Docker |

---

## ✅ GESTIÓN POST-VENTA (Ya Implementado)

### Historial de Pedidos (`/mis-pedidos`)
- ✅ Lista de pedidos con indicador visual de estado
- ✅ Estados: `pendiente`, `pagado`, `enviado`, `entregado`, `cancelado`
- ✅ Detalle de items con imagen, cantidad y precio
- ✅ Descuentos aplicados visibles

### Flujo de Cancelación (Antes del envío)
- ✅ Botón "Cancelar Pedido" visible solo en estado `pagado`
- ✅ Confirmación antes de cancelar
- ✅ **Operación atómica** con `cancel_order_and_restore_stock()`:
  - Cambia estado a `cancelado`
  - Restaura stock automáticamente
- ✅ Botón desaparece en estados `enviado`/`entregado`

### Flujo de Devolución (Después de entrega)
- ✅ Botón "Solicitar Devolución" en estado `entregado`
- ✅ Modal informativo con:
  - 📦 **Instrucciones de envío** con dirección del almacén
  - ✅ **Confirmación** de email con etiqueta
  - 💰 **Disclaimer financiero** (5-7 días hábiles)
- ✅ Botón de seguimiento de pedido

---

## ❌ FUNCIONALIDADES QUE FALTAN

### 1. 🛍️ **CRUD Completo de Productos en Admin**
**Requerido:** El admin debe poder crear, editar y eliminar productos desde el panel.

**Estado actual:** El panel admin solo MUESTRA productos, no hay formularios para gestión.

**Implementar:**
- Formulario "Nuevo Producto" con todos los campos
- Modal/página de edición de productos
- Botón eliminar con confirmación
- Validación de campos

---

### 2. 📸 **Subida de Múltiples Imágenes a Supabase Storage**
**Requerido:** Subir fotos al bucket de Supabase y guardar URLs en la BD.

**Estado actual:** Los productos usan `image_url` (un solo texto) con placeholders.

**Implementar:**
- Crear bucket `product-images` en Supabase Storage
- Cambiar `image_url TEXT` a `images TEXT[]` (array de URLs)
- Componente drag & drop para subir imágenes
- Galería de imágenes en ficha de producto
- Políticas RLS para Storage

---

### 3. 🔥 **Sección "Ofertas Flash" con Interruptor Admin**
**Requerido:** Sección en Home que aparece/desaparece según interruptor del admin.

**Estado actual:** No existe sección de ofertas flash controlable.

**Implementar:**
- Tabla `site_settings` con `ofertas_activas: boolean`
- Campo `on_sale` y `sale_price` en productos
- Sección visual en Home que consulta el setting
- Toggle en admin para activar/desactivar ofertas
- Tiempo real (opcional): que cambie sin recargar

---

### 4. 💳 **Pasarela de Pago (Stripe)**
**Requerido:** Checkout con pago real (modo test).

**Estado actual:** El checkout crea el pedido pero no procesa pago.

**Implementar:**
- Integración Stripe Checkout Sessions
- API route `/api/create-checkout-session.ts`
- Webhook `/api/stripe-webhook.ts` para confirmar pago
- Actualizar estado del pedido a "pagado" automáticamente
- Variables de entorno para Stripe keys

---

### 5. 📄 **Ficha de Producto Individual**
**Requerido:** Página `/producto/[slug]` con galería, selección de opciones.

**Estado actual:** No existe página individual de producto.

**Implementar:**
- Ruta dinámica `/producto/[id].astro` o `[slug].astro`
- Galería de imágenes con thumbnails
- Selector de cantidad
- Mostrar stock disponible
- Productos relacionados

---

### 6. 🎨 **Carrito Slide-Over (Panel Lateral)**
**Requerido (opcional pero recomendado):** Carrito que se abre como panel lateral desde cualquier página.

**Estado actual:** El carrito es una página separada `/carrito`.

**Implementar:**
- Componente `CartSlideOver` en el Layout
- Icono de carrito en header que abre el panel
- Ver items sin salir de la página actual
- Usar Nano Stores para estado reactivo (recomendado por Astro)

---

### 7. 📊 **Dashboard Ejecutivo con Analíticas** ⭐ NUEVO
**Requerido:** El admin quiere ver gráficos para tomar decisiones rápidas, no solo tablas.

**Estado actual:** El panel admin solo muestra listado de productos.

**Implementar:**

#### KPI Cards (Tarjetas de Métricas)
- 💰 **Ventas Totales del Mes** (€) - `SUM(total) WHERE created_at >= inicio_mes`
- 📦 **Pedidos Pendientes** - `COUNT(*) WHERE status = 'pendiente'`
- 🏆 **Producto Más Vendido** - `GROUP BY product_id ORDER BY SUM(quantity) DESC LIMIT 1`
- 👥 **Nuevos Clientes del Mes** - `COUNT(*) FROM users WHERE created_at >= inicio_mes`

#### Gráfico de Ventas (Chart.js)
- Gráfico de barras/líneas: ventas de los últimos 7 días
- Consulta: `GROUP BY DATE(created_at) ORDER BY fecha`
- Transformar datos de BD al formato de Chart.js

#### Valor Educativo
- Consultas SQL de agregación: `SUM`, `COUNT`, `GROUP BY`
- Integración de Chart.js en Astro
- Transformación de datos para librerías gráficas

---

### 8. 🐾 **Recomendador de Producto por Mascota** ⭐ NUEVO
**Requerido:** Ayudar al usuario a elegir el producto adecuado para su mascota (reduce devoluciones).

**Adaptación para tienda de mascotas (en lugar de tallas de ropa):**

**Funcionalidad:**
- Botón "¿Qué producto necesita mi mascota?" en ficha de producto
- Modal que pide: Tipo de mascota, Peso (kg), Edad (años)

**Lógica algorítmica:**
```javascript
function recomendarProducto(tipo, peso, edad) {
  if (tipo === 'perro') {
    if (peso < 10) return { size: 'mini', age: edad < 1 ? 'cachorro' : edad > 7 ? 'senior' : 'adulto' };
    if (peso < 25) return { size: 'mediano', age: ... };
    return { size: 'grande', age: ... };
  }
  if (tipo === 'gato') {
    return { size: 'mini', age: edad < 1 ? 'cachorro' : edad > 10 ? 'senior' : 'adulto' };
  }
}
// Devuelve: "Te recomendamos productos para perro MEDIANO ADULTO"
```

**Valor Educativo:**
- Lógica de negocio desacoplada de UI
- Mejora UX con poco esfuerzo técnico
- Islands Architecture con formulario interactivo

---

### 9. 🧾 **Sistema de Facturas y Abonos** ⭐ NUEVO
**Requerido:** Gestión contable completa con facturas de venta y facturas de abono para devoluciones.

**Estado actual:** No existe sistema de facturación.

**Implementar:**

#### Tabla `invoices` (Facturas)
```sql
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number TEXT UNIQUE NOT NULL, -- Ej: FAC-2026-0001
  order_id UUID REFERENCES orders(id),
  user_id UUID REFERENCES users(id),
  type TEXT NOT NULL CHECK (type IN ('sale', 'refund')), -- venta o abono
  subtotal DECIMAL(10,2) NOT NULL,
  tax_rate DECIMAL(5,2) DEFAULT 21.00, -- IVA 21%
  tax_amount DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL, -- Positivo para venta, NEGATIVO para abono
  status TEXT DEFAULT 'issued' CHECK (status IN ('draft', 'issued', 'paid', 'cancelled')),
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  pdf_url TEXT -- URL del PDF generado
);
```

#### Flujo de Facturación
1. **Al completar pago** → Generar factura de VENTA (total positivo)
2. **Al procesar devolución** → Generar factura de ABONO (total negativo)
3. **Cuadre de caja** → Suma de todas las facturas = balance real

#### Funcionalidades
- Generar número de factura correlativo: `FAC-2026-0001`, `FAC-2026-0002`...
- Facturas de abono: `ABO-2026-0001` (importes negativos)
- Vista en admin: listado de facturas con filtros
- Descarga PDF de cada factura
- Cuadre de caja: sumatorio de facturas por período

#### Página `/admin/facturas`
- Tabla con todas las facturas
- Filtros: tipo (venta/abono), fecha, estado
- Total ventas vs Total abonos = Balance
- Exportar a CSV/Excel

---

## 📊 CAMBIOS EN BASE DE DATOS NECESARIOS

```sql
-- 1. Añadir campos de oferta a productos
ALTER TABLE products ADD COLUMN IF NOT EXISTS on_sale BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS sale_price DECIMAL(10,2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';
ALTER TABLE products ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- 2. Crear tabla de configuración del sitio
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar configuración inicial
INSERT INTO public.site_settings (key, value)
VALUES ('ofertas_flash', '{"active": false, "title": "Ofertas Flash 🔥"}');

-- RLS para site_settings
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Settings públicos para lectura"
  ON public.site_settings FOR SELECT TO public USING (true);

CREATE POLICY "Solo admins pueden modificar settings"
  ON public.site_settings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 3. Crear tabla de facturas
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number TEXT UNIQUE NOT NULL,
  order_id UUID REFERENCES public.orders(id),
  user_id UUID REFERENCES public.users(id),
  type TEXT NOT NULL CHECK (type IN ('sale', 'refund')),
  subtotal DECIMAL(10,2) NOT NULL,
  tax_rate DECIMAL(5,2) DEFAULT 21.00,
  tax_amount DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'issued' CHECK (status IN ('draft', 'issued', 'paid', 'cancelled')),
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  pdf_url TEXT
);

-- RLS para invoices
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users ven sus propias facturas"
  ON public.invoices FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins ven todas las facturas"
  ON public.invoices FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- 4. Función para generar número de factura
CREATE OR REPLACE FUNCTION generate_invoice_number(invoice_type TEXT)
RETURNS TEXT AS $$
DECLARE
  prefix TEXT;
  year TEXT;
  next_num INTEGER;
  result TEXT;
BEGIN
  prefix := CASE WHEN invoice_type = 'sale' THEN 'FAC' ELSE 'ABO' END;
  year := TO_CHAR(NOW(), 'YYYY');
  
  SELECT COALESCE(MAX(
    CAST(SPLIT_PART(invoice_number, '-', 3) AS INTEGER)
  ), 0) + 1
  INTO next_num
  FROM public.invoices
  WHERE invoice_number LIKE prefix || '-' || year || '-%';
  
  result := prefix || '-' || year || '-' || LPAD(next_num::TEXT, 4, '0');
  RETURN result;
END;
$$ LANGUAGE plpgsql;
```

---

## 🗂️ ESTRUCTURA DE ARCHIVOS A CREAR

```
src/
├── components/
│   ├── CartSlideOver.tsx       # Panel lateral del carrito
│   ├── AddToCartButton.tsx     # Botón añadir (Island)
│   ├── ProductGallery.tsx      # Galería de imágenes
│   ├── ImageUploader.tsx       # Drag & drop imágenes
│   ├── OfertasFlash.astro      # Sección ofertas en Home
│   ├── ToggleSwitch.tsx        # Switch para activar ofertas
│   ├── PetRecommender.tsx      # Recomendador de producto por mascota
│   ├── DashboardKPIs.astro     # Tarjetas KPI para admin
│   └── SalesChart.tsx          # Gráfico de ventas (Chart.js)
├── stores/
│   └── cartStore.ts            # Nano Stores para carrito
├── pages/
│   ├── producto/
│   │   └── [id].astro          # Ficha producto individual
│   ├── api/
│   │   ├── create-checkout-session.ts  # Stripe checkout
│   │   ├── stripe-webhook.ts           # Webhook Stripe
│   │   ├── admin/
│   │   │   ├── products.ts     # CRUD productos
│   │   │   ├── upload-image.ts # Subir imágenes
│   │   │   ├── settings.ts     # Actualizar settings
│   │   │   ├── analytics.ts    # Datos para dashboard
│   │   │   └── invoices.ts     # Generar facturas
│   └── admin/
│       ├── index.astro         # Dashboard con KPIs y gráficos
│       ├── productos/
│       │   ├── index.astro     # Listado CRUD productos
│       │   ├── nuevo.astro     # Formulario nuevo producto
│       │   └── [id].astro      # Editar producto
│       ├── facturas.astro      # Gestión de facturas
│       └── ofertas.astro       # Gestión ofertas flash
```

---

## 📌 PRIORIDAD DE IMPLEMENTACIÓN (Sugerida)

| Orden | Tarea | Tiempo Est. | Impacto |
|-------|-------|-------------|---------|
| 1 | CRUD Productos Admin | 2-3h | ⭐⭐⭐⭐⭐ |
| 2 | Ficha Producto Individual | 1-2h | ⭐⭐⭐⭐⭐ |
| 3 | Dashboard Ejecutivo (KPIs + Chart.js) | 2-3h | ⭐⭐⭐⭐⭐ |
| 4 | Supabase Storage + Imágenes | 2h | ⭐⭐⭐⭐ |
| 5 | Sección Ofertas Flash + Toggle | 1-2h | ⭐⭐⭐⭐ |
| 6 | Popup Newsletter con código | 1h | ⭐⭐⭐⭐ |
| 7 | Stripe Checkout | 2-3h | ⭐⭐⭐⭐⭐ |
| 8 | Sistema de Facturas/Abonos | 3-4h | ⭐⭐⭐⭐⭐ |
| 9 | Recomendador de Mascota | 1h | ⭐⭐⭐ |
| 10 | Carrito Slide-Over (Nano Stores) | 1-2h | ⭐⭐⭐ |
| 5 | Stripe Checkout | 2-3h | ⭐⭐⭐⭐⭐ |
| 6 | Carrito Slide-Over (Nano Stores) | 1-2h | ⭐⭐⭐ |

---

## 🚀 RESUMEN PARA LOS HITOS

### Hito 1 ✅ (Arquitectura)
- Ya tienes: Stack definido (Astro + Supabase + Tailwind)
- Ya tienes: Esquema de BD funcional

### Hito 2 ✅ (Prototipo Funcional)
- Ya tienes: Web muestra productos desde Supabase
- Ya tienes: Login admin funciona
- **Falta:** CRUD completo de productos

### Hito 3 (Tienda Viva)
- Ya tienes: Control de stock
- **Falta:** Stripe integrado (modo test)
- **Falta:** Desplegar en Coolify

---

## 📧 AMPLIACIÓN: NEWSLETTER CON POPUP Y CÓDIGO DESCUENTO

### Estado Actual
Ya existe un sistema básico de newsletter con:
- ✅ Tabla `newsletters` en Supabase
- ✅ API endpoint `/api/newsletter.ts`
- ✅ Generación de código promocional al suscribirse
- ✅ Códigos de descuento funcionales en el carrito

### ❌ Falta Implementar

#### 1. **Popup de Suscripción con Código Descuento** ⭐ PRIORITARIO
- Modal que aparece tras 5 segundos en la web
- Diseño atractivo: "¡Suscríbete y obtén 10% de descuento!"
- Al suscribirse, mostrar el código promocional generado
- Cookie para no mostrar de nuevo si ya se cerró/suscribió
- Animación de entrada suave

#### 2. **Formulario en Footer**
- Input de email siempre visible en el footer
- Validación de email en tiempo real
- Mensaje de éxito con código de descuento

#### 3. **Panel Admin - Gestión de Suscriptores**
- Ver lista de todos los suscriptores
- Exportar emails a CSV
- Estadísticas: total suscriptores, nuevos esta semana
- Eliminar suscriptores (GDPR)

#### 4. **Emails Automáticos (Opcional Avanzado)**
- Bienvenida con código de descuento
- Integración con servicio de email (Resend, SendGrid)
- Templates HTML personalizados

### Tabla Mejorada de Newsletter
```sql
ALTER TABLE public.newsletters ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.newsletters ADD COLUMN IF NOT EXISTS subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE public.newsletters ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'popup'; -- popup, footer, checkout
ALTER TABLE public.newsletters ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
```

### Componentes a Crear
```
src/
├── components/
│   ├── NewsletterPopup.astro    # Popup modal con código descuento
│   ├── NewsletterFooter.astro   # Formulario en footer
│   └── NewsletterAdmin.astro    # Gestión en admin
```

---

## ❓ DECISIONES PENDIENTES

1. **Stripe vs PayPal vs Redsys**: ¿Cuál prefieres? (Stripe es el más fácil de integrar)
2. **Nano Stores vs localStorage**: ¿Cambiar a Nano Stores para el carrito?
3. **Slug vs ID**: ¿URLs amigables `/producto/pienso-perro-adulto` o `/producto/uuid`?
4. **Newsletter**: ¿Quieres el popup automático o solo formulario en footer?
5. **Emails automáticos**: ¿Integrar Resend/SendGrid para enviar emails reales?

---

**¿Procedemos con la implementación? Confirma qué quieres hacer primero.**
