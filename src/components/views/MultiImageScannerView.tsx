import React, { useRef, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Camera,
  CheckCircle2,
  FolderPlus,
  Layers,
  Leaf,
  Plus,
  RefreshCw,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { CropType, DiagnosisResult, MultiImageScanItem } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { CROPS_METADATA } from '../../data/diseaseDatabase';
import { OfflineAiEngine } from '../../services/offlineAiEngine';
import { localDB } from '../../services/db';

export const MultiImageScannerView: React.FC = () => {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedCrop, setSelectedCrop] = useState<CropType>('tomato');
  const [items, setItems] = useState<MultiImageScanItem[]>([]);
  const [isAnalysingAll, setIsAnalysingAll] = useState<boolean>(false);
  const [isSamePlantConfirmed, setIsSamePlantConfirmed] = useState<boolean>(false);
  const [selectedItemForModal, setSelectedItemForModal] = useState<MultiImageScanItem | null>(null);

  // Handle multi-image file selection
  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUri = e.target?.result as string;
        const newItem: MultiImageScanItem = {
          id: 'item_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
          imageUri,
          name: file.name,
          crop: selectedCrop,
          status: 'idle',
        };
        setItems((prev) => [...prev, newItem]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleClearAll = () => {
    setItems([]);
  };

  // Run Batch Offline Analysis
  const handleBatchAnalyse = async () => {
    if (items.length === 0) return;
    setIsAnalysingAll(true);

    const updated = [...items];
    for (let i = 0; i < updated.length; i++) {
      if (updated[i].status === 'done' && updated[i].diagnosis) continue;

      updated[i].status = 'processing';
      setItems([...updated]);

      try {
        await new Promise((r) => setTimeout(r, 200));
        const diag = await OfflineAiEngine.diagnoseImage(updated[i].imageUri, updated[i].crop);
        updated[i].diagnosis = diag;
        updated[i].status = 'done';
        // Auto-save to scan history
        await localDB.saveScan(diag);
      } catch (err) {
        console.error('Failed to diagnose multi item:', err);
        updated[i].status = 'error';
      }
      setItems([...updated]);
    }

    setIsAnalysingAll(false);
  };

  // Compute Combined Crop Health Summary
  const analysedItems = items.filter((i) => i.status === 'done' && i.diagnosis);
  const totalAnalysed = analysedItems.length;

  let healthyCount = 0;
  let diseasedCount = 0;
  let pestCount = 0;
  let uncertainCount = 0;
  let healthScoreSum = 0;

  analysedItems.forEach((item) => {
    const diag = item.diagnosis!;
    healthScoreSum += diag.healthScore;
    if (diag.isUncertain) {
      uncertainCount++;
    }
    const top = diag.top3[0];
    if (top) {
      if (top.category === 'healthy') healthyCount++;
      else if (top.category === 'pest') pestCount++;
      else diseasedCount++;
    }
  });

  const averageHealthScore = totalAnalysed > 0 ? Math.round(healthScoreSum / totalAnalysed) : 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 md:text-2xl">{t.navMultiScan}</h2>
          <p className="text-xs text-stone-500">
            Batch foliar analysis for whole-canopy inspection and field health indexing.
          </p>
        </div>

        {/* Crop Selector */}
        <div className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-1.5 shadow-xs">
          <label htmlFor="multi-crop-select" className="text-xs font-semibold text-stone-600">
            {t.selectCrop}:
          </label>
          <select
            id="multi-crop-select"
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value as CropType)}
            className="text-xs font-bold text-emerald-800 outline-none cursor-pointer bg-transparent"
          >
            {(Object.keys(CROPS_METADATA) as CropType[]).map((crop) => (
              <option key={crop} value={crop}>
                {CROPS_METADATA[crop].name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Add Photos Button */}
          <button
            onClick={() => {
              if (fileInputRef.current) fileInputRef.current.click();
            }}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700"
          >
            <FolderPlus className="h-4 w-4" />
            <span>Select Multiple Leaf Images</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
          />

          {items.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100"
            >
              <Trash2 className="h-3.5 w-3.5 text-red-500" />
              <span>Clear All</span>
            </button>
          )}
        </div>

        {/* Confirmation check for same plant */}
        <div className="flex items-center gap-2 text-xs text-stone-600">
          <input
            id="same-plant-check"
            type="checkbox"
            checked={isSamePlantConfirmed}
            onChange={(e) => setIsSamePlantConfirmed(e.target.checked)}
            className="rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
          />
          <label htmlFor="same-plant-check" className="cursor-pointer">
            All photos belong to the same single plant
          </label>
        </div>

        {/* Batch Analyse Action */}
        {items.length > 0 && (
          <button
            onClick={handleBatchAnalyse}
            disabled={isAnalysingAll}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 disabled:bg-emerald-400"
          >
            {isAnalysingAll ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Analysing Batch Locally...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Analyse All {items.length} Images</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* THUMBNAIL GRID */}
      {items.length === 0 ? (
        <div className="flex h-72 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-200 bg-white p-8 text-center text-stone-400">
          <Layers className="h-10 w-10 text-stone-300" />
          <h3 className="mt-3 text-sm font-bold text-stone-700">No Leaf Images Loaded</h3>
          <p className="mt-1 max-w-sm text-xs text-stone-500">
            Select 2 or more leaf images from your gallery to inspect across multiple canopy layers simultaneously.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {items.map((item, index) => {
            const diag = item.diagnosis;
            const top = diag?.top3[0];
            return (
              <div
                key={item.id}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white shadow-xs"
              >
                {/* Remove button */}
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="absolute right-1.5 top-1.5 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-stone-900/70 text-white hover:bg-red-600"
                  aria-label="Remove image"
                >
                  <X className="h-3.5 w-3.5" />
                </button>

                {/* Thumbnail */}
                <div
                  onClick={() => diag && setSelectedItemForModal(item)}
                  className="aspect-square w-full cursor-pointer overflow-hidden bg-stone-900"
                >
                  <img src={item.imageUri} alt={item.name} className="h-full w-full object-cover" />
                </div>

                {/* Footer status */}
                <div className="p-2 text-[11px]">
                  <span className="block truncate font-bold text-stone-800">Leaf #{index + 1}</span>
                  {item.status === 'processing' ? (
                    <span className="flex items-center gap-1 text-emerald-600">
                      <RefreshCw className="h-3 w-3 animate-spin" /> Processing...
                    </span>
                  ) : top ? (
                    <div
                      onClick={() => setSelectedItemForModal(item)}
                      className="cursor-pointer space-y-0.5"
                    >
                      <p className="truncate font-semibold text-stone-900">{top.name}</p>
                      <p className="font-mono-numbers text-emerald-700 font-bold">
                        {top.confidence}% Confidence
                      </p>
                    </div>
                  ) : (
                    <span className="text-stone-400">Ready to analyse</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* COMBINED CANOPY REPORT */}
      {totalAnalysed > 0 && (
        <section className="space-y-4 rounded-2xl border border-stone-200 bg-white p-6 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-stone-900">
                Combined Canopy Health Assessment
              </h3>
              <p className="text-xs text-stone-500">
                Aggregated diagnostics across {totalAnalysed} sampled leaves ({CROPS_METADATA[selectedCrop].name})
              </p>
            </div>

            {/* Overall Score */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-stone-500">Field Health Index:</span>
              <span
                className={`font-mono-numbers text-xl font-extrabold ${
                  averageHealthScore > 75
                    ? 'text-emerald-700'
                    : averageHealthScore > 50
                    ? 'text-amber-700'
                    : 'text-red-700'
                }`}
              >
                {averageHealthScore}%
              </span>
            </div>
          </div>

          {/* Breakdown stat bar */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs">
            <div className="rounded-xl border border-stone-200 bg-stone-50 p-3">
              <span className="text-stone-500">Total Analysed:</span>
              <p className="font-mono-numbers text-lg font-bold text-stone-800">{totalAnalysed}</p>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3">
              <span className="text-emerald-800 font-medium">Healthy Leaves:</span>
              <p className="font-mono-numbers text-lg font-bold text-emerald-900">{healthyCount}</p>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3">
              <span className="text-amber-800 font-medium">Suspected Disease:</span>
              <p className="font-mono-numbers text-lg font-bold text-amber-900">{diseasedCount}</p>
            </div>
            <div className="rounded-xl border border-red-200 bg-red-50/60 p-3">
              <span className="text-red-800 font-medium">Pest Damage:</span>
              <p className="font-mono-numbers text-lg font-bold text-red-900">{pestCount}</p>
            </div>
          </div>

          <p className="text-xs text-stone-600 leading-relaxed">
            Summary: Out of {totalAnalysed} sampled leaves, {diseasedCount} exhibit active fungal/bacterial lesion development, and {healthyCount} remain nominal.
            {isSamePlantConfirmed
              ? ' Since all leaves belong to the same plant, systemic localized pruning of infected lower leaves is recommended immediately.'
              : ' Since leaves may come from distinct field sectors, isolate symptomatic rows and apply preventive biological sprays to protect adjacent rows.'}
          </p>
        </section>
      )}

      {/* DETAIL MODAL FOR INDIVIDUAL LEAF RESULT */}
      {selectedItemForModal && selectedItemForModal.diagnosis && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 p-4 backdrop-blur-xs">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <button
              onClick={() => setSelectedItemForModal(null)}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-base font-bold text-stone-900 mb-4">
              Individual Diagnostic Breakdown ({selectedItemForModal.name})
            </h3>
            <div className="space-y-4">
              <div className="aspect-16/9 w-full overflow-hidden rounded-xl border border-stone-200 bg-stone-900">
                <img
                  src={selectedItemForModal.imageUri}
                  alt={selectedItemForModal.name}
                  className="h-full w-full object-contain"
                />
              </div>

              <div className="space-y-2 text-xs">
                {selectedItemForModal.diagnosis.top3.map((c) => (
                  <div
                    key={c.rank}
                    className="flex items-center justify-between rounded-lg border border-stone-200 p-2.5"
                  >
                    <div>
                      <span className="font-bold text-stone-900">
                        #{c.rank} {c.name}
                      </span>
                      <p className="text-[11px] text-stone-500">{c.distinguishingFactor}</p>
                    </div>
                    <span className="font-mono-numbers font-bold text-emerald-700">
                      {c.confidence}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
