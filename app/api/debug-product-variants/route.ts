import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('=== DEBUGGING PRODUCT VARIANTS ===');
    
    // Get your products from the computer
    const productsResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/products`);
    const products = await productsResponse.json();
    
    console.log('Found products:', products.length);
    
    // Check each product for variant IDs
    const productsWithVariants = products.map((product: any) => ({
      id: product.id,
      name: product.name,
      printfulVariantId: product.printfulVariantId,
      variantIdsBySize: product.variantIdsBySize,
      sizes: product.sizes
    }));
    
    console.log('Products with variant info:', productsWithVariants);
    
    // Test the Printful API with the hoodie variant ID
    const hoodieProduct = products.find((p: any) => p.name.toLowerCase().includes('hoodie'));
    
    if (hoodieProduct && (hoodieProduct.printfulVariantId || hoodieProduct.variantIdsBySize)) {
      console.log('Found hoodie product:', hoodieProduct.name);
      console.log('Hoodie variant ID:', hoodieProduct.printfulVariantId);
      console.log('Hoodie variant IDs by size:', hoodieProduct.variantIdsBySize);
      
      // Try to test the variant ID with Printful
      const variantId = hoodieProduct.variantIdsBySize?.S || hoodieProduct.printfulVariantId;
      
      if (variantId) {
        console.log(`Testing variant ID ${variantId} with Printful...`);
        
        // Test if this variant exists
        const variantResponse = await fetch(`https://api.printful.com/products/variant/${variantId}`, {
          headers: {
            'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
            'Content-Type': 'application/json',
          },
        });
        
        const variantData = await variantResponse.json();
        console.log('Variant response:', variantResponse.status, variantData);
        
        return NextResponse.json({
          success: true,
          products: productsWithVariants,
          hoodieProduct: {
            name: hoodieProduct.name,
            variantId: variantId,
            printfulVariantId: hoodieProduct.printfulVariantId,
            variantIdsBySize: hoodieProduct.variantIdsBySize
          },
          variantTest: {
            status: variantResponse.status,
            data: variantData
          }
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      products: productsWithVariants,
      message: 'No hoodie product found or no variant IDs set'
    });
    
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({
      error: 'Debug failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
