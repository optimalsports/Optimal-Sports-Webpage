import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('=== GETTING ONLY OPTIMALSPORTSLAUNCH PRODUCTS ===');
    
    // Use your specific store ID for optimalsportslaunch
    const storeId = 16862505;
    
    const response = await fetch(`https://api.printful.com/stores/${storeId}/products`, {
      headers: {
        'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({
        error: 'Failed to fetch optimalsportslaunch products',
        status: response.status,
        details: errorText
      }, { status: response.status });
    }
    
    const data = await response.json();
    const products = data.result || [];
    
    console.log(`Found ${products.length} products in optimalsportslaunch store`);
    
    // Get variant IDs for each product
    const productsWithVariants = [];
    
    for (const product of products) {
      try {
        console.log(`Getting variants for: ${product.name}`);
        
        const variantsResponse = await fetch(`https://api.printful.com/products/${product.id}`, {
          headers: {
            'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (variantsResponse.ok) {
          const variantsData = await variantsResponse.json();
          const variants = variantsData.result?.variants || [];
          
          productsWithVariants.push({
            productName: product.name,
            productId: product.id,
            image: product.image,
            variants: variants.map((v: any) => ({
              variantId: v.id,
              sku: v.sku,
              size: v.size,
              color: v.color,
              price: v.price
            }))
          });
          
          console.log(`Found ${variants.length} variants for ${product.name}`);
        }
      } catch (error) {
        console.error(`Error getting variants for product ${product.id}:`, error);
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'ONLY your optimalsportslaunch products (no random catalog items):',
      storeId: storeId,
      storeName: 'optimalsportslaunch',
      productCount: productsWithVariants.length,
      products: productsWithVariants,
      instructions: {
        step1: 'These are ONLY your custom products from optimalsportslaunch store',
        step2: 'Copy the variantId numbers from the variants array',
        step3: 'Add those variant IDs to your admin dashboard',
        step4: 'Match the size (S, M, L, XL) with the correct variantId'
      }
    });
    
  } catch (error) {
    console.error('Error getting optimalsportslaunch products:', error);
    return NextResponse.json({
      error: 'Failed to get your products',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
