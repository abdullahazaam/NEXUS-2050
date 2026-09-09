import { useState } from "react";
import {
  Radio,
  Network,
  Cpu,
  PanelsTopLeft,
  Route,
  ArrowRight,
  ArrowUpRight,
  Github,
} from "lucide-react";
import { Button, Demo, Eyebrow, Logo, Reveal } from "../ui/Common";
import { siteConfig } from "../../lib/config";
const stages = [
  {
    name: "Urban Sensors",
    icon: Radio,
    tag: "COLLECT",
    text: "Aggregate mobility, environmental, and utility signals are the starting point. This experience uses deterministic local data.",
  },
  {
    name: "Edge Network",
    icon: Network,
    tag: "CONNECT",
    text: "District gateways organize incoming signals close to their source, creating a shared picture across the modeled city.",
  },
  {
    name: "Intelligence Engine",
    icon: Cpu,
    tag: "UNDERSTAND",
    text: "A transparent rules-based simulation models tradeoffs between demand, sustainability, and response readiness.",
  },
  {
    name: "Command Center",
    icon: PanelsTopLeft,
    tag: "DECIDE",
    text: "Responsive charts and accessible controls translate complex relationships into clear, explorable decisions.",
  },
  {
    name: "City Response",
    icon: Route,
    tag: "COORDINATE",
    text: "Modeled outcomes reflect changes across the network, showing how one adjustment can influence multiple systems.",
  },
];
export function Technology() {
  const [selected, setSelected] = useState(2);
  return (
    <section id="technology" className="section technology">
      <Reveal className="section-heading">
        <div>
          <Eyebrow index="05">THE ARCHITECTURE</Eyebrow>
          <h2>
            Built to connect.
            <br />
            <span>Engineered to respond.</span>
          </h2>
        </div>
        <p className="section-aside">
          From a single signal to a coordinated response.
          <br />
          Explore the conceptual intelligence pipeline.
        </p>
      </Reveal>
      <div className="architecture-flow" data-reveal>
        {stages.map((stage, i) => {
          const Icon = stage.icon;
          return (
            <div className="architecture-item" key={stage.name}>
              <button
                onClick={() => setSelected(i)}
                onFocus={() => setSelected(i)}
                onPointerEnter={() => setSelected(i)}
                aria-pressed={selected === i}
                aria-controls="architecture-description"
                className={selected === i ? "selected" : ""}
              >
                <span className="architecture-number">
                  0{i + 1} / {stage.tag}
                </span>
                <Icon size={27} />
                <strong>{stage.name}</strong>
                <span>
                  {i === 4
                    ? "Coordinated city response"
                    : "Intelligence pipeline"}
                </span>
              </button>
              {i < 4 && <ArrowRight className="architecture-arrow" size={17} />}
            </div>
          );
        })}
      </div>
      <div
        id="architecture-description"
        className="architecture-description"
        aria-live="polite"
      >
        <span>{stages[selected].tag}</span>
        <p>{stages[selected].text}</p>
      </div>
      <div className="tech-stack">
        <div>
          <span className="chart-title">
            THE ENGINEERING BEHIND THE EXPERIENCE
          </span>
          <p>
            Real frontend craft.
            <br />
            An imagined urban future.
          </p>
        </div>
        <div className="tech-list">
          {[
            ["React + TypeScript", "Composable UI. Reliable logic."],
            [
              "Three.js + React Three Fiber",
              "Procedural, interactive city geometry.",
            ],
            [
              "GSAP + Framer Motion",
              "Scroll storytelling. Thoughtful transitions.",
            ],
            [
              "Recharts + Tailwind CSS",
              "Responsive data. A coherent interface.",
            ],
          ].map(([title, text]) => (
            <div key={title}>
              <span className="tiny-square" />
              <div>
                <strong>{title}</strong>
                <span>{text}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
export function Vision() {
  return (
    <section id="vision" className="section vision">
      <div className="vision-atmosphere" aria-hidden="true">
        <div />
        <div />
        <div />
      </div>
      <Reveal>
        <Eyebrow index="06">THE 2050 VISION</Eyebrow>
        <h2>
          A city that learns,
          <br />
          adapts, <span>and responds.</span>
        </h2>
        <p className="vision-copy">
          The next chapter of urban life is about more than smarter technology.
          It’s about systems that work together — making our cities more
          efficient, resilient, and sustainable, and our everyday lives a little
          better.
        </p>
      </Reveal>
      <div className="vision-timeline">
        {[
          [
            "2030",
            "Connected Foundations",
            "Connecting essential services through shared, responsible data infrastructure.",
          ],
          [
            "2040",
            "Adaptive Infrastructure",
            "Anticipating demand and adapting resources to the rhythm of urban life.",
          ],
          [
            "2050",
            "Coordinated Urban Intelligence",
            "A citywide network that turns collective understanding into coordinated action.",
          ],
        ].map(([year, title, text]) => (
          <Reveal key={year} className="milestone">
            <span className="timeline-point" />
            <strong>{year}</strong>
            <h3>{title}</h3>
            <p>{text}</p>
          </Reveal>
        ))}
      </div>
      <span className="vision-note">
        A speculative vision for connected cities. Designed to inspire, not
        predict.
      </span>
    </section>
  );
}
export function Footer() {
  return (
    <>
      <section className="final-cta">
        <div>
          <Eyebrow>YOUR CITY. YOUR NEXT MOVE.</Eyebrow>
          <h2>Ready to enter the city?</h2>
        </div>
        <div>
          <Button href="#simulation">Launch Simulation</Button>
          <Button href="#technology" secondary>
            View Project Architecture
          </Button>
        </div>
      </section>
      <footer className="footer">
        <div className="footer-top">
          <div>
            <a href="#overview" aria-label="Back to Nexus 2050 overview">
              <Logo />
            </a>
            <p>Intelligence for the Cities of Tomorrow.</p>
          </div>
          <div className="footer-nav">
            <a href="#systems">City Systems</a>
            <a href="#intelligence">Command Center</a>
            <a href="#simulation">Simulation Lab</a>
            <a href="#technology">Architecture</a>
            <a href="#vision">Vision 2050</a>
          </div>
          <a
            href={siteConfig.repository}
            target="_blank"
            rel="noreferrer"
            className="github-link"
          >
            <Github size={17} />
            Explore on GitHub
            <ArrowUpRight size={15} />
          </a>
        </div>
        <div className="footer-disclaimer">
          <Demo />
          <p>
            NEXUS 2050 is a fictional smart-city experience. All city metrics,
            events, and projections are simulated. No real sensors, government
            data, or live city feeds are used.
          </p>
          <span>
            REACT · TYPESCRIPT · THREE.JS · GSAP · RECHARTS · TAILWIND
          </span>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} NEXUS 2050</span>
          <span>
            Designed and developed by{" "}
            <a href={siteConfig.github} target="_blank" rel="noreferrer">
              {siteConfig.author}
              <ArrowUpRight size={12} />
            </a>
          </span>
          <a href="#overview">Back to the skyline ↑</a>
        </div>
      </footer>
    </>
  );
}
