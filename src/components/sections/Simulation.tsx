import { useEffect, useRef, useState } from "react";
import { animate, useReducedMotion } from "framer-motion";
import {
  Activity,
  Leaf,
  RotateCcw,
  SlidersHorizontal,
  Wind,
  Zap,
  Timer,
  ArrowUpRight,
} from "lucide-react";
import { presets, simulate } from "../../lib/simulation";
import type { Inputs } from "../../lib/simulation";
import { Demo, Eyebrow, Reveal } from "../ui/Common";
const controls: { key: keyof Inputs; label: string; description: string }[] = [
  {
    key: "traffic",
    label: "Traffic demand",
    description: "Private vehicle load",
  },
  {
    key: "transport",
    label: "Public transport capacity",
    description: "Available transit service",
  },
  {
    key: "renewable",
    label: "Renewable energy allocation",
    description: "Clean energy contribution",
  },
  {
    key: "industry",
    label: "Industrial activity",
    description: "Production and energy demand",
  },
  {
    key: "readiness",
    label: "Emergency readiness",
    description: "Response resource availability",
  },
];
export default function Simulation() {
  const [input, setInput] = useState<Inputs>({ ...presets["Normal Day"] });
  const inputRef = useRef(input);
  const [preset, setPreset] = useState("Normal Day");
  const animation = useRef<ReturnType<typeof animate> | null>(null);
  const reduced = useReducedMotion();
  const result = simulate(input);
  useEffect(() => () => animation.current?.stop(), []);
  const select = (name: string) => {
    animation.current?.stop();
    setPreset(name);
    const from = { ...inputRef.current },
      to = presets[name];
    if (reduced) {
      inputRef.current = { ...to };
      setInput({ ...to });
      return;
    }
    animation.current = animate(0, 1, {
      duration: 0.6,
      ease: "easeInOut",
      onUpdate: (progress) => {
        const next = { ...to };
        controls.forEach(({ key }) => {
          next[key] = Math.round(from[key] + (to[key] - from[key]) * progress);
        });
        inputRef.current = next;
        setInput(next);
      },
    });
  };
  const change = (key: keyof Inputs, value: number) => {
    animation.current?.stop();
    setPreset("Custom");
    const next = { ...inputRef.current, [key]: value };
    inputRef.current = next;
    setInput(next);
  };
  const outputs = [
    {
      label: "Congestion level",
      value: result.congestion,
      unit: "%",
      icon: Activity,
      good: result.congestion < 45,
    },
    {
      label: "Carbon output",
      value: result.carbon,
      unit: "t/h",
      icon: Leaf,
      good: result.carbon < 65,
    },
    {
      label: "Air quality",
      value: result.aqi,
      unit: "AQI",
      icon: Wind,
      good: result.aqi < 50,
    },
    {
      label: "Energy stability",
      value: result.stability,
      unit: "%",
      icon: Zap,
      good: result.stability > 80,
    },
    {
      label: "Response time",
      value: result.response,
      unit: "min",
      icon: Timer,
      good: result.response < 5,
    },
  ];
  return (
    <section id="simulation" className="section simulation">
      <Reveal className="section-heading">
        <div>
          <Eyebrow index="04">CITY SIMULATION LAB</Eyebrow>
          <h2>
            Shape the city’s
            <br />
            <span>next move.</span>
          </h2>
        </div>
        <div className="section-aside">
          <p>
            A little more transit. A cleaner energy mix.
            <br />
            Explore how your decisions change the whole city.
          </p>
          <Demo />
        </div>
      </Reveal>
      <div className="simulation-presets" aria-label="Simulation presets">
        {Object.keys(presets).map((name, i) => (
          <button
            key={name}
            onClick={() => select(name)}
            aria-pressed={preset === name}
            className={preset === name ? "selected" : ""}
          >
            <span>0{i + 1}</span>
            {name}
            {preset === name && <span className="preset-dot" />}
          </button>
        ))}
      </div>
      <div className="simulation-layout">
        <div className="sim-controls panel">
          <div className="sim-panel-title">
            <span>
              <SlidersHorizontal size={16} />
              CITY PARAMETERS
            </span>
            <button onClick={() => select("Normal Day")} className="reset">
              <RotateCcw size={13} />
              Reset
            </button>
          </div>
          {controls.map(({ key, label, description }) => (
            <div className="slider-group" key={key}>
              <div>
                <label htmlFor={`slider-${key}`}>{label}</label>
                <output htmlFor={`slider-${key}`}>
                  {input[key]}
                  <small>%</small>
                </output>
              </div>
              <input
                id={`slider-${key}`}
                type="range"
                min="0"
                max="100"
                value={input[key]}
                onChange={(e) => change(key, +e.target.value)}
                style={{ "--range": `${input[key]}%` } as React.CSSProperties}
                aria-describedby={`hint-${key}`}
              />
              <span id={`hint-${key}`}>{description}</span>
            </div>
          ))}
          <div className="model-note">
            <span className="tiny-square" />
            Five inputs. One interconnected city.
          </div>
        </div>
        <div className="sim-results panel">
          <div className="sim-panel-title">
            <span>
              <Activity size={16} />
              PROJECTED CITY STATE
            </span>
            <span className="pill">
              {preset === "Custom" ? "CUSTOM MODEL" : preset.toUpperCase()}
            </span>
          </div>
          <div
            className={`sim-city ${result.efficiency > 75 ? "healthy" : result.efficiency < 55 ? "stressed" : ""}`}
            aria-hidden="true"
          >
            <div className="sim-city-grid" />
            <div className="sim-skyline">
              {Array.from({ length: 23 }, (_, i) => (
                <i
                  key={i}
                  style={{
                    height: `${28 + ((i * 37) % 92)}px`,
                    width: `${14 + (i % 4) * 5}px`,
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
              ))}
            </div>
            <span className="sim-orbit" />
            <div className="sim-city-label">
              <i />
              DISTRICT MODEL / PROJECTED ACTIVITY
            </div>
            <span className="sim-load">
              NETWORK LOAD {Math.round((input.traffic + input.industry) / 2)}%
            </span>
          </div>
          <div
            className="efficiency-result"
            aria-live="polite"
            aria-atomic="true"
          >
            <div>
              <span>OVERALL CITY EFFICIENCY</span>
              <strong>
                {result.efficiency}
                <small>/ 100</small>
              </strong>
            </div>
            <div className="efficiency-description">
              <span className={result.efficiency > 75 ? "green-text" : ""}>
                {result.efficiency > 75
                  ? "A city in balance"
                  : result.efficiency > 55
                    ? "Room to optimize"
                    : "Network under pressure"}{" "}
                <ArrowUpRight size={15} />
              </span>
              <p>
                {result.efficiency > 75
                  ? "Your parameters support a cleaner, more resilient urban network."
                  : "Increase public transit and renewables to ease pressure across the network."}
              </p>
            </div>
          </div>
          <div className="output-grid">
            {outputs.map((o) => {
              const Icon = o.icon;
              return (
                <div key={o.label}>
                  <span>
                    <Icon size={14} />
                    {o.label}
                  </span>
                  <strong className={o.good ? "good" : "caution"}>
                    {o.value}
                    <small>{o.unit}</small>
                  </strong>
                  <div className="output-track">
                    <i
                      style={{
                        width: `${Math.min(100, o.label === "Response time" ? o.value * 10 : o.value)}%`,
                        background: o.good ? "#79d8bf" : "#e0b282",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <p className="sim-disclaimer">
            Illustrative model, not a forecast. Outputs show simplified
            relationships and do not represent a real city.
          </p>
        </div>
      </div>
    </section>
  );
}
