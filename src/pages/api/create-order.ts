import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { user_id, items, total, promo_code, discount_amount } = await request.json();

    if (!user_id || !items || items.length === 0) {
      return new Response(JSON.stringify({ error: 'Datos inválidos' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Llamar a la función de Supabase para crear el pedido
    const { data, error } = await supabase.rpc('create_order_and_reduce_stock', {
      p_user_id: user_id,
      p_total: total,
      p_items: items,
      p_promo_code: promo_code || null,
      p_discount_amount: discount_amount || 0
    });

    if (error) throw error;

    return new Response(JSON.stringify({ 
      success: true, 
      order_id: data 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Error al crear pedido:', error);
    return new Response(JSON.stringify({ error: error.message || 'Error al procesar el pedido' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
