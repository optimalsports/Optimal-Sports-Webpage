import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('=== TESTING WITH MARQUIS SHIRT ===');
    
    // Get your local products
    const productsResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/products`);
    const products = await productsResponse.json();
    
    console.log('Found local products:', products.length);
    
    // Find the Marquis shirt
    const marquisProduct = products.find((p: any) => 
      p.name.toLowerCase().includes('marquis') || 
      p.name.toLowerCase().includes('gallegos')
    );
    
    if (!marquisProduct) {
      return NextResponse.json({
        error: 'Marquis product not found in local database',
        availableProducts: products.map((p: any) => ({
          id: p.id,
          name: p.name,
          variantIdsBySize: p.variantIdsBySize,
          printfulVariantId: p.printfulVariantId
        }))
      }, { status: 404 });
    }
    
    console.log('Found Marquis product:', marquisProduct.name);
    console.log('Marquis variant IDs:', marquisProduct.variantIdsBySize);
    console.log('Marquis general variant ID:', marquisProduct.printfulVariantId);
    
    // Test if we can find this product in Printful
    let foundInPrintful = false;
    let printfulVariantIds = [];
    
    // Try to find the product in Printful using the variant ID
    if (marquisProduct.variantIdsBySize) {
      const firstVariantId = Object.values(marquisProduct.variantIdsBySize)[0];
      console.log(`Testing variant ID: ${firstVariantId}`);
      
      try {
        const variantResponse = await fetch(`https://api.printful.com/products/variant/${firstVariantId}`, {
          headers: {
            'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (variantResponse.ok) {
          const variantData = await variantResponse.json();
          foundInPrintful = true;
          printfulVariantIds.push({
            variantId: firstVariantId,
            data: variantData
          });
          console.log('✅ Found variant in Printful!');
        } else {
          console.log('❌ Variant not found in Printful');
        }
      } catch (error) {
        console.error('Error testing variant:', error);
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Marquis product test results:',
      localProduct: {
        id: marquisProduct.id,
        name: marquisProduct.name,
        variantIdsBySize: marquisProduct.variantIdsBySize,
        printfulVariantId: marquisProduct.printfulVariantId
      },
      foundInPrintful: foundInPrintful,
      printfulVariants: printfulVariantIds,
      instructions: {
        step1: 'Check if foundInPrintful is true',
        step2: 'If true, the variant IDs are working',
        step3: 'If false, the product needs to be created in Printful first',
        step4: 'Use the variant IDs from printfulVariants for checkout'
      }
    });
    
  } catch (error) {
    console.error('Marquis test error:', error);
    return NextResponse.json({
      error: 'Marquis test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
