import type { APIRoute } from 'astro';
import Stripe from 'stripe';
import { supabase } from '../../../lib/supabase';

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY || '');

const endpointSecret = import.meta.env.STRIPE_WEBHOOK_SECRET || '';

export const POST: APIRoute = async ({ request }) => {
  const sig = request.headers.get('stripe-signature');

  if (!sig) {
    return new Response(JSON.stringify({ error: 'No signature' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  let event: Stripe.Event;

  try {
    const body = await request.text();
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return new Response(JSON.stringify({ error: `Webhook Error: ${err.message}` }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Manejar el evento
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleSuccessfulPayment(session);
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.error('Payment failed:', paymentIntent.id);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
  try {
    const userId = session.metadata?.user_id;
    const promoCode = session.metadata?.promo_code;
    const discountPercent = parseInt(session.metadata?.discount_percent || '0');

    // Obtener detalles de los line items
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
    
    // Calcular total
    const total = (session.amount_total || 0) / 100;
    const discountAmount = total * (discountPercent / 100);

    // Crear pedido en Supabase
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId || null,
        total: total,
        status: 'pagado',
        promo_code: promoCode || null,
        discount_amount: discountAmount,
        stripe_session_id: session.id,
        shipping_address: JSON.stringify((session as any).shipping_details || null),
        billing_address: JSON.stringify(session.customer_details || null)
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      return;
    }

    // Crear items del pedido y actualizar stock
    for (const item of lineItems.data) {
      if (item.description === 'Gastos de envío') continue;

      const productId = item.price?.product as string;
      
      // Buscar producto por nombre (ya que Stripe no guarda el ID original)
      const { data: product } = await supabase
        .from('products')
        .select('id, stock')
        .eq('name', item.description)
        .single();

      if (product) {
        // Crear order item
        await supabase
          .from('order_items')
          .insert({
            order_id: order.id,
            product_id: product.id,
            quantity: item.quantity || 1,
            price: (item.amount_total || 0) / 100 / (item.quantity || 1)
          });

        // Reducir stock
        await supabase
          .from('products')
          .update({ stock: Math.max(0, product.stock - (item.quantity || 1)) })
          .eq('id', product.id);
      }
    }

    // Generar factura
    const invoiceNumber = await generateInvoiceNumber();
    
    await supabase
      .from('invoices')
      .insert({
        order_id: order.id,
        user_id: userId || null,
        invoice_number: invoiceNumber,
        invoice_type: 'factura',
        subtotal: total / 1.21, // Sin IVA
        tax_amount: total - (total / 1.21),
        total: total
      });

    console.log(`Order ${order.id} created successfully with invoice ${invoiceNumber}`);

  } catch (error) {
    console.error('Error handling successful payment:', error);
  }
}

async function generateInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = 'FAC';
  
  // Obtener último número
  const { data } = await supabase
    .from('invoices')
    .select('invoice_number')
    .like('invoice_number', `${prefix}-${year}-%`)
    .order('invoice_number', { ascending: false })
    .limit(1);

  let sequence = 1;
  if (data && data.length > 0) {
    const lastNumber = data[0].invoice_number;
    const match = lastNumber.match(/(\d+)$/);
    if (match) {
      sequence = parseInt(match[1]) + 1;
    }
  }

  return `${prefix}-${year}-${sequence.toString().padStart(6, '0')}`;
}
