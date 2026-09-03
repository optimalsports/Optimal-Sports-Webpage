import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Check Stripe configuration
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    
    // Check Printful configuration
    const printfulApiKey = process.env.PRINTFUL_API_KEY;
    
    const config = {
      stripe: {
        configured: !!stripeSecretKey && !!stripePublishableKey,
        secretKey: stripeSecretKey ? `${stripeSecretKey.substring(0, 10)}...` : 'Not set',
        publishableKey: stripePublishableKey ? `${stripePublishableKey.substring(0, 10)}...` : 'Not set'
      },
      printful: {
        configured: !!printfulApiKey && printfulApiKey !== 'oVW8x5IDNQtj2NERKoYoCZFGbEy6zVrlNPheDtoy',
        apiKey: printfulApiKey ? `${printfulApiKey.substring(0, 10)}...` : 'Not set'
      }
    };
    
    return NextResponse.json({
      success: true,
      message: 'Configuration check complete',
      config,
      ready: config.stripe.configured && config.printful.configured,
      nextSteps: !config.stripe.configured ? 
        'Add Stripe API keys to environment variables' :
        !config.printful.configured ?
        'Configure Printful API key' :
        'All systems ready for payments!'
    });
    
  } catch (error) {
    console.error('Configuration check error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to check configuration'
    }, { status: 500 });
  }
}
