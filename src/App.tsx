import { useReducedMotion } from "framer-motion";
import Navigation from "./components/Navigation";
import Preloader from "./components/Preloader";
import Hero from "./components/sections/Hero";
import Pulse from "./components/sections/Pulse";
import Systems from "./components/sections/Systems";
import Intelligence from "./components/sections/Intelligence";
import Simulation from "./components/sections/Simulation";
import { Technology, Vision, Footer } from "./components/sections/Story";
import { useCityMotion } from "./hooks/useCityMotion";
export default function App() {
  const reduced = !!useReducedMotion();
  useCityMotion(reduced);
  return (
    <>
      <Preloader />
      <Navigation />
      <main id="main-content">
        <Hero />
        <Pulse />
        <Systems />
        <Intelligence />
        <Simulation />
        <Technology />
        <Vision />
      </main>
      <Footer />
    </>
  );
}
