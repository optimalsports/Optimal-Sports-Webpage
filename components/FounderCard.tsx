"use client";

import React from "react";
import SafeImage from "@/components/SafeImage";

type FounderCardProps = {
  name: string;
  title: string;
  imageSrc: string;
  bio: string;
  credentials: string[];
  imageClassName?: string;
};

export default function FounderCard({ name, title, imageSrc, bio: _bio, credentials: _credentials, imageClassName }: FounderCardProps) {
  // Hover description and badges removed for a cleaner card and more visible imagery

  return (
    <div className="relative bg-black rounded-3xl shadow-2xl overflow-hidden group hover:shadow-red-500/20 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.01]">
      {/* Image area */}
      <div className="relative h-[26rem] w-full overflow-hidden rounded-3xl">
        <SafeImage src={imageSrc} fallbackSrc="/IMG_3743.webp" alt={name} className={`h-full w-full object-cover group-hover:scale-110 transition-transform duration-700 ${imageClassName ?? ''}`.trim()} />

        {/* Title badge top-left */}
        <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold border border-red-500/50">
          {title}
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent"></div>

        {/* Description overlay removed */}

        {/* Bottom info section */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-md border-t border-white/20 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-1 group-hover:text-red-200 transition-colors">{name}</h3>
              <p className="text-red-400 font-semibold text-sm">{title}</p>
            </div>
          </div>
          {/* Badges removed to reveal more of the image */}
        </div>
      </div>
    </div>
  );
}


