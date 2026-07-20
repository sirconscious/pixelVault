"use client";

import { useEffect, useRef, useState } from "react";
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
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, []);

  if (error || !src) {
    return (
      <div className={`bg-base-200 flex items-center justify-center ${className}`}>
        <ImageOff className="w-8 h-8 text-base-content/20" />
      </div>
    );
  }

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      className={`${className} ${loaded ? "" : "opacity-0"}`}
      onLoad={() => setLoaded(true)}
      onError={() => setError(true)}
    />
  );
}
