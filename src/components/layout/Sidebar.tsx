import React, { useState } from 'react';
import {
  LayoutGrid,
  BarChart2,
  Users,
  Bell,
  Settings,
  HelpCircle
} from 'lucide-react';

export type SidebarItem = 'dashboard' | 'analytics' | 'competitors' | 'notifications' | 'settings';

interface SidebarProps {
  activeItem?: SidebarItem;
  onSelect?: (item: SidebarItem) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeItem = 'analytics',
  onSelect
}) => {
  const [current, setCurrent] = useState<SidebarItem>(activeItem);

  const handleSelect = (item: SidebarItem) => {
    setCurrent(item);
    onSelect?.(item);
  };

  const navItems: { id: SidebarItem; icon: React.ReactNode; label: string }[] = [
    { id: 'dashboard', icon: <LayoutGrid className="w-5 h-5" />, label: 'Dashboard Overview' },
    { id: 'analytics', icon: <BarChart2 className="w-5 h-5" />, label: 'Analytics & Observability' },
    { id: 'competitors', icon: <Users className="w-5 h-5" />, label: 'Competitor Intelligence' },
    { id: 'notifications', icon: <Bell className="w-5 h-5" />, label: 'Alerts & Triggers' },
    { id: 'settings', icon: <Settings className="w-5 h-5" />, label: 'System Settings' },
  ];

  return (
    <aside className="w-[52px] bg-[#0D1728] border-r border-[#26364B] flex flex-col items-center justify-between py-3 select-none z-30 shrink-0">
      {/* Top Nav Icons */}
      <div className="flex flex-col items-center space-y-2 w-full">
        {navItems.map((item) => {
          const isActive = current === item.id;
          return (
            <div key={item.id} className="relative group w-full flex justify-center">
              <button
                onClick={() => handleSelect(item.id)}
                className={`relative w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 focus:outline-none ${
                  isActive
                    ? 'bg-[#19D9A0]/15 text-[#19D9A0] shadow-[0_0_12px_rgba(25,217,160,0.25)]'
                    : 'text-[#8995A7] hover:text-[#F3F6FA] hover:bg-[#111E30]'
                }`}
                title={item.label}
              >
                {/* Active left indicator pill */}
                {isActive && (
                  <span className="absolute -left-[6px] top-2 bottom-2 w-1 bg-[#19D9A0] rounded-r shadow-[0_0_8px_#19D9A0]" />
                )}
                {item.icon}
              </button>

              {/* Tooltip on hover */}
              <div className="absolute left-[56px] px-2.5 py-1 bg-[#111E30] text-[#F3F6FA] text-[11px] font-medium rounded-md shadow-xl border border-[#26364B] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                {item.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Icons: Help & User Avatar */}
      <div className="flex flex-col items-center space-y-3 w-full">
        <div className="relative group w-full flex justify-center">
          <button
            className="w-10 h-10 rounded-lg flex items-center justify-center text-[#8995A7] hover:text-[#F3F6FA] hover:bg-[#111E30] transition-colors focus:outline-none"
            title="Help & Documentation"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
          <div className="absolute left-[56px] px-2.5 py-1 bg-[#111E30] text-[#F3F6FA] text-[11px] font-medium rounded-md shadow-xl border border-[#26364B] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
            Help & Documentation
          </div>
        </div>

        {/* User avatar indicator at bottom */}
        <div className="relative cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#19D9A0] to-[#2185F5] p-[1.5px] transition-transform group-hover:scale-105">
            <div className="w-full h-full rounded-full bg-[#0D1728] flex items-center justify-center overflow-hidden">
              <span className="text-[11px] font-bold text-[#19D9A0]">BV</span>
            </div>
          </div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#19D9A0] border-2 border-[#0D1728]" />
        </div>
      </div>
    </aside>
  );
};
