"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

const SESSION_KEY = "hasSeenIntro";
const MIN_DISPLAY_MS = 700;
const IRIS_DURATION_MS = 1300;
const REDUCED_FADE_MS = 400;

export const PIXELBLAST_READY_EVENT = "pixelblast-ready";

export default function IntroLoader({ children }: { children: React.ReactNode }) {
  const [skip, setSkip] = useState(true);
  const [phase, setPhase] = useState<
    "idle" | "fading" | "iris-settle" | "iris-wipe" | "done"
  >("done");
  const pixelReadyRef = useRef(false);
  const pixelResolveRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY) === "true") {
        setSkip(true);
        setPhase("done");
        return;
      }
    } catch {}

    setSkip(false);
    setPhase("idle");

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const pixelPromise = new Promise<void>((resolve) => {
      pixelResolveRef.current = resolve;
    });

    const handler = () => {
      if (!pixelReadyRef.current) {
        pixelReadyRef.current = true;
        pixelResolveRef.current?.();
      }
    };
    window.addEventListener(PIXELBLAST_READY_EVENT, handler);

    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    const minTime = new Promise<void>((r) => setTimeout(r, MIN_DISPLAY_MS));

    Promise.all([fontsReady, pixelPromise, minTime]).then(() => {
      if (prefersReduced) {
        setPhase("fading");
        setTimeout(() => {
          setPhase("done");
          try { sessionStorage.setItem(SESSION_KEY, "true"); } catch {}
        }, REDUCED_FADE_MS);
      } else {
        // Step 1: Apply mask + transition at --r: 100% (overlay still full)
        setPhase("iris-settle");
        // Step 2: Next frame, change --r to 0% → transition fires
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setPhase("iris-wipe");
          });
        });
        setTimeout(() => {
          setPhase("done");
          try { sessionStorage.setItem(SESSION_KEY, "true"); } catch {}
        }, IRIS_DURATION_MS + 300);
      }
    });

    return () => {
      window.removeEventListener(PIXELBLAST_READY_EVENT, handler);
    };
  }, []);

  const handleReady = useCallback(() => {
    if (!pixelReadyRef.current) {
      pixelReadyRef.current = true;
      pixelResolveRef.current?.();
    }
  }, []);

  if (skip || phase === "done") {
    return (
      <IntroLoaderContext.Provider value={{ onReady: handleReady }}>
        {children}
      </IntroLoaderContext.Provider>
    );
  }

  const showSpinner = phase === "idle" || phase === "fading";
  const hasMask = phase === "iris-settle" || phase === "iris-wipe";
  // iris-settle: --r starts at 100% (full), transition is applied
  // iris-wipe: --r goes to 0% (empty), transition fires
  const maskRadius = phase === "iris-wipe" ? "0%" : "100%";

  return (
    <IntroLoaderContext.Provider value={{ onReady: handleReady }}>
      {children}
      <div
        className="fixed inset-0 z-[9999] pointer-events-none"
        style={{ background: "var(--color-base-100)" }}
      >
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-4"
          style={
            {
              maskImage: hasMask
                ? "circle(var(--r) at 50% 50%)"
                : undefined,
              WebkitMaskImage: hasMask
                ? "circle(var(--r) at 50% 50%)"
                : undefined,
              "--r": hasMask ? maskRadius : undefined,
              transition: hasMask
                ? "--r 1.3s cubic-bezier(0.65, 0, 0.35, 1)"
                : phase === "fading"
                  ? `opacity ${REDUCED_FADE_MS}ms ease-out`
                  : undefined,
              opacity: phase === "fading" ? 0 : 1,
            } as React.CSSProperties
          }
        >
          <div
            className="w-7 h-7 rounded-full border-2 border-current"
            style={{
              color: "var(--color-primary)",
              borderTopColor: "transparent",
              animation: showSpinner
                ? "intro-spin 0.8s linear infinite"
                : "none",
              opacity: showSpinner ? 1 : 0,
              transition: "opacity 300ms ease-out",
            }}
          />
          <span
            className="font-mono text-xs uppercase tracking-widest"
            style={{
              color: "var(--color-base-content)",
              opacity: showSpinner ? 0.4 : 0,
              transition: "opacity 300ms ease-out",
            }}
          >
            loading
          </span>
        </div>
      </div>
    </IntroLoaderContext.Provider>
  );
}

const IntroLoaderContext = React.createContext<{ onReady: () => void }>({
  onReady: () => {},
});
export { IntroLoaderContext };
