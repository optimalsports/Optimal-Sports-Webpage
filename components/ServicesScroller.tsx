"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Slide = {
  title: string;
  subtitle: string;
  bullets: string[];
  image: string;
  tag: string;
  badges?: string[];
};

const slides: Slide[] = [
  {
    title: "Draft Representation",
    subtitle:
      "From pre‑draft prep to pro contract positioning—we manage the path to the league.",
    bullets: [
      "Scouting reports and interview prep",
      "Combine/Pro‑day preparation",
      "Negotiation strategy and advisory",
    ],
    image: "/newphotos/draftrepresentation.jpeg",
    tag: "Draft",
    badges: ["Scouting", "Combine Prep", "Contract Strategy"],
  },
  {
    title: "Innovative Marketing & Brand Development",
    subtitle:
      "Full‑funnel creative and distribution to turn moments into momentum.",
    bullets: [
      "Campaign strategy and production",
      "Social growth and distribution",
      "Content systems that scale",
    ],
    image: "/newphotos/innovationmarketing.jpeg",
    tag: "Marketing",
    badges: ["Campaigns", "Growth", "Distribution"],
  },
  {
    title: "Professional Contract Management",
    subtitle:
      "Diligent review, optimized terms, and airtight execution—so you stay focused on performance.",
    bullets: [
      "Legal review and risk mitigation",
      "Negotiation support",
      "Signature to delivery oversight",
    ],
    image: "/newphotos/contractmanagment.jpeg",
    tag: "Contracts",
    badges: ["Legal", "Negotiation", "Compliance"],
  },
  {
    title: "Nationwide Network & Expansion",
    subtitle:
      "Coast‑to‑coast access and elite partnerships that open the right doors.",
    bullets: [
      "National and regional partners",
      "Cross‑market activations",
      "Post‑campaign analytics",
    ],
    image: "/newphotos/nationwide.jpeg",
    tag: "Network",
    badges: ["Nationwide", "Elite Partners", "Analytics"],
  },
];

export default function ServicesScroller() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0); // 0..1 across the whole section
  const [perSlideVh, setPerSlideVh] = useState(100); // tweak height on mobile

  const totalSlides = slides.length;
  const totalHeight = useMemo(() => totalSlides * perSlideVh, [totalSlides, perSlideVh]); // in vh

  // Adjust overall section height for mobile so the whole scrollytelling block is shorter
  useEffect(() => {
    const update = () => setPerSlideVh(window.innerWidth < 768 ? 85 : 100);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const viewportH = window.innerHeight;
        const containerPx = (totalSlides * viewportH) as number;
        const traveled = Math.min(Math.max(-rect.top, 0), containerPx - viewportH);
        const p = containerPx > viewportH ? traveled / (containerPx - viewportH) : 0;
        const idx = Math.min(
          totalSlides - 1,
          Math.max(0, Math.round(p * (totalSlides - 1)))
        );
        setProgress(p);
        setActiveIndex(idx);
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll as any);
      window.removeEventListener("resize", onScroll as any);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [totalSlides]);

  return (
    <section aria-label="How We Serve Our Athletes" className="relative">
      {/* The outer container creates enough scroll room for all slides */}
      <div
        ref={containerRef}
        className="relative"
        style={{ height: `calc(${totalHeight}vh)` }}
      >
        {/* Sticky viewport that pins while the user scrolls through the slides */}
        <div className="sticky top-0 h-[85vh] md:h-screen pt-6 pb-10 md:pt-10 md:pb-16">
          <div className="h-full w-full grid grid-cols-1 lg:grid-cols-12 items-center">
            {/* Textual Content */}
            <div className="lg:col-span-7 px-6 md:px-10 max-w-3xl mx-auto lg:mx-0">
              <div className="mb-6">
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-red-600/15 text-red-600 dark:text-red-300 border border-red-600/20">
                  {slides[activeIndex].tag}
                </span>
              </div>
              <h4 className="text-4xl md:text-6xl font-extrabold leading-tight text-gray-900 dark:text-white mb-4">
                {slides[activeIndex].title}
              </h4>
              <p className="text-gray-700 dark:text-gray-300 text-xl md:text-2xl leading-relaxed mb-4">
                {slides[activeIndex].subtitle}
              </p>
              {slides[activeIndex].badges && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {slides[activeIndex].badges!.map((badge, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full text-xs font-semibold bg-red-600/10 text-red-700 dark:text-red-200 border border-red-600/20"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              )}
              <ul className="space-y-3">
                {slides[activeIndex].bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1 inline-block w-2.5 h-2.5 rounded-full bg-red-600"></span>
                    <span className="text-gray-800 dark:text-gray-200 text-lg md:text-xl">{b}</span>
                  </li>
                ))}
              </ul>

              {/* Progress Indicator */}
              <div className="mt-8 flex items-center gap-3">
                {slides.map((_, i) => (
                  <span
                    key={i}
                    aria-hidden
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i <= activeIndex ? "bg-red-600 w-10" : "bg-gray-300 dark:bg-gray-700 w-6"
                    }`}
                  />
                ))}
                <span className="sr-only">Slide {activeIndex + 1} of {totalSlides}</span>
              </div>
            </div>

            {/* Visual Content - kept smaller than full screen */}
            <div className="lg:col-span-5 px-6 md:px-10 mt-8 lg:mt-0 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-lg aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slides[activeIndex].image}
                  alt={slides[activeIndex].title}
                  className="absolute inset-0 w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                {/* Removed on-photo labels and step numbers per request */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


