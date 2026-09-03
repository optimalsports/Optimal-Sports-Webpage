"use client";

import Link from "next/link";
import { athletes } from "@/lib/athletes";
import { kv } from "@/lib/redis";
import { getSchoolByName } from "@/lib/schools";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function AthletesPage() {
  const searchParams = useSearchParams();
  const [allAthletes, setAllAthletes] = useState<any[]>([]);
  const [filteredAthletes, setFilteredAthletes] = useState<any[]>([]);
  const [nflAthletes, setNflAthletes] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLeague, setSelectedLeague] = useState(""); // "College" | "NFL" | ""
  const [loading, setLoading] = useState(true);

  // Helper to determine league
  const getLeague = (conference: string) => (conference === "NFL" ? "NFL" : "College");

  // Load from KV so Admin edits are live
  useEffect(() => {
    let cancelled = false;
    const loadAthletes = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/athletes", { cache: "no-store" });
        const data = res.ok ? await res.json() : athletes;
        if (!cancelled) {
          const playersOnly = (data || athletes).filter((a: any) => `${a.name}`.trim().toLowerCase() !== "to be announced");
          setAllAthletes(playersOnly);
          setLoading(false);
        }
      } catch {
        // fallback to defaults
        if (!cancelled) {
          const playersOnly = athletes.filter((a: any) => `${a.name}`.trim().toLowerCase() !== "to be announced");
          setAllAthletes(playersOnly);
          setLoading(false);
        }
      }
    };
    
    loadAthletes();
    
    return () => { 
      cancelled = true; 
    };
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = allAthletes;

    // URL-based filtering (for search results)
    const schoolFromUrl = searchParams.get('school');
    if (schoolFromUrl) {
      filtered = filtered.filter(a => a.school === schoolFromUrl);
    }

    // Apply other filters
    if (searchTerm) {
      filtered = filtered.filter(a => 
        a.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedLeague) {
      if (selectedLeague === "NFL") {
        filtered = filtered.filter(a => getLeague(a.conference) === "NFL");
        setNflAthletes([]);
        setFilteredAthletes(filtered);
      } else if (selectedLeague === "College") {
        filtered = filtered.filter(a => getLeague(a.conference) === "College");
        setNflAthletes([]);
        setFilteredAthletes(filtered);
      }
    } else {
      // Separate college and NFL athletes
      const college = filtered.filter(a => getLeague(a.conference) === "College");
      const nfl = filtered.filter(a => getLeague(a.conference) === "NFL");
      
      setFilteredAthletes(college);
      setNflAthletes(nfl);
    }
  }, [searchTerm, selectedLeague, searchParams, allAthletes]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedLeague("");
  };

  if (loading) {
    return (
      <main className="pb-16">
        <section className="text-white py-16" style={{background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)"}}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Our Athletes</h1>
            <p className="max-w-3xl text-gray-100">Loading athletes...</p>
          </div>
        </section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pb-16">
      <section className="text-white py-16" style={{background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)"}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Our Athletes</h1>
          <p className="max-w-3xl text-gray-100">Meet the talented college athletes we represent and support in their journey to success. Each player brings unique skills, dedication, and potential to the field.</p>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search / League filter */}
        <div className="-mt-10 mb-6">
          <div className="bg-white dark:bg-neutral-900 border rounded-xl p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
              <input 
                className="border rounded-lg px-3 py-2" 
                placeholder="Search player name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="border rounded-lg px-3 py-2"
                value={selectedLeague}
                onChange={(e) => setSelectedLeague(e.target.value)}
              >
                <option value="">All Leagues</option>
                <option value="College">College</option>
                <option value="NFL">NFL</option>
              </select>
              <div className="hidden md:block" />
            </div>
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Showing {filteredAthletes.length} of {allAthletes.length} athletes
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => window.location.reload()}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Refresh
                </button>
                {(searchTerm || selectedLeague) && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAthletes.map((athlete) => {
            const schoolInfo = getSchoolByName(athlete.school);
            return (
              <Link
                key={athlete.slug}
                href={`/athletes/${athlete.slug}`}
                className="relative bg-black rounded-3xl shadow-2xl overflow-hidden group hover:shadow-red-500/20 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105"
              >
                {/* Full Background Image */}
                <div className="relative h-96 w-full overflow-hidden rounded-3xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={athlete.image} 
                    alt={athlete.name} 
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent"></div>
                  
                  {/* Transparent Info Section */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-md border-t border-white/20 p-6">
                    <div className="mb-3">
                      <h3 className="text-lg font-bold text-white mb-1 group-hover:text-red-200 transition-colors">
                        {athlete.name}
                      </h3>
                      <div>
                        <p className="text-gray-200 text-sm font-medium">{athlete.school}</p>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm line-clamp-2 mb-3 opacity-90">{athlete.bio}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* NFL Roster Section */}
        {nflAthletes.length > 0 && !selectedLeague && (
          <div className="mt-20">
            {/* NFL Roster Header */}
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
                NFL Roster
              </h2>
              <div className="flex flex-wrap items-center justify-center gap-4 mb-4">
                <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                  NFL Drafted
                </span>
                <span className="bg-gradient-to-r from-yellow-600 to-yellow-700 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                  Active Roster
                </span>
                <span className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                  Success Stories
                </span>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Our elite clients who made it to the NFL. Representing the best in professional football.
              </p>
            </div>

            {/* NFL Athletes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {nflAthletes.map((athlete) => {
                const schoolInfo = getSchoolByName(athlete.school);
                return (
                  <Link
                    key={athlete.slug}
                    href={`/athletes/${athlete.slug}`}
                    className="relative bg-black rounded-3xl shadow-2xl overflow-hidden group hover:shadow-blue-500/20 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 border-2 border-blue-500/30"
                  >
                    {/* NFL Success Badge */}
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg z-10">
                      NFL
                    </div>
                    
                    {/* Full Background Image */}
                    <div className="relative h-96 w-full overflow-hidden rounded-3xl">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={athlete.image} 
                        alt={athlete.name} 
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent"></div>
                      
                      {/* Transparent Info Section */}
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-md border-t border-white/20 p-6">
                        <div className="mb-3">
                          <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-200 transition-colors flex items-center gap-2">
                            {athlete.name}
                            <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </h3>
                          <div>
                            <p className="text-gray-200 text-sm font-medium">{athlete.school}</p>
                          </div>
                        </div>
                        <p className="text-gray-300 text-sm line-clamp-2 mb-3 opacity-90">{athlete.bio}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}


