"use client";
import React, { useRef, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import Balancer from "react-wrap-balancer";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { div } from "motion/react-client";
import { HeroParallax } from "@/components/ui/hero-parallax";
import { MaskContainer } from "@/components/ui/svg-mask-effect";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if customer is logged in
    const customer = localStorage.getItem("customer");
    setIsLoggedIn(!!customer);
  }, []);

  const handleAuth = () => {
    if (isLoggedIn) {
      localStorage.removeItem("customer");
      setIsLoggedIn(false);
    } else {
      router.push("/auth");
    }
  };

  const products = [
    {
      title: "Farmatodo Venezuela",
      link: "https://www.farmatodo.com.ve/",
      thumbnail:
        "https://aceternity.com/images/products/thumbnails/new/moonbeam.png",
    },
    {
      title: "Cursor",
      link: "https://cursor.so",
      thumbnail:
        "https://aceternity.com/images/products/thumbnails/new/cursor.png",
    },
    {
      title: "Rogue",
      link: "https://userogue.com",
      thumbnail:
        "https://aceternity.com/images/products/thumbnails/new/rogue.png",
    },

    {
      title: "Editorially",
      link: "https://editorially.org",
      thumbnail:
        "https://aceternity.com/images/products/thumbnails/new/editorially.png",
    },
    {
      title: "Editrix AI",
      link: "https://editrix.ai",
      thumbnail:
        "https://aceternity.com/images/products/thumbnails/new/editrix.png",
    },
    {
      title: "Pixel Perfect",
      link: "https://app.pixelperfect.quest",
      thumbnail:
        "https://aceternity.com/images/products/thumbnails/new/pixelperfect.png",
    },

    {
      title: "Algochurn",
      link: "https://algochurn.com",
      thumbnail:
        "https://aceternity.com/images/products/thumbnails/new/algochurn.png",
    },
    {
      title: "Aceternity UI",
      link: "https://ui.aceternity.com",
      thumbnail:
        "https://aceternity.com/images/products/thumbnails/new/aceternityui.png",
    },
    {
      title: "Tailwind Master Kit",
      link: "https://tailwindmasterkit.com",
      thumbnail:
        "https://aceternity.com/images/products/thumbnails/new/tailwindmasterkit.png",
    },
    {
      title: "SmartBridge",
      link: "https://smartbridgetech.com",
      thumbnail:
        "https://aceternity.com/images/products/thumbnails/new/smartbridge.png",
    },
    {
      title: "Renderwork Studio",
      link: "https://renderwork.studio",
      thumbnail:
        "https://aceternity.com/images/products/thumbnails/new/renderwork.png",
    },

    {
      title: "Creme Digital",
      link: "https://cremedigital.com",
      thumbnail:
        "https://aceternity.com/images/products/thumbnails/new/cremedigital.png",
    },
    {
      title: "Golden Bells Academy",
      link: "https://goldenbellsacademy.com",
      thumbnail:
        "https://aceternity.com/images/products/thumbnails/new/goldenbellsacademy.png",
    },
    {
      title: "Invoker Labs",
      link: "https://invoker.lol",
      thumbnail:
        "https://aceternity.com/images/products/thumbnails/new/invoker.png",
    },
    {
      title: "E Free Invoice",
      link: "https://efreeinvoice.com",
      thumbnail:
        "https://aceternity.com/images/products/thumbnails/new/efreeinvoice.png",
    },
  ];

  return (
    <div className="relative">
      <HeroParallax products={products} />
      <div className="absolute top-625 left-0 w-full h-[40rem] flex items-center justify-center overflow-hidden z-[9999] pointer-events-none">
        <div className="pointer-events-auto w-full h-full">
          <MaskContainer
            revealText={
              <p className="mx-auto max-w-4xl text-center text-4xl font-bold text-slate-800 dark:text-white">
                Compra tus productos farmacéuticos de forma rápida y segura.
                Entrega a domicilio en toda Venezuela.
              </p>
            }
            className="h-[40rem] w-full rounded-none border-0 text-white dark:text-black"
          >
            Compra tus productos farmacéuticos de forma rápida y segura. Entrega
            a domicilio en toda Venezuela.
          </MaskContainer>
        </div>
      </div>
    </div>
    // <div
    //   ref={parentRef}
    //   className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-4 pt-24 pb-20 md:px-8 md:pt-32 md:pb-40"
    // >
    //   <BackgroundGrids />
    //   <CollisionMechanism
    //     beamOptions={{
    //       initialX: -400,
    //       translateX: 600,
    //       duration: 7,
    //       repeatDelay: 3,
    //     }}
    //     containerRef={containerRef as React.RefObject<HTMLDivElement>}
    //     parentRef={parentRef as unknown as React.RefObject<HTMLDivElement>}
    //   />
    //   <CollisionMechanism
    //     beamOptions={{
    //       initialX: -200,
    //       translateX: 800,
    //       duration: 4,
    //       repeatDelay: 3,
    //     }}
    //     containerRef={containerRef as React.RefObject<HTMLDivElement>}
    //     parentRef={parentRef as unknown as React.RefObject<HTMLDivElement>}
    //   />
    //   <CollisionMechanism
    //     beamOptions={{
    //       initialX: 200,
    //       translateX: 1200,
    //       duration: 5,
    //       repeatDelay: 3,
    //     }}
    //     containerRef={containerRef as React.RefObject<HTMLDivElement>}
    //     parentRef={parentRef as unknown as React.RefObject<HTMLDivElement>}
    //   />
    //   <CollisionMechanism
    //     containerRef={containerRef as React.RefObject<HTMLDivElement>}
    //     parentRef={parentRef as unknown as React.RefObject<HTMLDivElement>}
    //     beamOptions={{
    //       initialX: 400,
    //       translateX: 1400,
    //       duration: 6,
    //       repeatDelay: 3,
    //     }}
    //   />

    //   <h2 className="relative z-50 mx-auto mt-4 mb-4 max-w-4xl text-center text-3xl font-semibold tracking-tight text-balance text-gray-700 md:text-7xl dark:text-neutral-300">
    //     <Balancer>
    //       Tu farmacia en línea,{" "}
    //       <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
    //         <div className="text-black [text-shadow:0_0_rgba(0,0,0,0.1)] dark:text-white">
    //           <span className="">siempre disponible.</span>
    //         </div>
    //       </div>
    //     </Balancer>
    //   </h2>
    //   <p className="relative z-50 mx-auto mt-4 max-w-lg px-4 text-center text-base/6 text-gray-600 dark:text-gray-200">
    //     Compra tus productos farmacéuticos de forma rápida y segura. Entrega a domicilio en toda Venezuela.
    //   </p>
    //   <div className="mt-8 mb-10 flex w-full flex-col items-center justify-center gap-4 px-8 sm:flex-row md:mb-20">
    //     <Link
    //       href="/tienda"
    //       className="group relative z-20 flex h-10 w-full cursor-pointer items-center justify-center space-x-2 rounded-lg bg-orange-500 p-px px-4 py-2 text-center text-sm leading-6 font-semibold text-white no-underline transition duration-200 hover:bg-orange-600 sm:w-52"
    //     >
    //       Ir a la tienda
    //     </Link>
    //     {!isLoggedIn && (
    //       <Link
    //         href="/auth"
    //         className="shadow-input group relative z-20 flex h-10 w-full cursor-pointer items-center justify-center space-x-2 rounded-lg bg-white p-px px-4 py-2 text-sm leading-6 font-semibold text-black no-underline transition duration-200 hover:-translate-y-0.5 sm:w-52 dark:bg-neutral-800 dark:text-white"
    //       >
    //         Registrarse
    //       </Link>
    //     )}
    //   </div>
    //   <div
    //     ref={containerRef}
    //     className="relative mx-auto max-w-7xl rounded-[32px] border border-neutral-200/50 bg-neutral-100 p-2 backdrop-blur-lg md:p-4 dark:border-neutral-700 dark:bg-neutral-800/50"
    //   >
    //     <div className="rounded-[24px] border border-neutral-200 bg-white p-2 dark:border-neutral-700 dark:bg-black">
    //       <img
    //         src="https://assets.aceternity.com/pro/aceternity-landing.webp"
    //         alt="header"
    //         width={1920}
    //         height={1080}
    //         className="rounded-[20px]"
    //       />
    //     </div>
    //   </div>
    // </div>
  );
}

