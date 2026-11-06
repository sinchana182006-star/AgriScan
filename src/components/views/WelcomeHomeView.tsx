import React, { useEffect, useState } from 'react';
import {
  Activity,
  ArrowRight,
  Bug,
  Camera,
  CheckCircle,
  FileCheck2,
  Layers,
  Leaf,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Upload,
  WifiOff,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { DiagnosisResult } from '../../types';
import { localDB } from '../../services/db';
import { NavItemKey } from '../Sidebar';

interface WelcomeHomeViewProps {
  onNavigate: (tab: NavItemKey) => void;
  onSelectScanForDetail?: (scan: DiagnosisResult) => void;
}

export const WelcomeHomeView: React.FC<WelcomeHomeViewProps> = ({
  onNavigate,
  onSelectScanForDetail,
}) => {
  const { t } = useLanguage();
  const { currentUser } = useAuth();
  const [scans, setScans] = useState<DiagnosisResult[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    healthy: 0,
    diseased: 0,
    pests: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const allScans = await localDB.getAllScans();
        setScans(allScans);

        let healthy = 0;
        let diseased = 0;
        let pests = 0;

        allScans.forEach((s) => {
          const top = s.top3[0];
          if (!top) return;
          if (top.category === 'healthy') healthy++;
          else if (top.category === 'pest') pests++;
          else diseased++;
        });

        setStats({
          total: allScans.length,
          healthy,
          diseased,
          pests,
        });
      } catch (err) {
        console.error('Error loading dashboard stats:', err);
      }
    };
    loadStats();
  }, []);

  return (
    <div className="space-y-8 pb-10">
      {/* 1. HERO WELCOME SECTION */}
      <section className="relative overflow-hidden rounded-3xl border border-emerald-900/10 bg-linear-to-br from-emerald-900 via-emerald-950 to-stone-950 text-white shadow-xl">
        {/* Subtle background glow */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-80 w-80 rounded-full bg-emerald-500/15 blur-3xl"></div>

        <div className="relative z-10 grid grid-cols-1 items-center gap-8 p-6 md:p-10 lg:grid-cols-12">
          {/* Text Content (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-700/60 bg-emerald-800/50 px-3 py-1 text-xs font-semibold text-emerald-200 backdrop-blur-xs">
              <WifiOff className="h-3.5 w-3.5 text-emerald-400" />
              <span>{t.offlineIndicator}</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl text-balance">
              Welcome to AgriScan
            </h1>

            <p className="text-base font-medium text-emerald-200 md:text-lg">
              {t.appSubtitle}
            </p>

            <p className="text-xs leading-relaxed text-emerald-100/80 md:text-sm max-w-xl">
              {t.welcomeIntro}
            </p>

            {/* Welcome Features List */}
            <div className="space-y-2 pt-2">
              {t.welcomeFeatures.slice(0, 3).map((feat, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-emerald-100/90">
                  <CheckCircle className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <button
                onClick={() => onNavigate('scanner')}
                className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-emerald-950 hover:bg-emerald-400 transition-colors shadow-md"
              >
                <span>{t.getStarted}</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => onNavigate('multi-scan')}
                className="flex items-center gap-2 rounded-xl border border-emerald-700 bg-emerald-900/60 px-4 py-3 text-xs font-semibold text-white hover:bg-emerald-800/80 transition-colors"
              >
                <Layers className="h-4 w-4 text-emerald-300" />
                <span>{t.navMultiScan}</span>
              </button>
            </div>
          </div>

          {/* Hero Visual Imagery (5 cols) */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto aspect-16/10 w-full max-w-md overflow-hidden rounded-2xl border border-emerald-700/50 shadow-2xl">
              <img
                src="/src/assets/images/hero_agriscan_farmer_1793904223845.jpg"
                alt="AgriScan farmer inspecting crops"
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-linear-to-t from-emerald-950/90 via-transparent to-transparent"></div>
              <div className="absolute bottom-3 left-3 right-3 text-xs text-white">
                <span className="font-bold text-emerald-300">Smart Offline Diagnostic Engine</span>
                <p className="text-[11px] text-emerald-100/70">
                  On-device neural inference without cloud dependencies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DASHBOARD KPI CARDS (60-30-10 palette discipline) */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {/* Total Scans */}
        <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">{t.totalScans}</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-100 text-stone-700">
              <ScanLine className="h-4 w-4" />
            </div>
          </div>
          <p className="font-mono-numbers mt-2 text-2xl font-extrabold text-stone-900 sm:text-3xl">
            {stats.total}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium">Logged in local database</span>
        </div>

        {/* Healthy Crops */}
        <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">{t.healthyCrops}</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
              <Leaf className="h-4 w-4" />
            </div>
          </div>
          <p className="font-mono-numbers mt-2 text-2xl font-extrabold text-emerald-700 sm:text-3xl">
            {stats.healthy}
          </p>
          <span className="text-[11px] text-stone-500 font-medium">Optimal canopy chlorophyll</span>
        </div>

        {/* Disease Detected */}
        <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">{t.diseasesDetected}</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <p className="font-mono-numbers mt-2 text-2xl font-extrabold text-amber-700 sm:text-3xl">
            {stats.diseased}
          </p>
          <span className="text-[11px] text-stone-500 font-medium">Under active treatment</span>
        </div>

        {/* Pest Incidents */}
        <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">{t.pestsDetected}</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-700">
              <Bug className="h-4 w-4" />
            </div>
          </div>
          <p className="font-mono-numbers mt-2 text-2xl font-extrabold text-red-700 sm:text-3xl">
            {stats.pests}
          </p>
          <span className="text-[11px] text-stone-500 font-medium">IPM protocols available</span>
        </div>
      </section>

      {/* 3. QUICK ACCESS TO DIAGNOSTIC SERVICES */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-stone-900 md:text-lg">Quick Agricultural Services</h2>
          <span className="text-xs text-stone-500">All tools work offline</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: AI Scanner */}
          <div
            onClick={() => onNavigate('scanner')}
            className="group cursor-pointer rounded-2xl border border-stone-200 bg-white p-5 shadow-xs transition-all hover:border-emerald-500 hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 transition-transform group-hover:scale-105">
              <Camera className="h-5 w-5" />
            </div>
            <h3 className="mt-3 font-bold text-stone-900 text-sm">AI Crop Scanner</h3>
            <p className="mt-1 text-xs text-stone-600 line-clamp-2">
              Capture or upload leaf photo with 2-stage verification & top-3 differential diagnosis.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
              Launch Scanner <ArrowRight className="h-3 w-3" />
            </span>
          </div>

          {/* Card 2: Multi-Leaf Detection */}
          <div
            onClick={() => onNavigate('multi-scan')}
            className="group cursor-pointer rounded-2xl border border-stone-200 bg-white p-5 shadow-xs transition-all hover:border-emerald-500 hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-800 transition-transform group-hover:scale-105">
              <Layers className="h-5 w-5" />
            </div>
            <h3 className="mt-3 font-bold text-stone-900 text-sm">Multiple Image Detection</h3>
            <p className="mt-1 text-xs text-stone-600 line-clamp-2">
              Batch analyze multiple leaf samples at once and generate a combined field health index.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-blue-700">
              Batch Inspection <ArrowRight className="h-3 w-3" />
            </span>
          </div>

          {/* Card 3: Pest & Beneficials */}
          <div
            onClick={() => onNavigate('pest-id')}
            className="group cursor-pointer rounded-2xl border border-stone-200 bg-white p-5 shadow-xs transition-all hover:border-emerald-500 hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800 transition-transform group-hover:scale-105">
              <Bug className="h-5 w-5" />
            </div>
            <h3 className="mt-3 font-bold text-stone-900 text-sm">Pest Identification</h3>
            <p className="mt-1 text-xs text-stone-600 line-clamp-2">
              Identify harmful insects and protect beneficial farmer predators like ladybugs.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-amber-800">
              Identify Pest <ArrowRight className="h-3 w-3" />
            </span>
          </div>

          {/* Card 4: Disease Encyclopedia */}
          <div
            onClick={() => onNavigate('encyclopedia')}
            className="group cursor-pointer rounded-2xl border border-stone-200 bg-white p-5 shadow-xs transition-all hover:border-emerald-500 hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-800 transition-transform group-hover:scale-105">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="mt-3 font-bold text-stone-900 text-sm">Disease Encyclopedia</h3>
            <p className="mt-1 text-xs text-stone-600 line-clamp-2">
              Explore preloaded offline reference guides for Tomato, Potato, Apple, Grapes, and more.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-purple-700">
              Open Library <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      </section>

      {/* 4. RECENT ACTIVITY & AGRONOMIC TIPS OF THE DAY */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Recent Scans (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-900">{t.recentActivity}</h3>
            <button
              onClick={() => onNavigate('history')}
              className="text-xs font-semibold text-emerald-700 hover:underline"
            >
              View Full History
            </button>
          </div>

          {scans.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-stone-200 bg-stone-50/50 p-8 text-center text-xs text-stone-500">
              <ScanLine className="mx-auto h-8 w-8 text-stone-400" />
              <p className="mt-2 font-medium">No previous scans recorded yet.</p>
              <button
                onClick={() => onNavigate('scanner')}
                className="mt-3 inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
              >
                Scan Your First Crop Leaf
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {scans.slice(0, 4).map((scan) => {
                const top = scan.top3[0];
                return (
                  <div
                    key={scan.id}
                    onClick={() => onSelectScanForDetail && onSelectScanForDetail(scan)}
                    className="flex cursor-pointer items-center justify-between rounded-xl border border-stone-200 bg-white p-3 hover:border-emerald-300 transition-colors shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={scan.imageUri}
                        alt="Scanned leaf"
                        className="h-12 w-12 rounded-lg object-cover border border-stone-200"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-stone-900">
                            {top?.name || 'Crop Leaf'}
                          </span>
                          <span className="text-stone-300">·</span>
                          <span className="text-[11px] text-stone-500 capitalize">{scan.cropName}</span>
                        </div>
                        <p className="text-[11px] text-stone-500">
                          {new Date(scan.timestamp).toLocaleDateString()} · {new Date(scan.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-mono-numbers text-xs font-bold text-emerald-700">
                        {top?.confidence || 0}%
                      </span>
                      <p className="text-[10px] text-stone-400">Confidence</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Agronomic Daily Tips (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-sm font-bold text-stone-900">{t.quickTipsTitle}</h3>
          <div className="space-y-2.5 rounded-2xl border border-stone-200 bg-stone-50 p-4">
            {t.quickTips.map((tip, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs text-stone-700">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-200/80 font-bold text-emerald-950 text-[10px]">
                  {i + 1}
                </span>
                <p className="leading-snug">{tip}</p>
              </div>
            ))}
          </div>

          {/* Offline Voice Assistant Banner */}
          <div
            onClick={() => onNavigate('voice')}
            className="cursor-pointer rounded-2xl border border-emerald-300 bg-emerald-50/70 p-4 transition-all hover:bg-emerald-100/60"
          >
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white">
                <Sparkles className="h-4 w-4" />
              </span>
              <span className="text-xs font-bold text-emerald-950">Farmer Voice Assistant Active</span>
            </div>
            <p className="mt-1 text-xs text-emerald-800">
              Speak or ask diagnostic questions in English, Kannada, Hindi, or Malayalam.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
