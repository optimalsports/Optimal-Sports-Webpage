import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('=== COMPREHENSIVE PRINTFUL TEST ===');
    
    const results = {
      apiKey: process.env.PRINTFUL_API_KEY ? 'Set' : 'Not set',
      tests: [] as any[]
    };
    
    // Test 1: Basic stores endpoint
    try {
      console.log('Test 1: Basic stores endpoint');
      const storesResponse = await fetch('https://api.printful.com/stores', {
        headers: {
          'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });
      
      const storesData = await storesResponse.json();
      results.tests.push({
        name: 'Stores endpoint',
        status: storesResponse.status,
        success: storesResponse.ok,
        data: storesData
      });
    } catch (error) {
      results.tests.push({
        name: 'Stores endpoint',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
    
    // Test 2: All products endpoint
    try {
      console.log('Test 2: All products endpoint');
      const productsResponse = await fetch('https://api.printful.com/products', {
        headers: {
          'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });
      
      const productsData = await productsResponse.json();
      results.tests.push({
        name: 'All products endpoint',
        status: productsResponse.status,
        success: productsResponse.ok,
        productCount: productsData.result?.length || 0,
        sampleProducts: productsData.result?.slice(0, 3) || []
      });
    } catch (error) {
      results.tests.push({
        name: 'All products endpoint',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
    
    // Test 3: Try each store individually
    const storeIds = [16862505, 7957549, 8375620];
    
    for (const storeId of storeIds) {
      try {
        console.log(`Test 3: Store ${storeId} products`);
        const storeProductsResponse = await fetch(`https://api.printful.com/stores/${storeId}/products`, {
          headers: {
            'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
            'Content-Type': 'application/json',
          },
        });
        
        const storeProductsData = await storeProductsResponse.json();
        results.tests.push({
          name: `Store ${storeId} products`,
          status: storeProductsResponse.status,
          success: storeProductsResponse.ok,
          productCount: storeProductsData.result?.length || 0,
          error: storeProductsResponse.ok ? null : storeProductsData
        });
      } catch (error) {
        results.tests.push({
          name: `Store ${storeId} products`,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    // Test 4: Try a different approach - check if there are any custom products
    try {
      console.log('Test 4: Looking for custom products');
      const customProductsResponse = await fetch('https://api.printful.com/products?type=custom', {
        headers: {
          'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });
      
      const customProductsData = await customProductsResponse.json();
      results.tests.push({
        name: 'Custom products endpoint',
        status: customProductsResponse.status,
        success: customProductsResponse.ok,
        productCount: customProductsData.result?.length || 0,
        sampleProducts: customProductsData.result?.slice(0, 3) || []
      });
    } catch (error) {
      results.tests.push({
        name: 'Custom products endpoint',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Comprehensive test results:',
      results: results,
      instructions: {
        step1: 'Look for tests with success: true',
        step2: 'Check productCount > 0 for any test',
        step3: 'If all tests fail, there might be an API permission issue',
        step4: 'If some tests succeed, use the working endpoint'
      }
    });
    
  } catch (error) {
    console.error('Comprehensive test error:', error);
    return NextResponse.json({
      error: 'Comprehensive test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
