// Removed video background for a cleaner hero consistent with other pages

export default function ServicesPage() {

  const services = [
    {
      title: "NFL Contract Representation",
      description: "Expert contract negotiation and salary optimization to ensure you receive the compensation you deserve. We handle performance bonuses, guaranteed money, and complex contract structures.",
      image: "/newphotos/contractmanagment.jpeg",
      imageAlt: "Professional athlete contract representation",
      gradient: "from-red-600 via-red-700 to-black",
      features: ["Contract Negotiation", "Salary Optimization", "Performance Bonuses", "Guaranteed Money"],
      stats: "15+ years experience",
      badge: "NFL READY"
    },
    {
      title: "NIL Representation & Marketing",
      description: "Strategic brand development and endorsement deals that maximize your market value. We create comprehensive marketing strategies that scale with your career.",
      image: "/newphotos/innovationmarketing.jpeg",
      imageAlt: "NIL marketing and brand partnerships for athletes",
      gradient: "from-blue-600 via-purple-600 to-red-600",
      features: ["Brand Strategy", "Market Research", "Endorsement Deals", "Social Media Growth", "Transfer Portal", "Collective Negotiation"],
      stats: "200+ brand partnerships",
      badge: "NIL EXPERTS"
    },
    {
      title: "Nationwide Representation",
      description: "Comprehensive coverage across all major markets and regions. We ensure you have representation and support wherever your career takes you.",
      image: "/newphotos/nationwide.jpeg",
      imageAlt: "Nationwide athlete representation and support",
      gradient: "from-purple-600 via-blue-600 to-cyan-600",
      features: ["Multi-Market Coverage", "Regional Support", "Market Analysis", "Local Partnerships"],
      stats: "50+ markets covered",
      badge: "COAST TO COAST"
    },
    {
      title: "Draft Representation",
      description: "Expert guidance through the NFL Draft process. From combine preparation to team interviews, we position you for maximum draft value.",
      image: "/newphotos/draftrepresentation.jpeg",
      imageAlt: "NFL Draft preparation and representation",
      gradient: "from-orange-600 via-red-600 to-purple-600",
      features: ["Combine Prep", "Team Interviews", "Draft Strategy", "Media Training"],
      stats: "100+ draft picks",
      badge: "DRAFT EXPERTS"
    },
    {
      title: "Client Relations & Support",
      description: "Comprehensive personal and professional support to handle your everyday needs. From charity management to family logistics, we ensure you can focus on your game.",
      image: "/newphotos/clientrelationssupport.jpeg",
      imageAlt: "Comprehensive athlete support and client relations",
      gradient: "from-green-600 via-teal-600 to-blue-600",
      features: ["Charity Management", "Family Logistics", "Travel Coordination", "Personal Assistance"],
      stats: "24/7 support available",
      badge: "FULL SERVICE"
    }
  ];

  return (
    <main className="min-h-screen">
      {/* Consistent Hero (matches other pages) */}
      <section className="py-16 bg-gradient-to-br from-red-600 via-red-700 to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-3">Our Services</h1>
          <p className="text-gray-100/90 max-w-2xl mx-auto">
            Comprehensive representation, branding, and career support for elite athletes
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-red-400 to-red-600 mx-auto mt-6 rounded-full"></div>
        </div>
      </section>

      {/* NFL-Style Alternating Services */}
      <section className="py-20 bg-white dark:bg-black text-gray-900 dark:text-white" id="nil">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-gray-900 via-red-600 to-gray-900 dark:from-white dark:via-red-200 dark:to-white bg-clip-text text-transparent">
                Elite Services
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Professional expertise that elevates champions to the next level
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-red-600 mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="space-y-24">
            {services.map((service, index) => (
              <div key={index} id={index===0? 'contract' : index===1? 'marketing' : index===2? 'merchandise' : 'career'} className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-16`}>
                {/* Image Side */}
                <div className="flex-1 group">
                  <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                    <img 
                      src={service.image} 
                      alt={service.imageAlt}
                      className="w-full h-[400px] lg:h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    
                    {/* Overlays and badges removed as requested */}
                  </div>
                </div>

                {/* Content Side */}
                <div className="flex-1 space-y-6">
                  <div>
                    <h3 className="text-3xl lg:text-4xl font-black text-white mb-4 leading-tight">
                      {service.title}
                    </h3>
                    <p className="text-lg text-gray-300 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* Features Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-red-500/30 transition-all duration-300 hover:bg-white/10">
                        <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow-lg flex-shrink-0"></div>
                        <span className="text-white font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Per-section CTA and step indicators removed as requested */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clean Process Section */}
      <section className="py-16 bg-white dark:bg-black text-gray-900 dark:text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-gray-900 via-red-600 to-gray-900 dark:from-white dark:via-red-200 dark:to-white bg-clip-text text-transparent">
                Our Process
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              A proven methodology that delivers results
            </p>
          </div>

          <div className="relative">
            {/* Clean Progress Line */}
            <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-gray-700">
              <div className="h-full bg-gradient-to-r from-red-500 to-red-600 w-full" />
            </div>

            {/* Minimal Steps */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: "1", title: "Assessment", description: "Evaluate your current situation" },
                { step: "2", title: "Strategy", description: "Develop comprehensive plans" },
                { step: "3", title: "Execution", description: "Implement with precision" },
                { step: "4", title: "Optimization", description: "Continuously improve" }
              ].map((process, index) => (
                <div key={index} className="text-center relative">
                  {/* Circle on Line */}
                  <div className="relative mb-6">
                    <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-lg font-bold relative z-10 bg-red-600 text-white">
                      {process.step}
                    </div>
                  </div>

                  {/* Clean Content */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-white">
                      {process.title}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {process.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>




    </main>
  );
}


