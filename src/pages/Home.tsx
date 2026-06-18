import { Hero } from "../components/home/Hero";
import { AboutUs } from "../components/home/AboutUs";
import { EventDocumentation } from "../components/home/EventDocumentation";
import { Contributors } from "../components/home/Contributors";

export function Home() {
  return (
    <>
      <Hero />
      <AboutUs />
      <EventDocumentation />
      <Contributors />
    </>
  );
}
