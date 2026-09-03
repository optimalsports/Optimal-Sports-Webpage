import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerInfo, productName, size, quantity } = body;

    // Use a catalog product that we know exists in the API
    // Product ID 679: "Unisex Performance Crew Neck T-Shirt"
    const catalogProduct = {
      variant_id: 1, // Use a simple variant ID that should work
      quantity: quantity || 1,
      retail_price: '15.99'
    };

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
      items: [catalogProduct]
    };

    console.log('Creating Printful order with catalog product:', printfulOrder);

    // Create order in your optimalsportslaunch store
    const printfulResponse = await fetch('https://api.printful.com/stores/16862505/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(printfulOrder)
    });

    const result = await printfulResponse.json();
    console.log('Printful API response:', result);

    if (printfulResponse.ok) {
      return NextResponse.json({
        success: true,
        message: 'Order successfully created in Printful!',
        printfulOrderId: result.result?.id,
        externalId: result.result?.external_id,
        status: result.result?.status,
        printfulResponse: result
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Printful order creation failed',
        printfulError: result,
        orderData: printfulOrder
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Working Printful order error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
