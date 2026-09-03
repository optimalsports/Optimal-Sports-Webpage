"use client";

import { useState, useEffect } from 'react';
import StripePayment from './StripePayment';

interface CheckoutFormProps {
  product: {
    id: string;
    name: string;
    price: string;
    sizes: string[];
    colors: string[];
    variantIdsBySize?: Record<string, string>;
    printfulVariantId?: string;
  };
  selectedSize: string;
  selectedColor: string;
  selectedQuantity: number;
  onClose: () => void;
}

export default function CheckoutForm({ product, selectedSize, selectedColor, selectedQuantity, onClose }: CheckoutFormProps) {
  const [quantity, setQuantity] = useState(selectedQuantity);

  // Calculate amount once and store it
  const productPrice = parseFloat(product.price);
  const calculatedAmount = productPrice * quantity;
  
  useEffect(() => {
    console.log('✨ CheckoutForm calculated amount (before passing to StripePayment):', { 
      productPrice: product.price, 
      parsedPrice: productPrice, 
      quantity, 
      calculatedAmount 
    });
  }, [product.price, quantity, productPrice, calculatedAmount]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    country: 'US',
    zip: '',
    phone: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentSuccess = async (paymentIntent: any) => {
    console.log('🎉 Payment success handler called!', paymentIntent);
    
    // Now call our checkout API to create the Printful order
    try {
      console.log('🔄 Calling /api/checkout after successful payment...');
      
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product,
          selectedSize,
          selectedColor,
          quantity,
          customerInfo,
          retailPrice: product.price,
          paymentIntentId: paymentIntent.id
        }),
      });

      const data = await response.json();
      console.log('🔍 Checkout API response:', data);

      if (response.ok) {
        console.log('✅ Printful order created successfully!');
        setIsSubmitting(false);
        setSuccess(true);
      } else {
        console.error('❌ Printful order creation failed:', data.error);
        setError(data.error || 'Order failed. Please contact support.');
      }
    } catch (err) {
      console.error('❌ Network error calling checkout API:', err);
      setError('Order processing failed. Please contact support.');
    }
    
    console.log('Payment successful:', paymentIntent.id);
    
    // Store payment intent ID for order tracking
    localStorage.setItem('lastPaymentIntent', paymentIntent.id);
  };

  const handlePaymentError = (error: any) => {
    console.log('❌ Payment error handler called!', error);
    // Payment failed - no more alert needed
    setError(error);
    setIsSubmitting(false);
  };


  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product,
          selectedSize,
          selectedColor,
          quantity,
          customerInfo,
          retailPrice: product.price,
        }),
      });

      const data = await response.json();
      
      console.log('🔍 Checkout API response:', data);

      if (response.ok) {
        setSuccess(true);
        // You might want to redirect to a success page or show a confirmation
        setTimeout(() => {
          onClose();
        }, 3000);
      } else {
        setError(data.error || 'Order failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  console.log('🔍 CheckoutForm render - success state:', success, 'isSubmitting:', isSubmitting);
  
  if (success) {
    console.log('🎉 Rendering success message!');
    return (
      <div className="fixed inset-0 bg-gray-100 dark:bg-neutral-900 z-50 overflow-y-auto">
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Order Placed Successfully!</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Your payment was successful! Your order is being processed and will be sent to Printful for fulfillment. You&apos;ll receive a confirmation email shortly.
            </p>
            <button
              onClick={() => {
                console.log('🎉 User clicked close button');
                onClose();
              }}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
            >
              Continue Shopping
            </button>
          </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-100 dark:bg-neutral-900 z-50 overflow-y-auto">
      <div className="min-h-screen">
        {/* Header */}
        <div className="bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">OS</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">Optimal Sports</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Management</p>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-neutral-700">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Secure Checkout</h2>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>SSL Secured</span>
                </div>
              </div>
            </div>
            <div className="p-6">

          {/* Order Summary */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Product:</span>
                <span className="text-gray-900 dark:text-white">{product.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Size:</span>
                <span className="text-gray-900 dark:text-white">{selectedSize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Color:</span>
                <span className="text-gray-900 dark:text-white">{selectedColor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Quantity:</span>
                <span className="text-gray-900 dark:text-white">{quantity}</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-2">
                <span className="text-gray-900 dark:text-white">Total:</span>
                <span className="text-gray-900 dark:text-white">${calculatedAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Customer Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={customerInfo.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={customerInfo.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Address Line 1 *
              </label>
              <input
                type="text"
                name="address1"
                value={customerInfo.address1}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Address Line 2
              </label>
              <input
                type="text"
                name="address2"
                value={customerInfo.address2}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-gray-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={customerInfo.city}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  value={customerInfo.state}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-gray-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  name="zip"
                  value={customerInfo.zip}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Country *
                </label>
                <select
                  name="country"
                  value={customerInfo.country}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-gray-900"
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="GB">United Kingdom</option>
                  <option value="AU">Australia</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={customerInfo.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quantity
              </label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-gray-900"
              >
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>

            {!showPayment ? (
              <button
                type="button"
                onClick={() => {
                  console.log('🚀 Continue to Payment clicked');
                  setShowPayment(true);
                }}
                disabled={isSubmitting}
                className="w-full bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Processing Order...' : 'Continue to Payment'}
              </button>
            ) : (
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Secure Payment</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Complete your order with secure payment processing
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-4">🔍 StripePayment component is rendering...</p>
                  <StripePayment
                    amount={calculatedAmount}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                    disabled={isSubmitting}
                    orderData={{
                      items: [{
                        productId: product.id,
                        name: product.name,
                        size: selectedSize,
                        color: selectedColor,
                        quantity: quantity,
                        price: parseFloat(product.price),
                      }],
                      customerInfo: customerInfo,
                      productDetails: {
                        id: product.id,
                        name: product.name,
                        price: product.price,
                      }
                    }}
                  />
                </div>
              </div>
            )}
          </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
