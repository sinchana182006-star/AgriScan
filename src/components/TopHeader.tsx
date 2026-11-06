import React from 'react';
import { Menu, WifiOff, Globe, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../types';
import { NavItemKey } from './Sidebar';

interface TopHeaderProps {
  currentTab: NavItemKey;
  onOpenMobileSidebar: () => void;
  onQuickScan: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentTab,
  onOpenMobileSidebar,
  onQuickScan,
}) => {
  const { language, setLanguage, t } = useLanguage();

  const languageLabels: Record<Language, { label: string; native: string }> = {
    en: { label: 'English', native: 'English' },
    kn: { label: 'Kannada', native: 'ಕನ್ನಡ' },
    hi: { label: 'Hindi', native: 'हिन्दी' },
    ml: { label: 'Malayalam', native: 'മലയാളം' },
  };

  const getSectionTitle = (tab: NavItemKey): string => {
    switch (tab) {
      case 'home':
        return t.navHome;
      case 'scanner':
        return t.navScanner;
      case 'multi-scan':
        return t.navMultiScan;
      case 'pest-id':
        return t.navPestId;
      case 'multi-cause':
        return t.navMultiCause;
      case 'health-report':
        return t.navHealthReport;
      case 'treatments':
        return t.navTreatments;
      case 'encyclopedia':
        return t.navEncyclopedia;
      case 'risk-pred':
        return t.navRiskPred;
      case 'history':
        return t.navScanHistory;
      case 'notes':
        return t.navNotes;
      case 'voice':
        return t.navVoice;
      case 'reminders':
        return t.navReminders;
      case 'language':
        return t.navLanguage;
      case 'profile':
        return t.navProfile;
      case 'settings':
        return t.navSettings;
      default:
        return 'AgriScan';
    }
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-stone-200/80 bg-white/95 px-4 backdrop-blur-md md:px-6">
      {/* Left zone: Mobile toggle + Breadcrumb Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="rounded-lg p-2 text-stone-600 hover:bg-stone-100 hover:text-stone-900 md:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">AgriScan</span>
          <span className="text-stone-300">/</span>
          <h1 className="text-sm font-bold text-stone-800 md:text-base">{getSectionTitle(currentTab)}</h1>
        </div>
      </div>

      {/* Right zone: Offline Badge + Language Selector + Quick Scan Button */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Offline indicator */}
        <div className="hidden items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-800 lg:flex shadow-xs">
          <WifiOff className="h-3.5 w-3.5 text-emerald-600" />
          <span>{t.offlineIndicator}</span>
        </div>

        {/* Multilingual Selector */}
        <div className="relative flex items-center">
          <label htmlFor="language-select" className="sr-only">
            Select Language
          </label>
          <div className="flex items-center gap-1 rounded-lg border border-stone-200 bg-stone-50 px-2.5 py-1.5 text-xs font-medium text-stone-700 hover:border-emerald-500 transition-colors">
            <Globe className="h-3.5 w-3.5 text-stone-500" />
            <select
              id="language-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-transparent text-xs font-semibold text-stone-800 outline-none cursor-pointer"
            >
              <option value="en">English (EN)</option>
              <option value="kn">ಕನ್ನಡ (Kannada)</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="ml">മലയാളം (Malayalam)</option>
            </select>
          </div>
        </div>

        {/* Quick Scan Action button */}
        {currentTab !== 'scanner' && (
          <button
            onClick={onQuickScan}
            className="hidden items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 sm:flex shadow-xs transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>{t.navScanner}</span>
          </button>
        )}
      </div>
    </header>
  );
};
