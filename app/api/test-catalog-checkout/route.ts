import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Test with a catalog product that we know exists
    const testProduct = {
      id: 'catalog-test-679', // Using catalog product ID 679
      name: 'Unisex Performance Crew Neck T-Shirt',
      price: '15.99',
      variantIdsBySize: {
        'S': '1', // Using a simple variant ID for testing
        'M': '2',
        'L': '3'
      }
    };

    const testOrder = {
      product: testProduct,
      selectedSize: 'M',
      selectedColor: 'Black',
      quantity: 1,
      customerInfo: {
        name: 'Test Customer',
        email: 'test@example.com',
        address: '123 Test St',
        city: 'Test City',
        state: 'CA',
        zip: '12345',
        country: 'US'
      },
      retailPrice: '15.99',
      paymentIntentId: 'pi_test_catalog_' + Date.now()
    };

    // Call the checkout API with the test data
    const checkoutResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testOrder)
    });

    const result = await checkoutResponse.json();

    return NextResponse.json({
      success: true,
      message: 'Test checkout with catalog product',
      testData: testOrder,
      checkoutResult: result
    });

  } catch (error) {
    console.error('Test catalog checkout error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
