import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Filter,
  Info,
  Search,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { CropType, DiseaseRecord } from '../../types';
import { CROPS_METADATA, DISEASES_DATABASE } from '../../data/diseaseDatabase';
import { useLanguage } from '../../context/LanguageContext';

export const DiseaseEncyclopediaView: React.FC = () => {
  const { t } = useLanguage();

  const [selectedCrop, setSelectedCrop] = useState<CropType | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDisease, setActiveDisease] = useState<DiseaseRecord>(DISEASES_DATABASE[0]);

  const filteredDiseases = DISEASES_DATABASE.filter((d) => {
    const matchesCrop = selectedCrop === 'all' || d.crop === selectedCrop;
    const matchesCategory = categoryFilter === 'all' || d.category === categoryFilter;
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.symptoms.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      d.causes.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (d.scientificName && d.scientificName.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCrop && matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-stone-900 md:text-2xl">{t.navEncyclopedia}</h2>
        <p className="text-xs text-stone-500">
          Searchable offline agricultural knowledge library for Tomato, Potato, Apple, Grapes, Banana, Mango, and Citrus.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
        {/* Search Input */}
        <div className="relative min-w-[240px] flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full rounded-xl border border-stone-200 bg-stone-50 py-2 pl-9 pr-3 text-xs text-stone-800 outline-none focus:border-emerald-500 focus:bg-white"
          />
        </div>

        {/* Crop filter */}
        <div className="flex items-center gap-2">
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value as any)}
            className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs font-semibold text-stone-800 outline-none"
          >
            <option value="all">All Crops ({DISEASES_DATABASE.length})</option>
            {(Object.keys(CROPS_METADATA) as CropType[]).map((crop) => (
              <option key={crop} value={crop}>
                {CROPS_METADATA[crop].name}
              </option>
            ))}
          </select>

          {/* Pathogen filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs font-semibold text-stone-800 outline-none"
          >
            <option value="all">All Pathogen Types</option>
            <option value="fungal">Fungal</option>
            <option value="bacterial">Bacterial</option>
            <option value="viral">Viral</option>
            <option value="deficiency">Nutrient Deficiency</option>
            <option value="healthy">Healthy Standards</option>
          </select>
        </div>
      </div>

      {/* Main 2-column layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Col: Disease List (5 cols) */}
        <div className="lg:col-span-5 space-y-2 max-h-[620px] overflow-y-auto pr-1">
          {filteredDiseases.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-stone-200 p-8 text-center text-xs text-stone-400">
              No matching disease found offline.
            </div>
          ) : (
            filteredDiseases.map((d) => {
              const isSelected = activeDisease.id === d.id;
              return (
                <div
                  key={d.id}
                  onClick={() => setActiveDisease(d)}
                  className={`cursor-pointer rounded-xl border p-3.5 transition-all ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-500/20'
                      : 'border-stone-200 bg-white hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-stone-900">{d.name}</span>
                        <span className="text-[10px] text-stone-400 capitalize">({d.crop})</span>
                      </div>
                      {d.scientificName && (
                        <p className="text-[11px] italic text-stone-500">{d.scientificName}</p>
                      )}
                    </div>

                    <span
                      className={`text-[10px] font-bold uppercase rounded px-2 py-0.5 ${
                        d.severity === 'severe'
                          ? 'bg-red-100 text-red-800'
                          : d.severity === 'high'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {d.category}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Col: Comprehensive Knowledge Article (7 cols) */}
        <div className="lg:col-span-7 space-y-5 rounded-2xl border border-stone-200 bg-white p-6 shadow-xs">
          <div className="border-b border-stone-100 pb-4">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
              <span className="uppercase">{activeDisease.crop}</span>
              <span className="text-stone-300">·</span>
              <span className="capitalize">{activeDisease.category} Pathology</span>
            </div>
            <h3 className="mt-1 text-2xl font-black text-stone-900">{activeDisease.name}</h3>
            {activeDisease.scientificName && (
              <p className="text-xs italic text-stone-500">{activeDisease.scientificName}</p>
            )}
          </div>

          {/* Key Symptoms */}
          <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-xs">
            <h4 className="font-bold text-stone-900 mb-2">Visible Diagnostic Symptoms:</h4>
            <ul className="space-y-1.5 pl-5 list-disc text-stone-700">
              {activeDisease.symptoms.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          {/* Distinguishing Characteristics */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 text-xs">
            <h4 className="font-bold text-emerald-950 mb-2">Key Distinguishing Botanical Features:</h4>
            <ul className="space-y-1.5 pl-5 list-disc text-emerald-900">
              {activeDisease.distinguishingFeatures.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>

          {/* Causes & Environmental Drivers */}
          <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-xs">
            <h4 className="font-bold text-stone-900 mb-2">Causes & Contributing Epidemiological Drivers:</h4>
            <ul className="space-y-1.5 pl-5 list-disc text-stone-700">
              {activeDisease.causes.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>

          {/* Affected Plant Organs */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-stone-700">Vulnerable Plant Parts:</span>
            {activeDisease.affectedParts.map((p, i) => (
              <span
                key={i}
                className="rounded-md border border-stone-200 bg-stone-100 px-2 py-0.5 text-stone-700"
              >
                {p}
              </span>
            ))}
          </div>

          {/* Prevention Protocols */}
          <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-xs">
            <h4 className="font-bold text-stone-900 mb-2">Agronomic Prevention & Cultural Stewardship:</h4>
            <ul className="space-y-1.5 pl-5 list-disc text-stone-700">
              {activeDisease.prevention.map((prev, i) => (
                <li key={i}>{prev}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
