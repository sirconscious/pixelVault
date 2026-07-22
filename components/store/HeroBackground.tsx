"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const PixelBlast = dynamic(
  () => import("@/components/ui/PixelBlast"),
  { ssr: false },
);

export default function HeroBackground() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setShow(mq.matches);
    const handler = (e: MediaQueryListEvent) => setShow(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  if (!show) return null;

  return (
    <div className="absolute inset-0 z-0">
      <PixelBlast
        variant="circle"
        pixelSize={6}
        color="#a78bfa"
        patternScale={3}
        patternDensity={2.5}
        pixelSizeJitter={0.5}
        enableRipples
        rippleSpeed={0.4}
        rippleThickness={0.12}
        rippleIntensityScale={1.5}
        liquid
        liquidStrength={0.12}
        liquidRadius={1.2}
        liquidWobbleSpeed={5}
        speed={0.6}
        edgeFade={0.25}
        transparent
      />
    </div>
  );
}
