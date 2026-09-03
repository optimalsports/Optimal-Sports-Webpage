import Link from "next/link";
import Image from "next/image";
import FounderCard from "@/components/FounderCard";
import { kv } from "@/lib/redis";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

type Executive = {
  id: string;
  name: string;
  title: string;
  image: string;
  bio?: string;
  credentials?: string[];
};

export default async function AboutPage() {
  // Load executives directly from KV (no HTTP) and gracefully fallback to static list
  let teamMembers: Executive[] = [];
  try {
    teamMembers = (await kv.get("executives:all")) || [];
  } catch {}
  if (teamMembers.length === 0) {
    teamMembers = [
      { id: 'christopher', name: 'Christopher Gil', title: 'Founder & Chief Executive Officer', image: '/founders/christopher.webp' },
      { id: 'damian', name: 'Damian Ochoa', title: 'Chief Operating Officer', image: '/founders/damianochoa.webp' },
      { id: 'frank', name: 'Frank Yip', title: 'Co-Founder and Director of Football Operations', image: '/founders/frankyip.webp' },
      { id: 'jon', name: 'Jon Kingdon', title: 'Director of Scouting', image: '/founders/jonkingdom.webp' },
      { id: 'steve', name: 'Steve Briscoe', title: 'Director of Youth Football', image: '/founders/stevebriscoe.webp' },
    ];
  }

  const faqs = [
    {
      question: "I am currently an American college football player and would like to learn more about the NIL laws that came into effect. Would it also be possible to represent me?",
      answer: "Absolutely! We specialize in NIL representation and would be happy to discuss how we can help you navigate the new NIL landscape while maintaining your collegiate eligibility. Our experienced advisors have been involved in the sports industry for over 30 years and understand the complexities of NIL regulations."
    },
    {
      question: "Are there any career opportunities/internships for students or recent college graduates?",
      answer: "Yes, we offer internship and career opportunities for qualified candidates. We're always looking for passionate individuals who want to learn about sports management and athlete representation. Please reach out to us for current openings and application processes."
    }
  ];

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Mission Section */}
      <section className="py-20 bg-white dark:bg-neutral-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Our Mission
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Optimal Sports Management is dedicated to enhancing the lives of our clients, 
            both on and off-the field, by giving them the necessary resources to achieve 
            their goals and create meaningful impact within their communities.
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50 dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Optimal Sports Management Executive Team
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">Meet the experienced professionals dedicated to your success</p>
          </div>

          {/* CEO & COO on top row, rest below (title-based so admin edits still sort correctly) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {teamMembers
              .filter(m => /Chief\s+Executive\s+Officer/i.test(m.title) || /Chief\s+Operating\s+Officer/i.test(m.title))
              .map((member, index) => (
              <FounderCard
                key={`lead-${index}`}
                name={member.name}
                title={member.title}
                imageSrc={member.image}
                bio={member.bio || ''}
                credentials={member.credentials || []}
                imageClassName={/Damian\s+Ochoa/i.test(member.name) ? "object-[50%_35%]" : undefined}
              />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers
              .filter(m => !(/Chief\s+Executive\s+Officer/i.test(m.title) || /Chief\s+Operating\s+Officer/i.test(m.title)))
              .map((member, index) => (
              <FounderCard
                key={`rest-${index}`}
                name={member.name}
                title={member.title}
                imageSrc={member.image}
                bio={member.bio || ''}
                credentials={member.credentials || []}
              />
            ))}
          </div>

          {/* LinkedIn Promo */}
          <div className="mt-16">
            <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-neutral-800 bg-gradient-to-br from-gray-50 to-white dark:from-neutral-900 dark:to-black p-8">
              <div className="flex flex-col lg:flex-row items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#0A66C2]/10 flex items-center justify-center">
                    <svg className="w-7 h-7 text-[#0A66C2]" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8h5v13H0V8zm7.5 0h4.8v1.8h.07c.67-1.2 2.3-2.46 4.73-2.46 5.05 0 5.98 3.33 5.98 7.66V21H18v-6.67c0-1.59-.03-3.63-2.21-3.63-2.22 0-2.56 1.73-2.56 3.52V21H7.5V8z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Follow Optimal Sports on LinkedIn</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">News, signings, and behind-the-scenes updates from our executive team.</p>
                  </div>
                </div>
                <div className="flex-1" />
                <div className="flex items-center gap-4">
                  <a
                    href="https://www.linkedin.com/company/optimal-sports-management/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0A66C2] text-white font-semibold hover:bg-[#0a5ab0] transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8h5v13H0V8zm7.5 0h4.8v1.8h.07c.67-1.2 2.3-2.46 4.73-2.46 5.05 0 5.98 3.33 5.98 7.66V21H18v-6.67c0-1.59-.03-3.63-2.21-3.63-2.22 0-2.56 1.73-2.56 3.52V21H7.5V8z"/>
                    </svg>
                    View LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      

      {/* Enhanced Social Section - Instagram CTA Style from Homepage */}
      <section className="bg-gray-100 dark:bg-black text-gray-900 dark:text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              Follow Our Journey
            </h2>
          </div>

          {/* Instagram Photos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0">
            {[
              {
                src: "/504101920_18049286879603363_1084582550272691093_n.jpg",
                alt: "Community Photo 1",
                overlayText: "@OPTIMALSPORTSMGMT"
              },
              {
                src: "/503434072_18050765681603363_2382997233816373608_n.jpg",
                alt: "Community Photo 2", 
                overlayText: "@OPTIMALSPORTSMGMT"
              },
              {
                src: "/524393326_18054878426603363_5233614071608525766_n.jpg",
                alt: "Community Photo 3",
                overlayText: "@OPTIMALSPORTSMGMT"
              },
              {
                src: "/527350224_18055009787603363_4745511802424426391_n.jpg",
                alt: "Community Photo 4",
                overlayText: "@OPTIMALSPORTSMGMT"
              }
            ].map((photo, index) => (
              <a
                key={index} 
                href="https://instagram.com/OPTIMALSPORTSMGMT" 
                target="_blank"
                rel="noopener noreferrer"
                className="relative group cursor-pointer transform hover:-translate-y-2 transition-all duration-500 block"
              >
                <div className="h-80 md:h-96 lg:h-[450px] overflow-hidden border-4 border-white/20 shadow-2xl hover:shadow-white/20 transition-all duration-500">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={photo.src} 
                    alt={photo.alt} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Enhanced Instagram Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-8">
                    <div className="text-center text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.07 1.645.07 4.849 0 3.205-.012 3.584-.07 4.849-.148 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                          </svg>
                        </div>
                        <span className="font-bold text-xl">{photo.overlayText}</span>
                      </div>
                      <div className="text-sm text-gray-200 font-medium bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">Click to follow</div>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}


