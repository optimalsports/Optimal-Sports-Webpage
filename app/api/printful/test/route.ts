import { NextRequest, NextResponse } from 'next/server';
import { printful } from '@/lib/printful';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing Printful connection...');
    
    // Test basic connection by getting products
    const products = await printful.getProducts();
    
    console.log('Printful products:', products.length);
    
    return NextResponse.json({
      success: true,
      message: 'Printful connection successful',
      productCount: products.length,
      products: products.slice(0, 3).map(p => ({
        id: p.id,
        name: p.name,
        variantCount: p.variants?.length || 0
      }))
    });
    
  } catch (error) {
    console.error('Printful test error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Printful connection failed'
    }, { status: 500 });
  }
}
