import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Check, Radio } from "lucide-react";
import { systems } from "../../data/city";
import { Demo, Eyebrow, Logo, Reveal } from "../ui/Common";
export default function Systems() {
  const [selected, setSelected] = useState(0);
  const system = systems[selected];
  const Icon = system.icon;
  const reduced = useReducedMotion();
  return (
    <section id="systems" className="section systems">
      <Reveal className="section-heading">
        <div>
          <Eyebrow index="02">CONNECTED CITY SYSTEMS</Eyebrow>
          <h2>
            Different systems.
            <br />
            <span>Shared intelligence.</span>
          </h2>
        </div>
        <p className="section-aside">
          Six essential systems. One coordinated network.
          <br />
          Select a system to explore its role in the city.
        </p>
      </Reveal>
      <div className="systems-layout">
        <div className="system-network" data-reveal>
          <div className="network-orbit orbit-one" />
          <div className="network-orbit orbit-two" />
          <svg
            className="network-lines"
            viewBox="0 0 600 480"
            aria-hidden="true"
          >
            {[
              [130, 90],
              [470, 90],
              [520, 240],
              [470, 390],
              [130, 390],
              [80, 240],
            ].map(([x, y], i) => (
              <path
                key={i}
                d={`M300 240 Q${x} 240 ${x} ${y}`}
                className={i === selected ? "selected" : ""}
              />
            ))}
          </svg>
          <div className="network-core">
            <Logo compact />
            <span>INTELLIGENCE ENGINE</span>
            <i />
          </div>
          {systems.map((s, i) => {
            const Symbol = s.icon;
            return (
              <button
                key={s.name}
                className={`system-node node-${i} ${i === selected ? "selected" : ""}`}
                onClick={() => setSelected(i)}
                aria-pressed={selected === i}
                aria-controls="system-detail"
                style={{ "--system-color": s.color } as React.CSSProperties}
              >
                <span className="node-icon">
                  <Symbol size={21} />
                  <i />
                </span>
                <span>{s.short}</span>
                <small>0{i + 1}</small>
              </button>
            );
          })}
          <div className="network-caption">
            <Radio size={13} /> ALL SYSTEMS CONNECTED <Demo short />
          </div>
        </div>
        <div
          className="system-detail panel"
          id="system-detail"
          aria-live="polite"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={selected}
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="detail-top">
                <span className="detail-icon" style={{ color: system.color }}>
                  <Icon size={23} />
                </span>
                <span>0{selected + 1} / CITY SYSTEM</span>
                <ArrowUpRight size={20} />
              </div>
              <h3>{system.name}</h3>
              <h4>{system.description}</h4>
              <p>{system.body}</p>
              <div className="system-detail-metric">
                <strong style={{ color: system.color }}>{system.metric}</strong>
                <span>
                  {system.label}
                  <small>SIMULATED METRIC</small>
                </span>
                <div className="equalizer" aria-hidden="true">
                  {Array.from({ length: 12 }, (_, i) => (
                    <i
                      key={i}
                      style={{
                        height: `${12 + ((i * 17 + selected * 7) % 45)}px`,
                        animationDelay: `${i * 0.13}s`,
                        background: system.color,
                      }}
                    />
                  ))}
                </div>
              </div>
              <ul>
                {system.details.map((d) => (
                  <li key={d}>
                    <Check size={14} />
                    {d}
                  </li>
                ))}
              </ul>
              <div className="detail-status">
                <span>
                  <i />
                  {system.status}
                </span>
                <a href="#simulation">
                  Model this system <ArrowUpRight size={14} />
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
