"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";

export default function CategoryImage({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className={`bg-base-200 flex items-center justify-center ${className}`}>
        <ImageOff className="w-8 h-8 text-base-content/20" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${className} ${loaded ? "" : "opacity-0"}`}
      onLoad={() => setLoaded(true)}
      onError={() => setError(true)}
    />
  );
}
