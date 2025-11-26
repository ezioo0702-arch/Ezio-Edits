
import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ACLogo } from "./ACLogo";

export const Preloader: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          // Optional: remove from DOM or just let it sit hidden
          if (containerRef.current) {
             containerRef.current.style.pointerEvents = "none";
          }
        }
      });

      // Initial States
      gsap.set(".char", { y: "100%" });
      gsap.set(".logo-char", { y: "100%" });
      gsap.set(".loader-footer-line", { y: "100%" });
      gsap.set(progressBarRef.current, { scaleX: 0, transformOrigin: "left" });

      // 1. Animate Progress Bar (0 to 100%)
      // We break it into steps to simulate "loading" stutter
      const progressTl = gsap.timeline();
      progressTl
        .to(progressBarRef.current, {
          scaleX: 0.2,
          duration: 0.5,
          ease: "power2.out"
        })
        .to(progressBarRef.current, {
          scaleX: 0.45,
          duration: 0.8,
          ease: "power2.inOut"
        })
        .to(progressBarRef.current, {
          scaleX: 0.7,
          duration: 0.4,
          ease: "linear"
        })
        .to(progressBarRef.current, {
          scaleX: 1,
          duration: 0.6,
          ease: "power4.out"
        });

      // 2. Text and Logo Reveal (happens while loading)
      tl.add(progressTl, 0)
        .to(".logo-char", {
          y: "0%",
          duration: 1,
          ease: "power4.inOut"
        }, 0)
        .to(".char", {
          y: "0%",
          stagger: 0.05,
          duration: 1,
          ease: "power4.inOut",
        }, 0.1)
        .to(".loader-footer-line", {
          y: "0%",
          stagger: 0.1,
          duration: 1,
          ease: "power4.inOut",
        }, 0.2);

      // 3. Exit Sequence
      const exitTl = gsap.timeline({ delay: 0.2 });

      // 3a. Hide Text & Logo
      exitTl
        .to(".char", {
          y: "-100%",
          stagger: 0.05,
          duration: 0.8,
          ease: "power4.inOut"
        })
        .to(".logo-char", {
          y: "-100%",
          duration: 0.8,
          ease: "power4.inOut"
        }, "<")
        .to(".loader-footer-line", {
          y: "-100%",
          stagger: 0.1,
          duration: 0.8,
          ease: "power4.inOut"
        }, "<");

      // 3b. Fade out progress bar
      exitTl.to(progressBarRef.current, {
        opacity: 0,
        duration: 0.3
      }, "-=0.5");

      // 3c. The "Mask" Reveal (Expanding Hole)
      // We use a clip-path or mask-image to reveal the content underneath.
      // Since we want the "Capsules" effect (expanding pill/circle), we animate the mask-size.
      exitTl.to(containerRef.current, {
        "--mask-size": "250%", // Expands the transparent hole
        duration: 1.8,
        ease: "power3.inOut",
      }, "-=0.2");

      // 3d. Zoom out the Hero Image (Targeting the ID from Hero component)
      exitTl.fromTo("#hero-content", 
        { scale: 1.3 },
        { scale: 1, duration: 1.8, ease: "power3.inOut" },
        "<"
      );

      tl.add(exitTl);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col justify-between bg-ac-dark text-white overflow-hidden"
      style={{
        // This CSS Mask creates a "hole" that we can expand.
        // transparent = hole, black = visible mask
        maskImage: "radial-gradient(circle at center, transparent var(--mask-size, 0%), black var(--mask-size, 0%))",
        WebkitMaskImage: "radial-gradient(circle at center, transparent var(--mask-size, 0%), black var(--mask-size, 0%))",
        "--mask-size": "0%", // Initial CSS variable
      } as React.CSSProperties}
    >
      {/* Progress Bar */}
      <div className="w-full h-1 bg-gray-900 absolute top-0 left-0">
        <div 
          ref={progressBarRef}
          className="h-full w-full bg-white"
        />
      </div>

      {/* Centered Logo and Text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-4 md:gap-8">
        
        {/* Logo Animation Container */}
        <div className="overflow-hidden">
            <ACLogo className="logo-char w-16 h-16 md:w-24 md:h-24 text-white" />
        </div>

        <h1 
          ref={textRef} 
          className="text-6xl md:text-9xl font-serif font-bold uppercase tracking-tighter flex"
        >
          {/* Manual SplitText simulation */}
          {"EZIO".split("").map((char, i) => (
            <div key={i} className="overflow-hidden">
              <span className="char inline-block origin-bottom">{char}</span>
            </div>
          ))}
        </h1>
      </div>

      {/* Footer */}
      <div ref={footerRef} className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full text-center px-4">
        <div className="overflow-hidden">
            <p className="loader-footer-line text-gray-500 text-sm font-mono uppercase tracking-widest">
            Synchronizing Memory Archives
            </p>
        </div>
      </div>
    </div>
  );
};
