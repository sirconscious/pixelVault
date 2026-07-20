"use client";

import { useEffect } from "react";

export default function HomeMotion() {
  useEffect(() => {
    let ctx: { revert: () => void } | null = null;
    let cancelled = false;

    (async () => {
      const gsapMod = await import("gsap");
      const stMod = await import("gsap/ScrollTrigger");
      if (cancelled) return;

      const gsap = gsapMod.default ?? gsapMod.gsap;
      const ScrollTrigger = stMod.ScrollTrigger ?? stMod.default;
      gsap.registerPlugin(ScrollTrigger);

      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const isTouch = window.matchMedia("(pointer: coarse)").matches;

      ctx = gsap.context(() => {
        // Single-item reveals
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          const delay = parseFloat(el.dataset.delay || "0");
          if (prefersReduced) {
            gsap.set(el, { opacity: 1, y: 0 });
            return;
          }
          gsap.fromTo(
            el,
            { opacity: 0, y: 22 },
            {
              opacity: 1,
              y: 0,
              duration: 0.75,
              ease: "power3.out",
              delay,
              scrollTrigger: { trigger: el, start: "top 88%" },
            },
          );
        });

        // Staggered group reveals
        gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((container) => {
          const items = container.querySelectorAll("[data-stagger-item]");
          if (prefersReduced || !items.length) {
            gsap.set(items, { opacity: 1, y: 0 });
            return;
          }
          gsap.fromTo(
            items,
            { opacity: 0, y: 28 },
            {
              opacity: 1,
              y: 0,
              duration: 0.75,
              ease: "power3.out",
              stagger: 0.12,
              scrollTrigger: { trigger: container, start: "top 82%" },
            },
          );
        });

        // Marquee — velocity-driven timeScale
        const marqueeTrack =
          document.querySelector<HTMLElement>(".marquee-track");
        if (marqueeTrack) {
          if (prefersReduced) {
            gsap.to(marqueeTrack, {
              x: "-50%",
              duration: 80,
              repeat: -1,
              ease: "none",
            });
          } else {
            const tween = gsap.to(marqueeTrack, {
              x: "-50%",
              duration: 38,
              repeat: -1,
              ease: "none",
            });
            let currentScale = 1;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let velTween: any = null;
            ScrollTrigger.create({
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onUpdate: (self: any) => {
                const velocity = Math.abs(self.getVelocity());
                const targetScale = gsap.utils.clamp(1, 3.5, 1 + velocity / 350);
                if (velTween) velTween.kill();
                velTween = gsap.to(
                  { s: currentScale },
                  {
                    s: targetScale,
                    duration: 0.4,
                    ease: "power2.out",
                    onUpdate: function (this: gsap.core.Tween) {
                      // @ts-expect-error runtime target access
                      currentScale = this.targets()[0].s;
                      tween.timeScale(currentScale);
                    },
                    onComplete: () => {
                      velTween = gsap.to(
                        { s: currentScale },
                        {
                          s: 1,
                          duration: 1.4,
                          ease: "power2.out",
                          onUpdate: function (this: gsap.core.Tween) {
                            // @ts-expect-error runtime target access
                            currentScale = this.targets()[0].s;
                            tween.timeScale(currentScale);
                          },
                        },
                      );
                    },
                  },
                );
              },
            });
          }
        }

        // Phone chat assembly
        const checkoutSection = document.querySelector("#checkout");
        const bubbles = gsap.utils.toArray<HTMLElement>("[data-bubble]");
        if (checkoutSection && bubbles.length) {
          if (prefersReduced) {
            gsap.set(bubbles, { opacity: 1, y: 0, scale: 1 });
          } else {
            gsap.set(bubbles, { opacity: 0, y: 16, scale: 0.96 });
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: checkoutSection,
                start: "top 50%",
                toggleActions: "play none none reverse",
              },
            });
            bubbles.forEach((bubble, i) => {
              const isTotal = bubble.hasAttribute("data-bubble-total");
              tl.to(
                bubble,
                {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  duration: isTotal ? 0.8 : 0.45,
                  ease: isTotal ? "back.out(1.4)" : "power2.out",
                },
                i * 0.34,
              );
            });
          }
        }
      });

      void isTouch;
      ScrollTrigger.refresh();
      if (document.fonts?.ready) {
        document.fonts.ready.then(() => ScrollTrigger.refresh());
      }
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return null;
}
