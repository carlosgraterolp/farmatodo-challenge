"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export const MaskContainer = ({
  children,
  revealText,
  size = 10,
  revealSize = 600,
  className,
}: {
  children?: string | React.ReactNode;
  revealText?: string | React.ReactNode;
  size?: number;
  revealSize?: number;
  className?: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState<{
    x: number | null;
    y: number | null;
  }>({ x: null, y: null });
  const [isMobile, setIsMobile] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1024);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateMousePosition = (e: MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const updateTouchPosition = (e: TouchEvent) => {
    if (!containerRef.current) return;
    const touch = e.touches[0] || e.changedTouches[0];
    const rect = containerRef.current.getBoundingClientRect();
    setMousePosition({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    });
  };

  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setWindowWidth(width);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    if (!containerRef.current) return;

    containerRef.current.addEventListener("mousemove", updateMousePosition);
    containerRef.current.addEventListener("touchmove", updateTouchPosition);
    containerRef.current.addEventListener("touchstart", updateTouchPosition);

    return () => {
      window.removeEventListener("resize", checkMobile);
      if (containerRef.current) {
        containerRef.current.removeEventListener(
          "mousemove",
          updateMousePosition
        );
        containerRef.current.removeEventListener(
          "touchmove",
          updateTouchPosition
        );
        containerRef.current.removeEventListener(
          "touchstart",
          updateTouchPosition
        );
      }
    };
  }, []);

  // Make revealSize responsive
  const responsiveRevealSize = isMobile
    ? Math.min(revealSize * 0.6, 300)
    : windowWidth < 1024
    ? revealSize * 0.8
    : revealSize;

  const maskSize = isHovered ? responsiveRevealSize : size;

  return (
    <motion.div
      ref={containerRef}
      className={cn("relative h-full z-9999", className)}
      animate={{
        backgroundColor: isHovered ? "var(--slate-900)" : "var(--white)",
      }}
      transition={{
        backgroundColor: { duration: 0.3 },
      }}
    >
      <motion.div
        className="absolute flex h-full w-full items-center justify-center bg-black text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl [mask-image:url(/mask.svg)] [mask-repeat:no-repeat] [mask-size:20px] sm:[mask-size:30px] md:[mask-size:40px] dark:bg-white"
        animate={{
          maskPosition:
            mousePosition.x !== null && mousePosition.y !== null
              ? `${mousePosition.x - maskSize / 2}px ${
                  mousePosition.y - maskSize / 2
                }px`
              : "50% 50%",
          maskSize: `${maskSize}px`,
        }}
        transition={{
          maskSize: { duration: 0.3, ease: "easeInOut" },
          maskPosition: { duration: 0.15, ease: "linear" },
        }}
      >
        <div className="absolute inset-0 z-0 h-full w-full bg-black opacity-50 dark:bg-white" />
        <div
          onMouseEnter={() => {
            setIsHovered(true);
          }}
          onMouseLeave={() => {
            setIsHovered(false);
          }}
          onTouchStart={() => {
            setIsHovered(true);
          }}
          onTouchEnd={() => {
            setIsHovered(false);
          }}
          className="relative z-20 mx-auto max-w-4xl px-4 text-center text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold"
        >
          {children}
        </div>
      </motion.div>

      <div className="flex h-full w-full items-center justify-center">
        {revealText}
      </div>
    </motion.div>
  );
};
