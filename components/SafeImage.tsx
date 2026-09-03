"use client";

import React, { useState } from "react";

type SafeImageProps = {
  src: string;
  fallbackSrc?: string;
  alt: string;
  className?: string;
};

export default function SafeImage({ src, fallbackSrc, alt, className }: SafeImageProps) {
  const [currentSrc, setCurrentSrc] = useState<string>(src);

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onError={() => {
        if (fallbackSrc && currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        }
      }}
    />
  );
}


