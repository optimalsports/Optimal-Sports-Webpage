import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('=== TESTING PRINTFUL API KEY BASIC FUNCTIONALITY ===');
    
    const results = [];
    
    // Test 1: Basic API key test with /stores endpoint
    try {
      console.log('Testing /stores endpoint...');
      const storesResponse = await fetch('https://api.printful.com/stores', {
        headers: {
          'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });
      
      const storesData = await storesResponse.json();
      results.push({
        test: 'stores endpoint',
        status: storesResponse.status,
        success: storesResponse.ok,
        data: storesData
      });
      
      console.log('Stores endpoint result:', storesResponse.status, storesData);
    } catch (error) {
      results.push({
        test: 'stores endpoint',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
    
    // Test 2: Try /products endpoint (all products, no store filter)
    try {
      console.log('Testing /products endpoint...');
      const productsResponse = await fetch('https://api.printful.com/products', {
        headers: {
          'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });
      
      const productsData = await productsResponse.json();
      results.push({
        test: 'products endpoint (all)',
        status: productsResponse.status,
        success: productsResponse.ok,
        data: productsData
      });
      
      console.log('Products endpoint result:', productsResponse.status, productsData);
    } catch (error) {
      results.push({
        test: 'products endpoint (all)',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
    
    // Test 3: Try a specific store with different endpoint format
    try {
      console.log('Testing store 16862505 with different approach...');
      const storeResponse = await fetch('https://api.printful.com/stores/16862505', {
        headers: {
          'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });
      
      const storeData = await storeResponse.json();
      results.push({
        test: 'store 16862505 info',
        status: storeResponse.status,
        success: storeResponse.ok,
        data: storeData
      });
      
      console.log('Store info result:', storeResponse.status, storeData);
    } catch (error) {
      results.push({
        test: 'store 16862505 info',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Basic Printful API tests completed',
      results: results,
      apiKey: process.env.PRINTFUL_API_KEY ? 'Set' : 'Not set',
      instructions: {
        step1: 'Check if any tests show success: true',
        step2: 'Look for 401 errors (invalid API key)',
        step3: 'Look for 403 errors (insufficient permissions)',
        step4: 'Check the data field for actual content'
      }
    });
    
  } catch (error) {
    console.error('Basic test error:', error);
    return NextResponse.json({
      error: 'Basic test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
