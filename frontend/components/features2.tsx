"use client";

import { cn } from "@/lib/utils";
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import type { Transition } from "framer-motion";
import Image from "next/image";
import DottedMap from "dotted-map";
import {
  IconBrandDiscord,
  IconBrandFacebook,
  IconBrandLinkedin,
  IconBrandReddit,
  IconBrandTwitch,
  IconBrandTwitter,
  IconBrandYoutube,
  IconCircleArrowLeft,
} from "@tabler/icons-react";
import { Logo, LogoIcon } from "./logo";

export function Features2() {
  return (
    <div
      id="product"
      className="w-full max-w-7xl mx-auto py-4 px-4 md:px-8 md:my-20 md:py-20"
    >
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-6xl font-bold mb-4">
          Features so good you&apos;ll{" "}
          <span className="text-[#FF7757]">Love us</span>
        </h2>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Packed with thousands of features, we are going to show you only 4
          because bento looks the best with that
        </p>
      </div>
      <div className="mt-20  grid cols-1 lg:grid-cols-5 gap-4 auto-rows-[25rem] max-w-3xl mx-auto lg:max-w-none">
        <Card className="flex relative flex-col justify-between lg:col-span-3">
          <div className="absolute inset-0">
            <MapView />
          </div>
          <div className="absolute z-10 inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-white via-white to-transparent" />
          <CardContent className="absolute z-10 bottom-0">
            <CardTitle>Connect with people all over the world</CardTitle>
            <CardDescription>
              Our servers are available all over the world except Asia,
              Australia, Europe, North America, South America and Africa.
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="flex flex-col relative justify-between lg:col-span-2">
          <Chart />
          <div className="absolute z-10 inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-white via-white to-transparent" />
          <CardContent className="absolute z-10 bottom-0">
            <CardTitle>Superb Analytics</CardTitle>
            <CardDescription>
              With our realtime dashboards, get a view of who&apos;s using your
              links and sending it to other people.
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="flex flex-col relative justify-between lg:col-span-2 bg-transparent">
          <div className="absolute inset-0 flex items-center justify-center">
            <LogoOrbit />
          </div>
          <div className="absolute z-10 inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-white via-white to-transparent" />
          <CardContent className="absolute  z-10 bottom-0">
            <CardTitle>Fancy ecosystem</CardTitle>
            <CardDescription>
              Connects with every other automation tool out there, zapier, meta
              you name it.
            </CardDescription>
          </CardContent>
          <div className="absolute right-4 bottom-4 opacity-10 md:opacity-100"></div>
        </Card>

        <Card className="flex flex-col justify-between lg:col-span-3">
          <CardSkeletonBody>
            <div className="w-full h-full p-4 rounded-lg px-2 md:px-10 mt-6">
              <DashboardCard />
            </div>
          </CardSkeletonBody>
          <CardContent className="h-40">
            <CardTitle>Easy to use</CardTitle>
            <CardDescription>We spend 90% of our budget on UX.</CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export const SkeletonTwo = () => {
  return (
    <div className="h-60 md:h-60  flex flex-col items-center relative bg-transparent mt-10"></div>
  );
};

// Card structure
const CardSkeletonBody = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("overflow-hidden relative w-full h-full", className)}>
      {children}
    </div>
  );
};

const CardContent = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={cn("p-6", className)}>{children}</div>;
};

const CardTitle = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h3
      className={cn(
        "inline-block text-[22px] font-[500] leading-[31px] font-rubik text-black",
        className
      )}
    >
      {children}
    </h3>
  );
};
const CardDescription = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <p
      className={cn(
        "font-sans max-w-sm text-sm font-normal tracking-tight mt-2 text-neutral-400",
        className
      )}
    >
      {children}
    </p>
  );
};

