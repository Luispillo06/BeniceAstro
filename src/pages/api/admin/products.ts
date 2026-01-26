import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

// Función helper para verificar si es admin
async function isAdmin(request: Request): Promise<boolean> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return false;

  const token = authHeader.replace('Bearer ', '');
  const { data: { user } } = await supabase.auth.getUser(token);
  
  if (!user) return false;

  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  return userData?.role === 'admin';
}

// GET: Obtener todos los productos o uno específico
export const GET: APIRoute = async ({ request, url }) => {
  const id = url.searchParams.get('id');

  try {
    if (id) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// POST: Crear nuevo producto
export const POST: APIRoute = async ({ request }) => {
  // Verificar autenticación admin
  const isAdminUser = await isAdmin(request);
  if (!isAdminUser) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await request.json();
    
    // Validaciones
    if (!body.name || !body.price || !body.animal_type || !body.category) {
      return new Response(JSON.stringify({ error: 'Faltan campos obligatorios' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generar slug si no existe
    if (!body.slug) {
      body.slug = body.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    const { data, error } = await supabase
      .from('products')
      .insert([{
        name: body.name,
        description: body.description || '',
        price: parseFloat(body.price),
        stock: parseInt(body.stock) || 0,
        image_url: body.image_url || '',
        images: body.images || [],
        animal_type: body.animal_type,
        size: body.size || 'mediano',
        category: body.category,
        age_range: body.age_range || 'adulto',
        on_sale: body.on_sale || false,
        sale_price: body.sale_price ? parseFloat(body.sale_price) : null,
        slug: body.slug
      }])
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify({ success: true, data }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Error al crear producto:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// PUT: Actualizar producto
export const PUT: APIRoute = async ({ request }) => {
  const isAdminUser = await isAdmin(request);
  if (!isAdminUser) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await request.json();
    
    if (!body.id) {
      return new Response(JSON.stringify({ error: 'ID de producto requerido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const updateData: any = {};
    
    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.price !== undefined) updateData.price = parseFloat(body.price);
    if (body.stock !== undefined) updateData.stock = parseInt(body.stock);
    if (body.image_url !== undefined) updateData.image_url = body.image_url;
    if (body.images !== undefined) updateData.images = body.images;
    if (body.animal_type !== undefined) updateData.animal_type = body.animal_type;
    if (body.size !== undefined) updateData.size = body.size;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.age_range !== undefined) updateData.age_range = body.age_range;
    if (body.on_sale !== undefined) updateData.on_sale = body.on_sale;
    if (body.sale_price !== undefined) updateData.sale_price = body.sale_price ? parseFloat(body.sale_price) : null;
    if (body.slug !== undefined) updateData.slug = body.slug;

    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', body.id)
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Error al actualizar producto:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// DELETE: Eliminar producto
export const DELETE: APIRoute = async ({ request, url }) => {
  const isAdminUser = await isAdmin(request);
  if (!isAdminUser) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const id = url.searchParams.get('id');
    
    if (!id) {
      return new Response(JSON.stringify({ error: 'ID de producto requerido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Error al eliminar producto:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
