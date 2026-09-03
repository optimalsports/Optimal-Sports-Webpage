import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@/lib/redis';
import { Product } from '@/lib/products';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const KEY_ALL = 'products:all';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const athlete = searchParams.get('athlete') || undefined;
  const school = searchParams.get('school') || undefined;
  const name = searchParams.get('name')?.toLowerCase() || undefined;
  const category = searchParams.get('category')?.toLowerCase() || undefined;
  const size = searchParams.get('size')?.toLowerCase() || undefined;
  const page = Number(searchParams.get('page') || '1');
  const limit = Number(searchParams.get('limit') || '50');
  const debug = searchParams.get('debug') === 'true';

  let all: Product[] = [];
  try {
    all = (await kv.get(KEY_ALL)) || [];
    console.log('Products from KV:', all.length);
  } catch (error) {
    console.log('KV error for products:', error);
    all = [];
  }
  
  // Only seed if Redis is completely empty AND we haven't seeded before
  if (all.length === 0) {
    // Check if we've already seeded by looking for a specific key
    const seededKey = 'products:seeded';
    try {
      const alreadySeeded = await kv.get(seededKey);
      if (!alreadySeeded) {
        console.log('Seeding default products for the first time...');
        const now = Date.now();
        all = [
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
          } as Product,
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
          } as Product,
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
          } as Product,
        ];
        await kv.set(KEY_ALL, all); 
        for (const p of all) await kv.set(`product:${p.id}`, p);
        await kv.set(seededKey, 'true');
        console.log('Successfully seeded default products');
      } else {
        console.log('Products already seeded, skipping...');
      }
    } catch (seedError) {
      console.log('Seeding error:', seedError);
    }
  }
  // TEMPORARILY DISABLE ALL FILTERING TO SHOW ALL PRODUCTS
  const filtered = all.filter(p => {
    // Only filter by active status, ignore all other filters
    return p.active !== false;
  });
  
  // Clean logging for production
  console.log(`Products API: ${all.length} total, ${filtered.length} filtered, page ${page} - ALL FILTERING DISABLED`);
  const start = Math.max((page - 1) * limit, 0);
  const paged = filtered.slice(start, start + limit);
  
  if (debug) {
    // Return debug information instead of products
    const seededFlag = await kv.get('products:seeded');
    return NextResponse.json({
      debug: true,
      totalProducts: all.length,
      filteredProducts: filtered.length,
      seededFlagExists: !!seededFlag,
      allProducts: all.map((p: any) => ({ id: p.id, name: p.name, active: p.active, price: p.price })),
      filteredProductsDetail: filtered.map((p: any) => ({ id: p.id, name: p.name, active: p.active, price: p.price })),
      timestamp: new Date().toISOString()
    });
  }
  
  return NextResponse.json(paged);
}

export async function POST(request: NextRequest) {
  try {
    const input = await request.json();
    console.log('Creating product:', input.name);
    console.log('Input data:', JSON.stringify(input, null, 2));
    
    const now = Date.now();
    const newProduct: Product = {
      id: input.id || crypto.randomUUID(),
      name: input.name,
      price: Number(input.price),
      imageUrl: input.imageUrl,
      images: input.images ?? (input.imageUrl ? [input.imageUrl] : []),
      athleteSlug: input.athleteSlug,
      athleteName: input.athleteName,
      school: input.school,
      categories: input.categories ?? [],
      sizes: input.sizes ?? [],
      inventoryBySize: input.inventoryBySize ?? {},
      active: input.active ?? true,
      externalUrl: input.externalUrl,
      createdAt: now,
      updatedAt: now,
    };
    
    // Get existing products and add new one
    const all = (await kv.get(KEY_ALL)) || [];
    console.log('Before adding new product - existing count:', all.length);
    console.log('Existing product IDs:', all.map((p: any) => p.id));
    
    all.push(newProduct);
    console.log('After adding new product - total count:', all.length);
    console.log('All product IDs now:', all.map((p: any) => p.id));
    
    // Save back to Redis
    await kv.set(KEY_ALL, all);
    await kv.set(`product:${newProduct.id}`, newProduct);
    
    // Verify it was saved
    const verify = await kv.get(KEY_ALL) || [];
    console.log('Verification - products in Redis after save:', verify.length);
    console.log('Verification - product IDs in Redis:', verify.map((p: any) => p.id));
    
    console.log('Successfully saved product to Redis. Total products:', all.length);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (e) {
    console.error('Error creating product:', e);
    console.error('Error stack:', e instanceof Error ? e.stack : 'No stack trace');
    console.error('Error details:', e instanceof Error ? e.message : 'Unknown error');
    return NextResponse.json({ 
      error: 'Failed to create product', 
      details: e instanceof Error ? e.message : 'Unknown error',
      stack: e instanceof Error ? e.stack : undefined
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  // Optional bulk replace
  const products: Product[] = await request.json();
  await kv.set(KEY_ALL, products);
  return NextResponse.json(products);
}

// Debug endpoint to check what's in Redis - accessible via GET /api/products?debug=true
// Debug endpoint to check what's in Redis
export async function DELETE(request: NextRequest) {
  try {
    const all = await kv.get(KEY_ALL) || [];
    const seededFlag = await kv.get('products:seeded');
    console.log('DEBUG: Products in Redis:', all.length);
    console.log('DEBUG: Seeded flag exists:', !!seededFlag);
    console.log('DEBUG: Redis products:', all.map((p: any) => ({ id: p.id, name: p.name, createdAt: new Date(p.createdAt).toISOString() })));
    return NextResponse.json({ 
      redisCount: all.length,
      seededFlagExists: !!seededFlag,
      redisProducts: all.map((p: any) => ({ id: p.id, name: p.name, active: p.active, createdAt: new Date(p.createdAt).toISOString() })),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// Sync endpoint to force all instances to have the same data
export async function PATCH(request: NextRequest) {
  try {
    console.log('🔄 SYNC: Forcing database sync across all instances...');
    
    // Get all products from the main instance
    const all = await kv.get(KEY_ALL) || [];
    console.log('🔄 SYNC: Found', all.length, 'products in main instance');
    
    // Clear the seeded flag to force re-sync
    await kv.del('products:seeded');
    console.log('🔄 SYNC: Cleared seeded flag');
    
    // Re-save all products to ensure consistency
    await kv.set(KEY_ALL, all);
    for (const product of all) {
      await kv.set(`product:${product.id}`, product);
    }
    console.log('🔄 SYNC: Re-saved all products');
    
    // Set seeded flag again
    await kv.set('products:seeded', 'true');
    console.log('🔄 SYNC: Set seeded flag');
    
    return NextResponse.json({ 
      success: true,
      message: 'Database synced across all instances',
      productCount: all.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('🔄 SYNC ERROR:', error);
    return NextResponse.json({ 
      error: 'Sync failed',
      details: (error as Error).message 
    }, { status: 500 });
  }
}


