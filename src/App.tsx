import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { NavItemKey, Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { AuthView } from './components/AuthView';
import { WelcomeHomeView } from './components/views/WelcomeHomeView';
import { AiCropScannerView } from './components/views/AiCropScannerView';
import { MultiImageScannerView } from './components/views/MultiImageScannerView';
import { PestIdentificationView } from './components/views/PestIdentificationView';
import { MultiCauseDiagnosisView } from './components/views/MultiCauseDiagnosisView';
import { CropHealthReportView } from './components/views/CropHealthReportView';
import { TreatmentRecommendationsView } from './components/views/TreatmentRecommendationsView';
import { DiseaseEncyclopediaView } from './components/views/DiseaseEncyclopediaView';
import { RiskPredictionView } from './components/views/RiskPredictionView';
import { ScanHistoryView } from './components/views/ScanHistoryView';
import { FarmerNotesView } from './components/views/FarmerNotesView';
import { VoiceAssistantView } from './components/views/VoiceAssistantView';
import { RemindersView } from './components/views/RemindersView';
import { ProfileView } from './components/views/ProfileView';
import { SettingsView } from './components/views/SettingsView';
import { DiagnosisResult, Language } from './types';
import { CheckCircle2, Globe } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentUser, isLoading } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const [currentTab, setCurrentTab] = useState<NavItemKey>('home');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // If loading local IndexedDB auth session
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-900 text-stone-100">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
          <span className="text-xs font-semibold text-emerald-400">Loading AgriScan Offline Environment...</span>
        </div>
      </div>
    );
  }

  // If not logged in, render the Offline Login / Registration screen
  if (!currentUser) {
    return <AuthView onSuccess={() => setCurrentTab('home')} />;
  }

  const renderActiveView = () => {
    switch (currentTab) {
      case 'home':
        return <WelcomeHomeView onNavigate={(tab) => setCurrentTab(tab)} />;
      case 'scanner':
        return <AiCropScannerView />;
      case 'multi-scan':
        return <MultiImageScannerView />;
      case 'pest-id':
        return <PestIdentificationView />;
      case 'multi-cause':
        return <MultiCauseDiagnosisView />;
      case 'health-report':
        return <CropHealthReportView />;
      case 'treatments':
        return <TreatmentRecommendationsView />;
      case 'encyclopedia':
        return <DiseaseEncyclopediaView />;
      case 'risk-pred':
        return <RiskPredictionView />;
      case 'history':
        return <ScanHistoryView />;
      case 'notes':
        return <FarmerNotesView />;
      case 'voice':
        return <VoiceAssistantView />;
      case 'reminders':
        return <RemindersView />;
      case 'language':
        return (
          <div className="space-y-6 max-w-xl pb-12">
            <div>
              <h2 className="text-xl font-bold text-stone-900 md:text-2xl">{t.navLanguage}</h2>
              <p className="text-xs text-stone-500">
                Select your preferred language. The entire interface, diagnoses, and recommendations will update immediately.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                { code: 'en', name: 'English', native: 'English' },
                { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
                { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
                { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
              ].map((lang) => {
                const isActive = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code as Language)}
                    className={`flex items-center justify-between rounded-2xl border p-4 text-left transition-all shadow-xs ${
                      isActive
                        ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500/20'
                        : 'border-stone-200 bg-white hover:border-emerald-400'
                    }`}
                  >
                    <div>
                      <p className="text-sm font-bold text-stone-900">{lang.native}</p>
                      <p className="text-xs text-stone-500">{lang.name}</p>
                    </div>
                    {isActive && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
                  </button>
                );
              })}
            </div>
          </div>
        );
      case 'profile':
        return <ProfileView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <WelcomeHomeView onNavigate={(tab) => setCurrentTab(tab)} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-stone-50 text-stone-900">
      {/* Permanent Sidebar on Desktop / Drawer on Mobile */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area to the right of the permanent sidebar */}
      <div className="flex flex-1 flex-col min-w-0">
        <TopHeader
          currentTab={currentTab}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onQuickScan={() => setCurrentTab('scanner')}
        />

        <main className="flex-1 px-4 py-6 md:px-8">
          <div className="mx-auto max-w-7xl">{renderActiveView()}</div>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </AuthProvider>
  );
}
