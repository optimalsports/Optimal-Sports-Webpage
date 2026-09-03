import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('=== TESTING HOODIE VARIANT ID ===');
    
    const variantId = '68f82663de0321';
    console.log(`Testing variant ID: ${variantId}`);
    
    // Test if this variant exists in Printful
    const variantResponse = await fetch(`https://api.printful.com/products/variant/${variantId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    
    const variantData = await variantResponse.json();
    console.log('Variant response status:', variantResponse.status);
    console.log('Variant response data:', variantData);
    
    if (variantResponse.ok) {
      return NextResponse.json({
        success: true,
        message: '✅ Hoodie variant ID is valid!',
        variantId: variantId,
        variantData: variantData,
        instructions: {
          step1: 'This variant ID works with Printful',
          step2: 'You can use this for checkout',
          step3: 'Try placing an order with this product',
          step4: 'The checkout should work now'
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        message: '❌ Hoodie variant ID is invalid',
        variantId: variantId,
        error: variantData,
        instructions: {
          step1: 'This variant ID does not exist in Printful',
          step2: 'You need to create the product in Printful first',
          step3: 'Go to Printful dashboard and create the hoodie',
          step4: 'Get the real variant ID from Printful'
        }
      });
    }
    
  } catch (error) {
    console.error('Hoodie variant test error:', error);
    return NextResponse.json({
      error: 'Hoodie variant test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
