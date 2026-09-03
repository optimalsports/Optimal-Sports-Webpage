import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering to prevent build-time execution
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching raw Printful products for store 16862505...');
    
    // Get products directly from Printful API
    const response = await fetch('https://api.printful.com/stores/16862505/products', {
      headers: {
        'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Printful API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`Raw products count: ${data.result?.length || 0}`);
    
    // Return the raw data so you can see the variant IDs
    return NextResponse.json({
      success: true,
      rawData: data,
      products: data.result || [],
      totalProducts: data.result?.length || 0
    });
    
  } catch (error) {
    console.error('Error fetching raw products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch raw products', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
