import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering to prevent build-time execution
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('=== DEBUGGING PRINTFUL API ===');
    
    // Test 1: Get all products without store filter
    console.log('1. Testing /products endpoint (no store filter)...');
    const allProductsResponse = await fetch('https://api.printful.com/products', {
      headers: {
        'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    
    const allProductsData = await allProductsResponse.json();
    console.log(`All products count: ${allProductsData.result?.length || 0}`);
    
    // Test 2: Get products with store filter
    console.log('2. Testing /stores/16862505/products endpoint...');
    const storeProductsResponse = await fetch('https://api.printful.com/stores/16862505/products', {
      headers: {
        'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    
    const storeProductsData = await storeProductsResponse.json();
    console.log(`Store products count: ${storeProductsData.result?.length || 0}`);
    
    // Test 3: Get store info
    console.log('3. Testing /stores endpoint...');
    const storesResponse = await fetch('https://api.printful.com/stores', {
      headers: {
        'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    
    const storesData = await storesResponse.json();
    console.log(`Stores count: ${storesData.result?.length || 0}`);
    
  // Get variant IDs for ALL products in your store
  let variantIds = [];
  if (storeProductsData.result && storeProductsData.result.length > 0) {
    console.log(`Processing ${storeProductsData.result.length} products from your store...`);
    
    for (const product of storeProductsData.result) {
      try {
        console.log(`Fetching variants for product ${product.id}: ${product.name}`);
        const variantsResponse = await fetch(`https://api.printful.com/products/${product.id}`, {
          headers: {
            'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
            'Content-Type': 'application/json',
          },
        });

        if (variantsResponse.ok) {
          const variantsData = await variantsResponse.json();
          const productVariants = variantsData.result?.variants?.map((v: any) => ({
            productId: product.id,
            productName: product.name,
            variantId: v.id,
            sku: v.sku,
            size: v.size,
            color: v.color,
            price: v.price
          })) || [];
          
          variantIds.push(...productVariants);
          console.log(`Found ${productVariants.length} variants for product ${product.id}`);
        } else {
          console.error(`Failed to fetch variants for product ${product.id}: ${variantsResponse.status}`);
        }
      } catch (error) {
        console.error(`Error fetching variants for product ${product.id}:`, error);
      }
    }
  }

    // Test Marquis product specifically
    let marquisTest = null;
    try {
      const localProductsResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/products`);
      const localProducts = await localProductsResponse.json();
      
      const hoodieProduct = localProducts.find((p: any) => 
        p.name.toLowerCase().includes('hoodie') || 
        p.name.toLowerCase().includes('zip')
      );
      
      if (hoodieProduct) {
        marquisTest = {
          found: true,
          name: hoodieProduct.name,
          variantIdsBySize: hoodieProduct.variantIdsBySize,
          printfulVariantId: hoodieProduct.printfulVariantId
        };
      }
    } catch (error) {
      marquisTest = { found: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }

    return NextResponse.json({
      success: true,
      message: "Here are your Printful variant IDs:",
      variantIds: variantIds,
      marquisTest: marquisTest,
      debug: {
        allProductsCount: allProductsData.result?.length || 0,
        storeProductsCount: storeProductsData.result?.length || 0,
        storesCount: storesData.result?.length || 0,
        allProductsSample: allProductsData.result?.slice(0, 3) || [],
        storeProductsSample: storeProductsData.result?.slice(0, 3) || [],
        stores: storesData.result || []
      }
    });
    
  } catch (error) {
    console.error('Debug API error:', error);
    return NextResponse.json(
      { error: 'Debug failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
