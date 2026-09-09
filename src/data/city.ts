import {
  TrainFront,
  Zap,
  Leaf,
  Siren,
  Network,
  ShieldCheck,
} from "lucide-react";
export const systems = [
  {
    name: "Smart Mobility",
    short: "Mobility",
    icon: TrainFront,
    color: "#69e3ec",
    metric: "42 km/h",
    label: "Average network flow",
    description: "A city that keeps moving.",
    body: "Coordinated transit, adaptive signals, and shared mobility balance demand across every district. Explore how a single network can make everyday journeys more predictable.",
    details: [
      "248 adaptive intersections",
      "18 connected transit lines",
      "91% transit availability",
    ],
    status: "Flow optimized",
  },
  {
    name: "Renewable Energy",
    short: "Energy",
    icon: Zap,
    color: "#b8f28a",
    metric: "73%",
    label: "Renewable energy share",
    description: "Clean power. Intelligently balanced.",
    body: "Distributed solar, wind, and stored energy work together to meet changing demand. District-level coordination helps reduce waste while keeping essential services powered.",
    details: [
      "6 distributed microgrids",
      "840 MWh storage capacity",
      "97% grid availability",
    ],
    status: "Grid balanced",
  },
  {
    name: "Environmental Monitoring",
    short: "Environment",
    icon: Leaf,
    color: "#56d6ad",
    metric: "38 AQI",
    label: "Simulated air quality index",
    description: "A healthier urban atmosphere.",
    body: "Environmental signals bring air quality, water usage, and green corridors into one view. Model the relationship between urban activity and a more breathable city.",
    details: [
      "126 environmental nodes",
      "32% green-space coverage",
      "18 water monitoring zones",
    ],
    status: "Within target",
  },
  {
    name: "Emergency Response",
    short: "Response",
    icon: Siren,
    color: "#f3b783",
    metric: "3.8 min",
    label: "Estimated response time",
    description: "Every second, coordinated.",
    body: "Shared situational awareness connects dispatch, mobility corridors, and emergency teams. Readiness planning helps the network respond coherently when pressure rises.",
    details: [
      "12 response centers",
      "96% team readiness",
      "24 priority routes",
    ],
    status: "Response ready",
  },
  {
    name: "Connected Infrastructure",
    short: "Infrastructure",
    icon: Network,
    color: "#aaa0f5",
    metric: "98.2%",
    label: "Infrastructure availability",
    description: "The invisible network. Made visible.",
    body: "An integrated view of bridges, utilities, and communications makes maintenance easier to prioritize. Understand asset health before small disruptions become citywide problems.",
    details: [
      "4,820 modeled assets",
      "24 district gateways",
      "8 maintenance windows",
    ],
    status: "Systems nominal",
  },
  {
    name: "Public Safety",
    short: "Safety",
    icon: ShieldCheck,
    color: "#82b8fa",
    metric: "96%",
    label: "Preparedness coverage",
    description: "Resilience, built around people.",
    body: "Area-level incident patterns and public-service readiness support thoughtful resource allocation. This fictional model uses aggregate signals without personal tracking.",
    details: [
      "24 district safety plans",
      "42 community access points",
      "100% aggregate demo signals",
    ],
    status: "Coverage active",
  },
];
export const ranges = ["1H", "24H", "7D", "30D"] as const;
export type Range = (typeof ranges)[number];
export function chartData(range: Range) {
  const seed = ranges.indexOf(range);
  return Array.from({ length: 12 }, (_, i) => ({
    time:
      range === "1H"
        ? `${i * 5}m`
        : range === "24H"
          ? `${String(i * 2).padStart(2, "0")}:00`
          : range === "7D"
            ? `D${Math.floor(i / 2) + 1}`
            : `D${Math.round((i * 29) / 11) + 1}`,
    traffic: Math.round(42 + Math.sin(i * 0.7 + seed) * 16 + seed * 3),
    energy: Math.round(62 + Math.sin(i * 0.55 + seed + 1) * 13),
    environment: Math.round(34 + Math.sin(i * 0.45 + seed) * 8),
    baseline: 40,
  }));
}