const BackgroundGrids = () => {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 grid h-full w-full -rotate-45 transform grid-cols-2 gap-10 select-none md:grid-cols-4">
      <div className="relative h-full w-full">
        <GridLineVertical className="left-0" />
        <GridLineVertical className="right-0 left-auto" />
      </div>
      <div className="relative h-full w-full">
        <GridLineVertical className="left-0" />
        <GridLineVertical className="right-0 left-auto" />
      </div>
      <div className="relative h-full w-full bg-gradient-to-b from-transparent via-neutral-100 to-transparent dark:via-neutral-800">
        <GridLineVertical className="left-0" />
        <GridLineVertical className="right-0 left-auto" />
      </div>
      <div className="relative h-full w-full">
        <GridLineVertical className="left-0" />
        <GridLineVertical className="right-0 left-auto" />
      </div>
    </div>
  );
};

const CollisionMechanism = React.forwardRef<
  HTMLDivElement,
  {
    containerRef: React.RefObject<HTMLDivElement>;
    parentRef: React.RefObject<HTMLDivElement>;
    beamOptions?: {
      initialX?: number;
      translateX?: number;
      initialY?: number;
      translateY?: number;
      rotate?: number;
      className?: string;
      duration?: number;
      delay?: number;
      repeatDelay?: number;
    };
  }
