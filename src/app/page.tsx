import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Music } from "@/components/sections/Music";
import { Obsessions } from "@/components/sections/Obsessions";
import { Restaurants } from "@/components/sections/Restaurants";
import { Trip } from "@/components/sections/Trip";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Music />
      <Obsessions />
      <Restaurants />
      <Trip />
      <Footer />
    </>
  );
}
