import { NextRequest, NextResponse } from 'next/server';
import { printful, formatCartForPrintful } from '@/lib/printful';
import { kv } from '@vercel/kv';
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
    const body = await request.json();
    
    // Validate required fields
    const { 
      product, 
      selectedSize, 
      selectedColor, 
      quantity, 
      customerInfo,
      retailPrice,
      paymentIntentId 
    } = body;

    if (!product || !selectedSize || !quantity || !customerInfo || !paymentIntentId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate customer info
    const { name, email, address1, city, state, country, zip } = customerInfo;
    if (!name || !email || !address1 || !city || !state || !country || !zip) {
      return NextResponse.json(
        { error: 'Incomplete customer information' },
        { status: 400 }
      );
    }

    console.log('Processing checkout order:', {
      product: product.name,
      size: selectedSize,
      color: selectedColor,
      quantity,
      customer: customerInfo.name,
      email: customerInfo.email,
      paymentIntentId
    });

            // Verify payment with Stripe
            try {
              const stripe = getStripe();
              const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status !== 'succeeded') {
        return NextResponse.json(
          { error: 'Payment not completed' },
          { status: 400 }
        );
      }
      
      console.log('Payment verified:', paymentIntent.id);
    } catch (stripeError) {
      console.error('Stripe verification error:', stripeError);
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      );
    }

    // Check if Printful is properly configured
    const printfulApiKey = process.env.PRINTFUL_API_KEY;
    if (!printfulApiKey || printfulApiKey === 'oVW8x5IDNQtj2NERKoYoCZFGbEy6zVrlNPheDtoy') {
      console.log('Printful not configured, creating mock order for testing');
      
      // Create a mock order for testing
      const mockOrder = {
        id: `order-${Date.now()}`,
        external_id: `optimal-${Date.now()}`,
        status: 'pending',
        created: new Date().toISOString(),
        customer: customerInfo,
        items: [{
          product: product.name,
          size: selectedSize,
          color: selectedColor,
          quantity: quantity,
          price: product.price
        }],
        total: parseFloat(product.price) * quantity
      };

      console.log('Mock order created:', mockOrder);

      return NextResponse.json({
        success: true,
        orderId: mockOrder.id,
        externalId: mockOrder.external_id,
        message: 'Order successfully created (mock mode - Printful not configured)',
        order: mockOrder,
        note: 'To enable Printful integration, please set up a valid PRINTFUL_API_KEY in your environment variables'
      });
    }

    // Skip the complex Printful product fetching - we'll use the variant ID from the product data
    
    // Find the correct variant ID based on selected size
    let variantId = null;
    
    console.log('🔍 DEBUG: Product data received:', {
      productId: product.id,
      productName: product.name,
      selectedSize,
      variantIdsBySize: product.variantIdsBySize,
      printfulVariantId: product.printfulVariantId
    });
    
    // Check if product has variantIdsBySize mapping
    if (product.variantIdsBySize && product.variantIdsBySize[selectedSize]) {
      variantId = product.variantIdsBySize[selectedSize];
      console.log(`✅ Using size-specific variant ID for ${selectedSize}: ${variantId}`);
    } else if (product.printfulVariantId) {
      variantId = product.printfulVariantId;
      console.log(`⚠️ Using general variant ID: ${variantId}`);
    } else {
      // No variant ID found
      console.log(`❌ No variant ID found for product ${product.name}`);
      return NextResponse.json({
        error: 'No Printful variant ID found',
        message: 'Please add a Printful variant ID to this product in the admin dashboard',
        product: product.name,
        selectedSize: selectedSize
      }, { status: 400 });
    }
    
    console.log('🎯 Final variant ID selected:', variantId);
    
    // Format items for Printful
    const items = [{
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      quantity: quantity,
      variantId: variantId, // Use the correct variant ID based on size
      size: selectedSize,
      color: selectedColor
    }];

          // Create order using the new auto-printful system
          try {
            const autoOrderResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/auto-printful-order`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                product,
                selectedSize,
                selectedColor,
                quantity,
                customerInfo,
                paymentIntentId
              })
            });

            const autoOrderResult = await autoOrderResponse.json();
            
            if (autoOrderResult.success) {
              console.log('Order created with auto-printful system:', autoOrderResult);
              
              return NextResponse.json({
                success: true,
                orderId: autoOrderResult.orderId,
                message: 'Order successfully created! It will be processed by Printful automatically.',
                printfulVariantId: autoOrderResult.printfulVariantId,
                printfulStoreId: autoOrderResult.printfulStoreId
              });
            } else {
              throw new Error(autoOrderResult.error || 'Auto-printful order creation failed');
            }
          } catch (autoOrderError) {
            console.error('Auto-printful order creation failed:', autoOrderError);

            // Still return success for the payment, but note Printful failed
            return NextResponse.json({
              success: true,
              orderId: `stripe-${paymentIntentId}`,
              message: 'Payment successful, but Printful order creation failed. Please contact support.',
              printfulError: autoOrderError instanceof Error ? autoOrderError.message : 'Unknown error'
            });
          }

  } catch (error) {
    console.error('Checkout error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      error: error
    });
    
    // Handle specific Printful API errors
    if (error instanceof Error && error.message.includes('Printful API Error')) {
      return NextResponse.json(
        { 
          error: 'Printful API Error: ' + error.message,
          details: 'Order processing failed. Please check Printful configuration.'
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error occurred',
        type: 'checkout_error'
      },
      { status: 500 }
    );
  }
}

// Optional: Get shipping rates
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country');
    const state = searchParams.get('state');
    const city = searchParams.get('city');
    const zip = searchParams.get('zip');
    const variantId = searchParams.get('variantId');
    const quantity = searchParams.get('quantity');

    if (!country || !state || !city || !zip || !variantId || !quantity) {
      return NextResponse.json(
        { error: 'Missing required shipping parameters' },
        { status: 400 }
      );
    }

    const shippingRates = await printful.getShippingRates(
      {
        name: 'Customer',
        address1: '123 Main St',
        city,
        state_code: state,
        country_code: country,
        zip,
      },
      [
        {
          variant_id: parseInt(variantId),
          quantity: parseInt(quantity),
        }
      ]
    );

    return NextResponse.json({
      success: true,
      shippingRates: shippingRates
    });

  } catch (error) {
    console.error('Shipping rates error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate shipping rates' },
      { status: 500 }
    );
  }
}
