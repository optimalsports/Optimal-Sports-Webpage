import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { Product } from '@/lib/products';

export async function GET(request: NextRequest) {
  try {
    // Get all products from KV
    const allProducts = (await kv.get('products:all')) as Product[] || [];
    
    // Return all products with their size information
    const productsWithSizes = allProducts.map((p: Product) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      sizes: p.sizes || [],
      hasSizes: (p.sizes || []).length > 0,
      hasMSize: (p.sizes || []).includes('M'),
      active: p.active
    }));
    
    return NextResponse.json({
      totalProducts: allProducts.length,
      products: productsWithSizes,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to get products',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
