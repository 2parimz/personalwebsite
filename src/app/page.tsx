import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Studio } from "@/components/sections/Studio";
import { Restaurants } from "@/components/sections/Restaurants";
import { Reel } from "@/components/sections/Reel";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Studio />
      <Restaurants />
      <Reel />
      <Footer />
    </>
  );
}
