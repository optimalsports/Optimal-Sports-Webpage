import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('=== HELP: HOW TO CREATE PRODUCTS IN PRINTFUL ===');
    
    return NextResponse.json({
      success: true,
      message: 'Here\'s how to get your products working with Printful:',
      steps: [
        {
          step: 1,
          title: 'Go to Printful Dashboard',
          description: 'Visit https://www.printful.com/dashboard',
          action: 'Log into your Printful account'
        },
        {
          step: 2,
          title: 'Create Your Products',
          description: 'Create your hoodie and other products in Printful',
          action: 'Use the "Add Product" button in your Printful dashboard'
        },
        {
          step: 3,
          title: 'Get Variant IDs',
          description: 'After creating products, you\'ll get variant IDs for each size/color',
          action: 'Copy the variant IDs from the product details in Printful'
        },
        {
          step: 4,
          title: 'Update Admin Dashboard',
          description: 'Add the variant IDs to your admin dashboard',
          action: 'Paste the variant IDs in the "Printful Variant IDs by Size" section'
        },
        {
          step: 5,
          title: 'Test Checkout',
          description: 'Try placing an order to see if it goes to Printful',
          action: 'Use the checkout form on your website'
        }
      ],
      currentStatus: {
        localProducts: 3,
        printfulProducts: 0,
        issue: 'Your products exist locally but not in Printful',
        solution: 'Create products in Printful dashboard first'
      },
      nextSteps: [
        'Go to Printful dashboard',
        'Create your hoodie product',
        'Get the variant IDs',
        'Update your admin dashboard',
        'Test the checkout'
      ]
    });
    
  } catch (error) {
    console.error('Help endpoint error:', error);
    return NextResponse.json({
      error: 'Help endpoint failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
