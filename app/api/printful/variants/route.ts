import { NextRequest, NextResponse } from 'next/server';
import { printful } from '@/lib/printful';

// Helper function to add delay between API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Force dynamic rendering to prevent build-time execution
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get('storeId');
    
    console.log('Fetching Printful store products and variants...', storeId ? `for store ${storeId}` : 'for all stores');
    
    // Get products directly from Printful API (bypassing the broken PrintfulService)
    let products = [];
    if (storeId) {
      console.log(`Fetching products directly from Printful API for store ${storeId}...`);
      const response = await fetch(`https://api.printful.com/stores/${storeId}/products`, {
        headers: {
          'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        products = data.result || [];
        console.log(`Direct API call returned ${products.length} products for store ${storeId}`);
      } else {
        console.error(`Direct API call failed: ${response.status}`);
      }
    } else {
      // Fallback to PrintfulService for all products
      products = await printful.getProducts();
    }
    
    console.log(`Found ${products.length} products in Printful store${storeId ? ` (store ID: ${storeId})` : ' (all stores)'}`);
    
    // Limit to first 5 products to avoid timeout during build
    const limitedProducts = products.slice(0, 5);
    console.log(`Processing first ${limitedProducts.length} products to avoid timeout`);
    
    const productsWithVariants = [];
    
    for (let i = 0; i < limitedProducts.length; i++) {
      const product = limitedProducts[i];
      
      try {
        // Add small delay between requests to be respectful to API
        if (i > 0) {
          await delay(500); // 0.5 second delay between requests
        }
        
        const variants = await printful.getProductVariants(product.id);
        console.log(`Product ${product.id} (${product.name}) has ${variants.length} variants`);
        
        productsWithVariants.push({
          productId: product.id,
          productName: product.name,
          variants: variants.map(variant => ({
            variantId: variant.id,
            sku: variant.sku,
            size: variant.size,
            color: variant.color,
            price: variant.price,
            availabilityRegions: variant.availability_regions
          }))
        });
      } catch (error) {
        console.error(`Error fetching variants for product ${product.id}:`, error);
        
        // If we hit rate limit, stop processing
        if (error instanceof Error && error.message.includes('429')) {
          console.log('Rate limit hit, stopping processing');
          break;
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      products: productsWithVariants,
      totalProducts: productsWithVariants.length,
      message: `Found ${productsWithVariants.length} products in YOUR Printful store`
    });
    
  } catch (error) {
    console.error('Error fetching Printful variants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Printful variants' },
      { status: 500 }
    );
  }
}
