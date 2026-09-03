import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { Product } from '@/lib/products';

export async function GET(request: NextRequest) {
  try {
    // Get all products from KV
    const allProducts = (await kv.get('products:all')) as Product[] || [];
    const seededFlag = await kv.get('products:seeded');
    
    return NextResponse.json({
      totalProducts: allProducts.length,
      seededFlagExists: !!seededFlag,
      products: allProducts.map((p: Product) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        sizes: p.sizes,
        active: p.active,
        hasMSize: p.sizes?.includes('M') || false,
        noSizes: !p.sizes || p.sizes.length === 0
      })),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to get products',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}