import Link from "next/link";
import VideoBackground from "../components/VideoBackground";
import dynamic from "next/dynamic";
import VisionCarousel from "../components/VisionCarousel";

const ServicesScroller = dynamic(() => import("../components/ServicesScroller"), { ssr: false });

export default function HomePage() {
  const instagramPhotos = [
    { 
      src: "/503434072_18050765681603363_2382997233816373608_n.jpg", 
      alt: "OPTIMAL SIGNED - Myles Purchase", 
      overlayText: "@OPTIMALSPORTSMGMT",
      isMain: true 
    },
    { 
      src: "/504101920_18049286879603363_1084582550272691093_n.jpg", 
      alt: "OPTIMAL SIGNED - Tuasivi Nomura", 
      overlayText: "@OPTIMALSPORTSMGMT",
      isMain: true 
    },
    { 
      src: "/524393326_18054878426603363_5233614071608525766_n.jpg", 
      alt: "BIG MEDIA DAYS - Team Photo", 
      overlayText: "@OPTIMALSPORTSMGMT",
      isMain: true 
    },
    { 
      src: "/527350224_18055009787603363_4745511802424426391_n.jpg", 
      alt: "HALL OF FAME GAME - Pro Football Hall of Fame", 
      overlayText: "@OPTIMALSPORTSMGMT",
      isMain: true 
    }
  ];

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-600 via-red-700 to-black h-[75vh] flex items-center">
        {/* Video Background */}
        <VideoBackground />
        
        {/* Enhanced Overlay with depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 backdrop-blur-lg" />
        
        {/* Content - Now centered and more prominent */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          {/* Main Title with enhanced styling and subtle glow */}
          <div className="mb-6">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight">
              <span className="block bg-gradient-to-r from-white via-red-100 to-white bg-clip-text text-transparent drop-shadow-2xl" style={{ textShadow: '0 0 20px rgba(255, 255, 255, 0.3), 0 0 40px rgba(255, 255, 255, 0.2)' }}>
                OPTIMAL
              </span>
              <span className="block text-3xl md:text-4xl lg:text-5xl font-bold tracking-wider bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent" style={{ textShadow: '0 0 10px rgba(239,68,68,0.3), 0 0 20px rgba(239,68,68,0.2)' }}>
                SPORTS MANAGEMENT
              </span>
            </h1>
            
            {/* Accent line */}
            <div className="w-32 h-1 bg-gradient-to-r from-red-400 to-red-600 mx-auto mb-6 rounded-full shadow-lg"></div>
          </div>

          <p className="text-gray-100 text-xl md:text-2xl max-w-3xl mx-auto mb-8 leading-relaxed">
            Elevating athletes through professional representation
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Link href="/athletes" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 font-bold px-4 py-3 sm:px-8 sm:py-4 rounded-xl text-center transition-all duration-300 transform hover:scale-105">
              View Athletes
            </Link>
          </div>
          
          <div className="mt-8">
            <Link href="/catalog" className="inline-flex items-center gap-2 text-white/80 hover:text-white text-lg font-medium transition-colors">
              <span>Shop merchandise from your favorite players</span>
              <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>


      {/* Athlete Vision Section - Brand New */}
      <section
        className="py-20 bg-gray-100 dark:bg-black text-gray-900 dark:text-white -mt-8 md:-mt-12 lg:-mt-16 relative z-10"
        style={{
          clipPath:
            "polygon(24px 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 0 100%, 0 24px)",
          WebkitClipPath:
            "polygon(24px 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 0 100%, 0 24px)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              Driven By Our Athletes&apos; Vision
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-5xl mx-auto leading-relaxed">
              Optimal Sports Management was built upon our athletes&apos; vision of not only being the best players they can be on the field, but also the most notable figures off-the-field through innovative marketing campaigns.
            </p>
      </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 mb-8 md:mb-20">
            {/* Left Side - Vision Content */}
            <div className="space-y-8">
              {/* Our Foundation Card */}
              <div className="group relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-red-900 rounded-2xl p-6 shadow-xl border border-red-500/30 hover:shadow-red-500/25 hover:scale-[1.02] transition-all duration-500 cursor-pointer">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-transparent to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -top-2 -right-2 w-20 h-20 bg-red-500/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-red-400/20 rounded-full blur-lg group-hover:scale-125 transition-transform duration-700 delay-100"></div>
                
                {/* Floating Icons */}
                <div className="absolute top-4 right-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 delay-200 transform translate-y-0 group-hover:translate-y-0">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>

                {/* Main Content */}
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">★</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1 group-hover:text-red-100 transition-colors duration-300">Our Foundation</h3>
                      <div className="w-12 h-1 bg-gradient-to-r from-red-400 to-red-500 rounded-full group-hover:w-16 transition-all duration-300"></div>
                    </div>
      </div>

                  <p className="text-gray-300 leading-relaxed text-sm mb-4 group-hover:text-white transition-colors duration-300">
                    By working with a variety of companies across the nation and having our own storefront, we ensure that our client&apos;s professional and personal needs are met.
                  </p>
                  
                  {/* Interactive Feature Pills */}
                  <div className="space-y-2">
                    {[
                      { icon: "🌐", text: "Nationwide Partnerships" },
                      { icon: "🏪", text: "Dedicated Storefront" },
                      { icon: "🤝", text: "Personal Support" }
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 delay-200" style={{ transitionDelay: `${200 + index * 100}ms` }}>
                        <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center text-xs shadow-md">
                          {feature.icon}
                        </div>
                        <span className="text-red-100 font-medium text-sm">{feature.text}</span>
                        <div className="flex-1 h-px bg-gradient-to-r from-red-500/50 to-transparent"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-red-900 rounded-2xl p-6 shadow-xl border border-red-500/30 hover:shadow-red-500/25 hover:scale-[1.02] transition-all duration-500 cursor-pointer">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-transparent to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -top-2 -right-2 w-20 h-20 bg-red-500/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-red-400/20 rounded-full blur-lg group-hover:scale-125 transition-transform duration-700 delay-100"></div>
                
                {/* Floating Icons */}
                <div className="absolute top-4 right-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 delay-200 transform translate-y-0 group-hover:translate-y-0">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>

                {/* Main Content */}
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 rounded-full flex items-center justify-center animate-pulse">
                        <span className="text-xs font-bold text-white">⚡</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1 group-hover:text-red-100 transition-colors duration-300">Innovation & Growth</h3>
                      <div className="w-12 h-1 bg-gradient-to-r from-red-400 to-red-500 rounded-full group-hover:w-16 transition-all duration-300"></div>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 leading-relaxed text-sm mb-4 group-hover:text-white transition-colors duration-300">
                    Through cutting-edge marketing campaigns and strategic partnerships, we help athletes become household names both on and off the field.
                  </p>
                  
                  {/* Interactive Feature Pills */}
                  <div className="space-y-2">
                    {[
                      { icon: "🚀", text: "Cutting-Edge Marketing" },
                      { icon: "🤝", text: "Strategic Partnerships" },
                      { icon: "📈", text: "Maximum Exposure" }
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 delay-200" style={{ transitionDelay: `${200 + index * 100}ms` }}>
                        <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center text-xs shadow-md">
                          {feature.icon}
                        </div>
                        <span className="text-red-100 font-medium text-sm">{feature.text}</span>
                        <div className="flex-1 h-px bg-gradient-to-r from-red-500/50 to-transparent"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Single auto-rotating panel with combined height */}
            <div>
              <VisionCarousel
                slides={[
                  { src: "/images (1).JPEG", title: "Supporting Excellence", subtitle: "Empowering athletes to reach their full potential" },
                  { src: "/frontpage3.png", title: "Driven by Our Athletes", subtitle: "Relentless commitment to the vision of our players" },
                ]}
                intervalMs={6000}
              />
            </div>
          </div>

          {/* How We Serve Our Athletes – Pinned Scrollytelling */}
          <div className="mb-8 md:mb-16">
            <div className="text-center mb-8">
              <h3 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">How We Serve Our Athletes</h3>
            </div>
            <ServicesScroller />
            <div className="text-center mt-8">
            <Link 
              href="/services" 
                className="group relative inline-flex items-center justify-center gap-3 px-10 py-4 font-bold text-white rounded-2xl overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-600 to-red-700 transition-transform duration-300 group-hover:scale-105" />
                <span className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-red-400/0 via-white/20 to-red-400/0 opacity-0 group-hover:opacity-100 blur transition-opacity duration-300" />
                <span className="relative z-10">Explore All Services</span>
                <svg className="relative z-10 w-6 h-6 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          </div>
          
        </div>
      </section>



          {/* Community CTA */}
          <section className="py-16 bg-gradient-to-r from-red-600 to-red-500 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Join the Optimal Community</h3>
                  <p className="text-red-50">Share game clips, milestones, and event photos. Stay on top of NIL news and growth insights.</p>
                </div>
                <div className="flex gap-3 md:justify-end">
                  <Link href="/about" className="bg-white text-gray-900 dark:text-black font-semibold px-5 py-3 rounded-lg">Learn More</Link>
                  <Link href="/contact" className="bg-transparent border-2 border-white text-white px-5 py-3 rounded-lg">Get Started</Link>
                </div>
              </div>
            </div>
          </section>

      {/* Enhanced Social Section - Full Height Instagram Photos */}
      <section className="bg-gray-100 dark:bg-black text-gray-900 dark:text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              Follow Our Journey
          </h2>
          </div>

          {/* Full Height Instagram Photos - No Extra Spacing */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0">
            {instagramPhotos.filter(photo => photo.isMain).map((photo, index) => (
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
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.07 1.645.07 4.849 0 3.205-.012 3.584-.07 4.849-.148 3.225-1.664 4.771-4.919 4.919-1.266.058 1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
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