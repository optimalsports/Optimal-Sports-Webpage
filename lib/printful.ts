// Printful API integration
const PRINTFUL_API_BASE = 'https://api.printful.com';
const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY || 'oVW8x5IDNQtj2NERKoYoCZFGbEy6zVrlNPheDtoy';

export interface PrintfulProduct {
  id: number;
  name: string;
  thumbnail_url: string;
  variants: PrintfulVariant[];
}

export interface PrintfulVariant {
  id: number;
  sku: string;
  price: string;
  size?: string;
  color?: string;
  availability_regions: Record<string, string>;
}

export interface PrintfulOrder {
  external_id: string;
  shipping: string;
  recipient: {
    name: string;
    address1: string;
    address2?: string;
    city: string;
    state_code: string;
    country_code: string;
    zip: string;
    phone?: string;
    email: string;
  };
  items: Array<{
    variant_id: number;
    quantity: number;
    retail_price?: string;
  }>;
}

export interface PrintfulOrderResponse {
  id: number;
  external_id: string;
  status: string;
  shipping: string;
  created: number;
  updated: number;
  recipient: any;
  items: any[];
  costs: any;
  retail_costs: any;
  shipments: any[];
  gift: any;
  packing_slip: any;
}

class PrintfulService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${PRINTFUL_API_BASE}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Printful API error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  // Get all products from Printful
  async getProducts(storeId?: number): Promise<PrintfulProduct[]> {
    try {
      const endpoint = storeId ? `/stores/${storeId}/products` : '/products';
      console.log(`PrintfulService.getProducts: Fetching from endpoint: ${endpoint}`);
      const response = await this.makeRequest(endpoint);
      console.log(`PrintfulService.getProducts: Response received, result length: ${response.result?.length || 0}`);
      return response.result || [];
    } catch (error) {
      console.error('Failed to fetch Printful products:', error);
      console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
      return [];
    }
  }

  // Get product variants
  async getProductVariants(productId: number): Promise<PrintfulVariant[]> {
    try {
      const response = await this.makeRequest(`/products/${productId}`);
      return response.result?.variants || [];
    } catch (error) {
      console.error(`Failed to fetch variants for product ${productId}:`, error);
      return [];
    }
  }

  // Create an order
  async createOrder(order: PrintfulOrder, storeId?: number): Promise<PrintfulOrderResponse> {
    try {
      // Use store-specific endpoint if storeId is provided, otherwise use default
      const endpoint = storeId ? `/stores/${storeId}/orders` : '/orders';
      console.log(`Creating Printful order with endpoint: ${endpoint}`);
      
      const response = await this.makeRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(order),
      });
      return response.result;
    } catch (error) {
      console.error('Failed to create Printful order:', error);
      throw error;
    }
  }

  // Get order status
  async getOrder(orderId: string): Promise<PrintfulOrderResponse> {
    try {
      const response = await this.makeRequest(`/orders/${orderId}`);
      return response.result;
    } catch (error) {
      console.error(`Failed to fetch order ${orderId}:`, error);
      throw error;
    }
  }

  // Get shipping rates
  async getShippingRates(recipient: any, items: any[]): Promise<any[]> {
    try {
      const response = await this.makeRequest('/shipping/rates', {
        method: 'POST',
        body: JSON.stringify({
          recipient,
          items,
        }),
      });
      return response.result || [];
    } catch (error) {
      console.error('Failed to fetch shipping rates:', error);
      return [];
    }
  }
}

// Export singleton instance
export const printful = new PrintfulService(PRINTFUL_API_KEY);

// Helper function to format our cart items for Printful
export function formatCartForPrintful(items: any[], shippingInfo: any): PrintfulOrder {
  // Split name into first and last name
  const nameParts = shippingInfo.name.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';
  
  return {
    external_id: `optimal-${Date.now()}`,
    shipping: 'STANDARD', // Default shipping method
    recipient: {
      name: `${firstName} ${lastName}`,
      address1: shippingInfo.address1,
      address2: shippingInfo.address2 || '',
      city: shippingInfo.city,
      state_code: shippingInfo.state,
      country_code: shippingInfo.country || 'US',
      zip: shippingInfo.zip,
      phone: shippingInfo.phone || '',
      email: shippingInfo.email,
    },
    items: items.map(item => ({
      variant_id: parseInt(item.variantId) || parseInt(item.printfulVariantId) || 1, // Use variant ID from item
      quantity: item.quantity,
      retail_price: item.price.toString(),
    })),
  };
}