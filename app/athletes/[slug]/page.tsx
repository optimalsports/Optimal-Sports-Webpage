import { notFound } from "next/navigation";
import Link from "next/link";
import { athletes } from "@/lib/athletes";
import { kv } from "@/lib/redis";
import { getSchoolByName } from "@/lib/schools";
import { AthleteShop } from "@/components/AthleteShop";

type Params = { slug: string };

export async function generateStaticParams() {
  // Only pre-render the default athletes, let admin-added ones be dynamic
  return athletes
    .filter(a => a.name.trim().toLowerCase() !== "to be announced")
    .map((a) => ({ slug: a.slug }));
}

export default async function AthleteProfile({ params }: { params: Params }) {
  const { slug } = params;
  console.log('Looking for athlete with slug:', slug);
  // Prefer KV so Admin edits are live, fall back to static list
  let athlete = null as (typeof athletes)[number] | null;
  try {
    athlete = await kv.get(`athlete:${slug}`);
  } catch {}
  if (!athlete) {
    try {
      const all = (await kv.get("athletes:all")) || athletes;
      athlete = all.find((a: any) => a.slug === slug && a.name.trim().toLowerCase() !== "to be announced") || null;
    } catch {
      athlete = athletes.find(a => a.slug === slug && a.name.trim().toLowerCase() !== "to be announced") || null;
    }
  }
  
  // Final fallback: try the API route
  if (!athlete) {
    try {
      const response = await fetch(`/api/athletes/${slug}`, { 
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (response.ok) {
        athlete = await response.json();
      }
    } catch (error) {
      console.error('Error fetching athlete from API:', error);
    }
  }
  
  if (!athlete) {
    console.log('Athlete not found for slug:', slug);
    return notFound();
  }
  
  console.log('Found athlete:', athlete.name, 'with slug:', athlete.slug);

  const schoolInfo = getSchoolByName(athlete.school);

  // categories could be introduced later for filtering merchandise

  return (
    <main className="py-10 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-900 dark:to-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/athletes" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-6">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Athletes
        </Link>

        {/* Hero Section with Big Photo and Info */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Side - Big Photo */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-neutral-800">
                <img 
                  src={athlete.image} 
                  alt={athlete.name} 
                  className="w-full h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"/>
                
                {/* Position Badge */}
                <div className="absolute top-6 left-6">
                  <span className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    {athlete.position}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Side - Player Info */}
            <div className="space-y-8">
              {/* Player Name and School */}
              <div>
                <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                  {athlete.name}
                </h1>
                <div className="mb-6">
                  {schoolInfo && (
                    <div>
                      <p className="text-xl font-semibold text-gray-900 dark:text-white">{athlete.school}</p>
                      <p className="text-gray-600 dark:text-gray-400">{schoolInfo.mascot}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-gray-200 dark:border-neutral-700">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Number</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">#{athlete.number}</div>
                </div>
                <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-gray-200 dark:border-neutral-700">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Position</div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">{athlete.position}</div>
                </div>
              </div>

              {/* Bio */}
              <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-gray-200 dark:border-neutral-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">About {athlete.name}</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">{athlete.bio}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Shop Section - Only show if athlete has merchandise */}
        <AthleteShop
          athleteName={athlete.name}
          hasMerchandise={athlete.hasMerchandise}
          merchandiseItems={athlete.merchandise ?? []}
          athleteSlug={athlete.slug}
        />

        {/* Shop Section */}
        <div className="mt-16">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 border border-gray-200 dark:border-neutral-700">
            <AthleteShop
              athleteName={athlete.name}
              hasMerchandise={true}
              merchandiseItems={athlete.merchandise ?? []}
              athleteSlug={athlete.slug}
            />
          </div>
        </div>
      </div>
    </main>
  );
}


