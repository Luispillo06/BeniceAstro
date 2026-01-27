import type { APIRoute } from 'astro';
import { sendContactEmail } from '../../lib/email';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    // Validación básica
    if (!name || !email || !subject || !message) {
      return new Response(JSON.stringify({ error: 'Faltan campos requeridos' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Enviar email
    await sendContactEmail({
      name,
      email,
      phone,
      subject,
      message
    });

    // Aquí podrías guardar el mensaje en Supabase también
    // await supabase.from('contact_messages').insert({ name, email, phone, subject, message });

    return new Response(JSON.stringify({ success: true, message: 'Mensaje enviado correctamente' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error al procesar formulario de contacto:', error);
    return new Response(JSON.stringify({ error: 'Error al enviar el mensaje' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
