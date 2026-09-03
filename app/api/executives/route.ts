import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@/lib/redis';
import crypto from 'crypto';

export type Executive = {
  id: string;
  name: string;
  title: string;
  image: string;
  bio?: string;
  credentials?: string[];
};

const KEY_ALL = 'executives:all';

export async function GET() {
  let all: Executive[] = [];
  try {
    all = (await kv.get(KEY_ALL)) || [];
    console.log('Executives from KV:', all.length);
  } catch (error) {
    console.log('KV error for executives:', error);
    all = [];
  }
  if (all.length === 0) {
    // Seed from current About page defaults even if KV is unavailable
    all = [
      { id: 'christopher', name: 'Christopher Gil', title: 'Founder & Chief Executive Officer', image: '/founders/christopher.webp' },
      { id: 'damian', name: 'Damian Ochoa', title: 'Chief Operating Officer', image: '/founders/damianochoa.webp' },
      { id: 'frank', name: 'Frank Yip', title: 'Co-Founder and Director of Football Operations', image: '/founders/frankyip.webp' },
      { id: 'jon', name: 'Jon Kingdon', title: 'Director of Scouting', image: '/founders/jonkingdom.webp' },
      { id: 'steve', name: 'Steve Briscoe', title: 'Director of Youth Football', image: '/founders/stevebriscoe.webp' },
    ];
    try { await kv.set(KEY_ALL, all); } catch {}
  }
  return NextResponse.json(all);
}

export async function POST(request: NextRequest) {
  try {
    const input = (await request.json()) as Omit<Executive, 'id'> & { id?: string };
    console.log('Creating executive:', input.name);
    const newExec: Executive = {
      id: input.id || crypto.randomUUID(),
      name: input.name,
      title: input.title,
      image: input.image,
      bio: input.bio || '',
      credentials: input.credentials || [],
    };
    const all = (await kv.get(KEY_ALL)) || [];
    all.push(newExec);
    await kv.set(KEY_ALL, all);
    await kv.set(`executive:${newExec.id}`, newExec);
    console.log('Successfully saved executive to KV');
    return NextResponse.json(newExec, { status: 201 });
  } catch (e) {
    console.error('Error creating executive:', e);
    return NextResponse.json({ error: 'Failed to create executive' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const executives = (await request.json()) as Executive[];
    await kv.set(KEY_ALL, executives);
    for (const ex of executives) {
      await kv.set(`executive:${ex.id}`, ex);
    }
    return NextResponse.json(executives);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to save executives' }, { status: 500 });
  }
}


