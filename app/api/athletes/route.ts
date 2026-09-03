import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@/lib/redis';
import crypto from 'crypto';
import { type Athlete, athletes as defaultAthletes } from '@/lib/athletes';

const KEY_ALL = 'athletes:all';

export async function GET() {
  let all: Athlete[] = [];
  try {
    all = (await kv.get(KEY_ALL)) || [];
    console.log('Athletes from KV:', all.length);
  } catch (error) {
    console.log('KV error for athletes:', error);
    all = [];
  }
  if (all.length === 0) {
    // Seed with all default athletes if KV is unavailable
    all = defaultAthletes;
    try { await kv.set(KEY_ALL, all); } catch {}
  }
  return NextResponse.json(all);
}

export async function POST(request: NextRequest) {
  try {
    const input = (await request.json()) as Omit<Athlete, 'slug'> & { slug?: string };
    console.log('Creating athlete:', input.name);
    
    // Validate required fields
    if (!input.name || !input.position || !input.school) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const newAthlete: Athlete = {
      slug: input.slug || crypto.randomUUID(),
      name: input.name,
      position: input.position,
      school: input.school,
      conference: input.conference,
      classYear: input.classYear,
      number: input.number || '',
      bio: input.bio || '',
      image: input.image || '/players/jonah_coleman.webp',
      colors: input.colors || { from: '#ff0000', to: '#0000ff' },
      stats: input.stats || {
        passingYards: 0,
        rushingYards: 0,
        receivingYards: 0,
        touchdowns: 0,
        interceptions: 0,
        tackles: 0,
        sacks: 0
      },
      merchandise: input.merchandise || [],
      hasMerchandise: input.hasMerchandise || false,
    };
    
    try {
      const all = (await kv.get(KEY_ALL)) || [];
      all.push(newAthlete);
      await kv.set(KEY_ALL, all);
      await kv.set(`athlete:${newAthlete.slug}`, newAthlete);
      console.log('Successfully saved athlete to KV');
      return NextResponse.json(newAthlete, { status: 201 });
    } catch (redisError) {
      console.error('Redis error:', redisError);
      // Fallback: return the athlete even if Redis fails
      return NextResponse.json(newAthlete, { status: 201 });
    }
  } catch (e) {
    console.error('Error creating athlete:', e);
    return NextResponse.json({ error: 'Failed to create athlete', details: e instanceof Error ? e.message : 'Unknown error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const athletes = (await request.json()) as Athlete[];
    await kv.set(KEY_ALL, athletes);
    for (const athlete of athletes) {
      await kv.set(`athlete:${athlete.slug}`, athlete);
    }
    return NextResponse.json(athletes);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to save athletes' }, { status: 500 });
  }
}