import { notFound } from 'next/navigation';
import type { Product } from '@/lib/products';
import { kv } from '@/lib/redis';
import ProductDetailClient from '@/components/ProductDetailClient';
export const dynamic = 'force-dynamic';

async function getProductServer(id: string): Promise<Product | null> {
  // Try individual record first
  try {
    const byId = await kv.get(`product:${id}`);
    if (byId) return byId;
  } catch {}
  // Fallback to list
  try {
    const all = (await kv.get('products:all')) || [];
    const found = all.find((p: any) => p.id === id) || null;
    if (found) return found;
  } catch {}
  // Final fallback: query list API (works even when KV unavailable due to in-memory fallback there)
  try {
    const res = await fetch('/api/products', { cache: 'no-store' });
    if (res.ok) {
      const list = await res.json() as Product[];
      const found = list.find(p => p.id === id) || null;
      if (found) return found;
    }
  } catch {}
  
  // Seed data fallback for development
  const seeded: Record<string, Product> = {
    'man-tee': {
      id: 'man-tee', name: 'Optimal Man Tee', price: 49,
      imageUrl: '/catalog/mens-classic-tee-black-front-6616e04f63957_540x.webp',
      images: ['/catalog/mens-classic-tee-black-front-6616e04f63957_540x.webp','/catalog/mens-classic-tee-black-left-6616e04f64dee_540x.webp','/catalog/mens-classic-tee-black-right-6616e04f6534e_540x.webp','/catalog/mens-classic-tee-black-back-62b588dcdd3e6_540x.webp'],
      athleteSlug: '', athleteName: '', school: '', categories: ['Tees'], sizes: ['S','M','L','XL'], active: true, createdAt: Date.now(), updatedAt: Date.now()
    },
    'man-hoodie': {
      id: 'man-hoodie', name: 'Optimal Man Hoodie', price: 79,
      imageUrl: '/catalog/unisex-premium-hoodie-black-front-62b584b06d8bc_540x.webp',
      images: ['/catalog/unisex-premium-hoodie-black-front-62b584b06d8bc_540x.webp'],
      athleteSlug: '', athleteName: '', school: '', categories: ['Hoodies'], sizes: ['S','M','L','XL'], active: true, createdAt: Date.now(), updatedAt: Date.now()
    },
    'flag-tee': {
      id: 'flag-tee', name: 'Optimal Flag Tee', price: 49,
      imageUrl: '/catalog/mens-classic-tee-black-front-62b588dcdd26d_540x.webp',
      images: ['/catalog/mens-classic-tee-black-front-62b588dcdd26d_540x.webp'],
      athleteSlug: '', athleteName: '', school: '', categories: ['Tees'], sizes: ['S','M','L','XL'], active: true, createdAt: Date.now(), updatedAt: Date.now()
    }
  };
  return seeded[id] || null;
}

export default async function ProductDetail({ params }: { params: { id: string } }) {
  const product = await getProductServer(params.id);
  if (!product) return notFound();

  return <ProductDetailClient product={product} />;
}