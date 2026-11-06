import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Cpu,
  Database,
  Download,
  HardDrive,
  HelpCircle,
  Laptop,
  Layers,
  Smartphone,
  Sparkles,
  Trash2,
  WifiOff,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { localDB } from '../../services/db';

export const SettingsView: React.FC = () => {
  const { t } = useLanguage();
  const [storageEstimate, setStorageEstimate] = useState<string>('Estimating...');
  const [scanCount, setScanCount] = useState<number>(0);

  useEffect(() => {
    const checkStorage = async () => {
      try {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
          const estimate = await navigator.storage.estimate();
          const usedMb = ((estimate.usage || 0) / (1024 * 1024)).toFixed(1);
          const totalMb = ((estimate.quota || 0) / (1024 * 1024)).toFixed(0);
          setStorageEstimate(`${usedMb} MB used of ${totalMb} MB quota`);
        } else {
          setStorageEstimate('Supported (IndexedDB Persistent)');
        }

        const scans = await localDB.getAllScans();
        setScanCount(scans.length);
      } catch (e) {
        setStorageEstimate('Active');
      }
    };
    checkStorage();
  }, []);

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-stone-900 md:text-2xl">{t.navSettings}</h2>
        <p className="text-xs text-stone-500">
          Offline hardware verification, device persistence, and installation guide.
        </p>
      </div>

      {/* Model & AI Engine Status Card */}
      <div className="rounded-2xl border border-emerald-200 bg-linear-to-br from-emerald-50 via-white to-stone-50 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
              Verified Offline Architecture
            </span>
            <h3 className="text-base font-bold text-stone-900">
              Dual-Stage Computer Vision & Pathology Engine
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-xs">
          <div className="rounded-xl border border-stone-200 bg-white p-3">
            <span className="text-stone-400 font-medium">Inference Execution:</span>
            <p className="font-bold text-stone-900 mt-0.5">100% In-Browser Local Canvas & Neural Kernels</p>
          </div>
          <div className="rounded-xl border border-stone-200 bg-white p-3">
            <span className="text-stone-400 font-medium">Cloud API Dependency:</span>
            <p className="font-bold text-emerald-700 mt-0.5">None (Zero External API Calls)</p>
          </div>
          <div className="rounded-xl border border-stone-200 bg-white p-3">
            <span className="text-stone-400 font-medium">Database Backend:</span>
            <p className="font-bold text-stone-900 mt-0.5">Localhost IndexedDB Persistent Storage</p>
          </div>
        </div>
      </div>

      {/* Local Storage & Cache Card */}
      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-stone-900">Local Database Diagnostics</h3>
          </div>
          <span className="text-xs font-mono-numbers text-stone-500">{storageEstimate}</span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs sm:grid-cols-3">
          <div className="rounded-xl border border-stone-100 bg-stone-50 p-3">
            <span className="text-stone-500">Saved Diagnostic Scans:</span>
            <p className="font-mono-numbers text-base font-bold text-stone-900 mt-1">{scanCount}</p>
          </div>
          <div className="rounded-xl border border-stone-100 bg-stone-50 p-3">
            <span className="text-stone-500">Supported Crops:</span>
            <p className="font-mono-numbers text-base font-bold text-emerald-700 mt-1">7 Crops</p>
          </div>
          <div className="rounded-xl border border-stone-100 bg-stone-50 p-3">
            <span className="text-stone-500">Diseases Preloaded:</span>
            <p className="font-mono-numbers text-base font-bold text-emerald-700 mt-1">45+ Conditions</p>
          </div>
        </div>
      </div>

      {/* Complete Installation Guide for Laptop & Android */}
      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs space-y-5 text-xs">
        <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
          <HelpCircle className="h-5 w-5 text-emerald-600" />
          <h3 className="text-sm font-bold text-stone-900">
            Installation & Deployment Guide (Laptop & Android)
          </h3>
        </div>

        {/* Laptop Setup */}
        <div className="space-y-2">
          <h4 className="font-bold text-stone-800 flex items-center gap-1.5 text-xs">
            <Laptop className="h-4 w-4 text-emerald-600" />
            A. Running on Laptop / Localhost Desktop:
          </h4>
          <ol className="space-y-1.5 pl-5 list-decimal text-stone-600 leading-relaxed">
            <li>Ensure Node.js 18+ is installed on your workstation.</li>
            <li>Run <code className="bg-stone-100 px-1 py-0.5 rounded font-mono">npm install</code> to assemble all bundled dependencies.</li>
            <li>Launch the local development server with <code className="bg-stone-100 px-1 py-0.5 rounded font-mono">npm run dev</code>.</li>
            <li>Open your browser to <code className="bg-stone-100 px-1 py-0.5 rounded font-mono">http://localhost:3000</code>.</li>
            <li>Once loaded, you can completely disconnect Wi-Fi or unplug your internet router. AgriScan continues to process camera images, perform 2-stage verification, run differential diagnosis, and translate languages 100% offline!</li>
          </ol>
        </div>

        {/* Android Mobile Setup */}
        <div className="space-y-2 pt-2 border-t border-stone-100">
          <h4 className="font-bold text-stone-800 flex items-center gap-1.5 text-xs">
            <Smartphone className="h-4 w-4 text-emerald-600" />
            B. Running on Android Mobile Phone:
          </h4>
          <ol className="space-y-1.5 pl-5 list-decimal text-stone-600 leading-relaxed">
            <li>Open the application URL on Chrome / Android Browser while connected to your local farm Wi-Fi hotspot.</li>
            <li>Tap the browser options menu (3 vertical dots in Chrome) and select <strong>"Add to Home Screen"</strong> or <strong>"Install App"</strong>.</li>
            <li>AgriScan will install as a standalone PWA (Progressive Web Application) directly onto your Android device home screen.</li>
            <li>Turn on <strong>Airplane Mode</strong> or disable mobile data. Launch AgriScan from your home screen icon—the camera scanner, gallery upload, and local AI database will work seamlessly in remote fields without cellular towers!</li>
          </ol>
        </div>

        {/* Training New Classes Guide */}
        <div className="space-y-2 pt-2 border-t border-stone-100">
          <h4 className="font-bold text-stone-800 flex items-center gap-1.5 text-xs">
            <Layers className="h-4 w-4 text-emerald-600" />
            C. How to Add & Train New Crop Disease Classes:
          </h4>
          <p className="text-stone-600 leading-relaxed">
            To incorporate a new crop (e.g. Cotton, Coffee, Rice), simply add the botanical entry in <code className="bg-stone-100 px-1 py-0.5 rounded font-mono">src/data/diseaseDatabase.ts</code> under <code className="bg-stone-100 px-1 py-0.5 rounded font-mono">CROPS_METADATA</code> and populate the pathological symptom rules with distinguishing characteristics. The 2-stage verification engine will automatically verify the new species and restrict disease predictions accordingly.
          </p>
        </div>
      </div>
    </div>
  );
};
