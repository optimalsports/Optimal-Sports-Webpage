"use client";

import React, { useEffect, useState } from "react";

type Slide = {
  src: string;
  title: string;
  subtitle: string;
};

export default function VisionCarousel({ slides, intervalMs = 5000 }: { slides: Slide[]; intervalMs?: number }) {
  const [index, setIndex] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(true);

  // Animate circular progress and advance slide on completion
  useEffect(() => {
    if (slides.length <= 1) return;
    let raf: number;
    const start = performance.now();
    const tick = (t: number) => {
      const elapsed = t - start;
      const p = Math.min(elapsed / intervalMs, 1);
      setProgress(p);
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setIndex((i) => (i + 1) % slides.length);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [index, slides.length, intervalMs]);

  // Reset progress when slide changes
  useEffect(() => {
    setProgress(0);
  }, [index]);

  // Show controls only when carousel is in viewport
  useEffect(() => {
    const el = document.getElementById('vision-carousel');
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => setVisible(e.isIntersecting));
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (!slides || slides.length === 0) return null;
  const active = slides[index];

  return (
    <div id="vision-carousel" className="relative h-[28rem] md:h-[34rem] rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={active.src}
        src={active.src}
        alt={active.title}
        className="w-full h-full object-cover"
        style={{ objectPosition: 'center 20%' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
      <div className="absolute bottom-4 left-4 right-4">
        <h4 className="text-white font-bold text-2xl md:text-3xl mb-2 drop-shadow">{active.title}</h4>
        <p className="text-gray-200 text-sm md:text-base">{active.subtitle}</p>
      </div>
      {/* Progress bar appears only when in viewport */}
      {/* Removed bottom progress bar under images as requested */}
    </div>
  );
}


