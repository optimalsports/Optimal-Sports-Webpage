import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

// GET all orders (for admin dashboard)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const status = searchParams.get('status'); // confirmed, pending, failed

    // Check if KV is configured
    if (!process.env.KV_REST_API_URL) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    // Get all order keys
    const keys = await kv.keys('order:*');
    
    // Filter out error keys
    const orderKeys = keys.filter(key => !key.includes(':error:'));
    
    // Get orders
    const orders = await Promise.all(
      orderKeys.slice(0, limit).map(async (key) => {
        const order = await kv.get(key);
        return { key, ...(order || {}) };
      })
    );

    // Filter by status if provided
    const filteredOrders = status
      ? orders.filter((order: any) => order.status === status)
      : orders;

    // Sort by createdAt (newest first)
    filteredOrders.sort((a: any, b: any) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return NextResponse.json({
      orders: filteredOrders,
      total: filteredOrders.length,
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// GET single order by payment intent ID
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentIntentId } = body;

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'Missing paymentIntentId' },
        { status: 400 }
      );
    }

    // Check if KV is configured
    if (!process.env.KV_REST_API_URL) {
      // Fallback to Stripe only
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      return NextResponse.json({
        order: {
          stripePaymentId: paymentIntent.id,
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency,
          status: paymentIntent.status,
          metadata: paymentIntent.metadata,
        },
      });
    }

    // Get from KV
    const order = await kv.get(`order:${paymentIntentId}`);

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ order });

  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

