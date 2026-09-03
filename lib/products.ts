export type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  images?: string[]; // optional gallery
  athleteSlug: string;
  athleteName: string;
  school: string;
  categories?: string[]; // e.g., ["Tees","Hoodies"]
  sizes?: string[]; // e.g., ["S","M","L","XL"]
  inventoryBySize?: Record<string, number>; // e.g., { S: 10, M: 5 }
  active: boolean;
  createdAt: number;
  updatedAt: number;
  externalUrl?: string; // optional purchase link
  printfulVariantId?: string; // Printful variant ID for order fulfillment
  variantIdsBySize?: Record<string, string>; // Printful variant IDs by size, e.g., { S: "12345", M: "67890" }
};

// Use same-origin by default
const API_BASE = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';

export async function fetchProducts(params?: { athleteSlug?: string; school?: string; name?: string; category?: string; size?: string; page?: number; limit?: number }): Promise<Product[]> {
  const qs = new URLSearchParams();
  if (params?.athleteSlug) qs.set('athlete', params.athleteSlug);
  if (params?.school) qs.set('school', params.school);
  if (params?.name) qs.set('name', params.name);
  if (params?.category) qs.set('category', params.category);
  if (params?.size) qs.set('size', params.size);
  if (params?.page) qs.set('page', String(params.page));
  if (params?.limit) qs.set('limit', String(params.limit));
  const url = `${API_BASE}/api/products${qs.toString() ? `?${qs.toString()}` : ''}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

export async function createProduct(input: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product | null> {
  const res = await fetch(`${API_BASE}/api/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) return null;
  return res.json();
}

export async function updateProduct(id: string, input: Partial<Product>): Promise<Product | null> {
  const res = await fetch(`${API_BASE}/api/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) return null;
  return res.json();
}

export async function deleteProduct(id: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/api/products/${id}`, { method: 'DELETE' });
  return res.ok;
}


