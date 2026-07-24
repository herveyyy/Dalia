"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@repo/ui/lib/utils";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
}

export function ScrollReveal({ children, className, delayMs = 0 }: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          if (ref.current) observer.unobserve(ref.current);
        }
      },
      { threshold: 0.12 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delayMs}ms` }}
      className={cn(
        "transition-all duration-700 ease-out",
        isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-8 scale-[0.98]",
        className
      )}
    >
      {children}
    </div>
  );
}
