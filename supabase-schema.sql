-- =============================================
-- BeniceAstro - Schema de Base de Datos
-- =============================================

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TABLA: users (perfil extendido)
-- =============================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS para users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users pueden ver su propio perfil"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users pueden actualizar su propio perfil"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- =============================================
-- TABLA: products
-- =============================================
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  image_url TEXT,
  animal_type TEXT NOT NULL CHECK (animal_type IN ('perro', 'gato', 'otros')),
  size TEXT NOT NULL CHECK (size IN ('mini', 'mediano', 'grande')),
  category TEXT NOT NULL CHECK (category IN ('alimentacion', 'higiene', 'salud', 'accesorios', 'juguetes')),
  age_range TEXT NOT NULL CHECK (age_range IN ('cachorro', 'adulto', 'senior')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS para products (lectura pública)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Productos visibles para todos"
  ON public.products FOR SELECT
  TO public
  USING (true);

-- =============================================
-- TABLA: orders
-- =============================================
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
  status TEXT NOT NULL DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'pagado', 'enviado', 'entregado', 'cancelado')),
  promo_code TEXT,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS para orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users pueden ver sus propios pedidos"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users pueden crear pedidos"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users pueden actualizar sus pedidos"
  ON public.orders FOR UPDATE
  USING (auth.uid() = user_id);

-- =============================================
-- TABLA: order_items
-- =============================================
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0)
);

-- RLS para order_items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users pueden ver items de sus pedidos"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users pueden insertar items en sus pedidos"
  ON public.order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- =============================================
-- TABLA: newsletters
-- =============================================
CREATE TABLE IF NOT EXISTS public.newsletters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  promo_code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS para newsletters (lectura pública para verificar)
ALTER TABLE public.newsletters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Newsletters pueden ser creadas por cualquiera"
  ON public.newsletters FOR INSERT
  TO public
  WITH CHECK (true);

-- =============================================
-- TABLA: promo_codes
-- =============================================
CREATE TABLE IF NOT EXISTS public.promo_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  discount_percentage INTEGER NOT NULL CHECK (discount_percentage > 0 AND discount_percentage <= 100),
  active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS para promo_codes (lectura pública)
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Códigos promocionales visibles para todos"
  ON public.promo_codes FOR SELECT
  TO public
  USING (active = true);

-- =============================================
-- FUNCIÓN: Cancelar pedido y restaurar stock
-- =============================================
CREATE OR REPLACE FUNCTION cancel_order_and_restore_stock(order_uuid UUID)
RETURNS VOID AS $$
DECLARE
  item RECORD;
BEGIN
  -- Verificar que el pedido esté en estado 'pagado'
  IF NOT EXISTS (
    SELECT 1 FROM public.orders
    WHERE id = order_uuid AND status = 'pagado'
  ) THEN
    RAISE EXCEPTION 'El pedido no puede ser cancelado';
  END IF;

  -- Restaurar stock de cada producto
  FOR item IN
    SELECT product_id, quantity
    FROM public.order_items
    WHERE order_id = order_uuid
  LOOP
    UPDATE public.products
    SET stock = stock + item.quantity
    WHERE id = item.product_id;
  END LOOP;

  -- Cambiar estado del pedido a cancelado
  UPDATE public.orders
  SET status = 'cancelado', updated_at = NOW()
  WHERE id = order_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- FUNCIÓN: Crear pedido y reducir stock
-- =============================================
CREATE OR REPLACE FUNCTION create_order_and_reduce_stock(
  p_user_id UUID,
  p_total DECIMAL,
  p_items JSONB,
  p_promo_code TEXT DEFAULT NULL,
  p_discount_amount DECIMAL DEFAULT 0
)
RETURNS UUID AS $$
DECLARE
  new_order_id UUID;
  item JSONB;
BEGIN
  -- Crear el pedido
  INSERT INTO public.orders (user_id, total, status, promo_code, discount_amount)
  VALUES (p_user_id, p_total, 'pagado', p_promo_code, p_discount_amount)
  RETURNING id INTO new_order_id;

  -- Procesar cada item
  FOR item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    -- Verificar stock disponible
    IF NOT EXISTS (
      SELECT 1 FROM public.products
      WHERE id = (item->>'product_id')::UUID
      AND stock >= (item->>'quantity')::INTEGER
    ) THEN
      RAISE EXCEPTION 'Stock insuficiente para el producto %', item->>'product_id';
    END IF;

    -- Crear order_item
    INSERT INTO public.order_items (order_id, product_id, quantity, price)
    VALUES (
      new_order_id,
      (item->>'product_id')::UUID,
      (item->>'quantity')::INTEGER,
      (item->>'price')::DECIMAL
    );

    -- Reducir stock
    UPDATE public.products
    SET stock = stock - (item->>'quantity')::INTEGER
    WHERE id = (item->>'product_id')::UUID;
  END LOOP;

  RETURN new_order_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- DATOS DE EJEMPLO: Productos
