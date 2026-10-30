import React, { useState } from 'react';
import { 
  Sparkles, 
  Smile, 
  Moon, 
  LineChart, 
  BookOpen, 
  MessageSquareHeart, 
  Settings, 
  ShieldAlert, 
  Menu, 
  X,
  Compass
} from 'lucide-react';

export type ActiveTab = 'dashboard' | 'mood' | 'sleep' | 'insights' | 'exercises' | 'chat' | 'settings';

interface NavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenEmergency: () => void;
  onOpenOnboarding: () => void;
  apiStatus: { configured: boolean; model: string };
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenEmergency,
  onOpenOnboarding,
  apiStatus
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Home', icon: <Compass className="w-4 h-4" /> },
    { id: 'mood', label: 'Mood Log', icon: <Smile className="w-4 h-4" /> },
    { id: 'sleep', label: 'Sleep & Rest', icon: <Moon className="w-4 h-4" /> },
    { id: 'insights', label: 'Insights', icon: <LineChart className="w-4 h-4" /> },
    { id: 'exercises', label: 'Exercises', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'chat', label: 'Prakash AI', icon: <MessageSquareHeart className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const handleSelect = (tab: ActiveTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-sage-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSelect('dashboard')}
              className="flex items-center gap-2.5 text-left group focus:outline-none focus:ring-2 focus:ring-sage-400 rounded-xl p-1"
            >
              <div className="w-9 h-9 rounded-xl bg-sage-600 flex items-center justify-center text-white shadow-sm shadow-sage-200 group-hover:bg-sage-700 transition">
                <span className="text-xl">🌿</span>
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-gray-900 flex items-center gap-1.5">
                  MindCare
                </span>
                <span className="block text-[10px] uppercase font-medium tracking-wider text-sage-700 -mt-1">
                  Gentle Wellness & Reflection
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Nav Tabs */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-sage-100 text-sage-900 shadow-xs'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/70'
                  }`}
                >
                  <span className={isActive ? 'text-sage-700' : 'text-gray-400'}>
                    {item.icon}
                  </span>
                  {item.label}
                  {item.id === 'chat' && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Header Badges & Actions */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Disclaimer pill */}
            <button
              onClick={onOpenOnboarding}
              title="Click to review MindCare boundaries & consent"
              className="text-xs px-2.5 py-1 rounded-lg bg-sage-50 text-sage-800 border border-sage-200 hover:bg-sage-100 transition flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-sage-600" />
              <span>Non-Medical Tool</span>
            </button>

            {/* Emergency Hotline Button */}
            <button
              onClick={onOpenEmergency}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition shadow-xs"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Crisis Support</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onOpenEmergency}
              className="p-1.5 rounded-lg text-rose-700 bg-rose-50 border border-rose-200"
              aria-label="Crisis Support"
            >
              <ShieldAlert className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-sage-100 bg-[#FAF8F5] px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? 'bg-sage-100 text-sage-900'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span className={isActive ? 'text-sage-700' : 'text-gray-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="pt-2 border-t border-gray-200/60 mt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenOnboarding();
              }}
              className="w-full text-left text-xs px-3.5 py-2 text-sage-800 hover:bg-sage-50 rounded-lg"
            >
              ℹ️ About MindCare & Non-Medical Boundaries
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

