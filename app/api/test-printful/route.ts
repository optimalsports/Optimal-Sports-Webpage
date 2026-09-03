import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;
    
    if (!PRINTFUL_API_KEY) {
      return NextResponse.json({ error: 'No API key found' }, { status: 500 });
    }

    // Test the API key with a simple call
    const response = await fetch('https://api.printful.com/stores', {
      headers: {
        'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ 
        error: 'API call failed', 
        status: response.status,
        details: errorText,
        apiKey: PRINTFUL_API_KEY.substring(0, 10) + '...' // Show first 10 chars for debugging
      }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json({ 
      success: true, 
      message: 'API key is working!',
      storesCount: data.result?.length || 0,
      apiKey: PRINTFUL_API_KEY.substring(0, 10) + '...'
    });

  } catch (error) {
    return NextResponse.json({ 
      error: 'Test failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
