import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, action } = body;

    console.log('Printful webhook received:', { orderId, action });

    if (action === 'process_pending_orders') {
      // Get all pending orders from the database
      const pendingOrders = await kv.keys('order:*');
      const processedOrders = [];

      for (const orderKey of pendingOrders) {
        try {
          const orderData: any = await kv.get(orderKey);
          
          if (orderData && orderData.status === 'pending_printful') {
            console.log('Processing pending order:', orderData.id);

            // Create Printful order
            const printfulOrder = {
              external_id: `optimal-${orderData.paymentIntentId}`,
              shipping: 'STANDARD',
              recipient: {
                name: orderData.customerInfo.name,
                address1: orderData.customerInfo.address,
                city: orderData.customerInfo.city,
                state_code: orderData.customerInfo.state,
                country_code: orderData.customerInfo.country,
                zip: orderData.customerInfo.zip
              },
              items: [{
                variant_id: parseInt(orderData.printfulVariantId),
                quantity: orderData.quantity,
                retail_price: orderData.product.price
              }]
            };

            // Send to Printful API
            const printfulResponse = await fetch(`https://api.printful.com/stores/${orderData.printfulStoreId}/orders`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(printfulOrder)
            });

            const printfulResult = await printfulResponse.json();

            if (printfulResponse.ok) {
              // Update order status
              await kv.set(orderKey, {
                ...orderData,
                status: 'printful_created',
                printfulOrderId: printfulResult.result?.id,
                printfulExternalId: printfulResult.result?.external_id,
                printfulStatus: printfulResult.result?.status,
                processedAt: new Date().toISOString()
              });

              processedOrders.push({
                orderId: orderData.id,
                printfulOrderId: printfulResult.result?.id,
                status: 'success'
              });

              console.log('Order successfully sent to Printful:', orderData.id);
            } else {
              console.error('Printful order creation failed:', printfulResult);
              processedOrders.push({
                orderId: orderData.id,
                status: 'failed',
                error: printfulResult
              });
            }
          }
        } catch (error) {
          console.error('Error processing order:', orderKey, error);
          processedOrders.push({
            orderId: orderKey,
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Processed pending orders',
        processedCount: processedOrders.length,
        orders: processedOrders
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Webhook received'
    });

  } catch (error) {
    console.error('Printful webhook error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
