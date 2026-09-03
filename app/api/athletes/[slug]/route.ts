import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@/lib/redis';
import { athletes as defaultAthletes, type Athlete } from '@/lib/athletes';

// GET /api/athletes/[slug] - Get specific athlete
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    console.log('API: Looking for athlete with slug:', slug);
    
    // Try to get from individual record first (faster)
    let athlete: Athlete | null = await kv.get(`athlete:${slug}`);
    console.log('API: Individual athlete from KV:', athlete ? athlete.name : 'not found');
    
    if (!athlete) {
      // Fallback: search in full athletes list
      const allAthletes = await kv.get('athletes:all') || defaultAthletes;
      console.log('API: All athletes count:', allAthletes.length);
      athlete = allAthletes.find((a: any) => a.slug === slug) ?? null;
      console.log('API: Found in all athletes:', athlete ? athlete.name : 'not found');
      
      // If found, cache it for future requests
      if (athlete) {
        await kv.set(`athlete:${slug}`, athlete);
        console.log('API: Cached athlete for future requests');
      }
    }
    
    if (!athlete) {
      console.log('API: Athlete not found, returning 404');
      return NextResponse.json(
        { error: 'Athlete not found' },
        { status: 404 }
      );
    }
    
    console.log('API: Returning athlete:', athlete.name);
    return NextResponse.json(athlete);
  } catch (error) {
    console.error('Error fetching athlete:', error);
    
    // Fallback to default athletes
    const athlete = defaultAthletes.find(a => a.slug === params.slug);
    if (athlete) {
      return NextResponse.json(athlete);
    }
    
    return NextResponse.json(
      { error: 'Athlete not found' },
      { status: 404 }
    );
  }
}

// PUT /api/athletes/[slug] - Update specific athlete
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const updatedAthlete: Athlete = await request.json();
    console.log('API: Updating athlete:', slug);
    console.log('API: Image preview:', updatedAthlete.image?.substring(0, 50));
    console.log('API: Image length:', updatedAthlete.image?.length);
    
    // Get current athletes list
    const currentAthletes = await kv.get('athletes:all') || defaultAthletes;
    
    // Find and update the athlete
    const athleteIndex = currentAthletes.findIndex((a: any) => a.slug === slug);
    
    if (athleteIndex === -1) {
      return NextResponse.json(
        { error: 'Athlete not found' },
        { status: 404 }
      );
    }
    
    // Update the athlete in the list
    currentAthletes[athleteIndex] = updatedAthlete;
    
    // Save updated list
    await kv.set('athletes:all', currentAthletes);
    
    // Update individual record
    await kv.set(`athlete:${slug}`, updatedAthlete);
    
    console.log('API: Athlete updated successfully');
    console.log('API: Saved image preview:', updatedAthlete.image?.substring(0, 50));
    
    return NextResponse.json(updatedAthlete);
  } catch (error) {
    console.error('Error updating athlete:', error);
    return NextResponse.json(
      { error: 'Failed to update athlete' },
      { status: 500 }
    );
  }
}

// DELETE /api/athletes/[slug] - Delete specific athlete
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    
    // Get current athletes list
    const currentAthletes = await kv.get('athletes:all') || defaultAthletes;
    
    // Filter out the athlete to delete
    const updatedAthletes = currentAthletes.filter((a: any) => a.slug !== slug);
    
    if (updatedAthletes.length === currentAthletes.length) {
      return NextResponse.json(
        { error: 'Athlete not found' },
        { status: 404 }
      );
    }
    
    // Save updated list
    await kv.set('athletes:all', updatedAthletes);
    
    // Delete individual record
    await kv.del(`athlete:${slug}`);
    
    return NextResponse.json({ message: 'Athlete deleted successfully' });
  } catch (error) {
    console.error('Error deleting athlete:', error);
    return NextResponse.json(
      { error: 'Failed to delete athlete' },
      { status: 500 }
    );
  }
}

