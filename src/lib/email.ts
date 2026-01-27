// Sistema de Emails Transaccionales con Resend
import { Resend } from 'resend';

const resend = new Resend(import.meta.env.RESEND_API_KEY || process.env.RESEND_API_KEY);

const FROM_EMAIL = 'Venice Pet Shop <noreply@venice.com>';
const SUPPORT_EMAIL = 'info@venice.com';

interface OrderEmailData {
  to: string;
  customerName: string;
  orderId: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  discount?: number;
  total: number;
  shippingAddress?: string;
}

interface WelcomeEmailData {
  to: string;
  name: string;
}

interface ShippingEmailData {
  to: string;
  customerName: string;
  orderId: string;
  trackingNumber: string;
  carrier: string;
}

// Template base HTML
const baseTemplate = (content: string, title: string) => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #7e22ce 0%, #9333ea 100%); padding: 30px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 28px; }
    .header img { max-width: 150px; margin-bottom: 10px; }
    .content { padding: 30px; }
    .footer { background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; font-size: 12px; }
    .btn { display: inline-block; padding: 12px 30px; background: #7e22ce; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; }
    .btn:hover { background: #6b21a8; }
    .order-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .order-table th, .order-table td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
    .order-table th { background: #f9fafb; font-weight: 600; }
    .total-row { font-weight: bold; font-size: 18px; color: #7e22ce; }
    .highlight { background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0; }
    .success { background: #d1fae5; border-left-color: #10b981; }
    .icon { font-size: 48px; margin-bottom: 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🐾 Venice Pet Shop</h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Venice Pet Shop. Todos los derechos reservados.</p>
      <p>¿Tienes alguna pregunta? Contáctanos en ${SUPPORT_EMAIL}</p>
      <p>
        <a href="#" style="color: #9ca3af;">Política de Privacidad</a> | 
        <a href="#" style="color: #9ca3af;">Términos y Condiciones</a>
      </p>
    </div>
  </div>
</body>
</html>
`;

// Email de confirmación de pedido
export async function sendOrderConfirmation(data: OrderEmailData) {
  const itemsHtml = data.items.map(item => `
    <tr>
      <td>${item.name}</td>
      <td style="text-align: center;">${item.quantity}</td>
      <td style="text-align: right;">${item.price.toFixed(2)}€</td>
      <td style="text-align: right;">${(item.quantity * item.price).toFixed(2)}€</td>
    </tr>
  `).join('');

  const content = `
    <div class="icon">✅</div>
    <h2>¡Gracias por tu pedido, ${data.customerName}!</h2>
    <p>Tu pedido ha sido confirmado y está siendo procesado. Aquí tienes el resumen:</p>
    
    <div class="highlight success">
      <strong>Número de pedido:</strong> #${data.orderId.slice(0, 8).toUpperCase()}
    </div>

    <table class="order-table">
      <thead>
        <tr>
          <th>Producto</th>
          <th style="text-align: center;">Cantidad</th>
          <th style="text-align: right;">Precio</th>
          <th style="text-align: right;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="3" style="text-align: right;">Subtotal:</td>
          <td style="text-align: right;">${data.subtotal.toFixed(2)}€</td>
        </tr>
        ${data.discount ? `
        <tr style="color: #10b981;">
          <td colspan="3" style="text-align: right;">Descuento:</td>
          <td style="text-align: right;">-${data.discount.toFixed(2)}€</td>
        </tr>
        ` : ''}
        <tr>
          <td colspan="3" style="text-align: right;">Envío:</td>
          <td style="text-align: right;">GRATIS</td>
        </tr>
        <tr class="total-row">
          <td colspan="3" style="text-align: right;">Total:</td>
          <td style="text-align: right;">${data.total.toFixed(2)}€</td>
        </tr>
      </tfoot>
    </table>

    ${data.shippingAddress ? `
    <h3>📦 Dirección de envío</h3>
    <p style="background: #f3f4f6; padding: 15px; border-radius: 8px;">${data.shippingAddress}</p>
    ` : ''}

    <h3>🚚 ¿Qué sigue?</h3>
    <ol>
      <li>Estamos preparando tu pedido con mucho cariño 🐾</li>
      <li>Te enviaremos un email cuando sea enviado con el número de seguimiento</li>
      <li>Recibirás tu pedido en 24-48 horas laborables</li>
    </ol>

    <p style="text-align: center; margin-top: 30px;">
      <a href="https://venice.com/mis-pedidos" class="btn">Ver mis pedidos</a>
    </p>

    <p style="margin-top: 30px; color: #6b7280;">
      ¡Gracias por confiar en Venice Pet Shop! Si tienes alguna pregunta sobre tu pedido, 
      no dudes en contactarnos.
    </p>
  `;

  try {
    const response = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.to,
      subject: `✅ Pedido confirmado #${data.orderId.slice(0, 8).toUpperCase()}`,
      html: baseTemplate(content, 'Confirmación de Pedido'),
    });
    return { success: true, data: response };
  } catch (error) {
    console.error('Error enviando email de confirmación:', error);
    return { success: false, error };
  }
}

// Email de bienvenida
export async function sendWelcomeEmail(data: WelcomeEmailData) {
  const content = `
    <div class="icon">🎉</div>
    <h2>¡Bienvenido a Venice Pet Shop, ${data.name}!</h2>
    
    <p>Estamos encantados de tenerte en nuestra familia. En Venice encontrarás todo lo que 
    necesitas para cuidar de tus mascotas:</p>

    <div style="display: grid; gap: 15px; margin: 25px 0;">
      <div style="display: flex; align-items: center; gap: 15px; background: #f9fafb; padding: 15px; border-radius: 8px;">
        <span style="font-size: 32px;">🐕</span>
        <div>
          <strong>Perros</strong>
          <p style="margin: 5px 0 0; color: #6b7280; font-size: 14px;">Piensos, snacks, juguetes y accesorios</p>
        </div>
      </div>
      <div style="display: flex; align-items: center; gap: 15px; background: #f9fafb; padding: 15px; border-radius: 8px;">
        <span style="font-size: 32px;">🐈</span>
        <div>
          <strong>Gatos</strong>
          <p style="margin: 5px 0 0; color: #6b7280; font-size: 14px;">Arena, rascadores, comida premium</p>
        </div>
      </div>
      <div style="display: flex; align-items: center; gap: 15px; background: #f9fafb; padding: 15px; border-radius: 8px;">
        <span style="font-size: 32px;">🐹</span>
        <div>
          <strong>Pequeñas Mascotas</strong>
          <p style="margin: 5px 0 0; color: #6b7280; font-size: 14px;">Roedores, pájaros, peces y más</p>
        </div>
      </div>
    </div>

    <div class="highlight">
      <strong>🎁 ¡Regalo de bienvenida!</strong><br>
      Usa el código <strong style="color: #7e22ce; font-size: 18px;">BIENVENIDO10</strong> 
      y obtén un 10% de descuento en tu primera compra.
    </div>

    <p style="text-align: center; margin: 30px 0;">
      <a href="https://venice.com/productos" class="btn">Explorar productos</a>
    </p>

    <h3>🌟 Ventajas de ser parte de Venice:</h3>
    <ul>
      <li>✅ Envío gratis en pedidos superiores a 49€</li>
      <li>✅ Devoluciones gratuitas en 30 días</li>
      <li>✅ Atención al cliente personalizada</li>
      <li>✅ Ofertas exclusivas para miembros</li>
      <li>✅ Programa de puntos por cada compra</li>
    </ul>

    <p style="color: #6b7280; margin-top: 30px;">
      ¿Tienes alguna pregunta? Estamos aquí para ayudarte. ¡Escríbenos cuando quieras!
    </p>
  `;

  try {
    const response = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.to,
      subject: '🎉 ¡Bienvenido a Venice Pet Shop!',
      html: baseTemplate(content, 'Bienvenido'),
    });
    return { success: true, data: response };
  } catch (error) {
    console.error('Error enviando email de bienvenida:', error);
    return { success: false, error };
  }
}

