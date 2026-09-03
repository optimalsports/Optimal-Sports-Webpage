import { NextRequest, NextResponse } from 'next/server';

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
      retailPrice 
    } = body;

    if (!product || !selectedSize || !quantity || !customerInfo) {
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

    console.log('Processing simple checkout order:', {
      product: product.name,
      size: selectedSize,
      color: selectedColor,
      quantity,
      customer: customerInfo.name,
      email: customerInfo.email
    });

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

    // Return success response
    return NextResponse.json({
      success: true,
      orderId: mockOrder.id,
      externalId: mockOrder.external_id,
      message: 'Order successfully created (mock mode)',
      order: mockOrder
    });

  } catch (error) {
    console.error('Simple checkout error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error occurred',
        type: 'simple_checkout_error'
      },
      { status: 500 }
    );
  }
}