const Card = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <motion.div
      whileHover="animate"
      className={cn(
        "group relative isolate flex flex-col rounded-2xl !bg-[#F9FAFB] shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] overflow-hidden",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

const MapView = () => {
  const svgMap = useMemo(() => {
    const map = new DottedMap({
      height: 40,
      grid: "diagonal",
    });

    return map.getSVG({
      radius: 0.15,
      color: "#000000",
      shape: "circle",
    });
  }, []);

  const people = [
    {
      name: "Kishore",
      x: "10%",
      y: "4%",
      photo: "/images/kishore_gunnam.jpg",
    },
    {
      name: "John",
      x: "65%",
      y: "35%",
      photo: "/images/person3.png",
    },
    {
      name: "Manu",
      x: "50%",
      y: "20%",
      photo: "/images/manu_arora.jpg",
    },
    {
      name: "James",
      x: "80%",
      y: "25%",
      photo: "/images/person4.png",
    },
    {
      name: "Emily",
      x: "30%",
      y: "45%",
      photo: "/images/person5.png",
    },
  ];

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className="absolute inset-0 transition-opacity duration-300">
        <Image
          src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
          className="h-full w-full object-cover absolute top-0 -right-2 -mt-14 
            [mask-image:linear-gradient(to_bottom,transparent,white_15%,white_85%,transparent)]
            pointer-events-none select-none opacity-50"
          alt="Interactive world map visualization"
          height={595}
          width={356}
          priority={true}
          draggable={false}
        />
      </div>

      <div className="absolute inset-0">
        {people.map((person, index) => (
          <div
            key={index}
            className="absolute"
            style={{
              left: person.x,
              top: person.y,
            }}
          >
            <Image
              src={person.photo}
              alt={person.name}
              width={40}
              height={40}
              className="rounded-full border-2 border-white shadow-lg"
            />
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white rounded-lg border-[1.5px] border-white/40 bg-[#103685] mix-blend-luminosity shadow-[0px_10px_15px_-6px_#000,0px_4px_6px_-4px_rgba(0,0,0,0.10),0px_0px_8px_0px_rgba(248,248,248,0.25)_inset,0px_32px_24px_-16px_rgba(0,0,0,0.40)] backdrop-blur-[6px]">
              {person.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Chart = () => {
  return (
    <div className="bg-white mx-auto m-4 rounded-[18px_18px_0px_0px] border border-[#E1E1E1] border-[0.4px] p-2 max-w-[290px] w-full shadow-[0px_37px_10px_0px_rgba(0,0,0,0.00),0px_24px_10px_0px_rgba(0,0,0,0.01),0px_13px_8px_0px_rgba(0,0,0,0.02),0px_6px_6px_0px_rgba(0,0,0,0.03),0px_1px_3px_0px_rgba(0,0,0,0.04)]">
      {/* Window Controls */}
      <div className="flex gap-2 mb-8">
        <div className="w-3 h-3 rounded-full bg-[#FF5F57] cursor-pointer hover:opacity-80"></div>
        <div className="w-3 h-3 rounded-full bg-[#FEBC2E] cursor-pointer hover:opacity-80"></div>
        <div className="w-3 h-3 rounded-full bg-[#28C840] cursor-pointer hover:opacity-80"></div>
      </div>

      {/* Chart Container */}
      <div className="relative mx-auto h-[200px] w-[260px]">
        {/* Chart Bars */}
        <div className="absolute bottom-16 top-0 left-0 right-0 flex items-end justify-between gap-4 h-[190px]">
          {/* Cursor Line */}
          <div className="w-full h-[30%] rounded-t-[15px] bg-[linear-gradient(180deg,#BFBFBF_0%,#FFF_100%),linear-gradient(90deg,#D9D9D9_0%,#737373_100%)] hover:opacity-80 cursor-pointer transition-opacity"></div>
          <div className="w-full h-[70%] rounded-t-[15px] bg-[linear-gradient(180deg,#BFBFBF_0%,#FFF_100%),linear-gradient(90deg,#D9D9D9_0%,#737373_100%)] hover:opacity-80 cursor-pointer transition-opacity"></div>
          <div className="w-full h-[40%] rounded-t-[15px] bg-[linear-gradient(180deg,#BFBFBF_0%,#FFF_100%),linear-gradient(90deg,#D9D9D9_0%,#737373_100%)] hover:opacity-80 cursor-pointer transition-opacity"></div>
          <div className="w-full h-[80%] rounded-t-[15px] bg-[linear-gradient(180deg,#BFBFBF_0%,#FFF_100%),linear-gradient(90deg,#D9D9D9_0%,#737373_100%)] hover:opacity-80 cursor-pointer transition-opacity"></div>
          <div className="w-full h-[50%] rounded-t-[15px] bg-[linear-gradient(180deg,#BFBFBF_0%,#FFF_100%),linear-gradient(90deg,#D9D9D9_0%,#737373_100%)] hover:opacity-80 cursor-pointer transition-opacity"></div>
          <div className="w-full h-[100%] rounded-t-[15px] bg-[linear-gradient(180deg,#FEA353_0%,#FFF_100%),linear-gradient(90deg,#D9D9D9_0%,#737373_100%)] hover:opacity-90 cursor-pointer transition-opacity relative"></div>
        </div>

        {/* User Labels */}
        <motion.div
          className="absolute top-10 -left-10"
          initial={{ x: -20, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          whileHover={{ x: 5 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-2">
            <div className="bg-[#103685] text-white px-4 py-1.5 rounded-lg text-sm cursor-none hover:opacity-90 transition-opacity border border-white/40 flex items-center gap-2 shadow-[0px_0px_8px_0px_rgba(248,248,248,0.25)_inset,0px_32px_24px_-16px_rgba(0,0,0,0.40)] backdrop-blur-[6px] mix-blend-luminosity">
              Manu
              <CursorIcon className="absolute -top-4 -right-4" />
            </div>
          </div>
        </motion.div>
        <motion.div
          className="absolute top-0 -right-20"
          initial={{ x: 20, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          whileHover={{ x: -5 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-2">
            <div className="bg-[#103685] relative text-white px-4 py-1.5 rounded-lg text-sm cursor-none hover:opacity-90 transition-opacity border border-white/40 flex items-center gap-2 shadow-[0px_0px_8px_0px_rgba(248,248,248,0.25)_inset,0px_32px_24px_-16px_rgba(0,0,0,0.40)] backdrop-blur-[6px] mix-blend-luminosity">
              <CursorIcon className="scale-x-[-1] absolute -top-4 -left-4" />
              Kishore
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <div className="absolute p-1 justify-between bg-white border border-neutral-200 -bottom-4 -left-10 -right-10 flex rounded-full items-center gap-4">
          <div></div>
          <button className="text-white text-right px-6 py-2 rounded-[37px] bg-[linear-gradient(181deg,#5E5E5E_18.12%,#000_99.57%)] shadow-[0px_1px_1px_2px_rgba(255,255,255,0.40)_inset,0px_-1px_5px_2px_rgba(255,255,255,0.40)_inset,0px_10px_20px_0px_rgba(0,0,0,0.10),0px_3px_6px_0px_rgba(0,0,0,0.05),0px_4px_8px_0px_rgba(3,7,18,0.06),0px_2px_4px_0px_rgba(3,7,18,0.06),0px_0px_0px_1px_rgba(3,7,18,0.08)] cursor-pointer">
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

const CursorIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="21"
      viewBox="0 0 22 21"
      fill="none"
      className={className}
    >
      <path
        d="M16.9492 2.29758C17.135 2.22487 17.3235 2.15109 17.4831 2.10476C17.6345 2.06081 17.9271 1.98678 18.246 2.08721C18.6115 2.20235 18.904 2.4788 19.0396 2.83725C19.1578 3.14991 19.1004 3.44625 19.0651 3.59991C19.0278 3.76189 18.9648 3.95425 18.9027 4.14384L14.5057 17.5726C14.4285 17.8084 14.3545 18.0346 14.2801 18.2093C14.2172 18.3569 14.0739 18.68 13.7478 18.8696C13.3912 19.0769 12.9553 19.0949 12.5828 18.9178C12.2421 18.7558 12.0726 18.4456 11.9977 18.3037C11.9091 18.1357 11.8167 17.9164 11.7203 17.6878L9.41629 12.2247L3.83184 10.2325C3.59818 10.1491 3.37405 10.0692 3.20135 9.99022C3.05543 9.9235 2.73621 9.77174 2.55526 9.44076C2.3574 9.07885 2.35082 8.64263 2.53766 8.27491C2.70853 7.93862 3.02303 7.77729 3.16687 7.7062C3.33713 7.62204 3.55874 7.53539 3.78982 7.44503L16.9492 2.29758Z"
        fill="#121212"
        stroke="#F8F8F8"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const OrbitingIcons = ({
  centerIcon,
  orbits,
  className,
}: {
  centerIcon?: React.ReactNode;
  orbits: Array<{
    icons: React.ReactNode[];
    radius?: number;
    speed?: number;
    rotationDirection?: "clockwise" | "anticlockwise";
    className?: string;
  }>;
  className?: string;
}) => {
  // Precalculate all orbit data
  const orbitData = React.useMemo(() => {
    return orbits.map((orbit, orbitIndex) => {
      const radius = orbit.radius || 100 + orbitIndex * 80;
      const speed = orbit.speed || 1;
      const iconCount = orbit.icons.length;

      // Calculate angles for each icon with even distribution
      const angleStep = 360 / iconCount;
      const angles = Array.from({ length: iconCount }, (_, i) => angleStep * i);

      // Precalculate positions and animations for each icon
      const iconData = angles.map((angle) => {
        const rotationAngle =
          orbit.rotationDirection === "clockwise"
            ? [angle, angle - 360]
            : [angle, angle + 360];

        return {
          angle,
          rotationAngle,
          position: {
            x: radius * Math.cos((angle * Math.PI) / 180),
            y: radius * Math.sin((angle * Math.PI) / 180),
          },
          animation: {
            initial: {
              rotate: angle,
              scale: 1,
              opacity: 1,
            },
            animate: {
              rotate: rotationAngle,
              scale: 1,
              opacity: 1,
            },
            transition: {
              rotate: {
                duration: speed,
                repeat: Infinity,
                ease: "linear",
              },
            },
            counterRotation: {
              initial: { rotate: -angle },
              animate: {
                rotate:
                  orbit.rotationDirection === "clockwise"
                    ? [-angle, -angle + 360]
                    : [-angle, -angle - 360],
              },
              transition: {
                duration: speed,
                repeat: Infinity,
                ease: "linear",
              },
            },
          },
        };
      });

      return {
        radius,
        speed,
        iconData,
        rotationDirection: orbit.rotationDirection,
        className: orbit.className,
      };
    });
  }, [orbits]);

  return (
    <div className={cn("relative w-[200px] h-[200px]", className)}>
      {centerIcon && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          {centerIcon}
        </div>
      )}
      {orbitData.map((orbit, orbitIndex) => (
        <div
          key={orbitIndex}
          className="absolute top-0 left-0 w-full h-full"
          style={{ zIndex: orbits.length - orbitIndex }}
        >
          <div
            className={cn(
              "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full",
              orbit.className
            )}
            style={{
              width: orbit.radius * 2 + "px",
              height: orbit.radius * 2 + "px",
            }}
          />

          {orbit.iconData.map((icon, iconIndex) => (
            <motion.div
              key={iconIndex}
              className="absolute"
              style={{
                width: "40px",
                height: "40px",
                left: `calc(50% - 20px)`,
                top: `calc(50% - 20px)`,
                transformOrigin: "center center",
              }}
              initial={icon.animation.initial}
              animate={icon.animation.animate}
              transition={icon.animation.transition as Transition}
            >
              <div
                style={{
                  position: "absolute",
                  left: `${orbit.radius}px`,
                  transformOrigin: "center center",
                }}
              >
                <motion.div
                  initial={icon.animation.counterRotation.initial}
                  animate={icon.animation.counterRotation.animate}
                  transition={
                    icon.animation.counterRotation.transition as Transition
                  }
                  className="w-8 h-8 rounded-full bg-gray-700 p-2 flex items-center justify-center border-[0.7px] border-[#E4E4E4] bg-gradient-to-b mix-blend-luminosity shadow-[inset_0px_0px_8px_0px_rgba(248,248,248,0.25)] drop-shadow-[0px_4px_6px_rgba(0,0,0,0.10)]  will-change-transform"
                >
                  {orbits[orbitIndex].icons[iconIndex]}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  );
};

const LogoOrbit = () => {
  const orbit1Icons = [
    <IconBrandTwitter key="twitter" className="w-8 h-8 text-white" />,
    <IconBrandFacebook key="facebook" className="w-8 h-8 text-white" />,
    <IconBrandLinkedin key="linkedin" className="w-8 h-8 text-white" />,
  ];

  const orbit2Icons = [
    <IconBrandYoutube key="youtube" className="w-6 h-6 text-white" />,
    <IconBrandTwitch key="twitch" className="w-6 h-6 text-white" />,
    <IconBrandReddit key="reddit" className="w-6 h-6 text-white" />,
    <IconBrandDiscord key="discord" className="w-6 h-6 text-white" />,
  ];

  return (
    <OrbitingIcons
      centerIcon={<LogoIcon className="h-10 w-10" />}
      orbits={[
        {
          icons: orbit1Icons,
          rotationDirection: "anticlockwise",
          radius: 50,
          speed: 9,
          className: "bg-white",
        },
        {
          icons: orbit2Icons,
          rotationDirection: "anticlockwise",
          radius: 90,
          speed: 15,
          className:
            "bg-[radial-gradient(circle,rgba(249,250,251,1)_0%,rgba(255,187,128,1)_50%,rgba(254,166,89,1)_100%)]",
        },
        {
          icons: orbit1Icons,
          rotationDirection: "clockwise",
          radius: 140,
          speed: 7,
          className: "bg-white",
        },
        {
          icons: orbit2Icons,
          rotationDirection: "anticlockwise",
          radius: 180,
          speed: 15,
          className:
            "bg-[radial-gradient(circle,rgba(249,250,251,1)_0%,rgba(255,187,128,1)_50%,rgba(254,166,89,1)_100%)]",
        },
      ]}
    />
  );
};

const DashboardCard = () => {
  return (
    <div className="w-full h-full p-4 bg-white border border-gray-200 rounded-xl">
      {/* Dashboard Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex items-center gap-2 mb-6"
      >
        <div className="flex gap-2">
          <motion.div
            whileHover={{ scale: 1.2 }}
            className="w-3 h-3 rounded-full bg-[#FF5F57]"
          ></motion.div>
          <motion.div
            whileHover={{ scale: 1.2 }}
            className="w-3 h-3 rounded-full bg-[#FEBC2E]"
          ></motion.div>
          <motion.div
            whileHover={{ scale: 1.2 }}
            className="w-3 h-3 rounded-full bg-[#28C840]"
          ></motion.div>
        </div>
      </motion.div>

      {/* Dashboard Content */}
      <div className="flex flex-col md:flex-row h-full gap-4">
        {/* Left Panel - User Profile */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          whileHover={{ scale: 1.02 }}
          className="flex-shrink-0 bg-[#F9FAFB] p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="rounded-full bg-gray-200 overflow-hidden ring-2 ring-white"
              >
                <Image
                  src="/images/kishore_gunnam.jpg"
                  alt="Kishore Gunnam Profile"
                  width={56}
                  height={56}
                  className="w-14 h-14 object-cover hover:scale-105 transition-transform shrink-0"
                />
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"
              />
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="space-y-1"
            >
              <div className="text-[10px] md:text-xs font-medium text-gray-400 tracking-wider">
                DESIGNER ENGINEER
              </div>
              <div className="text-xs md:text-lg font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Kishore Gunnam
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Panel - Content Area */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          whileHover={{ scale: 1.02 }}
          className="flex-1 bg-[#F9FAFB] relative p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <motion.div
            whileHover={{ x: -5 }}
            className="flex items-center text-gray-300 mx-2 absolute top-4 left-0"
          >
            <IconCircleArrowLeft className="w-6 h-6 hover:text-gray-600 transition-colors cursor-pointer" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col h-full justify-center items-center text-gray-400"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Logo />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="text-sm"
            >
              Select a conversation to start messaging
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
