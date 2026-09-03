import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('=== FINDING YOUR STORE WITH 2 PRODUCTS ===');
    
    const stores = [
      { id: 16862505, name: 'optimalsportslaunch' },
      { id: 7957549, name: 'Personal orders' },
      { id: 8375620, name: 'The Gridiron Collection' }
    ];
    
    const results = [];
    
    for (const store of stores) {
      try {
        console.log(`Testing store ${store.id}: ${store.name}`);
        
        const response = await fetch(`https://api.printful.com/stores/${store.id}/products`, {
          headers: {
            'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          const products = data.result || [];
          
          results.push({
            storeId: store.id,
            storeName: store.name,
            productCount: products.length,
            products: products.map((p: any) => ({
              id: p.id,
              name: p.name,
              image: p.image
            })),
            status: 'success'
          });
          
          console.log(`Store ${store.id} has ${products.length} products`);
        } else {
          const errorText = await response.text();
          results.push({
            storeId: store.id,
            storeName: store.name,
            productCount: 0,
            status: 'error',
            error: errorText
          });
          console.log(`Store ${store.id} failed: ${response.status}`);
        }
      } catch (error) {
        results.push({
          storeId: store.id,
          storeName: store.name,
          productCount: 0,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        console.error(`Error testing store ${store.id}:`, error);
      }
    }
    
    // Find the store with 2 products
    const storeWith2Products = results.find(r => r.productCount === 2);
    
    return NextResponse.json({
      success: true,
      message: 'Store analysis complete:',
      results: results,
      yourStore: storeWith2Products ? {
        storeId: storeWith2Products.storeId,
        storeName: storeWith2Products.storeName,
        productCount: storeWith2Products.productCount,
        products: storeWith2Products.products
      } : null,
      instructions: {
        step1: 'Look for the store with productCount: 2',
        step2: 'That\'s your store with 2 products',
        step3: 'Use that storeId in the checkout API',
        note: 'If no store has exactly 2 products, check the productCount for each store'
      }
    });
    
  } catch (error) {
    console.error('Error finding your store:', error);
    return NextResponse.json({
      error: 'Failed to find your store',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
