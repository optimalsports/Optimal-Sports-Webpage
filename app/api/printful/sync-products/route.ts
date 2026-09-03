import { NextRequest, NextResponse } from 'next/server';

/**
 * This endpoint helps you see all your Printful sync products and their variants
 * Use this to map your products to Printful variant IDs
 * 
 * Usage: GET /api/printful/sync-products
 */
export async function GET(request: NextRequest) {
  try {
    const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;

    if (!PRINTFUL_API_KEY) {
      return NextResponse.json(
        { error: 'PRINTFUL_API_KEY not configured' },
        { status: 500 }
      );
    }

    // Fetch sync products from Printful
    const response = await fetch('https://api.printful.com/sync/products', {
      headers: {
        'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: 'Printful API error', details: error },
        { status: response.status }
      );
    }

    const data = await response.json();
    const products = data.result || [];

    // Get detailed info for each product
    const detailedProducts = await Promise.all(
      products.map(async (product: any) => {
        try {
          const detailResponse = await fetch(
            `https://api.printful.com/sync/products/${product.id}`,
            {
              headers: {
                'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
                'Content-Type': 'application/json',
              },
            }
          );

          if (!detailResponse.ok) {
            return {
              id: product.id,
              name: product.name,
              error: 'Failed to fetch details',
            };
          }

          const detailData = await detailResponse.json();
          const syncProduct = detailData.result.sync_product;
          const syncVariants = detailData.result.sync_variants || [];

          return {
            id: syncProduct.id,
            name: syncProduct.name,
            thumbnail_url: syncProduct.thumbnail_url,
            variants: syncVariants.map((variant: any) => ({
              id: variant.id,
              name: variant.name,
              sku: variant.sku,
              retail_price: variant.retail_price,
              currency: variant.currency,
              // Extract size and color from variant name or product details
              files: variant.files?.map((file: any) => ({
                preview_url: file.preview_url,
                type: file.type,
              })),
            })),
          };
        } catch (error) {
          console.error(`Error fetching product ${product.id}:`, error);
          return {
            id: product.id,
            name: product.name,
            error: 'Failed to fetch details',
          };
        }
      })
    );

    return NextResponse.json({
      success: true,
      total: detailedProducts.length,
      products: detailedProducts,
      instructions: {
        message: 'Use this data to update lib/printful-mapping.ts',
        steps: [
          '1. Find your product by name',
          '2. Note the product ID and variant IDs',
          '3. Map your website product IDs to these Printful IDs',
          '4. Update PRODUCT_VARIANT_MAP in lib/printful-mapping.ts',
        ],
      },
    });

  } catch (error) {
    console.error('Error fetching Printful products:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch Printful products',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

