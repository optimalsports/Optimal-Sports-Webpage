import { NextRequest, NextResponse } from 'next/server';
import { printful } from '@/lib/printful';

// Force dynamic rendering to prevent build-time execution
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching Printful stores...');
    
    // Get all stores from Printful
    const response = await fetch('https://api.printful.com/stores', {
      headers: {
        'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Printful API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Printful stores:', data);
    
    return NextResponse.json({
      success: true,
      stores: data.result || [],
      totalStores: data.result?.length || 0
    });
    
  } catch (error) {
    console.error('Error fetching Printful stores:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Printful stores' },
      { status: 500 }
    );
  }
}
