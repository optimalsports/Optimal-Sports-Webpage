import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('=== TESTING STORE-SPECIFIC VARIANTS ===');
    
    // Try to get variants from your store directly
    const storeId = 16862505; // optimalsportslaunch store
    
    const response = await fetch(`https://api.printful.com/stores/${storeId}/products`, {
      headers: {
        'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({
        error: 'Failed to fetch store products',
        status: response.status,
        details: errorText
      }, { status: response.status });
    }
    
    const data = await response.json();
    const products = data.result || [];
    
    console.log(`Found ${products.length} products in store ${storeId}`);
    
    // Look for the Marquis product
    const marquisProduct = products.find((p: any) => 
      p.name.toLowerCase().includes('marquis') || 
      p.name.toLowerCase().includes('gallegos')
    );
    
    if (!marquisProduct) {
      return NextResponse.json({
        error: 'Marquis product not found in store',
        availableProducts: products.map((p: any) => ({
          id: p.id,
          name: p.name
        }))
      }, { status: 404 });
    }
    
    console.log('Found Marquis product:', marquisProduct.name);
    
    // Get variants for this product
    const variantsResponse = await fetch(`https://api.printful.com/products/${marquisProduct.id}`, {
      headers: {
        'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!variantsResponse.ok) {
      const errorText = await variantsResponse.text();
      return NextResponse.json({
        error: 'Failed to fetch product variants',
        status: variantsResponse.status,
        details: errorText
      }, { status: variantsResponse.status });
    }
    
    const variantsData = await variantsResponse.json();
    const variants = variantsData.result?.variants || [];
    
    console.log(`Found ${variants.length} variants for Marquis product`);
    
    return NextResponse.json({
      success: true,
      message: 'Found Marquis product and variants:',
      product: {
        id: marquisProduct.id,
        name: marquisProduct.name
      },
      variants: variants.map((v: any) => ({
        variantId: v.id,
        sku: v.sku,
        size: v.size,
        color: v.color,
        price: v.price
      })),
      instructions: {
        step1: 'Use these variant IDs in your admin dashboard',
        step2: 'Match the size (S, M, L) with the correct variantId',
        step3: 'Update your product with these variant IDs',
        step4: 'Test checkout with the correct variant IDs'
      }
    });
    
  } catch (error) {
    console.error('Store variants test error:', error);
    return NextResponse.json({
      error: 'Store variants test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
