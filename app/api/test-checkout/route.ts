import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { product, selectedSize } = body;

    console.log('=== CHECKOUT DEBUG ===');
    console.log('Product data:', product);
    console.log('Selected size:', selectedSize);
    console.log('Variant IDs by size:', product.variantIdsBySize);
    console.log('General variant ID:', product.printfulVariantId);

    // Check if we have variant IDs
    let variantId = null;
    if (product.variantIdsBySize && product.variantIdsBySize[selectedSize]) {
      variantId = product.variantIdsBySize[selectedSize];
      console.log(`✅ Using size-specific variant ID for ${selectedSize}: ${variantId}`);
    } else if (product.printfulVariantId) {
      variantId = product.printfulVariantId;
      console.log(`⚠️ Using general variant ID: ${variantId}`);
    } else {
      console.log('❌ No variant ID found!');
      return NextResponse.json({
        error: 'No variant ID found',
        product: product,
        selectedSize: selectedSize,
        message: 'Please add variant IDs to your product in the admin dashboard'
      }, { status: 400 });
    }

    // Test the Printful API call with the variant ID
    try {
      const storeId = 16862505;
      const testOrder = {
        external_id: `test-${Date.now()}`,
        shipping: 'STANDARD',
        recipient: {
          name: 'Test Customer',
          address1: '123 Test St',
          city: 'Test City',
          state_code: 'CA',
          country_code: 'US',
          zip: '90210',
          email: 'test@example.com',
        },
        items: [{
          variant_id: parseInt(variantId),
          quantity: 1,
          retail_price: '25.00',
        }],
      };

      console.log('Testing Printful order creation with:', testOrder);

      const response = await fetch(`https://api.printful.com/stores/${storeId}/orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testOrder),
      });

      const responseText = await response.text();
      console.log('Printful response status:', response.status);
      console.log('Printful response body:', responseText);

      if (response.ok) {
        const data = JSON.parse(responseText);
        return NextResponse.json({
          success: true,
          message: 'Test order creation successful!',
          variantId: variantId,
          storeId: storeId,
          printfulResponse: data
        });
      } else {
        return NextResponse.json({
          error: 'Printful API error',
          status: response.status,
          response: responseText,
        variantId: variantId,
        testOrder: testOrder
        }, { status: response.status });
      }
    } catch (apiError) {
      console.error('Printful API test error:', apiError);
      return NextResponse.json({
        error: 'API test failed',
        details: apiError instanceof Error ? apiError.message : 'Unknown error',
        variantId: variantId
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Test checkout error:', error);
    return NextResponse.json({
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
