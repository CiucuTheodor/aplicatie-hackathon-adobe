import { CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const chartMargin = { top: 8, right: 8, bottom: 0, left: -12 };
export const axisProps = {
  tick: { fill: "var(--text-muted)", fontSize: 11 },
  axisLine: false,
  tickLine: false,
  tickMargin: 10,
};
export const gridProps = { stroke: "var(--border-subtle)", strokeDasharray: "3 5", vertical: false };

export function ChartTooltip({ active, payload, label, formatter }) {
  if (!active || !payload?.length) return null;
  return <div className="chart-tooltip"><strong>{label}</strong>{payload.map((item) => <div key={item.dataKey} className="tooltip-row"><span className="tooltip-dot" style={{ background: item.color }} />{item.name || item.dataKey}<b>{formatter ? formatter(item.value, item.dataKey) : item.value}</b></div>)}</div>;
}

export function ChartAxes({ xKey, yWidth = 34, yFormatter }) {
  return <>
    <CartesianGrid {...gridProps} />
    <XAxis dataKey={xKey} {...axisProps} tickLine={false} minTickGap={22} />
    <YAxis {...axisProps} width={yWidth} tickFormatter={yFormatter} />
    <Tooltip content={<ChartTooltip />} cursor={{ stroke: "var(--border)", strokeDasharray: "3 4" }} />
  </>;
}

export function ResponsiveChart({ children, height = 270 }) {
  return <div className="chart-canvas" style={{ height }}><ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer></div>;
}
