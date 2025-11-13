"use client";
import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Balancer from "react-wrap-balancer";

export function LogoCloud() {
  const logos = [
    {
      name: "Aceternity UI",
      src: "https://assets.aceternity.com/pro/logos/aceternity-ui.png",
    },
    {
      name: "Gamity",
      src: "https://assets.aceternity.com/pro/logos/gamity.png",
    },
    {
      name: "Host it",
      src: "https://assets.aceternity.com/pro/logos/hostit.png",
    },
    {
      name: "Asteroid Kit",
      src: "https://assets.aceternity.com/pro/logos/asteroid-kit.png",
    },
  ];

  return (
    <div className="relative w-full py-12 md:py-4 overflow-hidden">
      <div className="text-balance relative z-20 mx-auto mb-4 max-w-4xl text-center text-lg font-semibold tracking-tight text-gray-700  md:text-3xl px-4">
        <Balancer>
          <h2
            className={cn(
              "inline-block text-center text-[#3D3D3D] font-inter text-[22px] font-semibold"
            )}
          >
            Trusted by Industry Leaders
          </h2>
        </Balancer>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-6 md:gap-10 w-full max-w-3xl mx-auto relative px-4">
        {logos.map((logo, idx) => (
          <div
            key={logo.src + idx}
            className="flex items-center justify-center"
          >
            <Image
              src={logo.src}
              alt={logo.name}
              width={300}
              height={300}
              className="w-full max-w-[200px] object-contain select-none"
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
