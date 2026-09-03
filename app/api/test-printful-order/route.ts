import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Test order data (using your exact Marquis variant ID)
    const testOrder = {
      external_id: `optimal-test-${Date.now()}`,
      shipping: 'STANDARD',
      recipient: {
        name: 'Test Customer',
        address1: '123 Test Street',
        city: 'Test City',
        state_code: 'CA',
        country_code: 'US',
        zip: '12345'
      },
      items: [{
        variant_id: 41133373816905, // Your exact Marquis M size variant ID
        quantity: 1,
        retail_price: '24.99'
      }]
    };

    console.log('Creating test Printful order:', testOrder);

    // Send to Printful API
    const printfulResponse = await fetch('https://api.printful.com/stores/16862505/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testOrder)
    });

    const result = await printfulResponse.json();
    console.log('Printful API response:', result);

    if (printfulResponse.ok) {
      return NextResponse.json({
        success: true,
        message: 'Test order successfully created in Printful!',
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
        orderData: testOrder
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Test Printful order error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}