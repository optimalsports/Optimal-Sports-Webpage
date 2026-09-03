import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@/lib/redis';
import { Product } from '@/lib/products';

const KEY_ALL = 'products:all';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const product = await kv.get(`product:${id}`);
    if (product) return NextResponse.json(product);
  } catch {}

  // Fallback: search in all products if individual record missing (or KV not available)
  try {
    const all = (await kv.get(KEY_ALL)) || [];
    const found = all.find((p: any) => p.id === id);
    if (found) return NextResponse.json(found);
  } catch {}

  // Final fallback: known seeded products
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
  if (seeded[id]) return NextResponse.json(seeded[id]);
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const input = await request.json();
  const all = (await kv.get(KEY_ALL)) || [];
  const idx = all.findIndex((p: any) => p.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const updated: Product = {
    ...all[idx],
    ...input,
    images: input.images ?? all[idx].images ?? (input.imageUrl ? [input.imageUrl] : all[idx].images),
    categories: input.categories ?? all[idx].categories,
    sizes: input.sizes ?? all[idx].sizes,
    inventoryBySize: input.inventoryBySize ?? all[idx].inventoryBySize,
    updatedAt: Date.now(),
  };
  all[idx] = updated;
  await kv.set(KEY_ALL, all);
  await kv.set(`product:${id}`, updated);
  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const all = (await kv.get(KEY_ALL)) || [];
  const next = all.filter((p: any) => p.id !== id);
  if (next.length === all.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  await kv.set(KEY_ALL, next);
  await kv.del(`product:${id}`);
  return NextResponse.json({ ok: true });
}


