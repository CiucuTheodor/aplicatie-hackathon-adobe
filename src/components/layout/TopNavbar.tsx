import React, { useState, useRef, useEffect } from 'react';
import {
  Activity,
  Bell,
  ChevronDown,
  User,
  ShieldAlert,
  Radio,
  Sliders,
  LogOut,
  ExternalLink,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export type NavTab = 'Overview' | 'Competitors' | 'Brand Mentions' | 'Alerts' | 'Reports';

interface TopNavbarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ activeTab, onTabChange }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const tabs: NavTab[] = [
    'Overview',
    'Competitors',
    'Brand Mentions',
    'Alerts',
    'Reports'
  ];

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <header className="h-[58px] bg-[#101A2B] border-b border-[#26364B] px-4 flex items-center justify-between select-none z-40 relative">
      {/* Left: Brand Identity */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-3 cursor-pointer group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#19D9A0] via-[#10936C] to-[#0D1728] p-[1px] shadow-sm group-hover:shadow-[0_0_12px_rgba(25,217,160,0.4)] transition-all">
            <div className="w-full h-full bg-[#0D1728] rounded-[7px] flex items-center justify-center">
              <Radio className="w-4 h-4 text-[#19D9A0] animate-pulse" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="text-sm font-extrabold tracking-wider leading-none">
              <span className="text-white">BRAND</span>
              <span className="text-[#19D9A0]">VISION</span>
            </div>
            <span className="text-[10px] text-[#8995A7] font-medium tracking-wide mt-0.5">
              SaaS Observability
            </span>
          </div>
        </div>

        {/* Center / Left-align Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1 pl-4 h-[58px]">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`relative px-3.5 h-[58px] text-xs font-semibold tracking-wide transition-colors flex items-center justify-center ${
                  isActive
                    ? 'text-[#19D9A0]'
                    : 'text-[#A0AEC0] hover:text-[#F3F6FA] hover:bg-[#111E30]/40'
                }`}
              >
                {tab}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#19D9A0] shadow-[0_0_8px_#19D9A0]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        {/* Live Status indicator */}
        <div className="hidden lg:flex items-center space-x-2 px-2.5 py-1 rounded-full bg-[#070D1A] border border-[#26364B] text-[11px] text-[#A0AEC0]">
          <span className="w-2 h-2 rounded-full bg-[#19D9A0] animate-ping" />
          <span className="text-[#8995A7]">AI Engine:</span>
          <span className="text-[#19D9A0] font-medium">Tracking 4 Competitors</span>
        </div>

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="relative p-2 rounded-lg bg-[#0D1728] border border-[#26364B] hover:border-[#3A4D66] text-[#A0AEC0] hover:text-white transition-colors focus:outline-none"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#F59E35] border-2 border-[#101A2B] rounded-full" />
            )}
          </button>

          {/* Notifications Flyout */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#0D1728] border border-[#26364B] rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-3 border-b border-[#26364B] flex items-center justify-between bg-[#111E30]">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Alerts & Signals
                  </span>
                  <span className="px-1.5 py-0.2 text-[10px] bg-[#19D9A0]/20 text-[#19D9A0] rounded-full font-semibold">
                    {unreadCount} new
                  </span>
                </div>
                <button
                  onClick={() => setUnreadCount(0)}
                  className="text-[11px] text-[#8995A7] hover:text-[#19D9A0] transition-colors"
                >
                  Mark read
                </button>
              </div>

              <div className="divide-y divide-[#26364B]/60 max-h-80 overflow-y-auto">
                <div className="p-3 hover:bg-[#111E30] transition-colors cursor-pointer flex items-start space-x-2.5">
                  <AlertCircle className="w-4 h-4 text-[#F59E35] mt-0.5 shrink-0" />
                  <div className="text-xs">
                    <p className="text-[#F3F6FA] font-medium leading-tight">
                      Competitor B launched new pricing tier
                    </p>
                    <p className="text-[11px] text-[#8995A7] mt-0.5">3 mentions detected on Reddit & HackerNews</p>
                    <span className="text-[10px] text-[#19D9A0] mt-1 block">12m ago</span>
                  </div>
                </div>

                <div className="p-3 hover:bg-[#111E30] transition-colors cursor-pointer flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#19D9A0] mt-0.5 shrink-0" />
                  <div className="text-xs">
                    <p className="text-[#F3F6FA] font-medium leading-tight">
                      Share of Voice reached target: 42%
                    </p>
                    <p className="text-[11px] text-[#8995A7] mt-0.5">+3.8% surge following the Q3 product release</p>
                    <span className="text-[10px] text-[#19D9A0] mt-1 block">45m ago</span>
                  </div>
                </div>

                <div className="p-3 hover:bg-[#111E30] transition-colors cursor-pointer flex items-start space-x-2.5">
                  <ShieldAlert className="w-4 h-4 text-[#2185F5] mt-0.5 shrink-0" />
                  <div className="text-xs">
                    <p className="text-[#F3F6FA] font-medium leading-tight">
                      TechCrunch featured BrandVision
                    </p>
                    <p className="text-[11px] text-[#8995A7] mt-0.5">High authority backlink detected with 180k reach</p>
                    <span className="text-[10px] text-[#19D9A0] mt-1 block">2h ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center space-x-2 pl-2 pr-1.5 py-1 rounded-lg bg-[#0D1728] border border-[#26364B] hover:border-[#3A4D66] transition-colors focus:outline-none"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#2185F5] to-[#19D9A0] flex items-center justify-center text-[11px] font-bold text-white shadow-inner">
              SV
            </div>
            <span className="text-xs font-semibold text-[#F3F6FA] hidden sm:inline">
              Stefan V.
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#8995A7]" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-[#0D1728] border border-[#26364B] rounded-xl shadow-2xl z-50 py-1.5 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2 border-b border-[#26364B] mb-1">
                <p className="font-semibold text-white">Stefan Vance</p>
                <p className="text-[11px] text-[#8995A7]">stefan@brandvision.io</p>
                <span className="inline-block mt-1.5 px-2 py-0.5 rounded bg-[#19D9A0]/20 text-[#19D9A0] text-[10px] font-medium">
                  Enterprise Admin
                </span>
              </div>
              <button
                onClick={() => setShowProfileMenu(false)}
                className="w-full text-left px-3 py-2 hover:bg-[#111E30] text-[#A0AEC0] hover:text-white flex items-center space-x-2 transition-colors"
              >
                <User className="w-3.5 h-3.5 text-[#8995A7]" />
                <span>Account Profile</span>
              </button>
              <button
                onClick={() => setShowProfileMenu(false)}
                className="w-full text-left px-3 py-2 hover:bg-[#111E30] text-[#A0AEC0] hover:text-white flex items-center space-x-2 transition-colors"
              >
                <Sliders className="w-3.5 h-3.5 text-[#8995A7]" />
                <span>Observability Rules</span>
              </button>
              <button
                onClick={() => setShowProfileMenu(false)}
                className="w-full text-left px-3 py-2 hover:bg-[#111E30] text-[#A0AEC0] hover:text-white flex items-center space-x-2 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#8995A7]" />
                <span>API & Webhooks</span>
              </button>
              <div className="border-t border-[#26364B] my-1" />
              <button
                onClick={() => setShowProfileMenu(false)}
                className="w-full text-left px-3 py-2 hover:bg-[#111E30] text-[#F59E35] flex items-center space-x-2 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
