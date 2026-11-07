import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface DropdownOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string;
}

interface DropdownProps {
  options: DropdownOption[];
  selectedId: string;
  onSelect: (option: DropdownOption) => void;
  prefix?: string;
  icon?: React.ReactNode;
  className?: string;
  buttonClassName?: string;
  menuWidth?: string;
  align?: 'left' | 'right';
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  selectedId,
  onSelect,
  prefix,
  icon,
  className = '',
  buttonClassName = '',
  menuWidth = 'w-48',
  align = 'right'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.id === selectedId) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center justify-between space-x-2 bg-[#0D1728] hover:bg-[#15243B] text-[#F3F6FA] border border-[#26364B] hover:border-[#384C66] rounded-md px-3 py-1.5 text-xs font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-[#19D9A0] ${buttonClassName}`}
      >
        <span className="flex items-center space-x-1.5 truncate">
          {icon && <span className="text-[#8995A7]">{icon}</span>}
          {prefix && <span className="text-[#8995A7] font-normal">{prefix}:</span>}
          <span className="truncate">{selectedOption?.label}</span>
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#8995A7] transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-[#19D9A0]' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute z-50 mt-1.5 ${menuWidth} ${
            align === 'right' ? 'right-0' : 'left-0'
          } rounded-lg bg-[#0D1728] border border-[#26364B] shadow-2xl py-1 text-xs backdrop-blur-md overflow-hidden animate-in fade-in zoom-in-95 duration-100`}
        >
          {options.map((option) => {
            const isSelected = option.id === selectedId;
            return (
              <button
                key={option.id}
                onClick={() => {
                  onSelect(option);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-[#19D9A0]/15 text-[#19D9A0] font-medium'
                    : 'text-[#F3F6FA] hover:bg-[#162235] hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2 truncate">
                  {option.icon && (
                    <span className={isSelected ? 'text-[#19D9A0]' : 'text-[#8995A7]'}>
                      {option.icon}
                    </span>
                  )}
                  <span className="truncate">{option.label}</span>
                </div>
                {option.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#101A2B] text-[#8995A7] border border-[#26364B]">
                    {option.badge}
                  </span>
                )}
                {isSelected && <Check className="w-3.5 h-3.5 text-[#19D9A0] shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
