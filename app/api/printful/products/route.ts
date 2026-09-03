import { NextRequest, NextResponse } from 'next/server';
import { printful } from '@/lib/printful';

export async function GET(request: NextRequest) {
  try {
    const products = await printful.getProducts();
    
    return NextResponse.json({
      success: true,
      products: products
    });

  } catch (error) {
    console.error('Failed to fetch Printful products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
