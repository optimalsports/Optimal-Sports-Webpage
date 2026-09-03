import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('=== SIMPLE PRINTFUL TEST ===');
    
    // Test 1: Basic API key test
    const storesResponse = await fetch('https://api.printful.com/stores', {
      headers: {
        'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    
    const storesData = await storesResponse.json();
    console.log('Stores response:', storesData);
    
    // Test 2: Try to get products from the first store that exists
    let foundProducts = false;
    let workingStoreId = null;
    let workingStoreName = null;
    
    if (storesData.result && storesData.result.length > 0) {
      for (const store of storesData.result) {
        try {
          console.log(`Trying store ${store.id}: ${store.name}`);
          
          const productsResponse = await fetch(`https://api.printful.com/stores/${store.id}/products`, {
            headers: {
              'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
              'Content-Type': 'application/json',
            },
          });
          
          if (productsResponse.ok) {
            const productsData = await productsResponse.json();
            const products = productsData.result || [];
            
            if (products.length > 0) {
              foundProducts = true;
              workingStoreId = store.id;
              workingStoreName = store.name;
              console.log(`Found ${products.length} products in store ${store.id}`);
              break;
            }
          }
        } catch (error) {
          console.error(`Error testing store ${store.id}:`, error);
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Simple test results:',
      stores: storesData.result || [],
      foundProducts: foundProducts,
      workingStore: foundProducts ? {
        id: workingStoreId,
        name: workingStoreName
      } : null,
      instructions: {
        step1: 'Check if foundProducts is true',
        step2: 'If true, use the workingStore ID',
        step3: 'If false, there might be an API permission issue'
      }
    });
    
  } catch (error) {
    console.error('Simple test error:', error);
    return NextResponse.json({
      error: 'Simple test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
