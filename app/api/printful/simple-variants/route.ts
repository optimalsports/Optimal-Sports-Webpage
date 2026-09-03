import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering to prevent build-time execution
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('[simple-variants] Starting simple variants fetch...');
    
    // Get products directly from Printful API
    const productsUrl = 'https://api.printful.com/stores/16862505/products';
    console.log(`[simple-variants] Fetching products from: ${productsUrl}`);
    
    const response = await fetch(productsUrl, {
      headers: {
        'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    
    console.log(`[simple-variants] Products response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[simple-variants] Products fetch failed: ${response.status} - ${errorText}`);
      throw new Error(`Printful API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    const products = data.result || [];
    
    // Extract just the variant IDs in a simple format
    const simpleVariants = [];
    
    console.log(`[simple-variants] Found ${products.length} products, processing first 3...`);
    
    for (const product of products.slice(0, 3)) { // Just first 3 products
      try {
        const variantsUrl = `https://api.printful.com/products/${product.id}`;
        console.log(`[simple-variants] Fetching variants for product ${product.id} (${product.name}) from: ${variantsUrl}`);
        
        const variantsResponse = await fetch(variantsUrl, {
          headers: {
            'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
            'Content-Type': 'application/json',
          },
        });
        
        console.log(`[simple-variants] Variants response status for product ${product.id}: ${variantsResponse.status}`);
        
        if (variantsResponse.ok) {
          const variantsData = await variantsResponse.json();
          const variants = variantsData.result?.variants || [];
          
          simpleVariants.push({
            productName: product.name,
            productId: product.id,
            variants: variants.map((v: any) => ({
              variantId: v.id,
              sku: v.sku,
              size: v.size,
              color: v.color,
              price: v.price
            }))
          });
        }
      } catch (error) {
        console.error(`Error fetching variants for product ${product.id}:`, error);
      }
    }
    
    return NextResponse.json({
      success: true,
      message: "Here are your Printful variant IDs:",
      products: simpleVariants
    });
    
  } catch (error) {
    console.error('Error fetching simple variants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch variants', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
