"use client";

import { useState } from "react";
import Image from "next/image";
import CheckoutForm from "./CheckoutForm";
import type { Product } from "@/lib/products";
import { athletes } from "@/lib/athletes";

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [showCheckout, setShowCheckout] = useState(false);

  // Auto-generate sizes from variant IDs if sizes array is empty
  const availableSizes = product.sizes && product.sizes.length > 0 
    ? product.sizes 
    : product.variantIdsBySize 
      ? Object.keys(product.variantIdsBySize)
      : [];

  // Set default size for products without sizes
  const effectiveSelectedSize = availableSizes.length > 0 
    ? selectedSize 
    : 'One Size'; // Default for products without size options

  // Find the associated athlete
  const athlete = product.athleteSlug 
    ? athletes.find(a => a.slug === product.athleteSlug)
    : product.athleteName 
    ? athletes.find(a => a.name === product.athleteName)
    : null;

  const handleCheckout = () => {
    // Only require size selection if the product has sizes
    if (availableSizes.length > 0 && !selectedSize) {
      alert('Please select a size before checkout');
      return;
    }
    if (selectedQuantity < 1) {
      alert('Please select a valid quantity');
      return;
    }
    setShowCheckout(true);
  };

  return (
    <>
      <main className="min-h-screen bg-white dark:bg-black">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-red-600 via-red-700 to-black text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-black mb-3">{product.name}</h1>
            <p className="text-gray-100/90 max-w-2xl mx-auto">
              Premium athletic wear designed for champions. Show your support with style.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-red-400 to-red-600 mx-auto mt-6 rounded-full"></div>
          </div>
        </section>

        {/* Product Details */}
        <section className="py-20 bg-white dark:bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              {/* Product Images */}
              <div className="space-y-6">
                {product.images && product.images.length > 0 ? (
                  <div className="relative">
                    {/* Main Image Display */}
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-800">
                      <Image
                        src={product.images[0]}
                        alt={`${product.name} - Main Image`}
                        fill
                        className="object-cover main-product-image"
                        unoptimized
                      />
                    </div>
                    
                    {/* Thumbnail Navigation */}
                    {product.images.length > 1 && (
                      <div className="mt-4">
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          {product.images.map((image, index) => (
                            <button
                              key={index}
                              className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-600 hover:border-red-500 transition-colors"
                              onClick={() => {
                                // Simple image switching - could be enhanced with state management
                                const mainImg = document.querySelector('.main-product-image') as HTMLImageElement;
                                if (mainImg) {
                                  mainImg.src = image;
                                }
                              }}
                            >
                              <Image
                                src={image}
                                alt={`${product.name} - Thumbnail ${index + 1}`}
                                width={80}
                                height={80}
                                className="object-cover w-full h-full"
                                unoptimized
                              />
                            </button>
                          ))}
                        </div>
                        <div className="text-center mt-2">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {product.images.length} image{product.images.length > 1 ? 's' : ''} available
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-2xl flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400">No image available</span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-red-600 text-white text-sm font-semibold rounded-full">
                      ${product.price}
                    </span>
                    {product.categories && product.categories.length > 0 && (
                      <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-full">
                        {product.categories[0]}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                    Premium athletic wear designed for champions. Show your support with style and comfort.
                  </p>
                </div>

                {/* Size Selection - Updated to use dropdown and quantity input */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Select Size & Quantity</h3>
                  
                  {availableSizes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Size Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Size *
                        </label>
                        <select
                          value={selectedSize}
                          onChange={(e) => setSelectedSize(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          required
                        >
                          <option value="">Select a size</option>
                          {availableSizes.map((size) => {
                            const inventory = product.inventoryBySize?.[size] || 0;
                            const isSoldOut = inventory === 0;
                            return (
                              <option key={size} value={size} disabled={isSoldOut}>
                                {size} {isSoldOut ? '(Sold Out)' : ''}
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      {/* Quantity Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Quantity *
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={selectedQuantity}
                          onChange={(e) => setSelectedQuantity(parseInt(e.target.value) || 1)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          required
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* No sizes available */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Size
                        </label>
                        <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                          One Size Fits All
                        </div>
                      </div>

                      {/* Quantity Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Quantity *
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={selectedQuantity}
                          onChange={(e) => setSelectedQuantity(parseInt(e.target.value) || 1)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {selectedSize && product.sizes && product.sizes.length > 0 && (
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Selected: <span className="font-semibold">{selectedSize}</span> • 
                        Quantity: <span className="font-semibold">{selectedQuantity}</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Color Selection - Disabled until colors are added to Product type */}
                {/* {product.colors && product.colors.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Colors Available</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`px-4 py-2 rounded-lg border transition-colors ${
                            selectedColor === color
                              ? 'border-red-600 bg-red-600 text-white'
                              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:border-red-600'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )} */}

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  className="w-full bg-red-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl"
                >
                  Checkout with Printful
                </button>

                {/* Player Card */}
                {athlete && (
                  <div className="relative bg-black rounded-3xl shadow-2xl overflow-hidden group hover:shadow-red-500/20 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 max-w-xl">
                    <div className="absolute inset-0 rounded-3xl pointer-events-none ring-1 ring-white/10" />
                    <div className="p-6 flex items-center gap-5">
                      <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-red-500/40 flex-shrink-0 relative">
                        <Image
                          src={athlete.image}
                          alt={athlete.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xl font-bold text-white mb-1 truncate">{athlete.name}</h4>
                        <p className="text-red-400 font-semibold text-sm mb-2">{athlete.position} • {athlete.school}</p>
                        <p className="text-gray-300 text-sm line-clamp-2">{athlete.bio}</p>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                )}
              </div>
            </div>

            {/* Product Details Accordion */}
            <div className="mt-16 max-w-4xl">
              <div className="space-y-4">
                <details className="group border border-gray-200 dark:border-neutral-700 rounded-xl">
                  <summary className="px-5 py-4 cursor-pointer flex justify-between items-center text-lg text-gray-900 dark:text-white font-semibold">
                    Product Details
                    <span className="text-gray-500 group-open:rotate-180 transition-transform">⌄</span>
                  </summary>
                  <div className="px-5 pb-5 text-gray-700 dark:text-gray-300">
                    <p>Premium athletic wear designed for champions. Show your support with style and comfort.</p>
                    {product.categories && (
                      <div className="mt-4">
                        <strong>Categories:</strong> {product.categories.join(', ')}
                      </div>
                    )}
                  </div>
                </details>
                
                <details className="group border border-gray-200 dark:border-neutral-700 rounded-xl">
                  <summary className="px-5 py-4 cursor-pointer flex justify-between items-center text-lg text-gray-900 dark:text-white font-semibold">
                    Sizing & Care
                    <span className="text-gray-500 group-open:rotate-180 transition-transform">⌄</span>
                  </summary>
                  <div className="px-5 pb-5 text-gray-700 dark:text-gray-300">
                    Most apparel fits true-to-size. Wash cold and tumble dry low to preserve print quality.
                  </div>
                </details>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Checkout Modal */}
      {showCheckout && (
        <CheckoutForm
          product={{
            id: product.id,
            name: product.name,
            price: product.price.toString(),
            sizes: availableSizes,
            colors: [], // Disabled until colors are added to Product type
            variantIdsBySize: product.variantIdsBySize || {},
            printfulVariantId: product.printfulVariantId
          }}
          selectedSize={effectiveSelectedSize}
          selectedColor={selectedColor}
          selectedQuantity={selectedQuantity}
          onClose={() => setShowCheckout(false)}
        />
      )}
    </>
  );
}
