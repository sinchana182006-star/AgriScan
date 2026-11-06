import React, { useEffect, useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Columns2,
  Eye,
  Filter,
  History,
  Info,
  Search,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { DiagnosisResult } from '../../types';
import { localDB } from '../../services/db';
import { useLanguage } from '../../context/LanguageContext';
import { DifferentialDiagnosisCard } from '../DifferentialDiagnosisCard';

export const ScanHistoryView: React.FC = () => {
  const { t } = useLanguage();
  const [scans, setScans] = useState<DiagnosisResult[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScanForDetail, setSelectedScanForDetail] = useState<DiagnosisResult | null>(null);

  // Side-by-side comparison state
  const [compareScan1, setCompareScan1] = useState<DiagnosisResult | null>(null);
  const [compareScan2, setCompareScan2] = useState<DiagnosisResult | null>(null);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const loadScans = async () => {
    const list = await localDB.getAllScans();
    setScans(list);
  };

  useEffect(() => {
    loadScans();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this offline diagnostic scan record?')) {
      await localDB.deleteScan(id);
      loadScans();
      if (selectedScanForDetail?.id === id) {
        setSelectedScanForDetail(null);
      }
    }
  };

  const filtered = scans.filter((s) => {
    const top = s.top3[0];
    const matchesSearch =
      s.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (top && top.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      new Date(s.timestamp).toLocaleDateString().includes(searchQuery);
    return matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 md:text-2xl">{t.navScanHistory}</h2>
          <p className="text-xs text-stone-500">
            Locally stored diagnostic logs with side-by-side comparative symptom tracking.
          </p>
        </div>

        {/* Side-by-Side Comparison Trigger */}
        <div className="flex items-center gap-2">
          {compareScan1 && compareScan2 ? (
            <button
              onClick={() => setIsCompareModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700"
            >
              <Columns2 className="h-4 w-4" />
              <span>Launch Side-by-Side Comparison</span>
            </button>
          ) : (
            <span className="text-[11px] text-stone-500 hidden sm:inline">
              Select 2 scans to compare symptom changes over time
            </span>
          )}
        </div>
      </div>

      {/* Search and filters */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by crop, disease name, or date..."
          className="w-full rounded-xl border border-stone-200 bg-white py-2 pl-9 pr-3 text-xs text-stone-800 outline-none focus:border-emerald-500 shadow-2xs"
        />
      </div>

      {/* Main Grid of Scans */}
      {filtered.length === 0 ? (
        <div className="flex h-72 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-200 bg-white p-8 text-center text-stone-400">
          <History className="h-10 w-10 text-stone-300" />
          <h3 className="mt-3 text-sm font-bold text-stone-700">No Saved Scans</h3>
          <p className="mt-1 text-xs text-stone-500">
            Run a diagnostic scan in the AI Crop Scanner to automatically record local logs.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => {
            const top = s.top3[0];
            const isSelected1 = compareScan1?.id === s.id;
            const isSelected2 = compareScan2?.id === s.id;
            const isBeingCompared = isSelected1 || isSelected2;

            return (
              <div
                key={s.id}
                onClick={() => setSelectedScanForDetail(s)}
                className={`group cursor-pointer rounded-2xl border bg-white p-4 transition-all shadow-xs ${
                  isBeingCompared
                    ? 'border-emerald-600 ring-2 ring-emerald-500/20'
                    : 'border-stone-200 hover:border-emerald-400 hover:shadow-sm'
                }`}
              >
                {/* Image and delete button */}
                <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-stone-900 border border-stone-100">
                  <img src={s.imageUri} alt={s.cropName} className="h-full w-full object-contain" />
                  <button
                    onClick={(e) => handleDelete(s.id, e)}
                    className="absolute right-2 top-2 rounded-lg bg-stone-900/60 p-1.5 text-white hover:bg-red-600 backdrop-blur-xs transition-colors"
                    aria-label="Delete scan"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>

                  <div className="absolute bottom-2 left-2 rounded-md bg-stone-900/80 px-2 py-0.5 text-[10px] font-bold text-white capitalize backdrop-blur-xs">
                    {s.cropName}
                  </div>
                </div>

                {/* Content */}
                <div className="mt-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-stone-900 truncate">
                      {top?.name || 'Healthy Leaf'}
                    </h3>
                    <span className="font-mono-numbers text-xs font-extrabold text-emerald-700">
                      {top?.confidence || 0}%
                    </span>
                  </div>

                  <p className="text-[11px] text-stone-500 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {new Date(s.timestamp).toLocaleDateString()} ·{' '}
                      {new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                    <span className="text-stone-500">
                      Health Score: <strong className="text-stone-800">{s.healthScore}/100</strong>
                    </span>

                    {/* Compare selector checkbox */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isSelected1) setCompareScan1(null);
                        else if (isSelected2) setCompareScan2(null);
                        else if (!compareScan1) setCompareScan1(s);
                        else if (!compareScan2) setCompareScan2(s);
                        else setCompareScan1(s);
                      }}
                      className={`text-[11px] font-bold rounded px-2 py-0.5 border ${
                        isBeingCompared
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      {isBeingCompared ? 'Selected for Compare' : '+ Select to Compare'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DETAIL MODAL FOR CLICKED SCAN */}
      {selectedScanForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <button
              onClick={() => setSelectedScanForDetail(null)}
              className="absolute right-5 top-5 rounded-xl bg-stone-100 p-2 text-stone-500 hover:bg-stone-200"
            >
              <X className="h-5 w-5" />
            </button>
            <DifferentialDiagnosisCard diagnosis={selectedScanForDetail} />
          </div>
        </div>
      )}

      {/* SIDE-BY-SIDE SYMPTOM COMPARISON MODAL */}
      {isCompareModalOpen && compareScan1 && compareScan2 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/70 p-4 backdrop-blur-xs">
          <div className="relative max-h-[95vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <h3 className="text-lg font-bold text-stone-900">
                  Side-by-Side Symptom & Disease Progression Tracker
                </h3>
                <p className="text-xs text-stone-500">
                  Compare two scans to verify treatment response or symptom expansion.
                </p>
              </div>
              <button
                onClick={() => setIsCompareModalOpen(false)}
                className="rounded-xl bg-stone-100 p-2 text-stone-500 hover:bg-stone-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Split Screen 2 Scans */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Scan 1 */}
              <div className="space-y-3 rounded-2xl border border-stone-200 p-4 bg-stone-50">
                <span className="text-xs font-bold text-stone-500 uppercase">
                  Scan A: {new Date(compareScan1.timestamp).toLocaleDateString()}
                </span>
                <div className="aspect-4/3 w-full overflow-hidden rounded-xl bg-stone-900 border">
                  <img
                    src={compareScan1.imageUri}
                    alt="Scan 1"
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between font-bold text-stone-800">
                    <span>{compareScan1.top3[0]?.name}</span>
                    <span className="font-mono-numbers text-emerald-700">
                      {compareScan1.top3[0]?.confidence}%
                    </span>
                  </div>
                  <p className="text-stone-500">
                    Health Score: <strong>{compareScan1.healthScore}/100</strong>
                  </p>
                  <p className="text-stone-600 text-[11px] line-clamp-2">
                    {compareScan1.top3[0]?.distinguishingFactor}
                  </p>
                </div>
              </div>

              {/* Scan 2 */}
              <div className="space-y-3 rounded-2xl border border-stone-200 p-4 bg-stone-50">
                <span className="text-xs font-bold text-stone-500 uppercase">
                  Scan B: {new Date(compareScan2.timestamp).toLocaleDateString()}
                </span>
                <div className="aspect-4/3 w-full overflow-hidden rounded-xl bg-stone-900 border">
                  <img
                    src={compareScan2.imageUri}
                    alt="Scan 2"
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between font-bold text-stone-800">
                    <span>{compareScan2.top3[0]?.name}</span>
                    <span className="font-mono-numbers text-emerald-700">
                      {compareScan2.top3[0]?.confidence}%
                    </span>
                  </div>
                  <p className="text-stone-500">
                    Health Score: <strong>{compareScan2.healthScore}/100</strong>
                  </p>
                  <p className="text-stone-600 text-[11px] line-clamp-2">
                    {compareScan2.top3[0]?.distinguishingFactor}
                  </p>
                </div>
              </div>
            </div>

            {/* Comparison Conclusion */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 text-xs text-emerald-950">
              <h4 className="font-bold flex items-center gap-1.5 mb-1">
                <CheckCircle2 className="h-4 w-4 text-emerald-700" /> Longitudinal Evaluation:
              </h4>
              <p className="leading-relaxed">
                Health Score shifted from {compareScan1.healthScore}% to {compareScan2.healthScore}%.
                {compareScan2.healthScore > compareScan1.healthScore
                  ? ' Visible recovery observed! Foliar chlorosis is receding and necrotic lesions have ceased expanding.'
                  : ' Lesions have expanded or secondary spotting has intensified. Re-evaluate fungicide coverage or inspect soil drainage.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
