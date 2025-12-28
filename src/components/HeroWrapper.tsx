import { Hero } from "./Hero";
import { HeroMobile } from "./Hero-Mobile";

export function HeroWrapper() {
  return (
    <>
      <HeroMobile />
      <Hero />
    </>
  );
}
