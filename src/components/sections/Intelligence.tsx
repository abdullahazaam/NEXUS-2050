import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  ArrowUpRight,
  ChevronRight,
  Cpu,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { chartData, ranges } from "../../data/city";
import type { Range } from "../../data/city";
import { Demo, Eyebrow, Reveal } from "../ui/Common";
const tooltipStyle = {
  background: "#101e2a",
  border: "1px solid #30434e",
  borderRadius: 4,
  color: "#e8f3f6",
  fontSize: 12,
};
const colors = ["#80ddd8", "#a09be1", "#83b59b", "#263d4c"];
const axis = {
  stroke: "#7f96a5",
  fontSize: 10,
  tickLine: false,
  axisLine: false,
};
export default function Intelligence() {
  const [range, setRange] = useState<Range>("24H");
  const data = useMemo(() => chartData(range), [range]);
  const reduced = !!useReducedMotion();
  const index = ranges.indexOf(range);
  const mix = [
    { name: "Solar", value: 40 + index * 2 },
    { name: "Wind", value: 25 - index * 2 },
    { name: "Hydro", value: 10 },
    { name: "Other", value: 25 },
  ];
  const districts = ["Central", "North", "Harbor", "West", "Park"].map(
    (name, i) => ({ name, score: 94 - i * 3 + index }),
  );
  return (
    <section id="intelligence" className="section intelligence">
      <Reveal className="section-heading">
        <div>
          <Eyebrow index="03">URBAN INTELLIGENCE</Eyebrow>
          <h2>
            The city, <span>in perspective.</span>
          </h2>
        </div>
        <p className="section-aside">
          Complex signals. Clear decisions.
          <br />A command center designed for the bigger picture.
        </p>
      </Reveal>
      <div className="command-shell" data-reveal>
        <div className="command-bar">
          <div>
            <span className="command-mark">
              <Activity size={17} />
            </span>
            <strong>City Command Center</strong>
            <span className="network-live">
              <i />
              SYSTEMS NOMINAL
            </span>
          </div>
          <div className="time-controls" aria-label="Dashboard time range">
            {ranges.map((r) => (
              <button
                key={r}
                aria-pressed={r === range}
                onClick={() => setRange(r)}
                className={r === range ? "selected" : ""}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        <div className="command-subbar">
          <span>
            NEXUS METROPOLITAN AREA <ChevronRight size={12} /> ALL DISTRICTS
          </span>
          <Demo />
        </div>
        <div className="dashboard-grid">
          <div className="score-panel">
            <span className="chart-title">CITY EFFICIENCY</span>
            <div
              className="score-dial"
              style={{ "--score": `${86 + index}%` } as React.CSSProperties}
            >
              <div>
                <strong>
                  {86 + index}
                  <small>/100</small>
                </strong>
                <span>OPTIMIZED</span>
              </div>
            </div>
            <span className="trend">
              <ArrowUpRight size={14} /> +{2.6 + index / 10}% this period
            </span>
            <p>
              Balanced performance across
              <br />
              six connected city systems.
            </p>
            <div className="score-footer">
              <ShieldCheck size={15} />
              All districts reporting
            </div>
          </div>
          <div className="chart-panel traffic-chart">
            <div className="chart-header">
              <span className="chart-title">MOBILITY FLOW</span>
              <span className="chart-unit">km/h · {range}</span>
            </div>
            <div className="chart-stat">
              {data[data.length - 1].traffic}
              <small>km/h</small>
              <span>NETWORK AVERAGE</span>
            </div>
            <div
              className="chart-wrap"
              role="img"
              aria-label={`Simulated mobility flow for ${range}, ${data.map((d) => `${d.time}: ${d.traffic} km/h`).join(", ")}`}
            >
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <AreaChart
                  data={data}
                  margin={{ left: -23, right: 5, top: 5, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="traffic-fill"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#66d6d5" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#66d6d5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    stroke="#20303c"
                    vertical={false}
                    strokeDasharray="3 5"
                  />
                  <XAxis dataKey="time" {...axis} interval={3} />
                  <YAxis {...axis} domain={[0, 80]} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area
                    name="Flow (km/h)"
                    dataKey="traffic"
                    stroke="#70deda"
                    fill="url(#traffic-fill)"
                    strokeWidth={2}
                    isAnimationActive={!reduced}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="chart-panel energy-chart">
            <div className="chart-header">
              <span className="chart-title">ENERGY DISTRIBUTION</span>
              <Zap size={14} />
            </div>
            <div className="energy-chart-body">
              <div
                className="donut-wrap"
                role="img"
                aria-label={`Energy mix: ${mix.map((d) => `${d.name} ${d.value}%`).join(", ")}`}
              >
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <PieChart>
                    <Pie
                      data={mix}
                      dataKey="value"
                      innerRadius="69%"
                      outerRadius="92%"
                      paddingAngle={4}
                      stroke="none"
                      isAnimationActive={!reduced}
                    >
                      {mix.map((d, i) => (
                        <Cell key={d.name} fill={colors[i]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
                <span>
                  <strong>
                    75<small>%</small>
                  </strong>
                  <small>RENEWABLE</small>
                </span>
              </div>
              <div className="chart-legend">
                {mix.map((d, i) => (
                  <span key={d.name}>
                    <i style={{ background: colors[i] }} />
                    {d.name}
                    <b>{d.value}%</b>
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="chart-panel environment-chart">
            <div className="chart-header">
              <span className="chart-title">ENVIRONMENTAL TREND</span>
              <span className="green-text">GOOD</span>
            </div>
            <div className="chart-stat">
              {data[data.length - 1].environment}
              <small>AQI</small>
            </div>
            <div
              className="chart-wrap short"
              role="img"
              aria-label={`Simulated air quality trend for ${range}: ${data.map((d) => `${d.time} ${d.environment} AQI`).join(", ")}`}
            >
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <LineChart
                  data={data}
                  margin={{ left: -23, right: 4, top: 5, bottom: 0 }}
                >
                  <CartesianGrid
                    stroke="#20303c"
                    vertical={false}
                    strokeDasharray="3 5"
                  />
                  <XAxis dataKey="time" {...axis} interval={3} />
                  <YAxis {...axis} domain={[0, 60]} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line
                    name="Air quality (AQI)"
                    dataKey="environment"
                    stroke="#a4bf8b"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={!reduced}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="chart-panel district-chart">
            <div className="chart-header">
              <span className="chart-title">DISTRICT PERFORMANCE</span>
              <span className="chart-unit">SCORE / 100</span>
            </div>
            <div
              className="chart-wrap district"
              role="img"
              aria-label={districts
                .map((d) => `${d.name} district ${d.score} out of 100`)
                .join(", ")}
            >
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <BarChart
                  data={districts}
                  layout="vertical"
                  margin={{ left: 0, right: 12, top: 10, bottom: 0 }}
                >
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis type="category" dataKey="name" {...axis} width={48} />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    cursor={{ fill: "#192b37" }}
                  />
                  <Bar
                    name="Efficiency score"
                    dataKey="score"
                    barSize={7}
                    radius={[0, 2, 2, 0]}
                    background={{ fill: "#1b2b36" }}
                    isAnimationActive={!reduced}
                  >
                    {districts.map((d, i) => (
                      <Cell
                        key={d.name}
                        fill={i === 0 ? "#77dad7" : "#436d7b"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="alert-panel">
            <div className="chart-header">
              <span className="chart-title">ACTIVE ALERT TIMELINE</span>
              <span className="alert-count">14</span>
            </div>
            {[
              {
                time: "09:42",
                title: "Grid load redistributed",
                sub: "Energy · District 07",
                color: "mint",
              },
              {
                time: "09:38",
                title: "Traffic demand elevated",
                sub: "Mobility · Central corridor",
                color: "amber",
              },
              {
                time: "09:31",
                title: "Maintenance window scheduled",
                sub: "Infrastructure · North sector",
                color: "violet",
              },
            ].map((a) => (
              <div className="alert" key={a.time}>
                <i className={a.color} />
                <div>
                  <strong>{a.title}</strong>
                  <span>{a.sub}</span>
                </div>
                <time>{a.time}</time>
              </div>
            ))}
            <span className="alert-note">
              Showing 3 of 14 modeled events · {range}
            </span>
          </div>
        </div>
        <div className="command-footer">
          <span>
            <Cpu size={14} />
            Infrastructure <b>98.2% available</b>
          </span>
          <span>
            <ShieldCheck size={14} />
            Response readiness <b>{94 + index}%</b>
          </span>
          <span className="command-footnote">
            Deterministic simulation · No real sensor feeds
          </span>
        </div>
      </div>
    </section>
  );
}
