import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { printful, formatCartForPrintful } from '@/lib/printful';
import { kv } from '@vercel/kv';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// This is important: we need the raw body for webhook signature verification
export async function POST(request: NextRequest) {
  try {
    // Get the raw body
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET is not set');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    // Verify the webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    console.log('Received webhook event:', event.type);

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment succeeded:', paymentIntent.id);

  try {
    // Get order details from metadata
    const metadata = paymentIntent.metadata;
    
    if (!metadata.orderData) {
      console.error('No order data in payment intent metadata');
      return;
    }

    // Parse the order data
    const orderData = JSON.parse(metadata.orderData);
    const { items, customerInfo, productDetails } = orderData;

    console.log('Creating Printful order for payment:', paymentIntent.id);

    // Format order for Printful
    const printfulOrder = formatCartForPrintful(items, customerInfo);

    // Create order in Printful
    const printfulResponse = await printful.createOrder(printfulOrder);

    console.log('Printful order created:', printfulResponse.id);

    // Store order in database (if KV is configured)
    if (process.env.KV_REST_API_URL) {
      await kv.set(`order:${paymentIntent.id}`, {
        stripePaymentId: paymentIntent.id,
        printfulOrderId: printfulResponse.id,
        printfulExternalId: printfulResponse.external_id,
        customerInfo,
        items,
        amount: paymentIntent.amount / 100, // Convert from cents
        currency: paymentIntent.currency,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        printfulStatus: printfulResponse.status,
      });

      console.log('Order saved to database');
    }

    // TODO: Send confirmation email to customer
    // You can integrate SendGrid, Resend, or AWS SES here

  } catch (error) {
    console.error('Error handling payment success:', error);
    
    // Store error for manual review
    if (process.env.KV_REST_API_URL) {
      await kv.set(`order:error:${paymentIntent.id}`, {
        paymentIntentId: paymentIntent.id,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        metadata: paymentIntent.metadata,
      });
    }

    throw error;
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment failed:', paymentIntent.id);

  // Store failed payment for analytics
  if (process.env.KV_REST_API_URL) {
    await kv.set(`payment:failed:${paymentIntent.id}`, {
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
      failureReason: paymentIntent.last_payment_error?.message || 'Unknown',
      timestamp: new Date().toISOString(),
      metadata: paymentIntent.metadata,
    });
  }

  // TODO: Send payment failure notification email
}

// Required for Next.js 14+ to handle raw body for webhooks
export const dynamic = 'force-dynamic';

