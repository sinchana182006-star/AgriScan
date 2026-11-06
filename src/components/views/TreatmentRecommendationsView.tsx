import React, { useState } from 'react';
import {
  CheckCircle2,
  Filter,
  Leaf,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { CropType, DiseaseRecord } from '../../types';
import { CROPS_METADATA, DISEASES_DATABASE } from '../../data/diseaseDatabase';
import { useLanguage } from '../../context/LanguageContext';

export const TreatmentRecommendationsView: React.FC = () => {
  const { t } = useLanguage();

  const [selectedCrop, setSelectedCrop] = useState<CropType | 'all'>('tomato');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDisease, setSelectedDisease] = useState<DiseaseRecord>(
    DISEASES_DATABASE.find((d) => d.id === 'tom-early-blight') || DISEASES_DATABASE[0]
  );

  const filteredDiseases = DISEASES_DATABASE.filter((d) => {
    const matchesCrop = selectedCrop === 'all' || d.crop === selectedCrop;
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.symptoms.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCrop && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-stone-900 md:text-2xl">{t.navTreatments}</h2>
        <p className="text-xs text-stone-500">
          Smart organic, biological, and extension-verified protocols for all crops without fictitious dosages.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Col: Disease List & Filter (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {/* Crop selector */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-stone-400" />
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value as any)}
              className="flex-1 rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-stone-800 outline-none"
            >
              <option value="all">All Supported Crops</option>
              {(Object.keys(CROPS_METADATA) as CropType[]).map((crop) => (
                <option key={crop} value={crop}>
                  {CROPS_METADATA[crop].name}
                </option>
              ))}
            </select>
          </div>

          {/* Search box */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search diseases or symptoms..."
              className="w-full rounded-xl border border-stone-200 bg-white py-2 pl-9 pr-3 text-xs text-stone-800 outline-none focus:border-emerald-500"
            />
          </div>

          {/* Diseases list */}
          <div className="max-h-[550px] space-y-2 overflow-y-auto pr-1">
            {filteredDiseases.map((d) => {
              const isSelected = selectedDisease.id === d.id;
              return (
                <div
                  key={d.id}
                  onClick={() => setSelectedDisease(d)}
                  className={`cursor-pointer rounded-xl border p-3 transition-all ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-500/20'
                      : 'border-stone-200 bg-white hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-stone-900">{d.name}</h4>
                      <p className="text-[11px] text-stone-500 capitalize">{d.crop} · {d.category}</p>
                    </div>
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold capitalize ${
                        d.severity === 'severe'
                          ? 'bg-red-100 text-red-800'
                          : d.severity === 'high'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {d.severity}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Treatment Protocols (7 cols) */}
        <div className="lg:col-span-7 space-y-4 rounded-2xl border border-stone-200 bg-white p-6 shadow-xs">
          <div className="flex items-start justify-between border-b border-stone-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 capitalize">
                  {selectedDisease.crop}
                </span>
                <span className="text-stone-300">·</span>
                <span className="text-xs text-stone-500 capitalize">{selectedDisease.category}</span>
              </div>
              <h3 className="text-lg font-extrabold text-stone-900">{selectedDisease.name}</h3>
              {selectedDisease.scientificName && (
                <p className="text-xs italic text-stone-500">{selectedDisease.scientificName}</p>
              )}
            </div>

            <span
              className={`rounded px-2.5 py-1 text-xs font-bold capitalize ${
                selectedDisease.severity === 'severe'
                  ? 'bg-red-100 text-red-800'
                  : selectedDisease.severity === 'high'
                  ? 'bg-orange-100 text-orange-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {selectedDisease.severity} Severity
            </span>
          </div>

          {/* Immediate Field Actions */}
          <div className="rounded-xl border border-red-200 bg-red-50/50 p-4 text-xs">
            <h4 className="font-bold text-red-950 flex items-center gap-1.5">
              <ShieldAlert className="h-4 w-4 text-red-700" />
              {t.immediateAction}
            </h4>
            <ul className="mt-2 space-y-1 pl-5 list-disc text-red-900">
              {selectedDisease.treatments.immediate.map((act, i) => (
                <li key={i}>{act}</li>
              ))}
            </ul>
          </div>

          {/* Organic & Cultural Controls */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 text-xs">
            <h4 className="font-bold text-emerald-950 flex items-center gap-1.5">
              <Leaf className="h-4 w-4 text-emerald-700" />
              {t.organicControl}
            </h4>
            <ul className="mt-2 space-y-1 pl-5 list-disc text-emerald-900">
              {selectedDisease.treatments.organic.map((org, i) => (
                <li key={i}>{org}</li>
              ))}
            </ul>
          </div>

          {/* Biological Controls */}
          <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 text-xs">
            <h4 className="font-bold text-blue-950 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-blue-700" />
              {t.biologicalControl}
            </h4>
            <ul className="mt-2 space-y-1 pl-5 list-disc text-blue-900">
              {selectedDisease.treatments.biological.map((bio, i) => (
                <li key={i}>{bio}</li>
              ))}
            </ul>
          </div>

          {/* IPM & Agronomic Prevention */}
          <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-xs">
            <h4 className="font-bold text-stone-800 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              {t.ipmStrategy} & Field Prophylactics
            </h4>
            <ul className="mt-2 space-y-1 pl-5 list-disc text-stone-700">
              {selectedDisease.treatments.ipm.concat(selectedDisease.prevention).map((ipm, i) => (
                <li key={i}>{ipm}</li>
              ))}
            </ul>
          </div>

          {/* Safe Chemical Extension Guidance */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 text-xs">
            <h4 className="font-bold text-amber-950">{t.chemicalGuidance}</h4>
            <ul className="mt-2 space-y-1 pl-5 list-disc text-amber-900">
              {selectedDisease.treatments.chemical.map((chem, i) => (
                <li key={i}>{chem}</li>
              ))}
            </ul>
            <p className="mt-2 text-[10px] text-amber-800 italic">
              Agricultural Safety Rule: Never invent or apply unregistered chemical formulations. Always cross-check with state agricultural department guidelines.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
