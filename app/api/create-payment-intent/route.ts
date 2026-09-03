import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe only when needed
const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Stripe not configured');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-08-27.basil',
  });
};

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Stripe not configured. Please add STRIPE_SECRET_KEY to environment variables.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { 
      amount, 
      currency = 'usd',
      orderData // New: includes items, customerInfo, productDetails
    } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Create a PaymentIntent with the order amount and currency
    const stripe = getStripe();
    
    // Prepare metadata - store order data for webhook processing
    const metadata: Record<string, string> = {
      source: 'optimal-sports',
    };

    // Store order data in metadata if provided (for webhook to create Printful order)
    if (orderData) {
      // Stripe metadata has a 500 character limit per value, so we'll store as JSON
      metadata.orderData = JSON.stringify(orderData);
      
      // Also store key fields separately for easy access
      if (orderData.customerInfo?.email) {
        metadata.customerEmail = orderData.customerInfo.email;
      }
      if (orderData.customerInfo?.name) {
        metadata.customerName = orderData.customerInfo.name;
      }
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata,
      // Add customer email for Stripe receipts
      receipt_email: orderData?.customerInfo?.email || undefined,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });

  } catch (error) {
    console.error('Payment intent creation error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to create payment intent',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
