import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderData } = body;

    // Create email notification
    const emailContent = `
New Order Received!

Order ID: ${orderData.id}
Payment Intent: ${orderData.paymentIntentId}
Customer: ${orderData.customerInfo.name}
Email: ${orderData.customerInfo.email}

Product: ${orderData.product.name}
Size: ${orderData.selectedSize}
Color: ${orderData.selectedColor}
Quantity: ${orderData.quantity}
Total: $${orderData.total}

Shipping Address:
${orderData.customerInfo.name}
${orderData.customerInfo.address}
${orderData.customerInfo.city}, ${orderData.customerInfo.state} ${orderData.customerInfo.zip}
${orderData.customerInfo.country}

Printful Details:
Store ID: ${orderData.printfulStoreId}
Variant ID: ${orderData.printfulVariantId}

To create this order in Printful:
1. Go to your Printful dashboard
2. Navigate to your optimalsportslaunch store
3. Create a new order with the above details
4. Use variant ID: ${orderData.printfulVariantId}

Order created at: ${orderData.createdAt}
    `;

    console.log('📧 Order notification email:');
    console.log(emailContent);

    // In a real implementation, you would send this via email service
    // For now, we'll just log it and return success

    return NextResponse.json({
      success: true,
      message: 'Order notification sent',
      emailContent: emailContent,
      orderId: orderData.id
    });

  } catch (error) {
    console.error('Send order notification error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
