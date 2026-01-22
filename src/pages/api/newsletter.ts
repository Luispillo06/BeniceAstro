import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

function generatePromoCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'BIENVENIDO';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({ error: 'Email inválido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verificar si ya está suscrito
    const { data: existing } = await supabase
      .from('newsletters')
      .select('id')
      .eq('email', email)
      .single();

    if (existing) {
      return new Response(JSON.stringify({ error: 'Email ya suscrito' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generar código promocional
    const promoCode = generatePromoCode();

    // Crear código promocional en la tabla
    await supabase.from('promo_codes').insert({
      code: promoCode,
      discount_percentage: 10,
      active: true,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    });

    // Guardar en newsletter
    const { error } = await supabase.from('newsletters').insert({
      email,
      promo_code: promoCode
    });

    if (error) throw error;

    // En producción, aquí enviarías un email real
    console.log(`Email enviado a ${email} con código: ${promoCode}`);

    return new Response(JSON.stringify({ 
      success: true, 
      promoCode,
      message: `Tu código es: ${promoCode}` 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error en newsletter:', error);
    return new Response(JSON.stringify({ error: 'Error al procesar suscripción' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