>(({ parentRef, containerRef, beamOptions = {} }, ref) => {
  const beamRef = useRef<HTMLDivElement>(null);
  const [collision, setCollision] = useState<{
    detected: boolean;
    coordinates: { x: number; y: number } | null;
  }>({ detected: false, coordinates: null });
  const [beamKey, setBeamKey] = useState(0);
  const [cycleCollisionDetected, setCycleCollisionDetected] = useState(false);

  useEffect(() => {
    const checkCollision = () => {
      if (
        beamRef.current &&
        containerRef.current &&
        parentRef.current &&
        !cycleCollisionDetected
      ) {
        const beamRect = beamRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        const parentRect = parentRef.current.getBoundingClientRect();

        if (beamRect.bottom >= containerRect.top) {
          const relativeX =
            beamRect.left - parentRect.left + beamRect.width / 2;
          const relativeY = beamRect.bottom - parentRect.top;

          setCollision({
            detected: true,
            coordinates: { x: relativeX, y: relativeY },
          });
          setCycleCollisionDetected(true);
          if (beamRef.current) {
            beamRef.current.style.opacity = "0";
          }
        }
      }
    };

    const animationInterval = setInterval(checkCollision, 50);

    return () => clearInterval(animationInterval);
  }, [cycleCollisionDetected, containerRef]);

  useEffect(() => {
    if (collision.detected && collision.coordinates) {
      setTimeout(() => {
        setCollision({ detected: false, coordinates: null });
        setCycleCollisionDetected(false);
        // Set beam opacity to 0
        if (beamRef.current) {
          beamRef.current.style.opacity = "1";
        }
      }, 2000);

      // Reset the beam animation after a delay
      setTimeout(() => {
        setBeamKey((prevKey) => prevKey + 1);
      }, 2000);
    }
  }, [collision]);

  return (
    <>
      <motion.div
        key={beamKey}
        ref={beamRef}
        animate="animate"
        initial={{
          translateY: beamOptions.initialY || "-200px",
          translateX: beamOptions.initialX || "0px",
          rotate: beamOptions.rotate || -45,
        }}
        variants={{
          animate: {
            translateY: beamOptions.translateY || "800px",
            translateX: beamOptions.translateX || "700px",
            rotate: beamOptions.rotate || -45,
          },
        }}
        transition={{
          duration: beamOptions.duration || 8,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
          delay: beamOptions.delay || 0,
          repeatDelay: beamOptions.repeatDelay || 0,
        }}
        className={cn(
          "absolute top-20 left-96 m-auto h-14 w-px rounded-full bg-gradient-to-t from-orange-500 via-yellow-500 to-transparent",
          beamOptions.className
        )}
      />
      <AnimatePresence>
        {collision.detected && collision.coordinates && (
          <Explosion
            key={`${collision.coordinates.x}-${collision.coordinates.y}`}
            className=""
            style={{
              left: `${collision.coordinates.x + 20}px`,
              top: `${collision.coordinates.y}px`,
              transform: "translate(-50%, -50%)",
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
});

CollisionMechanism.displayName = "CollisionMechanism";

const Explosion = ({ ...props }: React.HTMLProps<HTMLDivElement>) => {
  const spans = Array.from({ length: 20 }, (_, index) => ({
    id: index,
    initialX: 0,
    initialY: 0,
    directionX: Math.floor(Math.random() * 80 - 40),
    directionY: Math.floor(Math.random() * -50 - 10),
  }));

  return (
    <div {...props} className={cn("absolute z-50 h-2 w-2", props.className)}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute -inset-x-10 top-0 m-auto h-[4px] w-10 rounded-full bg-gradient-to-r from-transparent via-orange-500 to-transparent blur-sm"
      ></motion.div>
      {spans.map((span) => (
        <motion.span
          key={span.id}
          initial={{ x: span.initialX, y: span.initialY, opacity: 1 }}
          animate={{ x: span.directionX, y: span.directionY, opacity: 0 }}
          transition={{ duration: Math.random() * 1.5 + 0.5, ease: "easeOut" }}
          className="absolute h-1 w-1 rounded-full bg-gradient-to-b from-orange-500 to-yellow-500"
        />
      ))}
    </div>
  );
};

const GridLineVertical = ({
  className,
  offset,
}: {
  className?: string;
  offset?: string;
}) => {
  return (
    <div
      style={
        {
          "--background": "#ffffff",
          "--color": "rgba(0, 0, 0, 0.2)",
          "--height": "5px",
          "--width": "1px",
          "--fade-stop": "90%",
          "--offset": offset || "150px", //-100px if you want to keep the line inside
          "--color-dark": "rgba(255, 255, 255, 0.3)",
          maskComposite: "exclude",
        } as React.CSSProperties
      }
      className={cn(
        "absolute top-[calc(var(--offset)/2*-1)] h-[calc(100%+var(--offset))] w-[var(--width)]",
        "bg-[linear-gradient(to_bottom,var(--color),var(--color)_50%,transparent_0,transparent)]",
        "[background-size:var(--width)_var(--height)]",
        "[mask:linear-gradient(to_top,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_bottom,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)]",
        "[mask-composite:exclude]",
        "z-30",
        "dark:bg-[linear-gradient(to_bottom,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]",
        className
      )}
    ></div>
  );
};
