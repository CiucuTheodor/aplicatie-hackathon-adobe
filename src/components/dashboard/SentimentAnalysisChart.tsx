import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Card } from '../ui/Card';
import { sentimentTrendData, SentimentDataPoint } from '../../data/mockData';
import { Activity } from 'lucide-react';

interface SentimentTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomSentimentTooltip: React.FC<SentimentTooltipProps> = ({
  active,
  payload,
  label
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0D1728]/95 border border-[#26364B] rounded-lg p-2.5 shadow-xl text-xs backdrop-blur-md min-w-[170px]">
        <div className="text-[11px] font-bold text-white border-b border-[#26364B] pb-1 mb-1.5 flex items-center justify-between">
          <span>{label}</span>
          <span className="text-[10px] text-[#8995A7]">Index: -50..100</span>
        </div>
        <div className="space-y-1">
          {payload.map((entry, idx) => (
            <div key={`item-${idx}`} className="flex items-center justify-between text-[11px]">
              <div className="flex items-center space-x-1.5 truncate">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-[#A0AEC0] truncate">{entry.name}:</span>
              </div>
              <span
                className="font-bold ml-2"
                style={{ color: entry.color }}
              >
                {entry.value > 0 ? `+${entry.value}` : entry.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export const SentimentAnalysisChart: React.FC = () => {
  const [activeSeries, setActiveSeries] = useState<string | null>(null);

  const seriesConfig = [
    { key: 'positive', name: 'Positive', color: '#19D9A0', strokeWidth: 2.5 },
    { key: 'negative', name: 'Negative', color: '#F59E35', strokeWidth: 2 },
    { key: 'neutral', name: 'Neutral', color: '#8995A7', strokeWidth: 1.5 },
    { key: 'competitorA', name: 'Comp A', color: '#E2E8F0', strokeWidth: 1.5, strokeDasharray: '3 3' },
    { key: 'competitorB', name: 'Comp B', color: '#ECC94B', strokeWidth: 1.5, strokeDasharray: '4 4' },
  ];

  return (
    <Card
      title="SENTIMENT ANALYSIS OVER TIME"
      subtitle="(Net Sentiment Score)"
      className="h-[250px]"
      bodyClassName="p-2 flex flex-col justify-between"
    >
      <div className="w-full flex-1 min-h-[145px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={sentimentTrendData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#26364B"
              vertical={false}
              opacity={0.5}
            />
            <XAxis
              dataKey="month"
              stroke="#4B5A70"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#26364B' }}
              tick={{ fill: '#8995A7' }}
            />
            <YAxis
              domain={[-50, 100]}
              ticks={[-50, -25, 0, 25, 50, 75, 100]}
              stroke="#4B5A70"
              fontSize={9}
              tickLine={false}
              axisLine={{ stroke: '#26364B' }}
              tick={{ fill: '#8995A7' }}
            />
            <Tooltip content={<CustomSentimentTooltip />} />

            {seriesConfig.map((series) => {
              const isFaded = activeSeries !== null && activeSeries !== series.key;
              return (
                <Line
                  key={series.key}
                  type="monotone"
                  dataKey={series.key}
                  name={series.name}
                  stroke={series.color}
                  strokeWidth={series.strokeWidth}
                  strokeDasharray={series.strokeDasharray}
                  dot={{ r: 2.5, fill: series.color }}
                  activeDot={{
                    r: 5,
                    stroke: series.color,
                    strokeWidth: 2,
                    fill: '#0D1728'
                  }}
                  opacity={isFaded ? 0.2 : 1}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Compact Interactive Legend */}
      <div className="pt-1.5 border-t border-[#26364B]/60 flex items-center justify-between flex-wrap gap-1 px-1">
        {seriesConfig.map((item) => (
          <button
            key={item.key}
            onClick={() =>
              setActiveSeries(activeSeries === item.key ? null : item.key)
            }
            className={`flex items-center space-x-1.5 px-1 py-0.5 rounded transition-all text-[10px] ${
              activeSeries === item.key
                ? 'bg-[#162235] ring-1 ring-[#19D9A0]'
                : 'hover:text-white'
            }`}
          >
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span
              className={
                activeSeries === item.key
                  ? 'text-white font-semibold'
                  : 'text-[#8995A7]'
              }
            >
              {item.name}
            </span>
          </button>
        ))}
      </div>
    </Card>
  );
};
