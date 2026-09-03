'use client';

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface StripePaymentProps {
  amount: number;
  currency?: string;
  onSuccess: (paymentIntent: any) => void;
  onError: (error: any) => void;
  disabled?: boolean;
  orderData?: any; // Order data to store in payment intent metadata
}

const CheckoutForm: React.FC<StripePaymentProps> = ({ 
  amount, 
  currency = 'usd', 
  onSuccess, 
  onError,
  disabled = false,
  orderData 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log('🚀 Payment form submitted');

    if (!stripe || !elements) {
      console.log('❌ Stripe not ready');
      return;
    }

    setProcessing(true);
    console.log('🔄 Processing payment...');

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      console.log('❌ Card element not found');
      onError('Card element not found');
      setProcessing(false);
      return;
    }

    // Create payment intent
    try {
      console.log('📡 Creating payment intent...');
      console.log('💰 StripePayment amount debug:', { amount, amountInCents: Math.round(amount * 100) });
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to cents
          currency: currency,
          orderData: orderData, // Pass order data for webhook processing
        }),
      });

      console.log('📡 Payment intent response:', response.status);
      const { clientSecret, paymentIntentId, error: serverError } = await response.json();
      console.log('📡 Payment intent result:', { clientSecret: !!clientSecret, paymentIntentId, serverError });

      if (serverError) {
        console.log('❌ Server error:', serverError);
        onError(serverError);
        setProcessing(false);
        return;
      }

      // Confirm payment with Stripe
      console.log('💳 Confirming payment with Stripe...');
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        }
      });
      console.log('💳 Stripe confirmation result:', { error: !!error, paymentIntent: !!paymentIntent, status: paymentIntent?.status });

      if (error) {
        console.log('❌ Stripe payment error:', error);
        onError(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        console.log('✅ Stripe payment succeeded:', paymentIntent);
        onSuccess(paymentIntent);
      } else {
        console.log('⚠️ Stripe payment not succeeded, status:', paymentIntent.status);
        onError('Payment was not completed successfully');
      }
    } catch (error) {
      onError('Payment failed. Please try again.');
    }

    setProcessing(false);
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#374151',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        '::placeholder': {
          color: '#9CA3AF',
        },
        padding: '12px',
      },
      invalid: {
        color: '#DC2626',
        iconColor: '#DC2626',
      },
      complete: {
        color: '#059669',
        iconColor: '#059669',
      },
    },
    hidePostalCode: false,
  };

  return (
    <div className="space-y-6">
      {/* Stripe Branding Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.274 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-3.927-.921-5.251-1.612L6.033 21.83c1.235.5 3.747 1.15 6.131 1.15 2.572 0 4.649-.654 6.133-1.872 1.544-1.275 2.347-3.12 2.347-5.346 0-3.219-1.54-4.039-6.668-5.612z"/>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-blue-900">Secure Payment by Stripe</h3>
              <p className="text-sm text-blue-700">Your payment information is encrypted and processed securely</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-900">${amount.toFixed(2)}</div>
            <div className="text-sm text-blue-600">Total Amount</div>
          </div>
        </div>
      </div>

      {/* Payment Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Card Information *
            </label>
            <div className="relative">
              <div className="border-2 border-gray-300 dark:border-gray-600 rounded-xl p-4 bg-white dark:bg-gray-800 shadow-sm transition-all duration-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 hover:border-gray-400 dark:hover:border-gray-500">
                <CardElement options={cardElementOptions} />
              </div>
              <div className="absolute top-2 right-2">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <span>Secure</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
              </svg>
              Your card details are encrypted and secure
            </p>
          </div>
        </div>
        
        {/* Security Features */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>SSL Encrypted</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>PCI Compliant</span>
            </div>
          </div>
          <div className="text-gray-400">
            Powered by Stripe
          </div>
        </div>
        
        <button
          type="submit"
          disabled={!stripe || processing || disabled}
          className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none"
        >
          <div className="flex items-center justify-center gap-2">
            {processing ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing Payment...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Complete Secure Payment - ${amount.toFixed(2)}
              </>
            )}
          </div>
        </button>
      </form>

      {/* Trust Indicators */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>256-bit SSL</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>PCI DSS Compliant</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Instant Processing</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const StripePayment: React.FC<StripePaymentProps> = (props) => {
  // Check if Stripe keys are configured
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Stripe Not Configured
            </h3>
            <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
              <p>Payment processing is not yet set up. Please contact support to complete your order.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm {...props} />
    </Elements>
  );
};

export default StripePayment;
