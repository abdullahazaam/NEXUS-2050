import { useEffect, useState } from "react";
import { ArrowDown, Radio, Orbit, MoveUpRight } from "lucide-react";
import CityBoundary from "../three/CityBoundary";
import { Button, Eyebrow } from "../ui/Common";
export default function Hero() {
  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString("en-GB"),
  );
  useEffect(() => {
    const timer = setInterval(
      () => setTime(new Date().toLocaleTimeString("en-GB")),
      1000,
    );
    return () => clearInterval(timer);
  }, []);
  return (
    <section
      id="overview"
      className="city-journey"
      aria-labelledby="hero-title"
    >
      <div className="hero journey-stage">
        <div className="hero-coordinate">
          N / 24 DISTRICTS <span>2050.01 / CITY MODEL</span>
        </div>
        <div className="hero-content">
          <Eyebrow>INTERACTIVE SMART CITY INTELLIGENCE PLATFORM</Eyebrow>
          <h1
            id="hero-title"
            aria-label="NEXUS 2050. Intelligence for the Cities of Tomorrow. The future is connected."
          >
            The future isn’t
            <br />
            on the horizon.
            <br />
            <span>It’s connected.</span>
          </h1>
          <div className="hero-brand-line">
            NEXUS 2050 <span>Intelligence for the Cities of Tomorrow.</span>
          </div>
          <p className="hero-description">
            An interactive smart-city simulation connecting mobility, energy,
            environment, infrastructure, and urban response through one
            intelligent command network.
          </p>
          <div className="hero-actions">
            <Button href="#intelligence">Enter the Command Center</Button>
            <a href="#systems" className="text-link">
              Explore City Systems <MoveUpRight size={16} />
            </a>
          </div>
          <div className="hero-status">
            <span>
              <i />
              Network Online <small>SIMULATED</small>
            </span>
            <span>
              <Radio size={13} />
              24 Connected Districts
            </span>
          </div>
        </div>
        <p className="sr-only">
          An interactive procedural 3D city with a central intelligence tower,
          connected districts, illuminated roads, and simulated traffic.
          Lighting shifts from dawn to night as the camera descends through a
          street corridor beside the central tower. A shorter rooftop route is
          used on mobile; reduced motion keeps a stable aerial view. All
          essential information is available in the sections below.
        </p>
        <div className="hero-city">
          <CityBoundary />
          <div className="city-vignette" />
          <div className="city-axis">
            <Orbit size={16} />
            <span>PROCEDURAL CITY MODEL</span>
            <span>01 / 24</span>
          </div>
        </div>
        <div className="hero-bottom">
          <a href="#pulse">
            <span className="scroll-icon">
              <ArrowDown size={15} />
            </span>
            Scroll to enter the city
          </a>
          <div className="hero-mode">
            <span className="tiny-square" />{" "}
            <span className="journey-phase">01 / DAWN</span>
          </div>
          <div className="system-clock">
            <span>DEMO SIMULATION</span>
            <time>{time}</time>
            <small>LOCAL SYSTEM TIME</small>
          </div>
        </div>
        <a
          className="journey-skip"
          href="#pulse"
          onClick={(event) => {
            event.preventDefault();
            const target = document.getElementById("pulse");
            if (target) {
              target.scrollIntoView({ behavior: "instant", block: "start" });
              target.tabIndex = -1;
              target.focus({ preventScroll: true });
            }
          }}
        >
          Skip city journey <ArrowDown size={13} />
        </a>
        <div className="journey-outro" aria-hidden="true">
          <span className="eyebrow">NEXUS CORE / CONNECTION ESTABLISHED</span>
          <p>
            Entering
            <br />
            <span>Urban Intelligence</span>
          </p>
          <small>ONE CITY. ONE INTELLIGENCE LAYER.</small>
        </div>
        <div className="journey-blend" aria-hidden="true" />
      </div>
    </section>
  );
}
