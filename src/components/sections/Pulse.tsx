import {
  Activity,
  ArrowUpRight,
  Wind,
  Users,
  Zap,
  TriangleAlert,
} from "lucide-react";
import { Counter, Demo, Eyebrow, Reveal } from "../ui/Common";
function Spark({
  color = "#70e5de",
  type = 0,
}: {
  color?: string;
  type?: number;
}) {
  return (
    <svg className="spark" viewBox="0 0 180 45" aria-hidden="true">
      <path
        d={
          type
            ? "M0 34 16 29 30 32 42 19 60 25 75 15 90 20 105 9 122 13 137 7 155 12 180 3"
            : "M0 31 15 32 30 25 45 28 60 15 75 23 90 18 105 22 120 9 135 14 150 6 165 10 180 5"
        }
        fill="none"
        stroke={color}
        strokeWidth="1.6"
      />
      <path d="M0 43H180" stroke="#20323d" strokeDasharray="3 5" />
    </svg>
  );
}
export default function Pulse() {
  return (
    <section id="pulse" className="section pulse">
      <Reveal className="section-heading">
        <div>
          <Eyebrow index="01">THE URBAN PULSE</Eyebrow>
          <h2>
            One city. Millions of signals.
            <br />
            <span>One intelligence layer.</span>
          </h2>
        </div>
        <div className="section-aside">
          <p>
            A connected view of a city in motion.
            <br />
            Every signal brings the bigger picture into focus.
          </p>
          <Demo />
        </div>
      </Reveal>
      <div className="pulse-grid">
        <Reveal className="pulse-primary panel">
          <div className="panel-top">
            <Activity size={18} />
            <span>NETWORK UPTIME</span>
            <span className="pill">OPTIMAL</span>
          </div>
          <div className="huge-metric">
            <Counter value={94.8} decimals={1} suffix="%" />
            <span>
              <ArrowUpRight size={13} />
              2.4%<small>vs. previous cycle</small>
            </span>
          </div>
          <Spark />
          <div className="network-bottom">
            <span>
              <i />
              24 districts synchronized
            </span>
            <span>NETWORK HEALTH</span>
          </div>
        </Reveal>
        <Reveal className="pulse-energy panel">
          <div className="panel-top">
            <Zap size={17} />
            <span>RENEWABLE ENERGY</span>
          </div>
          <div className="metric">
            <Counter value={73} suffix="%" />
            <small>of the city’s energy mix</small>
          </div>
          <div className="energy-segments">
            {Array.from({ length: 30 }, (_, i) => (
              <i key={i} className={i < 22 ? "filled" : ""} />
            ))}
          </div>
          <div className="sub-metrics">
            <span>
              Solar <b>42%</b>
            </span>
            <span>
              Wind <b>21%</b>
            </span>
            <span>
              Hydro <b>10%</b>
            </span>
          </div>
        </Reveal>
        <Reveal className="pulse-pair">
          <div className="mini-metric">
            <span>
              <Activity size={15} />
              MOBILITY FLOW
            </span>
            <strong>
              <Counter value={42} /> <small>km/h</small>
            </strong>
            <Spark color="#a99aeb" type={1} />
          </div>
          <div className="mini-metric">
            <span>
              <Wind size={15} />
              AIR QUALITY
            </span>
            <strong>
              <Counter value={38} /> <small>AQI</small>
              <em>Good</em>
            </strong>
          </div>
        </Reveal>
      </div>
      <Reveal className="pulse-strip">
        <div>
          <Users size={18} />
          <strong>
            <Counter value={1.82} decimals={2} suffix="M" />
          </strong>
          <span>Connected citizens</span>
        </div>
        <span className="strip-divider" />
        <div>
          <TriangleAlert size={17} />
          <strong>
            <Counter value={14} />
          </strong>
          <span>Active city alerts</span>
          <a href="#intelligence">
            View intelligence <ArrowUpRight size={14} />
          </a>
        </div>
        <span className="strip-note">
          A fictional city. A real-world possibility.
        </span>
      </Reveal>
    </section>
  );
}
