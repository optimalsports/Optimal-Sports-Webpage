import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('=== TESTING REAL MARQUIS VARIANT IDs ===');
    
    // Test the real variant IDs from your Printful dashboard
    const variantIds = [
      '41133373784137', // Size S
      '41133373816905', // Size M  
      '41133373849673'  // Size L
    ];
    
    const results = [];
    
    for (const variantId of variantIds) {
      try {
        console.log(`Testing variant ID: ${variantId}`);
        
        const variantResponse = await fetch(`https://api.printful.com/products/variant/${variantId}`, {
          headers: {
            'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
            'Content-Type': 'application/json',
          },
        });
        
        const variantData = await variantResponse.json();
        
        results.push({
          variantId: variantId,
          status: variantResponse.status,
          success: variantResponse.ok,
          data: variantData
        });
        
        console.log(`Variant ${variantId}: ${variantResponse.status} - ${variantResponse.ok ? 'SUCCESS' : 'FAILED'}`);
        
      } catch (error) {
        results.push({
          variantId: variantId,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    const workingVariants = results.filter(r => r.success);
    
    return NextResponse.json({
      success: true,
      message: 'Testing real Marquis variant IDs from your Printful dashboard:',
      results: results,
      workingVariants: workingVariants,
      instructions: {
        step1: 'Check which variants show success: true',
        step2: 'Use the working variant IDs in your admin dashboard',
        step3: 'Update your product with the correct variant IDs',
        step4: 'Test checkout with the working variant IDs'
      }
    });
    
  } catch (error) {
    console.error('Marquis real variant test error:', error);
    return NextResponse.json({
      error: 'Marquis real variant test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
