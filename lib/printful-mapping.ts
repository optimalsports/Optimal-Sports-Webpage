/**
 * Printful Product Variant Mapping
 * 
 * This file maps your website's products to Printful's variant IDs.
 * Each size/color combination of a product has a unique Printful variant ID.
 * 
 * To find variant IDs:
 * 1. Go to Printful Dashboard
 * 2. Navigate to your product
 * 3. Click on a variant to see its ID in the URL or API response
 */

export interface PrintfulVariantMapping {
  productId: string; // Your internal product ID
  printfulSyncProductId: number; // Printful sync product ID
  variants: {
    size: string;
    color: string;
    printfulVariantId: number;
    sku?: string;
  }[];
}

/**
 * Example mapping structure - Update this with your actual products
 * 
 * To get your Printful variant IDs, you can:
 * 1. Use the Printful API endpoint: GET /sync/products
 * 2. Or check the Printful dashboard
 */
export const PRODUCT_VARIANT_MAP: PrintfulVariantMapping[] = [
  {
    productId: 'athlete-tshirt-001',
    printfulSyncProductId: 123456, // Your Printful sync product ID
    variants: [
      { size: 'S', color: 'Black', printfulVariantId: 4011 },
      { size: 'M', color: 'Black', printfulVariantId: 4012 },
      { size: 'L', color: 'Black', printfulVariantId: 4013 },
      { size: 'XL', color: 'Black', printfulVariantId: 4014 },
      { size: 'S', color: 'White', printfulVariantId: 4017 },
      { size: 'M', color: 'White', printfulVariantId: 4018 },
      { size: 'L', color: 'White', printfulVariantId: 4019 },
      { size: 'XL', color: 'White', printfulVariantId: 4020 },
    ],
  },
  // Add more product mappings here
];

/**
 * Get Printful variant ID for a specific product, size, and color
 */
export function getPrintfulVariantId(
  productId: string,
  size: string,
  color: string = 'Black'
): number | null {
  const product = PRODUCT_VARIANT_MAP.find(p => p.productId === productId);
  
  if (!product) {
    console.warn(`No Printful mapping found for product: ${productId}`);
    return null;
  }

  const variant = product.variants.find(
    v => v.size === size && v.color === color
  );

  if (!variant) {
    console.warn(`No variant found for ${productId} - Size: ${size}, Color: ${color}`);
    return null;
  }

  return variant.printfulVariantId;
}

/**
 * Get all available sizes for a product
 */
export function getAvailableSizes(productId: string): string[] {
  const product = PRODUCT_VARIANT_MAP.find(p => p.productId === productId);
  
  if (!product) {
    return [];
  }

  // Get unique sizes
  const sizes = [...new Set(product.variants.map(v => v.size))];
  return sizes;
}

/**
 * Get all available colors for a product
 */
export function getAvailableColors(productId: string): string[] {
  const product = PRODUCT_VARIANT_MAP.find(p => p.productId === productId);
  
  if (!product) {
    return [];
  }

  // Get unique colors
  const colors = [...new Set(product.variants.map(v => v.color))];
  return colors;
}

/**
 * Validate if a specific variant exists
 */
export function isVariantAvailable(
  productId: string,
  size: string,
  color: string
): boolean {
  return getPrintfulVariantId(productId, size, color) !== null;
}

/**
 * Fetch and log all Printful sync products (for setup/debugging)
 * Call this from an API route to see your available Printful products
 */
export async function fetchPrintfulProducts() {
  const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;
  
  if (!PRINTFUL_API_KEY) {
    throw new Error('PRINTFUL_API_KEY not configured');
  }

  const response = await fetch('https://api.printful.com/sync/products', {
    headers: {
      'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Printful API error: ${response.status}`);
  }

  const data = await response.json();
  return data.result;
}

/**
 * Helper to format cart items with Printful variant IDs
 */
export function enrichCartItemsWithPrintfulIds(items: any[]) {
  return items.map(item => {
    const variantId = getPrintfulVariantId(
      item.productId || item.id,
      item.size,
      item.color || 'Black'
    );

    if (!variantId) {
      console.error(`Missing Printful variant ID for item:`, item);
    }

    return {
      ...item,
      printfulVariantId: variantId,
    };
  });
}