-- =============================================
INSERT INTO public.products (name, description, price, stock, image_url, animal_type, size, category, age_range)
VALUES
  -- Perros
  ('Pienso Premium Perro Adulto', 'Alimento completo y balanceado para perros adultos de razas medianas', 45.99, 50, 'https://via.placeholder.com/400x300/3b82f6/ffffff?text=Pienso+Perro', 'perro', 'mediano', 'alimentacion', 'adulto'),
  ('Champú Hipoalergénico Perro', 'Champú suave para pieles sensibles', 12.50, 30, 'https://via.placeholder.com/400x300/8b5cf6/ffffff?text=Champu+Perro', 'perro', 'mediano', 'higiene', 'adulto'),
  ('Collar Antiparasitario', 'Protección contra pulgas y garrapatas durante 8 meses', 22.00, 25, 'https://via.placeholder.com/400x300/10b981/ffffff?text=Collar', 'perro', 'grande', 'salud', 'adulto'),
  ('Correa Extensible 5m', 'Correa retráctil para perros hasta 50kg', 18.99, 40, 'https://via.placeholder.com/400x300/f59e0b/ffffff?text=Correa', 'perro', 'grande', 'accesorios', 'adulto'),
  ('Pelota Kong Resistente', 'Juguete indestructible para perros activos', 15.50, 60, 'https://via.placeholder.com/400x300/ef4444/ffffff?text=Pelota', 'perro', 'mediano', 'juguetes', 'adulto'),
  
  -- Gatos
  ('Pienso Gato Cachorro', 'Nutrición completa para gatitos en crecimiento', 38.50, 45, 'https://via.placeholder.com/400x300/3b82f6/ffffff?text=Pienso+Gato', 'gato', 'mini', 'alimentacion', 'cachorro'),
  ('Arena Aglomerante 10L', 'Arena higiénica con control de olores', 9.99, 80, 'https://via.placeholder.com/400x300/8b5cf6/ffffff?text=Arena', 'gato', 'mini', 'higiene', 'adulto'),
  ('Antiparasitario Pipetas', 'Pack 3 pipetas para gatos', 25.00, 35, 'https://via.placeholder.com/400x300/10b981/ffffff?text=Pipetas', 'gato', 'mini', 'salud', 'adulto'),
  ('Rascador Torre 120cm', 'Rascador con plataformas y hamaca', 65.00, 15, 'https://via.placeholder.com/400x300/f59e0b/ffffff?text=Rascador', 'gato', 'mediano', 'accesorios', 'adulto'),
  ('Ratón con Catnip', 'Juguete interactivo relleno de hierba gatera', 4.99, 100, 'https://via.placeholder.com/400x300/ef4444/ffffff?text=Juguete', 'gato', 'mini', 'juguetes', 'adulto'),
  
  -- Otros animales
  ('Heno Premium Conejos', 'Heno de alta calidad para roedores', 12.99, 40, 'https://via.placeholder.com/400x300/3b82f6/ffffff?text=Heno', 'otros', 'mini', 'alimentacion', 'adulto'),
  ('Jaula Hamster 2 Pisos', 'Jaula espaciosa con accesorios incluidos', 55.00, 10, 'https://via.placeholder.com/400x300/8b5cf6/ffffff?text=Jaula', 'otros', 'mini', 'accesorios', 'adulto'),
  ('Vitaminas Aves', 'Suplemento vitamínico para pájaros', 8.50, 25, 'https://via.placeholder.com/400x300/10b981/ffffff?text=Vitaminas', 'otros', 'mini', 'salud', 'adulto'),
  ('Rueda Ejercicio 20cm', 'Rueda silenciosa para hámsters y ratones', 11.99, 30, 'https://via.placeholder.com/400x300/f59e0b/ffffff?text=Rueda', 'otros', 'mini', 'juguetes', 'adulto'),
  
  -- Productos Senior
  ('Pienso Senior Perro', 'Fórmula especial para perros mayores de 7 años', 52.00, 30, 'https://via.placeholder.com/400x300/ef4444/ffffff?text=Pienso+Senior', 'perro', 'mediano', 'alimentacion', 'senior'),
  ('Suplemento Articular Perro', 'Condroprotector con glucosamina y condroitina', 35.00, 20, 'https://via.placeholder.com/400x300/3b82f6/ffffff?text=Suplemento', 'perro', 'grande', 'salud', 'senior'),
  ('Pienso Senior Gato', 'Alimento digestivo para gatos mayores', 42.50, 25, 'https://via.placeholder.com/400x300/8b5cf6/ffffff?text=Pienso+Senior+Gato', 'gato', 'mini', 'alimentacion', 'senior');

-- =============================================
-- DATOS DE EJEMPLO: Códigos Promocionales
-- =============================================
INSERT INTO public.promo_codes (code, discount_percentage, active, expires_at)
VALUES
  ('BIENVENIDO10', 10, true, NOW() + INTERVAL '30 days'),
  ('VERANO20', 20, true, NOW() + INTERVAL '60 days'),
  ('BLACKFRIDAY30', 30, false, NOW() - INTERVAL '10 days');

-- =============================================
-- ÍNDICES para mejorar rendimiento
-- =============================================
CREATE INDEX idx_products_animal_type ON public.products(animal_type);
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_size ON public.products(size);
CREATE INDEX idx_products_age_range ON public.products(age_range);
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
