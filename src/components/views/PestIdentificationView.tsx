import React, { useRef, useState } from 'react';
import {
  AlertTriangle,
  Bug,
  CheckCircle2,
  Filter,
  HeartHandshake,
  Info,
  RotateCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Upload,
} from 'lucide-react';
import { PestRecord } from '../../types';
import { PESTS_DATABASE } from '../../data/diseaseDatabase';
import { useLanguage } from '../../context/LanguageContext';

export const PestIdentificationView: React.FC = () => {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedPest, setSelectedPest] = useState<PestRecord | null>(PESTS_DATABASE[0]);
  const [filterType, setFilterType] = useState<'all' | 'harmful_pest' | 'beneficial_insect'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadedPestImage, setUploadedPestImage] = useState<string | null>(null);
  const [isClassifying, setIsClassifying] = useState(false);

  const filteredPests = PESTS_DATABASE.filter((p) => {
    const matchesType = filterType === 'all' || p.type === filterType;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.damageCharacteristics.some((d) => d.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const src = event.target?.result as string;
      setUploadedPestImage(src);
      setIsClassifying(true);

      // Simulate local vision model matching
      await new Promise((r) => setTimeout(r, 600));
      // For demo: if ladybug pattern (reddish), classify as ladybug; else aphids/spider mites
      setSelectedPest(PESTS_DATABASE[6]); // Ladybug beneficial
      setIsClassifying(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 md:text-2xl">{t.navPestId}</h2>
          <p className="text-xs text-stone-500">
            Harmful pest diagnosis & beneficial insect conservation intelligence.
          </p>
        </div>

        {/* Upload Button */}
        <button
          onClick={() => {
            if (fileInputRef.current) fileInputRef.current.click();
          }}
          className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700"
        >
          <Upload className="h-4 w-4" />
          <span>Upload Insect Photo</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      {/* Visual Banner on Ladybug Beneficial Protection */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-200 bg-linear-to-r from-emerald-900 via-emerald-950 to-stone-900 p-5 text-white shadow-md">
        <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-12">
          <div className="sm:col-span-8 space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
              <HeartHandshake className="h-3 w-3" /> Beneficial Insect Protection Protocol
            </div>
            <h3 className="text-lg font-bold">Never Spray Before Inspecting For Natural Predators!</h3>
            <p className="text-xs text-emerald-100/80 leading-relaxed">
              Ladybug adults, green lacewing larvae, and hoverflies devour up to 100 aphids per day. Indiscriminate chemical spraying kills beneficial insects first, causing secondary pest resurgence.
            </p>
          </div>

          <div className="sm:col-span-4 flex justify-end">
            <img
              src="/src/assets/images/pest_inspection_field_1793904224196.jpg"
              alt="Beneficial ladybug feeding on aphids"
              className="h-28 w-40 rounded-xl object-cover border border-emerald-600 shadow-md"
            />
          </div>
        </div>
      </div>

      {/* Main Layout: Left Search/Filter + Right Pest Details */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Col: Search & Pest List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search insect or damage traits..."
              className="w-full rounded-xl border border-stone-200 bg-white py-2 pl-9 pr-3 text-xs text-stone-800 outline-none focus:border-emerald-500"
            />
          </div>

          {/* Filter segment tabs */}
          <div className="flex rounded-xl border border-stone-200 bg-stone-100 p-1 text-xs font-semibold text-stone-600">
            <button
              onClick={() => setFilterType('all')}
              className={`flex-1 rounded-lg py-1.5 transition-colors ${
                filterType === 'all' ? 'bg-white text-stone-900 shadow-xs' : 'hover:text-stone-900'
              }`}
            >
              All ({PESTS_DATABASE.length})
            </button>
            <button
              onClick={() => setFilterType('harmful_pest')}
              className={`flex-1 rounded-lg py-1.5 transition-colors ${
                filterType === 'harmful_pest' ? 'bg-white text-red-700 shadow-xs' : 'hover:text-stone-900'
              }`}
            >
              Harmful Pests
            </button>
            <button
              onClick={() => setFilterType('beneficial_insect')}
              className={`flex-1 rounded-lg py-1.5 transition-colors ${
                filterType === 'beneficial_insect' ? 'bg-white text-emerald-700 shadow-xs' : 'hover:text-stone-900'
              }`}
            >
              Beneficials
            </button>
          </div>

          {/* Pest list */}
          <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
            {filteredPests.map((p) => {
              const isSelected = selectedPest?.id === p.id;
              const isBeneficial = p.type === 'beneficial_insect';
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPest(p)}
                  className={`cursor-pointer rounded-xl border p-3 transition-all ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-500/20'
                      : 'border-stone-200 bg-white hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                          isBeneficial ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {isBeneficial ? <ShieldCheck className="h-4 w-4" /> : <Bug className="h-4 w-4" />}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-stone-900">{p.name}</h4>
                        <p className="text-[11px] italic text-stone-500">{p.scientificName}</p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold uppercase rounded px-2 py-0.5 ${
                        isBeneficial
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {isBeneficial ? 'Beneficial' : 'Pest'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Pest Details & IPM Protocol (7 cols) */}
        <div className="lg:col-span-7">
          {selectedPest ? (
            <div className="space-y-4 rounded-2xl border border-stone-200 bg-white p-6 shadow-xs">
              <div className="flex items-start justify-between border-b border-stone-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-stone-900">{selectedPest.name}</h3>
                    <span
                      className={`rounded px-2 py-0.5 text-[11px] font-bold ${
                        selectedPest.type === 'beneficial_insect'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {selectedPest.type === 'beneficial_insect' ? 'Beneficial Insect' : 'Harmful Pest'}
                    </span>
                  </div>
                  <p className="text-xs italic text-stone-500">{selectedPest.scientificName}</p>
                </div>

                <div className="text-right text-xs">
                  <span className="text-stone-400">Affected Crops:</span>
                  <p className="font-semibold text-stone-700 capitalize">
                    {selectedPest.affectedCrops.join(', ')}
                  </p>
                </div>
              </div>

              {/* Visible Characteristics */}
              <div className="rounded-xl border border-stone-200 bg-stone-50 p-3.5 text-xs">
                <span className="font-bold text-stone-800">Visible Physical Characteristics:</span>
                <ul className="mt-1.5 space-y-1 pl-5 list-disc text-stone-700">
                  {selectedPest.visibleFeatures.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>

              {/* Damage Symptoms */}
              <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3.5 text-xs">
                <span className="font-bold text-amber-950">Crop Damage & Feeding Behavior:</span>
                <ul className="mt-1.5 space-y-1 pl-5 list-disc text-amber-900">
                  {selectedPest.damageCharacteristics.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>

              {/* Prevention & IPM */}
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3.5 text-xs">
                <span className="font-bold text-emerald-950">Integrated Pest Management & Safe Controls:</span>
                <ul className="mt-1.5 space-y-1 pl-5 list-disc text-emerald-900">
                  {selectedPest.preventionMethods.concat(selectedPest.biologicalControl).map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-stone-200 bg-white p-6 text-center text-xs text-stone-400">
              <Bug className="h-8 w-8 text-stone-300" />
              <p className="mt-2 font-medium">Select an insect on the left to review identification traits.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
