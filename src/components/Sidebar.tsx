import React from 'react';
import {
  Home,
  ScanLine,
  Layers,
  Bug,
  HelpCircle,
  Activity,
  ShieldCheck,
  BookOpen,
  CloudSun,
  History,
  FileText,
  Mic,
  Bell,
  Globe,
  User,
  Settings,
  LogOut,
  X,
  Sprout,
  WifiOff,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export type NavItemKey =
  | 'home'
  | 'scanner'
  | 'multi-scan'
  | 'pest-id'
  | 'multi-cause'
  | 'health-report'
  | 'treatments'
  | 'encyclopedia'
  | 'risk-pred'
  | 'history'
  | 'notes'
  | 'voice'
  | 'reminders'
  | 'language'
  | 'profile'
  | 'settings';

interface SidebarProps {
  currentTab: NavItemKey;
  onSelectTab: (tab: NavItemKey) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  mobileOpen,
  onCloseMobile,
}) => {
  const { t } = useLanguage();
  const { logout, currentUser } = useAuth();

  const navItems: { key: NavItemKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: 'home', label: t.navHome, icon: Home },
    { key: 'scanner', label: t.navScanner, icon: ScanLine },
    { key: 'multi-scan', label: t.navMultiScan, icon: Layers },
    { key: 'pest-id', label: t.navPestId, icon: Bug },
    { key: 'multi-cause', label: t.navMultiCause, icon: HelpCircle },
    { key: 'health-report', label: t.navHealthReport, icon: Activity },
    { key: 'treatments', label: t.navTreatments, icon: ShieldCheck },
    { key: 'encyclopedia', label: t.navEncyclopedia, icon: BookOpen },
    { key: 'risk-pred', label: t.navRiskPred, icon: CloudSun },
    { key: 'history', label: t.navScanHistory, icon: History },
    { key: 'notes', label: t.navNotes, icon: FileText },
    { key: 'voice', label: t.navVoice, icon: Mic },
    { key: 'reminders', label: t.navReminders, icon: Bell },
    { key: 'language', label: t.navLanguage, icon: Globe },
    { key: 'profile', label: t.navProfile, icon: User },
    { key: 'settings', label: t.navSettings, icon: Settings },
  ];

  const handleNavClick = (key: NavItemKey) => {
    onSelectTab(key);
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex h-full flex-col bg-emerald-950 text-stone-100">
      {/* Brand Header */}
      <div className="flex items-center justify-between border-b border-emerald-900/60 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-inner">
            <Sprout className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white">AgriScan</span>
              <span className="rounded bg-emerald-900/80 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-300">
                OFFLINE
              </span>
            </div>
            <p className="text-xs text-emerald-400/80">Crop Pathology AI</p>
          </div>
        </div>

        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          className="rounded-lg p-1.5 text-emerald-300 hover:bg-emerald-900 md:hidden"
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Offline Status Badge in Sidebar */}
      <div className="mx-3 mt-3 flex items-center gap-2 rounded-lg border border-emerald-800/60 bg-emerald-900/40 px-3 py-2 text-xs text-emerald-200">
        <WifiOff className="h-4 w-4 shrink-0 text-emerald-400" />
        <span className="truncate">100% Local Neural Engine</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => handleNavClick(item.key)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-100/80 hover:bg-emerald-900/60 hover:text-white'
              }`}
            >
              <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-emerald-400'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Footer & Logout */}
      <div className="border-t border-emerald-900/60 p-3">
        {currentUser && (
          <div className="mb-2 flex items-center gap-3 px-2 py-1.5 text-xs text-emerald-200">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-800 font-semibold text-emerald-200">
              {currentUser.fullName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-white">{currentUser.fullName}</p>
              <p className="truncate text-[11px] text-emerald-400/80">{currentUser.district || 'Offline User'}</p>
            </div>
          </div>
        )}

        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-xs font-medium text-red-300 hover:bg-red-950/60 hover:text-red-200 transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>{t.navLogout}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Permanent Sidebar for Desktop/Laptop (Width: 260px) */}
      <aside className="hidden h-screen w-64 shrink-0 flex-col md:flex shadow-md z-30">
        {sidebarContent}
      </aside>

      {/* Collapsible Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          {/* Drawer Panel */}
          <div className="relative flex h-full w-72 max-w-xs flex-1 flex-col shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
