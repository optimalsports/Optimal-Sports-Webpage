import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      product, 
      selectedSize, 
      selectedColor, 
      quantity, 
      customerInfo,
      paymentIntentId 
    } = body;

    // Store the order in your database with all the details
    const orderData = {
      id: `order-${Date.now()}`,
      paymentIntentId: paymentIntentId,
      product: product,
      selectedSize: selectedSize,
      selectedColor: selectedColor,
      quantity: quantity,
      customerInfo: customerInfo,
      total: parseFloat(product.price) * quantity,
      status: 'pending_printful',
      createdAt: new Date().toISOString(),
      printfulVariantId: product.variantIdsBySize?.[selectedSize] || product.printfulVariantId,
      printfulStoreId: 16862505
    };

    // Store in database
    if (process.env.KV_REST_API_URL) {
      await kv.set(`order:${paymentIntentId}`, orderData);
    }

    // Create a webhook payload that Printful can process
    const printfulWebhookPayload = {
      type: 'order_created',
      order: {
        id: orderData.id,
        external_id: `optimal-${paymentIntentId}`,
        shipping: 'STANDARD',
        recipient: {
          name: customerInfo.name,
          address1: customerInfo.address,
          city: customerInfo.city,
          state_code: customerInfo.state,
          country_code: customerInfo.country,
          zip: customerInfo.zip
        },
        items: [{
          variant_id: parseInt(orderData.printfulVariantId),
          quantity: quantity,
          retail_price: product.price
        }]
      }
    };

    // Simulate Printful webhook processing
    console.log('Order created and stored:', orderData);
    console.log('Printful webhook payload:', printfulWebhookPayload);

    // Send email notification
    try {
      const notificationResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/send-order-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderData })
      });

      const notificationResult = await notificationResponse.json();
      console.log('📧 Notification sent:', notificationResult);
    } catch (notificationError) {
      console.error('Failed to send notification:', notificationError);
    }

    return NextResponse.json({
      success: true,
      message: 'Order created successfully! You will receive an email notification with order details.',
      orderId: orderData.id,
      paymentIntentId: paymentIntentId,
      status: 'pending_printful',
      printfulVariantId: orderData.printfulVariantId,
      printfulStoreId: 16862505,
      orderData: orderData
    });

  } catch (error) {
    console.error('Auto Printful order error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
