import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('=== GETTING PRINTFUL VARIANT IDs ===');
    
    // Get your store products from Printful
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
        error: 'Failed to fetch products',
        status: response.status,
        details: errorText
      }, { status: response.status });
    }
    
    const data = await response.json();
    const products = data.result || [];
    
    console.log(`Found ${products.length} products in your Printful store`);
    
    // Get variant IDs for each product
    const productsWithVariants = [];
    
    for (const product of products) {
      try {
        console.log(`Getting variants for product: ${product.name}`);
        
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
            variants: variants.map((v: any) => ({
              variantId: v.id, // This is the actual Printful variant ID
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
      message: 'Here are your actual Printful variant IDs:',
      products: productsWithVariants,
      instructions: {
        step1: 'Copy the variantId numbers from the variants array',
        step2: 'Paste them into your admin dashboard in the "Printful Variant IDs by Size" section',
        step3: 'Make sure to match the size (S, M, L, XL) with the correct variantId',
        note: 'The variantId is the number, not the sku or internal ID'
      }
    });
    
  } catch (error) {
    console.error('Error getting Printful variant IDs:', error);
    return NextResponse.json({
      error: 'Failed to get variant IDs',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
