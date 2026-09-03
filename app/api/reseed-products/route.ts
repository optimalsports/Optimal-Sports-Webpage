import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { Product } from '@/lib/products';

export async function POST(request: NextRequest) {
  try {
    const now = Date.now();
    
    // Clear existing products
    await kv.del('products:all');
    await kv.del('products:seeded');
    
    // Seed fresh products
    const seededProducts: Product[] = [
      {
        id: 'man-tee',
        name: 'Optimal Man Tee',
        price: 49,
        imageUrl: '/catalog/mens-classic-tee-black-front-6616e04f63957_540x.webp',
        images: ['/catalog/mens-classic-tee-black-front-6616e04f63957_540x.webp','/catalog/mens-classic-tee-black-left-6616e04f64dee_540x.webp','/catalog/mens-classic-tee-black-right-6616e04f6534e_540x.webp','/catalog/mens-classic-tee-black-back-62b588dcdd3e6_540x.webp'],
        athleteSlug: 'christian-pierce',
        athleteName: 'Christian Pierce',
        school: 'Arizona',
        categories: ['Tees'],
        sizes: ['S','M','L','XL'],
        inventoryBySize: { S: 10, M: 10, L: 10, XL: 10 },
        active: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'man-hoodie',
        name: 'Optimal Man Hoodie',
        price: 79,
        imageUrl: '/catalog/unisex-premium-hoodie-black-front-62b584b06d8bc_540x.webp',
        images: ['/catalog/unisex-premium-hoodie-black-front-62b584b06d8bc_540x.webp'],
        athleteSlug: 'christian-pierce',
        athleteName: 'Christian Pierce',
        school: 'USC',
        categories: ['Hoodies'],
        sizes: ['S','M','L','XL'],
        inventoryBySize: { S: 8, M: 12, L: 10, XL: 6 },
        active: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'flag-tee',
        name: 'Optimal Flag Tee',
        price: 49,
        imageUrl: '/catalog/mens-classic-tee-black-front-62b588dcdd26d_540x.webp',
        images: ['/catalog/mens-classic-tee-black-front-62b588dcdd26d_540x.webp'],
        athleteSlug: 'rico-flores-jr',
        athleteName: 'Rico Flores Jr.',
        school: 'Arizona',
        categories: ['Tees'],
        sizes: ['S','M','L','XL'],
        inventoryBySize: { S: 10, M: 10, L: 10, XL: 10 },
        active: true,
        createdAt: now,
        updatedAt: now,
      },
    ];
    
    // Store the seeded products
    await kv.set('products:all', seededProducts);
    await kv.set('products:seeded', true);
    
    return NextResponse.json({
      success: true,
      message: 'Products reseeded successfully',
      productCount: seededProducts.length,
      products: seededProducts.map(p => ({ id: p.id, name: p.name, sizes: p.sizes }))
    });
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to reseed products',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
