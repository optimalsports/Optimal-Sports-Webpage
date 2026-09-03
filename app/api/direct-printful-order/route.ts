import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { variantId, size, customerInfo } = body;

    // Create a direct Printful order using your exact variant IDs
    const printfulOrder = {
      external_id: `optimal-${Date.now()}`,
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
        variant_id: parseInt(variantId), // Use your exact variant ID
        quantity: 1,
        retail_price: '24.99'
      }]
    };

    // Make direct API call to Printful with store_id
    const printfulResponse = await fetch('https://api.printful.com/stores/16862505/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(printfulOrder)
    });

    const result = await printfulResponse.json();

    return NextResponse.json({
      success: true,
      message: 'Direct Printful order created',
      variantId: variantId,
      size: size,
      printfulResponse: result,
      orderData: printfulOrder
    });

  } catch (error) {
    console.error('Direct Printful order error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