// Email de envío de pedido
export async function sendShippingNotification(data: ShippingEmailData) {
  const content = `
    <div class="icon">🚚</div>
    <h2>¡Tu pedido está en camino, ${data.customerName}!</h2>
    
    <p>¡Buenas noticias! Tu pedido ha sido enviado y está de camino a tu dirección.</p>

    <div class="highlight success">
      <strong>Número de seguimiento:</strong> ${data.trackingNumber}<br>
      <strong>Transportista:</strong> ${data.carrier}
    </div>

    <p>Puedes rastrear tu envío haciendo clic en el siguiente botón:</p>

    <p style="text-align: center; margin: 30px 0;">
      <a href="https://www.${data.carrier.toLowerCase()}.es/seguimiento/${data.trackingNumber}" class="btn">
        📦 Rastrear pedido
      </a>
    </p>

    <h3>📅 Fecha estimada de entrega</h3>
    <p style="background: #f3f4f6; padding: 15px; border-radius: 8px; font-size: 18px; text-align: center;">
      <strong>24-48 horas laborables</strong>
    </p>

    <h3>💡 Consejos para la entrega:</h3>
    <ul>
      <li>Asegúrate de estar disponible en la dirección indicada</li>
      <li>El repartidor te llamará antes de llegar</li>
      <li>Si no estás, se dejará en un punto de recogida cercano</li>
    </ul>

    <p style="color: #6b7280; margin-top: 30px;">
      ¿Algún problema con tu envío? Contáctanos y te ayudamos.
    </p>
  `;

  try {
    const response = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.to,
      subject: `🚚 Tu pedido #${data.orderId.slice(0, 8).toUpperCase()} está en camino`,
      html: baseTemplate(content, 'Pedido Enviado'),
    });
    return { success: true, data: response };
  } catch (error) {
    console.error('Error enviando email de envío:', error);
    return { success: false, error };
  }
}

