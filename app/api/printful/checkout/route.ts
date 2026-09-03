import { NextRequest, NextResponse } from 'next/server';
import { printful, formatCartForPrintful } from '@/lib/printful';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, shippingInfo } = body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 });
    }

    if (!shippingInfo || !shippingInfo.firstName || !shippingInfo.lastName || !shippingInfo.email) {
      return NextResponse.json({ error: 'Missing shipping information' }, { status: 400 });
    }

    // Format the order for Printful
    const printfulOrder = formatCartForPrintful(items, shippingInfo);

    // Create the order in Printful
    const order = await printful.createOrder(printfulOrder);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      externalId: order.external_id,
      status: order.status,
      message: 'Order created successfully in Printful'
    });

  } catch (error) {
    console.error('Printful checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to process order', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
