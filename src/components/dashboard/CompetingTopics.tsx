import React from 'react';
import { Card } from '../ui/Card';
import { competingTopicsData } from '../../data/mockData';
import { Hash, Sparkles } from 'lucide-react';

export const CompetingTopics: React.FC = () => {
  const axisTicks = [0, 10, 20, 30, 40, 50];

  return (
    <Card
      title="TOP COMPETING TOPICS"
      subtitle="(Cross-Platform Conversation Distribution)"
      headerAction={
        <span className="text-[10px] text-[#19D9A0] font-semibold bg-[#19D9A0]/10 border border-[#19D9A0]/20 px-2 py-0.5 rounded-full">
          High Intent
        </span>
      }
      className="h-[250px]"
      bodyClassName="p-3.5 flex flex-col justify-between"
    >
      {/* List of horizontal progress bars */}
      <div className="space-y-2.5 flex-1 flex flex-col justify-center">
        {competingTopicsData.map((topic) => (
          <div key={topic.title} className="group">
            <div className="flex items-center justify-between text-xs mb-1">
              <div className="flex items-center space-x-1.5">
                <Hash className="w-3 h-3 text-[#8995A7]" />
                <span className="font-semibold text-[#F3F6FA] group-hover:text-white transition-colors">
                  {topic.title}
                </span>
              </div>
              <span className="font-bold text-xs" style={{ color: topic.color }}>
                {topic.percentage}%
              </span>
            </div>

            {/* Progress track */}
            <div className="h-2.5 w-full bg-[#0D1728] rounded-full overflow-hidden border border-[#26364B]/80 p-[1px]">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out group-hover:brightness-110 relative"
                style={{
                  width: `${(topic.percentage / 50) * 100}%`,
                  backgroundColor: topic.color,
                  boxShadow: `0 0 10px ${topic.color}40`
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* X-axis percentage markings and label */}
      <div className="pt-2 border-t border-[#26364B]/60 mt-1">
        <div className="flex items-center justify-between text-[10px] text-[#8995A7] font-mono px-0.5">
          {axisTicks.map((tick) => (
            <span key={tick}>{tick}%</span>
          ))}
        </div>
        <div className="text-center mt-0.5">
          <span className="text-[10px] font-medium uppercase tracking-wider text-[#A0AEC0]">
            % Engagement Share
          </span>
        </div>
      </div>
    </Card>
  );
};
