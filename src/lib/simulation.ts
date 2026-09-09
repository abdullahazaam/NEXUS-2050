export interface Inputs {
  traffic: number;
  transport: number;
  renewable: number;
  industry: number;
  readiness: number;
}
export const presets: Record<string, Inputs> = {
  "Normal Day": {
    traffic: 55,
    transport: 65,
    renewable: 73,
    industry: 50,
    readiness: 75,
  },
  "Peak-Hour Pressure": {
    traffic: 95,
    transport: 50,
    renewable: 55,
    industry: 80,
    readiness: 60,
  },
  "Emergency Mode": {
    traffic: 70,
    transport: 80,
    renewable: 60,
    industry: 30,
    readiness: 100,
  },
  "Sustainable Future": {
    traffic: 35,
    transport: 95,
    renewable: 95,
    industry: 40,
    readiness: 90,
  },
};
const clamp = (n: number, min = 0, max = 100) =>
  Math.min(max, Math.max(min, n));
export function simulate(input: Inputs) {
  const congestion = clamp(25 + input.traffic * 0.85 - input.transport * 0.55);
  const carbon = Math.max(
    5,
    40 +
      input.traffic * 0.8 +
      input.industry * 1.1 -
      input.renewable * 0.6 -
      input.transport * 0.25,
  );
  const aqi = Math.round(clamp(12 + carbon * 0.55 + congestion * 0.16, 5, 200));
  const stability = clamp(
    100 - input.industry * 0.22 - input.traffic * 0.1 + input.renewable * 0.09,
  );
  const response = Math.max(
    1.2,
    9 - input.readiness * 0.07 + congestion * 0.025,
  );
  const efficiency = clamp(
    (100 - congestion) * 0.3 +
      (100 - carbon / 2) * 0.2 +
      stability * 0.2 +
      input.readiness * 0.15 +
      input.renewable * 0.15,
  );
  return {
    congestion: Math.round(congestion),
    carbon: Math.round(carbon),
    aqi,
    stability: Math.round(stability),
    response: +response.toFixed(1),
    efficiency: Math.round(efficiency),
  };
}
