import { NextRequest, NextResponse } from 'next/server';
import { printful } from '@/lib/printful';

// Force dynamic rendering to prevent build-time execution
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    
    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    console.log(`Fetching variants for product ${productId}...`);
    
    const variants = await printful.getProductVariants(parseInt(productId));
    console.log(`Found ${variants.length} variants for product ${productId}`);
    
    const formattedVariants = variants.map(variant => ({
      variantId: variant.id,
      sku: variant.sku,
      size: variant.size,
      color: variant.color,
      price: variant.price,
      availabilityRegions: variant.availability_regions
    }));
    
    return NextResponse.json({
      success: true,
      productId: parseInt(productId),
      variants: formattedVariants,
      totalVariants: formattedVariants.length
    });
    
  } catch (error) {
    console.error('Error fetching product variants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product variants' },
      { status: 500 }
    );
  }
}