// Email de newsletter
export async function sendNewsletterWelcome(email: string, promoCode: string) {
  const content = `
    <div class="icon">📬</div>
    <h2>¡Gracias por suscribirte!</h2>
    
    <p>Ya formas parte de la comunidad Venice Pet Shop. Recibirás las mejores ofertas, 
    novedades y consejos para el cuidado de tus mascotas directamente en tu bandeja de entrada.</p>

    <div class="highlight">
      <strong>🎁 ¡Aquí tienes tu código de descuento!</strong><br><br>
      <div style="background: white; padding: 20px; border-radius: 8px; text-align: center;">
        <span style="font-size: 28px; font-weight: bold; color: #7e22ce; letter-spacing: 3px;">
          ${promoCode}
        </span>
        <p style="margin: 10px 0 0; color: #6b7280; font-size: 14px;">15% de descuento en tu próxima compra</p>
      </div>
    </div>

    <p style="text-align: center; margin: 30px 0;">
      <a href="https://venice.com/productos" class="btn">Ir a comprar</a>
    </p>

    <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
      Si no quieres recibir más emails, puedes 
      <a href="#" style="color: #7e22ce;">darte de baja aquí</a>.
    </p>
  `;

  try {
    const response = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: '🎁 ¡Tu código de descuento exclusivo!',
      html: baseTemplate(content, 'Newsletter'),
    });
    return { success: true, data: response };
  } catch (error) {
    console.error('Error enviando email de newsletter:', error);
    return { success: false, error };
  }
}

// Email de cancelación de pedido
export async function sendOrderCancellation(email: string, orderId: string, customerName: string) {
  const content = `
    <div class="icon">❌</div>
    <h2>Pedido cancelado</h2>
    
    <p>Hola ${customerName},</p>
    <p>Tu pedido <strong>#${orderId.slice(0, 8).toUpperCase()}</strong> ha sido cancelado correctamente.</p>

    <div class="highlight">
      <strong>💰 Reembolso</strong><br>
      El importe de tu pedido será reembolsado en un plazo de 3-5 días laborables 
      mediante el mismo método de pago utilizado.
    </div>

    <p>Si tienes alguna pregunta sobre la cancelación o el reembolso, no dudes en contactarnos.</p>

    <p style="text-align: center; margin: 30px 0;">
      <a href="https://venice.com/contacto" class="btn">Contactar soporte</a>
    </p>

    <p style="color: #6b7280; margin-top: 30px;">
      Sentimos que hayas tenido que cancelar tu pedido. Esperamos verte pronto de nuevo.
    </p>
  `;

  try {
    const response = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `❌ Pedido #${orderId.slice(0, 8).toUpperCase()} cancelado`,
      html: baseTemplate(content, 'Pedido Cancelado'),
    });
    return { success: true, data: response };
  } catch (error) {
    console.error('Error enviando email de cancelación:', error);
    return { success: false, error };
  }
}

// Email de contacto (para el admin)
export async function sendContactEmail(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
}) {
  const content = `
    <h2>Nuevo mensaje de contacto</h2>
    
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 10px; background: #f9fafb; width: 120px;"><strong>Nombre:</strong></td>
        <td style="padding: 10px;">${data.name}</td>
      </tr>
      <tr>
        <td style="padding: 10px; background: #f9fafb;"><strong>Email:</strong></td>
        <td style="padding: 10px;"><a href="mailto:${data.email}">${data.email}</a></td>
      </tr>
      ${data.phone ? `
      <tr>
        <td style="padding: 10px; background: #f9fafb;"><strong>Teléfono:</strong></td>
        <td style="padding: 10px;">${data.phone}</td>
      </tr>
      ` : ''}
      <tr>
        <td style="padding: 10px; background: #f9fafb;"><strong>Asunto:</strong></td>
        <td style="padding: 10px;">${data.subject}</td>
      </tr>
    </table>

    <h3 style="margin-top: 20px;">Mensaje:</h3>
    <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; white-space: pre-wrap;">
${data.message}
    </div>

    <p style="margin-top: 20px;">
      <a href="mailto:${data.email}?subject=Re: ${data.subject}" class="btn">
        Responder
      </a>
    </p>
  `;

  try {
    const response = await resend.emails.send({
      from: FROM_EMAIL,
      to: SUPPORT_EMAIL,
      replyTo: data.email,
      subject: `[Contacto] ${data.subject}`,
      html: baseTemplate(content, 'Nuevo Contacto'),
    });
    return { success: true, data: response };
  } catch (error) {
    console.error('Error enviando email de contacto:', error);
    return { success: false, error };
  }
}
