import CTA from "@/components/cta";
import { FAQ } from "@/components/faq";
import { Features } from "@/components/features";
import { Features2 } from "@/components/features2";
import Features3 from "@/components/features3";
import { Hero } from "@/components/hero";
import { LogoCloud } from "@/components/logos-cloud";
import Pricing from "@/components/pricing";
import { Testimonials } from "@/components/testimonials";
import { FarmatodoSimulator } from "@/components/farmatodo-simulator";

export default function Home() {
  return (
    <div>
      <Hero />
      <FarmatodoSimulator />
      <LogoCloud />
      <Features />
      <Features2 />
      <Features3 />
      <Pricing />
      <Testimonials />
      <FAQ />
      <CTA />
    </div>
  );
}
