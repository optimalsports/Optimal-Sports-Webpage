import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('=== CHECKING ALL PRODUCTS TO FIND YOUR STORE ===');
    
    // Get all products from the general endpoint
    const response = await fetch('https://api.printful.com/products', {
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
    const allProducts = data.result || [];
    
    console.log(`Found ${allProducts.length} total products`);
    
    // Filter for products that might be yours (look for custom products)
    // Custom products usually have different characteristics than catalog products
    const customProducts = allProducts.filter((product: any) => {
      // Look for products that might be custom (not in the main catalog)
      return product.type === 'custom' || 
             product.brand === 'Custom' || 
             product.name.includes('Custom') ||
             product.origin_country !== 'US' ||
             product.variant_count < 10; // Custom products usually have fewer variants
    });
    
    console.log(`Found ${customProducts.length} potential custom products`);
    
    // Get the first few custom products to examine
    const sampleProducts = customProducts.slice(0, 5).map((product: any) => ({
      id: product.id,
      name: product.name,
      brand: product.brand,
      type: product.type,
      variant_count: product.variant_count,
      origin_country: product.origin_country,
      image: product.image
    }));
    
    return NextResponse.json({
      success: true,
      message: 'Analysis of all products:',
      totalProducts: allProducts.length,
      customProducts: customProducts.length,
      sampleProducts: sampleProducts,
      instructions: {
        step1: 'Look at the sampleProducts to see if any are yours',
        step2: 'If you see your products, note their IDs',
        step3: 'We can then get variants for those specific products',
        note: 'Custom products usually have fewer variants and different characteristics'
      }
    });
    
  } catch (error) {
    console.error('Error checking all products:', error);
    return NextResponse.json({
      error: 'Failed to check products',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
