import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('=== FINDING YOUR PRINTFUL STORE ID ===');
    
    // First, get all your stores
    const storesResponse = await fetch('https://api.printful.com/stores', {
      headers: {
        'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!storesResponse.ok) {
      const errorText = await storesResponse.text();
      return NextResponse.json({
        error: 'Failed to fetch stores',
        status: storesResponse.status,
        details: errorText
      }, { status: storesResponse.status });
    }
    
    const storesData = await storesResponse.json();
    const stores = storesData.result || [];
    
    console.log(`Found ${stores.length} stores`);
    
    // List all stores
    const storeList = stores.map((store: any) => ({
      id: store.id,
      name: store.name,
      type: store.type,
      website: store.website
    }));
    
    console.log('Available stores:', storeList);
    
    // Try to get products from each store
    const storesWithProducts = [];
    
    for (const store of stores) {
      try {
        console.log(`Checking store ${store.id}: ${store.name}`);
        
        const productsResponse = await fetch(`https://api.printful.com/stores/${store.id}/products`, {
          headers: {
            'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          const products = productsData.result || [];
          
          storesWithProducts.push({
            storeId: store.id,
            storeName: store.name,
            productCount: products.length,
            products: products.map((p: any) => ({
              id: p.id,
              name: p.name
            }))
          });
          
          console.log(`Store ${store.id} has ${products.length} products`);
        } else {
          console.log(`Store ${store.id} returned ${productsResponse.status}`);
        }
      } catch (error) {
        console.error(`Error checking store ${store.id}:`, error);
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Here are your Printful stores:',
      allStores: storeList,
      storesWithProducts: storesWithProducts,
      instructions: {
        step1: 'Look at the "storesWithProducts" array',
        step2: 'Find the store that has your products',
        step3: 'Use that store ID in the checkout API',
        note: 'The store ID should be a number, not starting with #'
      }
    });
    
  } catch (error) {
    console.error('Error finding stores:', error);
    return NextResponse.json({
      error: 'Failed to find stores',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
