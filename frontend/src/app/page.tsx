/**
 * Home page - landing page with hero section and navigation
 */

"use client";
import { HeroParallax } from "@/components/ui/hero-parallax";
import { MaskContainer } from "@/components/ui/svg-mask-effect";

export default function Home() {
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
    <>
      <HeroParallax products={products} />
      <div className="w-full h-[30rem] sm:h-[35rem] md:h-[40rem] flex items-center justify-center overflow-hidden -mt-[55vh]">
        <MaskContainer
          revealText={
            <p className="mx-auto max-w-4xl px-4 text-center text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-slate-800 dark:text-white">
              Compra tus productos farmacéuticos de forma rápida y segura.
              Entrega a domicilio en toda Venezuela. ¡Tu salud más cerca, en
              solo unos clics!
            </p>
          }
          className="h-[30rem] sm:h-[35rem] md:h-[40rem] w-full rounded-none border-0 text-white dark:text-black"
          revealSize={600}
        >
          <p className="px-4 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
            Descubre tu farmacia inteligente: consulta productos actualizados en
            tiempo real, añade al carrito, paga de forma segura y recibe tu
            compra directo en tu puerta. Gestiona pedidos, recibe notificaciones
          </p>
        </MaskContainer>
      </div>
    </>
  );
}
