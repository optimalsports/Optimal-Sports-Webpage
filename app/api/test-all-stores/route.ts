import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('=== TESTING ALL STORES FOR PRODUCTS ===');
    
    const stores = [
      { id: 16862505, name: 'optimalsportslaunch' },
      { id: 7957549, name: 'Personal orders' },
      { id: 8375620, name: 'The Gridiron Collection' }
    ];
    
    const results = [];
    
    for (const store of stores) {
      try {
        console.log(`Testing store ${store.id}: ${store.name}`);
        
        // Test products endpoint
        const productsResponse = await fetch(`https://api.printful.com/stores/${store.id}/products`, {
          headers: {
            'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
            'Content-Type': 'application/json',
          },
        });
        
        const productsData = await productsResponse.json();
        console.log(`Store ${store.id} raw response:`, JSON.stringify(productsData, null, 2));
        
        // Handle different response structures
        let products = [];
        if (Array.isArray(productsData.result)) {
          products = productsData.result;
        } else if (Array.isArray(productsData)) {
          products = productsData;
        } else if (productsData.result && Array.isArray(productsData.result.data)) {
          products = productsData.result.data;
        } else {
          console.log(`Store ${store.id} - products is not an array:`, typeof productsData.result);
        }
        
        console.log(`Store ${store.id} returned ${products.length} products`);
        
        results.push({
          storeId: store.id,
          storeName: store.name,
          status: productsResponse.status,
          productCount: products.length,
          products: products.map((p: any) => ({
            id: p.id,
            name: p.name
          })),
          rawResponse: productsData,
          error: productsResponse.ok ? null : productsData
        });
        
        // If this store has products, get variant IDs for the first product
        if (products.length > 0) {
          const firstProduct = products[0];
          console.log(`Getting variants for product ${firstProduct.id}: ${firstProduct.name}`);
          
          const variantsResponse = await fetch(`https://api.printful.com/products/${firstProduct.id}`, {
            headers: {
              'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
              'Content-Type': 'application/json',
            },
          });
          
          if (variantsResponse.ok) {
            const variantsData = await variantsResponse.json();
            const variants = variantsData.result?.variants || [];
            
            (results[results.length - 1] as any).variants = variants.map((v: any) => ({
              variantId: v.id,
              sku: v.sku,
              size: v.size,
              color: v.color,
              price: v.price
            }));
            
            console.log(`Found ${variants.length} variants for product ${firstProduct.id}`);
          }
        }
        
      } catch (error) {
        console.error(`Error testing store ${store.id}:`, error);
        results.push({
          storeId: store.id,
          storeName: store.name,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Store test results:',
      results: results,
      instructions: {
        step1: 'Look for stores with productCount > 0',
        step2: 'Use the storeId from a store that has products',
        step3: 'Copy the variantId numbers for your products',
        step4: 'Add those variant IDs to your admin dashboard'
      }
    });
    
  } catch (error) {
    console.error('Error testing stores:', error);
    return NextResponse.json({
      error: 'Failed to test stores',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
